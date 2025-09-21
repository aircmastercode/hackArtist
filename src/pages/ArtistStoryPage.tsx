import React from 'react';
import Navbar from '../components/Navbar';
import ArtistGallery from '../components/ArtistGallery';

const ArtistStoryPage: React.FC = () => {
  return (
    <main className="bg-black text-white">
      <Navbar />
      <ArtistGallery />
    </main>
  );
};

export default ArtistStoryPage;
