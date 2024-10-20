from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import bcrypt
from jwt.exceptions import ExpiredSignatureError, DecodeError
import time
from flask_pymongo import PyMongo
from job_recommendation import similar_jobs

app = Flask(__name__)
# Replace the existing MongoDB configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/Team-8"

# Initialize MongoDB for candidates and companies
mongo = PyMongo(app)

CORS(app)

secret_key = 'yourSecretKey'

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    existing_candidate = mongo.db.candidates.find_one({'username': username})

    if existing_candidate: 
        # Check the hashed password
        stored_password = existing_candidate.get('password', '')
        if bcrypt.checkpw(password.encode('utf-8'), stored_password):
            token = jwt.encode({'username': existing_candidate['username'], 'exp': int(time.time()) + 3600}, secret_key, algorithm='HS256')
            return jsonify({'token': token}), 200
    
    existing_company = mongo.db.companies.find_one({'username': username})

    if existing_company: 
        # Check the hashed password
        stored_password = existing_company.get('password', '')
        if bcrypt.checkpw(password.encode('utf-8'), stored_password):
            token = jwt.encode({'username': existing_company['username'], 'exp': int(time.time()) + 3600}, secret_key, algorithm='HS256')
            return jsonify({'token': token}), 200

    return jsonify({'message': 'User does not exist or wrong credentials!'}), 401

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user_type = data.get('user_type')
    print('user_type', user_type)

    existing_candidate = mongo.db.candidates.find_one({'username': username})
    existing_company = mongo.db.companies.find_one({'username': username})

    # Specify the collection based on the user_type
    if user_type == 'candidate':
        user_collection = mongo.db.candidates
    elif user_type == 'company':
        user_collection = mongo.db.companies
    else:
        return jsonify({'message': 'Invalid user_type'}), 400

    if existing_candidate or existing_company:
        return jsonify({'message': 'Username already exists!'}), 409

    # Hash the password using bcrypt
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Insert the new user data into the appropriate collection
    user = {
        'username': username,
        'password': hashed_password,
        'user_type': user_type,
    }
    user_collection.insert_one(user)

    token = jwt.encode({'username': username, 'exp': int(time.time()) + 3600}, secret_key, algorithm='HS256')
    print('token', token)
    return jsonify({'token': token}), 200

@app.route('/decode_jwt', methods=['POST'])
def decode_jwt():
    data = request.get_json()
    jwt_token = data.get('jwt_token')

    try:
        decoded_token = jwt.decode(jwt_token, secret_key, algorithms=['HS256'])
        username = decoded_token.get('username', 'User not found in token')
        return jsonify({'username': username}), 200
    except ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except DecodeError:
        return jsonify({'message': 'Invalid token'}), 401
    
@app.route('/get-skills', methods=['POST'])
def get_skills():
    data = request.get_json()
    username = data.get('username')
    skill_type = data.get('skillType')

    user = mongo.db.candidates.find_one({'username': username})

    if not user:
        return jsonify({'message': 'User not found!'}), 404

    skills = user.get(skill_type, [])
    return jsonify({'skills': skills}), 200

@app.route('/add-skills', methods=['POST'])
def add_skills():
    data = request.get_json()
    username = data.get('username')
    new_skills = data.get('skills')
    skill_type = data.get('skillType')

    user = mongo.db.candidates.find_one({'username': username})

    if not user:
        return jsonify({'message': 'User not found!'}), 404

    existing_skills = user.get(skill_type, [])
    user[skill_type] = new_skills
    mongo.db.candidates.update_one({'_id': user['_id']}, {'$set': {skill_type: user[skill_type]}})

    return jsonify({'message': f'{skill_type} added/modified successfully'}), 200

@app.route('/get_usertype', methods=['POST'])
def get_usertype():
    data = request.get_json()
    username = data.get('username')

    existing_candidate = mongo.db.candidates.find_one({'username': username})
    
    if existing_candidate: 
        return jsonify({'user_type': 'candidate'}), 200
    
    existing_company = mongo.db.companies.find_one({'username': username})

    if existing_company: 
        return jsonify({'user_type': 'company'}), 200

    return jsonify({'message': 'User not found!'}), 404

@app.route('/get-job-description', methods=['POST'])
def get_job_description():
    data = request.get_json()
    username = data.get('username')

    company = mongo.db.companies.find_one({'username': username})

    if not company:
        return jsonify({'message': 'Company not found!'}), 404

    job_description = company.get('job_description', '')
    return jsonify({'jobDescription': job_description}), 200

@app.route('/save-job-description', methods=['POST'])
def save_job_description():
    data = request.get_json()
    username = data.get('username')
    job_description = data.get('jobDescription')

    company = mongo.db.companies.find_one({'username': username})

    if not company:
        return jsonify({'message': 'Company not found!'}), 404

    company['job_description'] = job_description
    mongo.db.companies.update_one({'_id': company['_id']}, {'$set': {'job_description': job_description}})

    return jsonify({'message': 'Job description saved successfully'}), 200

@app.route('/recommend-jobs', methods=['POST'])
def recommend_jobs():
    print('entered the recommend_jobs route')
    data = request.get_json()
    candidate_skills = data.get('skills')

    if not candidate_skills:
        return jsonify({'message': 'Skills not provided'}), 400

    # Call the function to get recommended jobs
    recommended_jobs = similar_jobs(candidate_skills, mongo.db.companies)

    # # Fetch job details from the companies collection based on the recommended jobs
    # jobs_collection = mongo.db.companies
    # recommended_jobs_data = []

    # for job_username in recommended_jobs:
    #     job = jobs_collection.find_one({'username': job_username})
    #     if job:
    #         recommended_jobs_data.append({'job_username': job_username, 'job_description': job.get('job_description', '')})
    print("recommended_jobs", recommended_jobs)
    return jsonify({'recommended_jobs': recommended_jobs}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
