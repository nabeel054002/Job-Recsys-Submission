from flask import Blueprint, request, jsonify
from services.user_service import UserService

user_bp = Blueprint('user', __name__)
user_service = UserService()

@user_bp.route('/get-skills', methods=['POST'])
def get_skills():
    data = request.get_json()
    username, skill_type = data.get('username'), data.get('skillType')
    return user_service.get_skills(username, skill_type)

@user_bp.route('/add-skills', methods=['POST'])
def add_skills():
    data = request.get_json()
    return user_service.add_skills(data)

@user_bp.route('/get_usertype', methods=['POST'])
def get_usertype():
    data = request.get_json()
    return user_service.get_usertype(data)
