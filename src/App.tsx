import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import LandingPage from './pages/LandingPage';
import ArtistStoryPage from './pages/ArtistStoryPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MyProducts from './pages/MyProducts';
import MyProfile from './pages/MyProfile';
import MyStory from './pages/MyStory';
import PopulateStories from './pages/PopulateStories';
import IndividualArtistStory from './components/IndividualArtistStory';
import DatabaseArtistStory from './components/DatabaseArtistStory';
import { artists } from './data/artistsData';

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/story" element={<ArtistStoryPage />} />
          <Route path="/explore" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/my-story" element={<MyStory />} />
          <Route path="/my-products" element={<MyProducts />} />
          <Route path="/community" element={<Dashboard />} />
          <Route path="/populate-stories" element={<PopulateStories />} />
          {/* Individual Artist Story Routes */}
          {artists.map((artist) => (
            <Route
              key={artist.id}
              path={`/story/${artist.id}`}
              element={
                <DatabaseArtistStory
                  artistId={artist.id}
                />
              }
            />
          ))}
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
