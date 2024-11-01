from flask import Blueprint, request, jsonify
from services.job_service import JobService

job_bp = Blueprint('job', __name__)
job_service = JobService()

@job_bp.route('/recommend-jobs', methods=['POST'])
def recommend_jobs():
    data = request.get_json()
    candidate_skills = data.get('skills')
    recommended_jobs = job_service.recommend_jobs(candidate_skills)
    return jsonify({'recommended_jobs': recommended_jobs}), 200

@job_bp.route('/get-job-description', methods=['POST'])
def get_job_description():
    data = request.get_json()
    username = data.get('username')
    description = job_service.get_job_description(username)
    return description

@job_bp.route('/save-job-description', methods=['POST'])
def save_job_description():
    data = request.get_json()
    result = job_service.save_job_description(data)
    return result
