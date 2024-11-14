from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import jwt, bcrypt, time
from jwt.exceptions import ExpiredSignatureError, DecodeError
from flask_pymongo import PyMongo
from job_recommendation import similar_jobs
from pymongo.errors import DuplicateKeyError

# Flask app and MongoDB setup
app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/Team-8"
mongo = PyMongo(app)
CORS(app)
cors = CORS(app, resource={
    r"/*":{
        "origins":"*"
    }
})
# Routes
@cross_origin
@app.route('/', methods=['GET'])
def health_check():
    return "Hi", 200

# Run the app
# if __name__ == '__main__':
app.run(port=5000)
