import React, {useState, useEffect} from "react"

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
      const techSkillsResponse = await fetch('http://localhost:5000/get-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          skillType: 'tech_skills',
        }),
      });
      const softSkillsResponse = await fetch('http://localhost:5000/get-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          skillType: 'soft_skills',
        }),
      });
  
      const techSkillsData = await techSkillsResponse.json();
      const softSkillsData = await softSkillsResponse.json();
  
      setTechSkills(techSkillsData.skills || []);
      setSoftSkills(softSkillsData.skills || []);
      getRecommendedJobs(techSkillsData.skills)
    };

    const getRecommendedJobs = async (techSkills) => {
        const skillsStr = techSkills.join(', ');
        const response = await fetch('http://localhost:5000/recommend-jobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                skills: skillsStr
            })
        })
        //console.log('response',response)
        const jsonRes = await response.json();
        //console.log('jsonRes', jsonRes.recommended_jobs)
        //console.log('jsonRes values', Object.values(jsonRes.recommended_jobs))
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