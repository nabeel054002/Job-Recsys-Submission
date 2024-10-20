import React from "react";
import CandidatePanel from "./CandidatePanel";
import CompanyPanel from "./CompanyPanel";

function Panel ({
    username
}) {

    const [userType, setUserType] = React.useState('');

    const getUserType = async () => {
        console.log('entered')
        const response = await fetch('http://localhost:5000/get_usertype',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username
            })
        })
        console.log('response', username)
        const u = await response.json();
        console.log('u',  u)
        setUserType(u.user_type)
    }

    React.useEffect(() => {
        getUserType()
    })
    return (
        <div>
            {userType==='candidate'? (
            <CandidatePanel
                user={username}
            />) : (
                userType==='company') ? (
                <CompanyPanel
                    user={username}
                />) : (
                <div>Gotta Sign in again</div>
                )}
        </div>
    )
}

export default Panel