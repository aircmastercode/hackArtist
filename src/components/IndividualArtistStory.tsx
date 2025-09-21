import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import DashboardNavbar from './DashboardNavbar';
import StoryHero from './StoryHero';
import StickyImageSection from './StickyImageSection';
import FullBleedImage from './FullBleedImage';
import { StickyImageSectionData, FullBleedImageData } from '../data/storyData';
import { useUser } from '../context/UserContext';

interface IndividualArtistStoryProps {
  story: {
    hero: {
      title: string;
      subtitle: string;
      imageUrl: string;
    };
    sections: (StickyImageSectionData | FullBleedImageData)[];
  };
  artistName: string;
}

const IndividualArtistStory: React.FC<IndividualArtistStoryProps> = ({ story, artistName }) => {
  const { isAuthenticated } = useUser();
  const renderSection = (section: StickyImageSectionData | FullBleedImageData, index: number) => {
    switch (section.type) {
      case 'sticky-image-section':
        return (
          <StickyImageSection
            key={index}
            backgroundUrl={section.backgroundUrl}
            alt={section.alt}
            textBlocks={section.textBlocks}
          />
        );
      case 'full-bleed-image':
        return (
          <FullBleedImage
            key={index}
            imageUrl={section.imageUrl}
            alt={section.alt}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="bg-black text-white">
      {/* Conditional Navbar */}
      {isAuthenticated ? <DashboardNavbar /> : <Navbar />}
      
      {/* Back to Gallery Button */}
      <div className="fixed top-20 left-4 z-40">
        <Link
          to="/story"
          className="bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-white/20 hover:border-orange-500/50 transition-all duration-300 flex items-center space-x-2 group"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Artists</span>
        </Link>
      </div>

      {/* Hero Section */}
      <StoryHero
        title={story.hero.title}
        subtitle={story.hero.subtitle}
        imageUrl={story.hero.imageUrl}
      />

      {/* Story Sections */}
      {story.sections.map((section, index) => renderSection(section, index))}

      {/* End of Story Section */}
      <section className="py-20 bg-[#121212]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-400">
            Discover More Artists
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Explore the stories of other master artisans and their incredible crafts
          </p>
          <Link
            to="/story"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-yellow-400 hover:shadow-lg hover:shadow-yellow-500/50 text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
          >
            <span>View All Artists</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default IndividualArtistStory;
