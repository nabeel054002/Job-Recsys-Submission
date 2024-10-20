import React from "react";
import { Link } from "react-router-dom";
import "../styles/index.css"

function ChoicesPage () {
    return (<div className="choices-page">
        Hi there!<br/>Please choose your choice
        <div className="choices-tab">
        <Link to="/candidate-page" className="choices"> Are you a seeking a job?</Link>
        <Link to="/company-page" className="choices">Are you hiring?</Link>
        <Link to='/login-page' className="choices">Already existing user</Link>
        </div>
    </div>)
}

export default ChoicesPage