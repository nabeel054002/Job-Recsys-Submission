import jwt
import time

SECRET_KEY = 'yourSecretKey'
JWT_EXPIRATION_TIME = 3600  # Token expires in 1 hour

def generate_token(username):
    return jwt.encode({'username': username, 'exp': time.time() + JWT_EXPIRATION_TIME}, SECRET_KEY, algorithm='HS256')
