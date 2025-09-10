import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ArtistDashboard.css';

const ArtistDashboard = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="artist-dashboard">
      <div className="dashboard-header">
        <h1>Artist Dashboard</h1>
        <button onClick={handleBackToHome} className="back-button">
          ← Back to Home
        </button>
      </div>
      
      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome to Your Artist Dashboard!</h2>
          <p>This is your dedicated space to manage your artist profile and showcase your work.</p>
        </div>
        
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Profile Management</h3>
            <p>Update your artist information, categories, and contact details.</p>
          </div>
          
          <div className="dashboard-card">
            <h3>Portfolio</h3>
            <p>Upload and manage your artwork, photos, and creative projects.</p>
          </div>
          
          <div className="dashboard-card">
            <h3>Exhibitions</h3>
            <p>Create and manage your upcoming exhibitions and events.</p>
          </div>
          
          <div className="dashboard-card">
            <h3>Analytics</h3>
            <p>Track views, engagement, and performance of your profile.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDashboard;
