import React, { useState } from 'react';
import '../styles/Panel.css'; // Import your CSS file
import JobDescription from './JobDescription'

const CompanyPanel = ({
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
          className={`tab ${activeTab === 'recommendedCandidates' ? 'active' : ''}`}
          onClick={() => handleTabClick('recommendedCandidates')}
        >
          Recommended Candidates
        </div>
      </div>
      <div className="content">
        {activeTab === 'yourSkills' && (
          <div className="tab-content">
            {/* Content for "Your Skills" tab */}
            <JobDescription username={user} />
          </div>
        )}
        {activeTab === 'recommendedCandidates' && (
          <div className="tab-content">
            {/* Content for "Recommended Candidates" tab */}
            Recommended Candidates Content Goes Here
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyPanel;
