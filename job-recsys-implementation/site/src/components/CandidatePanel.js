import React, { useState } from 'react';
import '../styles/Panel.css'; // Import your CSS file
import YourSkillsContent from './Skills';
import RecommendJobsContent from './RecommendJobs'

const CandidatePanel = ({
  user
}) => {
  const [activeTab, setActiveTab] = useState('yourSkills');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="panel">
      You are {user}
      <div className="tabs">
        <div
          className={`tab ${activeTab === 'yourSkills' ? 'active' : ''}`}
          onClick={() => handleTabClick('yourSkills')}
        >
          Your Skills
        </div>
        <div
          className={`tab ${activeTab === 'recommendedJobs' ? 'active' : ''}`}
          onClick={() => handleTabClick('recommendedJobs')}
        >
          Recommended Jobs
        </div>
      </div>
      <div className="content">
        {activeTab === 'yourSkills' && (
          <div className="tab-content">
            {/* Content for "Your Skills" tab */}
            <YourSkillsContent
              username={user}
            />
          </div>
        )}
        {activeTab === 'recommendedJobs' && (
          <div className="tab-content">
            <RecommendJobsContent
              username={user}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatePanel;
