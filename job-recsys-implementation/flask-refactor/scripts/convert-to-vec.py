from pyspark.sql import SparkSession
from pyspark.sql.functions import udf
from pymongo import MongoClient
import pandas as pd
from sentence_transformers import SentenceTransformer
from nltk.stem import PorterStemmer
from nltk.corpus import stopwords
import random
import json
import os
import zipfile
from bson import ObjectId

# MongoDB connection setup
mongo_client = MongoClient("mongodb://localhost:27017/")
db = mongo_client["Job-Recsys"]
sampled_jobs_collection = db["sampled_jobs"]

# Initialize Spark session (only once)
spark = SparkSession.builder \
    .appName("JobRecommendation") \
    .getOrCreate()

# Fetch all documents from MongoDB
data = list(sampled_jobs_collection.find({}, projection={
    "_id": 1,
    "Benefits": 1,
    "Job Description": 1,
    "Job Id": 1,
    "Responsibilities": 1,
    "Role": 1,
    "skills": 1,
    "Company": 1
}))

# Sample 35% of the data
sample_size = int(len(data))
sampled_data = random.sample(data, sample_size)

# Convert '_id' to string in sampled data
for doc in sampled_data:
    doc["_id"] = str(doc["_id"])  # Convert ObjectId to string

# Load the sampled data into a Pandas DataFrame
pandas_df = pd.DataFrame(sampled_data)

# Convert the Pandas DataFrame to a Spark DataFrame (infer schema automatically)
job_descriptions = spark.createDataFrame(pandas_df)

# Initialize NLTK tools
stemmer = PorterStemmer()
stop_words = set(stopwords.words('english'))

# Define a UDF to preprocess text fields (Benefits, Responsibilities, etc.)
@udf("array<string>")
def preprocess_text(field):
    words = [word.strip().lower() for word in field.split()]
    words = [stemmer.stem(word) for word in words if word not in stop_words]
    return words

# Apply preprocessing to relevant fields
for field in ["Job Description", "skills"]:
    job_descriptions = job_descriptions.withColumn(
        field, preprocess_text(job_descriptions[field])
    )

# Join preprocessed fields into a single text per job document
@udf("string")
def join_fields(description, skills):
    combined_text = " ".join(description + skills)
    return combined_text

processed_jobs = job_descriptions.withColumn(
    "combined_text", join_fields(
        job_descriptions["Job Description"],
        job_descriptions["skills"]
    )
)

# Collect the processed text and corresponding IDs
job_descriptions_list = [row["combined_text"] for row in processed_jobs.collect()]
doc_ids = [row["_id"] for row in processed_jobs.collect()]

# Load the sentence-transformers model
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Generate embeddings for the combined job descriptions
embeddings = model.encode(job_descriptions_list)

# Ensure embeddings are serializable as lists
embeddings = [embedding.tolist() for embedding in embeddings]

# Store the embeddings back into MongoDB
# dimensions of the embedding
for doc_id, embedding in zip(doc_ids, embeddings):
    if isinstance(doc_id, str):
        doc_id = ObjectId(doc_id)  # Convert string to ObjectId

    sampled_jobs_collection.update_one(
        {"_id": doc_id},
        {"$set": {"job_embedding": embedding}}
    )

print("Embeddings have been successfully added to MongoDB!")

# Add embeddings back to the original DataFrame with all columns
pandas_df["job_embedding"] = embeddings  # Add embeddings column

# Save the updated DataFrame with all initial columns plus embeddings to a CSV file
csv_file_path = "job_embeddings_with_all_columns.csv"
pandas_df.to_csv(csv_file_path, index=False)

# Compress the CSV file into a ZIP file
zip_file_path = "job_embeddings_with_all_columns.zip"
with zipfile.ZipFile(zip_file_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    zipf.write(csv_file_path, os.path.basename(csv_file_path))

# Clean up the uncompressed CSV file
os.remove(csv_file_path)

print(f"CSV file with all columns and embeddings has been compressed and saved as '{zip_file_path}'")

# Stop the Spark session
spark.stop()