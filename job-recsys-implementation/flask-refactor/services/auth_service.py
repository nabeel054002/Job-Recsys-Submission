import jwt
import bcrypt
import time
from jwt.exceptions import ExpiredSignatureError, DecodeError
from pymongo.errors import DuplicateKeyError
from models.user_model import UserModel
from utils.jwt_util import generate_token
from utils.password_util import hash_password, verify_password

class AuthService:
    def __init__(self):
        self.user_model = UserModel()

    def login(self, username, password):
        user = self.user_model.get_user(username)
        if user and verify_password(password, user.get('password', '')):
            return generate_token(username)
        return None

    def signup(self, data):
        username, password, user_type = data.get('username'), data.get('password'), data.get('user_type')
        if user_type not in ['candidate', 'company']:
            return jsonify({'message': 'Invalid user type'}), 400
        try:
            self.user_model.create_user(username, password, user_type)
        except DuplicateKeyError:
            return jsonify({'message': 'Username already exists'}), 409
        return jsonify({'token': generate_token(username)}), 200

    def decode_jwt(self, data):
        try:
            decoded = jwt.decode(data.get('jwt_token'), 'yourSecretKey', algorithms=['HS256'])
            return jsonify({'username': decoded.get('username')}), 200
        except ExpiredSignatureError:
            return jsonify({'message': 'Token expired'}), 401
        except DecodeError:
            return jsonify({'message': 'Invalid token'}), 401
