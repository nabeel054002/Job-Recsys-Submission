import pandas as pd
from pymongo import MongoClient
from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, StructField
from pyspark.sql.functions import udf,array_intersect,size,col,lit
from pyspark.sql.types import ArrayType, StringType
#from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
#import nltk

#nltk.download('stopwords')

def similar_jobs(candidate_skills, collection):
    print('collection', collection)
    data = list(collection.find({}, projection={"_id": 0}))
    pandas_df = pd.DataFrame(data)
    spark = SparkSession.builder.appName("JobRecommendation").getOrCreate() # inefficient since we are creating a spark session on every call

    # Define the schema based on your data structure
    schema = StructType([
        StructField("username", StringType(), True),
        StructField("job_description", StringType(), True),
    ])

    # super inefficient we should retrieve it from spark
    job_descriptions = spark.createDataFrame(pandas_df, schema=schema)
    job_descriptions_sample = job_descriptions.sample(fraction=0.3, seed=42)

    
    #stop_words = set(stopwords.words('english'))
    stemmer = PorterStemmer()

    # Tokenize the job descriptions' skills column by commas, convert to lowercase, and preprocess
    @udf(ArrayType(StringType()))
    def preprocess_job_skills(skills):
        skills = [skill.strip().lower() for skill in skills.split(",")]
        skills = [stemmer.stem(skill) for skill in skills ]
        #if skill not in stop_words
        return skills

    job_descriptions = job_descriptions_sample.withColumn("job_description", preprocess_job_skills(job_descriptions["job_description"]))

    # Tokenize the candidate's skills, convert to lowercase, and preprocess
    candidate_skills = [skill.strip().lower() for skill in candidate_skills]
    candidate_skills = [stemmer.stem(skill) for skill in candidate_skills ]
    #if skill not in stop_words

    # Calculate the number of common skills
    common_skills_expr = size(array_intersect(job_descriptions["job_description"], lit(candidate_skills)))
    job_descriptions = job_descriptions.withColumn("common_skills", common_skills_expr)

    # Selecting the relevant columns and sorting by the number of common skills
    result = job_descriptions.select("username", "common_skills").orderBy(col("common_skills").desc())
    #result = job_descriptions.select("job_description", "common_skills").orderBy(col("common_skills").desc())
    result = result.limit(10)

    # Convert the 'username' column to a Python list
    job_list = result.select("username").rdd.flatMap(lambda x: x).collect()
    #job_list = result.select("job_description").rdd.flatMap(lambda x: x).collect()

    job_doc = {}
    for item in data:
        if item['username'] in job_list:
            job_doc[item['username']] = item

    # Now 'job_list' is a Python list containing the values from the 'username' column
    return job_doc
    