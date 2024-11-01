from flask_pymongo import PyMongo
from utils.password_util import hash_password

mongo = PyMongo()

class UserModel:
    def get_user(self, username):
        """Retrieve user from candidates or companies."""
        return mongo.db.candidates.find_one({'username': username}) or \
               mongo.db.sampled_jobs.find_one({'username': username})

    def create_user(self, username, password, user_type):
        """Create a new user."""
        collection = mongo.db.candidates if user_type == 'candidate' else mongo.db.sampled_jobs
        collection.insert_one({
            '_id': username,
            'username': username,
            'password': hash_password(password),
            'user_type': user_type
        })

    def get_skills(self, username, skill_type):
        user = mongo.db.candidates.find_one({'username': username})
        if not user:
            return {'message': 'User not found!'}, 404
        return {'skills': user.get(skill_type, [])}, 200

    def add_skills(self, data):
        username, new_skills, skill_type = data.get('username'), data.get('skills'), data.get('skillType')
        user = mongo.db.candidates.find_one({'username': username})
        if not user:
            return {'message': 'User not found!'}, 404
        mongo.db.candidates.update_one(
            {'_id': user['_id']},
            {'$set': {skill_type: new_skills}}
        )
        return {'message': f'{skill_type} updated successfully'}, 200

    def get_usertype(self, data):
        user = self.get_user(data.get('username'))
        if user:
            return {'user_type': user['user_type']}, 200
        return {'message': 'User not found!'}, 404
