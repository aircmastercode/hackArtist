import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ArtistStoryPage from './pages/ArtistStoryPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import IndividualArtistStory from './components/IndividualArtistStory';
import { artists } from './data/artistsData';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/story" element={<ArtistStoryPage />} />
        <Route path="/explore" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Individual Artist Story Routes */}
        {artists.map((artist) => (
          <Route
            key={artist.id}
            path={`/story/${artist.id}`}
            element={
              <IndividualArtistStory
                story={artist.story}
                artistName={artist.name}
              />
            }
          />
        ))}
      </Routes>
    </Router>
  );
};

export default App;
