import React from 'react';
import { Link } from 'react-router-dom';
// import './ClickableDiv.css'; // You can style this as you like

function ClickableDiv() {
    return (
      <div className="clickable-div">
        <Link to="/new-page">Click me to go to a different page</Link>
      </div>
    );
  }
export default ClickableDiv