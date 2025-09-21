import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ArtistStoryPage from './pages/ArtistStoryPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/story" element={<ArtistStoryPage />} />
        <Route path="/explore" element={<LandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
