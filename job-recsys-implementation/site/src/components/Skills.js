import React, { useState, useEffect } from 'react';
import '../styles/Skills.css';

const YourSkillsContent = ({ username }) => {
  const [techSkills, setTechSkills] = useState([]);
  const [softSkills, setSoftSkills] = useState([]);
  const [isEditingTechSkills, setIsEditingTechSkills] = useState(false);
  const [isEditingSoftSkills, setIsEditingSoftSkills] = useState(false);

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

    setIsEditingTechSkills(!techSkillsData.skills || techSkillsData.skills.length === 0);
    setIsEditingSoftSkills(!softSkillsData.skills || softSkillsData.skills.length === 0);
  };

  const addSkills = async (skills, skillType) => {
    const response = await fetch('http://localhost:5000/add-skills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        skills: skills,
        skillType: skillType,
      }),
    });
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
      await addSkills(techSkills, 'tech_skills');
      setIsEditingTechSkills(false);
    } else {
      await addSkills(softSkills, 'soft_skills');
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
