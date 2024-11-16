from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from controllers.auth_controller import auth_bp, init_auth_routes
from controllers.job_controller import job_bp, init_job_routes
from controllers.user_controller import user_bp, init_user_routes

# Flask app and MongoDB setup
app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/Job-Recsys"
mongo = PyMongo(app)
CORS(app)

# Initialize routes with dependencies
init_auth_routes(mongo)
init_job_routes(mongo)
init_user_routes(mongo)

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(job_bp)
app.register_blueprint(user_bp)

# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=5050)
