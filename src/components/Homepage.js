import React, { useState, useEffect } from 'react';
import './Homepage.css';

const Homepage = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Track cursor position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Handle main button click
  const handleBeginJourney = () => {
    setIsModalOpen(true);
  };

  // Handle modal option clicks
  const handleExploreArts = () => {
    console.log('User chose: Explore the Arts');
    setIsModalOpen(false);
    // Future routing logic will go here
  };

  const handleIAmArtist = () => {
    console.log('User chose: I am an Artist');
    setIsModalOpen(false);
    // Future routing logic will go here
  };

  return (
    <div className="homepage-container">
      {/* Spotlight Overlay */}
      <div 
        className="spotlight-overlay"
        style={{
          '--x': `${cursorPosition.x}px`,
          '--y': `${cursorPosition.y}px`
        }}
      />
      
      {/* Content Wrapper */}
      <div className="content-wrapper">
        <button 
          className="main-cta-button"
          onClick={handleBeginJourney}
        >
          Begin Your Journey
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Welcome to the Nexus</h2>
            <p className="modal-subtitle">How would you like to begin?</p>
            <div className="modal-buttons">
              <button 
                className="modal-option-button"
                onClick={handleExploreArts}
              >
                Explore the Arts
              </button>
              <button 
                className="modal-option-button"
                onClick={handleIAmArtist}
              >
                I am an Artist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
