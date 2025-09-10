import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import ArtistDashboard from './components/ArtistDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/artist-dashboard" element={<ArtistDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
