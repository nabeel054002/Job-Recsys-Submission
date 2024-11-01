from job_recommendation import similar_jobs
from flask import Flask, request, jsonify
from flask_cors import CORS
from jwt.exceptions import ExpiredSignatureError, DecodeError
import time
from flask_pymongo import PyMongo
from job_recommendation import similar_jobs
from flask_cors import cross_origin

app = Flask(__name__)
# Replace the existing MongoDB configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/Team-8"

# Initialize MongoDB for candidates and sampled_jobs
mongo = PyMongo(app)

skills = 'frontend development backend development django html css expressjs javascript'
print("about to get recommendations")
recommendations = (similar_jobs(skills, mongo.db.sampled_jobs))
print(len(recommendations))