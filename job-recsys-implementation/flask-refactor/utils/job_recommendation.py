import numpy as np
from sentence_transformers import SentenceTransformer

def similar_jobs(candidate_skills, job_descriptions_df):
    # Load the sentence-transformers model
    model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

    # Preprocess candidate skills for embedding
    candidate_skills = [skill.strip().lower() for skill in candidate_skills]
    candidate_skills_embedding = model.encode([' '.join(candidate_skills)])[0]
    
    # Function to calculate cosine similarity
    def cosine_similarity(embedding1, embedding2):
        dot_product = np.dot(embedding1, embedding2)
        norm_a = np.linalg.norm(embedding1)
        norm_b = np.linalg.norm(embedding2)
        return dot_product / (norm_a * norm_b)

    # Calculate similarities
    similarities = []
    for row in job_descriptions_df.collect():  # Collect rows from the Spark DataFrame
        job_embedding = np.array(row['job_embedding'])  # Convert to numpy array
        similarity = cosine_similarity(job_embedding, candidate_skills_embedding)
        similarities.append((row['_id'], similarity))  # Append job ID and similarity

    # Sort by similarity in descending order and get the top 30 matches
    similarities.sort(key=lambda x: x[1], reverse=True)
    top_jobs = similarities[:30]

    # Create a job document to return
    job_doc = {}
    for job_id, _ in top_jobs:
        job_doc[job_id] = {
            'Role': row['Role'],
            'Company': row['Company'],
            'Job Description': row['Job Description'],
            'Benefits': row['Benefits'],
            'Responsibilities': row['Responsibilities'],
            'skills': row['skills']
        }

    return job_doc
