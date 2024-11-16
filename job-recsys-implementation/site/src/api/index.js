const handleFetchRequest = async (url, method, body = null, apiName = '') => {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${apiName} - ${error.message || 'Something went wrong'}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`${apiName} - Error during API request:`, error.message);
    throw new Error(`${apiName} - ${error.message || 'Request failed'}`);
  }
};

// Fetch skills for the given username and skill type
export const getSkillsApi = async (username, skillType) => {
  return await handleFetchRequest('http://localhost:5050/get-skills', 'POST', { username, skillType }, 'getSkillsApi');
};

// Sign up a new user
export const signupApi = async (username, password, userType) => {
  return await handleFetchRequest('http://localhost:5050/api/signup', 'POST', { username, password, user_type: userType }, 'signupApi');
};

// Fetch the job description for the given username
export const fetchJobDescriptionApi = async (username) => {
  return await handleFetchRequest('http://localhost:5050/get-job-description', 'POST', { username }, 'fetchJobDescriptionApi');
};

// Save the job description to the server
export const saveJobDescriptionApi = async (username, jobDescription) => {
  return await handleFetchRequest('http://localhost:5050/save-job-description', 'POST', { username, jobDescription }, 'saveJobDescriptionApi');
};

// Recommend jobs based on the given skills
export const recommendJobsApi = async (skillsStr) => {
  return await handleFetchRequest('http://localhost:5050/recommend-jobs', 'POST', { skills: skillsStr }, 'recommendJobsApi');
};

// Fetch the user type for a given username
export const fetchUserType = async (username) => {
  return await handleFetchRequest('http://localhost:5050/get_usertype', 'POST', { username }, 'fetchUserType');
};

// Add skills for a given user and skill type
export const addSkillsApi = async (username, skills, skillType) => {
  return await handleFetchRequest('http://localhost:5050/add-skills', 'POST', { username, skills, skillType }, 'addSkillsApi');
};

// Decode the JWT token to get the username
export const getUserFromToken = async (token) => {
  return await handleFetchRequest('http://localhost:5050/decode_jwt', 'POST', { jwt_token: token }, 'getUserFromToken');
};

// Fetch skills for a given username and skill type
export const fetchSkillsApi = async (username, skillType) => {
  const data = await handleFetchRequest('http://localhost:5050/get-skills', 'POST', { username, skillType }, 'fetchSkillsApi');
  return data.skills[0].skills;
};

// Log in a user with the given username and password
export const loginUser = async (username, password) => {
  const data = await handleFetchRequest('http://localhost:5050/api/login', 'POST', { username, password }, 'loginUser');
  return data.token;  // Assuming the server sends the token in a field called 'token'
};
