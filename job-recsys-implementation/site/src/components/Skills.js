import React, { useState, useEffect } from 'react';
import '../styles/Skills.css';
import { fetchSkillsApi, addSkillsApi } from '../api';

const YourSkillsContent = ({ username }) => {
  const [techSkills, setTechSkills] = useState([]);
  const [softSkills, setSoftSkills] = useState([]);
  const [isEditingTechSkills, setIsEditingTechSkills] = useState(false);
  const [isEditingSoftSkills, setIsEditingSoftSkills] = useState(false);

  const getSkills = async () => {
    const techSkillsData = await fetchSkillsApi(username, 'tech_skills');
    const softSkillsData = await fetchSkillsApi(username, 'soft_skills');

    console.log('techskillsdata', techSkillsData)

    setTechSkills(techSkillsData.skills || []);
    setSoftSkills(softSkillsData.skills || []);

    setIsEditingTechSkills(!techSkillsData.skills || techSkillsData.skills.length === 0);
    setIsEditingSoftSkills(!softSkillsData.skills || softSkillsData.skills.length === 0);
  };

  useEffect(() => {
    getSkills();
  }, []);

  const handleSkillChange = (e, index, skillType) => {
    const updatedSkills = skillType === 'tech_skills' ? [...techSkills] : [...softSkills];
    updatedSkills[index] = e.target.value;

    if (skillType === 'tech_skills') {
      setTechSkills(updatedSkills);
    } else {
      setSoftSkills(updatedSkills);
    }
  };

  const handleAddSkill = (skillType) => {
    const updatedSkills = skillType === 'tech_skills' ? [...techSkills] : [...softSkills];
    updatedSkills.push('');

    if (skillType === 'tech_skills') {
      setTechSkills(updatedSkills);
    } else {
      setSoftSkills(updatedSkills);
    }
  };

  const handleSaveSkills = async (skillType) => {
    if (skillType === 'tech_skills') {
      await addSkillsApi(username, techSkills, skillType) 
      setIsEditingTechSkills(false);
    } else {
      await addSkillsApi(username, softSkills, skillType) 
      setIsEditingSoftSkills(false);
    }
  };

  return (
    <div className="skills-content">
      <h3>Your Skills</h3>
      <div className="skills-tab">
        <h4>Tech Skills</h4>
        {isEditingTechSkills ? (
          <div>
            {techSkills.map((skill, index) => (
              <input
                key={index}
                type="text"
                value={skill}
                onChange={(e) => handleSkillChange(e, index, 'tech_skills')}
              />
            ))}
            <button onClick={() => handleAddSkill('tech_skills')}>Add Skill</button>
            <button onClick={() => handleSaveSkills('tech_skills')}>Save</button>
          </div>
        ) : (
          <div>
            {techSkills.map((skill, index) => (
              <div key={index}>{skill}</div>
            ))}
            <button onClick={() => setIsEditingTechSkills(true)}>Edit Skills</button>
          </div>
        )}
      </div>
      <div className="skills-tab">
        <h4>Soft Skills</h4>
        {isEditingSoftSkills ? (
          <div>
            {softSkills.map((skill, index) => (
              <input
                key={index}
                type="text"
                value={skill}
                onChange={(e) => handleSkillChange(e, index, 'soft_skills')}
              />
            ))}
            <button onClick={() => handleAddSkill('soft_skills')}>Add Skill</button>
            <button onClick={() => handleSaveSkills('soft_skills')}>Save</button>
          </div>
        ) : (
          <div>
            {softSkills.map((skill, index) => (
              <div key={index}>{skill}</div>
            ))}
            <button onClick={() => setIsEditingSoftSkills(true)}>Edit Skills</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourSkillsContent;
