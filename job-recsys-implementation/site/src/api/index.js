export const getSkillsApi = async (username, skillType) => {
    const response = await fetch('http://localhost:5050/get-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          skillType: skillType,
        }),
    });
    return response.json()
}

export const recommendJobsApi = async (skillsStr) => {
    const response = await fetch('http://localhost:5050/recommend-jobs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            skills: skillsStr
        })
    })

    return response.json();
}

export const addSkillsApi = async (username, skills, skillType) => {
    const response = await fetch('http://localhost:5050/add-skills', {
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
    return response.json();
}

export const fetchSkillsApi = async (username, skillType) => {
    const response = await fetch('http://localhost:5050/get-skills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        skillType: skillType,
      }),
    });
    const responseJson = await response.json();
    return responseJson.skills[0].skills;
}