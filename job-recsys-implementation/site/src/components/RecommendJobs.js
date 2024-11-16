import React, {useState, useEffect} from "react"
import { getSkillsApi, recommendJobsApi } from "../api";

function RecommendedJob({ job }) {
  return (
    <div key={job.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
      <h3>Company: {job.username}</h3>
      <p>Skills required: {job.skills}</p>
      <p>Soft skills: {job.soft_skills}</p>
      {/* Add other job details as needed */}
    </div>
  );
}

function RecommendJobs ({
    username
}) {
    const [techSkills, setTechSkills] = useState([]);
    const [softSkills, setSoftSkills] = useState([]);
    const [recommendedJobs, setRecommendedJobs] = useState([]);
  
    const getSkills = async () => {
      const techSkillsData = await getSkillsApi(username, 'tech_skills');
      const softSkillsData = await getSkillsApi(username, 'soft_skills') 
  
      setTechSkills(techSkillsData.skills || []);
      setSoftSkills(softSkillsData.skills || []);
      getRecommendedJobs(techSkillsData.skills)
    };

    const getRecommendedJobs = async (techSkills) => {
        const skillsStr = techSkills.join(', ');
        const jsonRes = await recommendJobsApi(skillsStr)
        setRecommendedJobs(Object.values(jsonRes.recommended_jobs))
    }

    useEffect(() => {
        getSkills();
        // getRecommendedJobs();
    }, []);

    return(<div>
        {!(techSkills.length) ? 
            (<div>
                Gotta add your technical skills!
            </div>) 
        : <div>
        {recommendedJobs.map(job => (
          <RecommendedJob key={job.id} job={job} />
        ))}
      </div>}
    </div>)
}

export default RecommendJobs