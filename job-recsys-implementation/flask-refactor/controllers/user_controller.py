from flask import Blueprint, request, jsonify
from services.user_service import UserService

user_bp = Blueprint('user', __name__)

# Global UserService instance for shared usage
user_service = None

def init_user_routes(mongo):
    """
    Initialize the user blueprint with dependencies.

    Args:
        mongo: The PyMongo instance to access the database.
    """
    global user_service
    user_service = UserService(mongo)

    @user_bp.route('/get-skills', methods=['POST'])
    def get_skills():
        data = request.get_json()
        username, skill_type = data.get('username'), data.get('skillType')
        skills = user_service.get_skills(username, skill_type)
        return jsonify({"skills": skills})

    @user_bp.route('/add-skills', methods=['POST'])
    def add_skills():
        data = request.get_json()
        result = user_service.add_skills(data)
        return jsonify(result)

    @user_bp.route('/get_usertype', methods=['POST'])
    def get_usertype():
        data = request.get_json()
        result = user_service.get_usertype(data)
        return jsonify(result)
