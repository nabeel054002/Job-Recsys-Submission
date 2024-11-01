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

SECRET_KEY = 'yourSecretKey'
JWT_EXPIRATION_TIME = 3600  # Token expires in 1 hour

# Helper functions
def generate_token(username):
    return jwt.encode({'username': username, 'exp': time.time() + JWT_EXPIRATION_TIME}, SECRET_KEY, algorithm='HS256')

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password)

def get_user(username):
    """Retrieve user from candidates or companies."""
    return mongo.db.candidates.find_one({'username': username}) or \
           mongo.db.sampled_jobs.find_one({'username': username})

def get_collection(user_type):
    """Return the relevant collection based on user type."""
    return mongo.db.candidates if user_type == 'candidate' else mongo.db.sampled_jobs

# Routes
@cross_origin
@app.route('/', methods=['GET'])
def health_check():
    return "Hi", 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username, password = data.get('username'), data.get('password')

    user = get_user(username)
    if user and verify_password(password, user.get('password', '')):
        token = generate_token(username)
        return jsonify({'token': token}), 200

    return jsonify({'message': 'Invalid credentials or user not found'}), 401

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username, password, user_type = data.get('username'), data.get('password'), data.get('user_type')

    if user_type not in ['candidate', 'company']:
        return jsonify({'message': 'Invalid user type'}), 400

    collection = get_collection(user_type)

    try:
        collection.insert_one({
            '_id': username, 
            'username': username, 
            'password': hash_password(password),
            'user_type': user_type
        })
    except DuplicateKeyError:
        return jsonify({'message': 'Username already exists'}), 409

    token = generate_token(username)
    return jsonify({'token': token}), 200

@app.route('/decode_jwt', methods=['POST'])
def decode_jwt():
    data = request.get_json()
    try:
        decoded = jwt.decode(data.get('jwt_token'), SECRET_KEY, algorithms=['HS256'])
        return jsonify({'username': decoded.get('username')}), 200
    except ExpiredSignatureError:
        return jsonify({'message': 'Token expired'}), 401
    except DecodeError:
        return jsonify({'message': 'Invalid token'}), 401

@app.route('/get-skills', methods=['POST'])
def get_skills():
    data = request.get_json()
    username, skill_type = data.get('username'), data.get('skillType')

    user = mongo.db.candidates.find_one({'username': username})
    if not user:
        return jsonify({'message': 'User not found!'}), 404

    return jsonify({'skills': user.get(skill_type, [])}), 200

@app.route('/add-skills', methods=['POST'])
def add_skills():
    data = request.get_json()
    username, new_skills, skill_type = data.get('username'), data.get('skills'), data.get('skillType')

    user = mongo.db.candidates.find_one({'username': username})
    if not user:
        return jsonify({'message': 'User not found!'}), 404

    mongo.db.candidates.update_one(
        {'_id': user['_id']}, 
        {'$set': {skill_type: new_skills}}
    )
    return jsonify({'message': f'{skill_type} updated successfully'}), 200

@app.route('/get_usertype', methods=['POST'])
def get_usertype():
    data = request.get_json()
    user = get_user(data.get('username'))

    if user:
        return jsonify({'user_type': user['user_type']}), 200
    return jsonify({'message': 'User not found!'}), 404

@app.route('/get-job-description', methods=['POST'])
def get_job_description():
    data = request.get_json()
    username = data.get('username')

    company = mongo.db.sampled_jobs.find_one({'username': username})
    if not company:
        return jsonify({'message': 'Company not found!'}), 404

    return jsonify({'jobDescription': company.get('job_description', '')}), 200

@app.route('/save-job-description', methods=['POST'])
def save_job_description():
    data = request.get_json()
    username, job_description = data.get('username'), data.get('jobDescription')

    result = mongo.db.sampled_jobs.update_one(
        {'username': username},
        {'$set': {'job_description': job_description}}
    )

    if result.matched_count:
        return jsonify({'message': 'Job description saved successfully'}), 200
    return jsonify({'message': 'Company not found!'}), 404

@app.route('/recommend-jobs', methods=['POST'])
def recommend_jobs():
    data = request.get_json()
    candidate_skills = data.get('skills')

    if not candidate_skills:
        return jsonify({'message': 'Skills not provided'}), 400

    recommended_jobs = similar_jobs(candidate_skills, mongo.db.sampled_jobs)
    return jsonify({'recommended_jobs': recommended_jobs}), 200

# Run the app
if __name__ == '__main__':
    app.run(port=5000)
