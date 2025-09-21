import React from 'react';
import Navbar from '../components/Navbar';
import DashboardNavbar from '../components/DashboardNavbar';
import ArtistGallery from '../components/ArtistGallery';
import { useUser } from '../context/UserContext';

const ArtistStoryPage: React.FC = () => {
  const { isAuthenticated } = useUser();

  return (
    <main className="bg-black text-white">
      {isAuthenticated ? <DashboardNavbar /> : <Navbar />}
      <ArtistGallery />
    </main>
  );
};

export default ArtistStoryPage;
