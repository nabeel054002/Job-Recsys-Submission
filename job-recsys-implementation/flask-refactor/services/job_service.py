from utils.job_recommendation import similar_jobs
from models.job_model import JobModel

class JobService:
    def __init__(self, mongo):
        self.job_model = JobModel(mongo)

    def recommend_jobs(self, candidate_skills):
        if not candidate_skills:
            return {'message': 'Skills not provided'}, 400
        job_descriptions_df = self.job_model.load_job_descriptions()
        recommended_jobs = similar_jobs(candidate_skills, job_descriptions_df)
        return recommended_jobs

    def get_job_description(self, username):
        return self.job_model.get_job_description(username)

    def save_job_description(self, data):
        return self.job_model.save_job_description(data)
