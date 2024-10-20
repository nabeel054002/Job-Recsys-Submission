import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Company from "./components/Company";
import Candidate from "./components/CandidatePage";
import Choices from "./components/ChoicesPage";
import Login from "./components/LoginPage";
import JwtComponent from './components/JwtComponent';
import Footer from "./components/Footer"
import './App.css';

function App() {
  return (
    <div>
      <div className="App">
      <h1>Welcome to a modern twist to your generic Job recommendation platform</h1>
      <div className="RouterContainer">
        <Router>
          <div>
            <Routes className="RoutesContainer">
              <Route exact path="/" element={<Choices className="ComponentContainer" />} />
              <Route path="/company-page" element={<Company className="ComponentContainer" />} />
              <Route path="/candidate-page" element={<Candidate className="ComponentContainer" />} />
              <Route path="/login-page" element={<Login className="ComponentContainer" />} />
              <Route path="/:token" element={<JwtComponent className="JwtComponent" />} />
            </Routes>
          </div>
        </Router>
      </div>
    </div>
    <Footer/>
    </div>
  );
}

export default App;
