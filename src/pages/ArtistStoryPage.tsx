import React from 'react';
import Navbar from '../components/Navbar';
import StoryHero from '../components/StoryHero';
import StickyImageSection from '../components/StickyImageSection';
import FullBleedImage from '../components/FullBleedImage';
import { artistStory } from '../data/storyData';
import { StickyImageSectionData, FullBleedImageData } from '../data/storyData';

const ArtistStoryPage: React.FC = () => {
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
      <Navbar />
      {/* Hero Section */}
      <StoryHero
        title={artistStory.hero.title}
        subtitle={artistStory.hero.subtitle}
        imageUrl={artistStory.hero.imageUrl}
      />

      {/* Story Sections */}
      {artistStory.sections.map((section, index) => renderSection(section, index))}
    </main>
  );
};

export default ArtistStoryPage;
