import React, { useState, useEffect } from "react";
import '../styles/Skills.css';

function JobDescription({ username }) {
  const [jobDescription, setJobDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Function to fetch the job description from the server
  const fetchJobDescription = async () => {
    const response = await fetch("http://localhost:5000/get-job-description", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    });
    const data = await response.json();
    setJobDescription(data.jobDescription || "");
  };

  // Function to save the job description to the server
  const saveJobDescription = async () => {
    const response = await fetch("http://localhost:5000/save-job-description", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        jobDescription: jobDescription,
      }),
    });

    if (response.ok) {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    fetchJobDescription();
  }, [username]);

  return (
    <div className="skills-content">
      <h3 className="skills-heading">Job Description</h3>
      {isEditing ? (
        <div className="skills-edit">
          <textarea
            className="skills-textarea"
            rows="4"
            cols="50"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          ></textarea>
          <button className="skills-button" onClick={saveJobDescription}>Save</button>
        </div>
      ) : (
        <div className="skills-view">
          <p className="skills-text">{jobDescription}</p>
          <button className="skills-button" onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
}

export default JobDescription;
