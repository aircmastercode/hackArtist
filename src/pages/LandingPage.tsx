import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import InteractiveMapSection from '../components/InteractiveMapSection';
import FeaturedArtistsSection from '../components/FeaturedArtistsSection';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
  return (
    <main className="bg-[#121212] text-white font-sans">
      <Navbar />
      <HeroSection />
      <InteractiveMapSection />
      <FeaturedArtistsSection />
      <Footer />
    </main>
  );
};

export default LandingPage;
