from flask import Blueprint, request, jsonify
from services.auth_service import AuthService

auth_bp = Blueprint('auth', __name__)

# Initialize the AuthService instance here
auth_service = None

def init_auth_routes(mongo):
    """
    Initialize the auth blueprint with dependencies.
    
    Args:
        mongo: The PyMongo instance to access the database.
    """
    global auth_service
    auth_service = AuthService(mongo)

    @auth_bp.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json()
        username, password = data.get('username'), data.get('password')
        token = auth_service.login(username, password)
        if token:
            return jsonify({'token': token}), 200
        return jsonify({'message': 'Invalid credentials or user not found'}), 401

    @auth_bp.route('/api/signup', methods=['POST'])
    def signup():
        data = request.get_json()
        result = auth_service.signup(data)
        return result

    @auth_bp.route('/decode_jwt', methods=['POST'])
    def decode_jwt():
        data = request.get_json()
        result = auth_service.decode_jwt(data)
        return result
