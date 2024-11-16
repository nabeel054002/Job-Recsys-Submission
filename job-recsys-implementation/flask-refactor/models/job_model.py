from flask_pymongo import PyMongo
import pandas as pd
from pyspark.sql import SparkSession

class JobModel:
    def __init__(self, mongo):
        self.mongo = mongo
        self.spark = SparkSession.builder.appName("JobRecommendation").getOrCreate()
        self.job_descriptions_df = self.load_job_descriptions()

    def load_job_descriptions(self):
        """Load job descriptions into a Spark DataFrame."""
        data = list(self.mongo.db.sampled_jobs.find({}, projection={
            "_id": 1,
            "Benefits": 1,
            "Job Description": 1,
            "Job Id": 1,
            "Responsibilities": 1,
            "Role": 1,
            "skills": 1,
            "Company": 1,
            "job_embedding": 1
        }))
        for doc in data:
            doc["_id"] = str(doc["_id"])  # Convert ObjectId to string
        pandas_df = pd.DataFrame(data)
        return self.spark.createDataFrame(pandas_df)

    def get_job_description(self, username):
        company = self.mongo.db.sampled_jobs.find_one({'username': username})
        if not company:
            return {'message': 'Company not found!'}, 404
        return {'jobDescription': company.get('job_description', '')}, 200

    def save_job_description(self, data):
        username, job_description = data.get('username'), data.get('jobDescription')
        result = self.mongo.db.sampled_jobs.update_one(
            {'username': username},
            {'$set': {'job_description': job_description}}
        )
        if result.matched_count:
            return {'message': 'Job description saved successfully'}, 200
        return {'message': 'Company not found!'}, 404
