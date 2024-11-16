import React from "react";
import CandidatePanel from "./CandidatePanel";
import CompanyPanel from "./CompanyPanel";
import { fetchUserType } from "../api";

function Panel ({
    username
}) {

    const [userType, setUserType] = React.useState('');

    const getUserType = async () => {
        const userType = await fetchUserType(username); 
        setUserType(userType)
    }

    React.useEffect(() => {
        getUserType()
    }, [])
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