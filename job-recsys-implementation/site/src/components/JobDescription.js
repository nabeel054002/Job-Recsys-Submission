import React, { useState, useEffect } from "react";
import '../styles/Skills.css';
import { fetchJobDescriptionApi, saveJobDescriptionApi } from "../api";

function JobDescription({ username }) {
  const [jobDescription, setJobDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Function to fetch the job description from the server
  const getJobDescription = async () => {
    try {
      const data = await fetchJobDescriptionApi(username);
      setJobDescription(data.jobDescription || "");
    } catch (error) {
      console.error("Error fetching job description:", error.message);
    }
  };

  // Fetch the job description when the component loads
  useEffect(() => {
    getJobDescription();
  }, [username]);

  // Handle saving the job description
  const handleSaveJobDescription = async () => {
    try {
      const result = await saveJobDescriptionApi(username, jobDescription);
      if (result) {
        setIsEditing(false);  // Exit edit mode
      }
    } catch (error) {
      console.error("Error saving job description:", error.message);
    }
  };

  // Toggle the editing state
  const handleToggleEditing = () => {
    setIsEditing((prevState) => !prevState);
  };

  // Render the JSX content
  const renderJobDescription = () => {
    return isEditing ? (
      <div className="skills-edit">
        <textarea
          className="skills-textarea"
          rows="4"
          cols="50"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        ></textarea>
        <button className="skills-button" onClick={handleSaveJobDescription}>Save</button>
      </div>
    ) : (
      <div className="skills-view">
        <p className="skills-text">{jobDescription}</p>
        <button className="skills-button" onClick={handleToggleEditing}>Edit</button>
      </div>
    );
  };

  return (
    <div className="skills-content">
      <h3 className="skills-heading">Job Description</h3>
      {renderJobDescription()}
    </div>
  );
}

export default JobDescription;
