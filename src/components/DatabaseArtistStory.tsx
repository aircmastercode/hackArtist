import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import DashboardNavbar from './DashboardNavbar';
import StoryHero from './StoryHero';
import StickyImageSection from './StickyImageSection';
import FullBleedImage from './FullBleedImage';
import { useUser } from '../context/UserContext';
import { FirestoreService, ArtistProfile } from '../services/firestore';
import { TextBlockData } from '../data/storyData';

interface DatabaseArtistStoryProps {
  artistId: string;
}

const DatabaseArtistStory: React.FC<DatabaseArtistStoryProps> = ({ artistId }) => {
  const { isAuthenticated } = useUser();
  const [artistProfile, setArtistProfile] = useState<ArtistProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadArtistProfile();
  }, [artistId]);

  const loadArtistProfile = async () => {
    try {
      setIsLoading(true);
      const profile = await FirestoreService.getArtistProfileByArtistId(artistId);
      
      if (profile) {
        setArtistProfile(profile);
      } else {
        setError('Artist profile not found');
      }
    } catch (err) {
      console.error('Error loading artist profile:', err);
      setError('Failed to load artist profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Convert story paragraphs to text blocks
  const createTextBlocks = (story: ArtistProfile['story']): TextBlockData[] => {
    const paragraphs = [
      story.paragraph1,
      story.paragraph2,
      story.paragraph3,
      story.paragraph4,
      story.paragraph5,
      story.paragraph6
    ];

    return paragraphs.map((paragraph, index) => ({
      type: 'text' as const,
      content: paragraph,
      alignment: index % 2 === 0 ? 'left' : 'right' as 'left' | 'right'
    }));
  };

  if (isLoading) {
    return (
      <main className="bg-black text-white min-h-screen">
        {isAuthenticated ? <DashboardNavbar /> : <Navbar />}
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-xl">Loading artist story...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !artistProfile) {
    return (
      <main className="bg-black text-white min-h-screen">
        {isAuthenticated ? <DashboardNavbar /> : <Navbar />}
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Story Not Found</h1>
            <p className="text-gray-300 mb-8">{error || 'This artist story could not be found.'}</p>
            <Link
              to="/story"
              className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Back to Artists
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const textBlocks = createTextBlocks(artistProfile.story);

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
        title={`${artistId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}'s Story`}
        subtitle="A Journey Through Art and Tradition"
        imageUrl={artistProfile.storyImages[0] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E"}
      />

      {/* Story Sections */}
      <StickyImageSection
        backgroundUrl={artistProfile.storyImages[1] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E"}
        alt="Artist story background"
        textBlocks={textBlocks.slice(0, 2)}
        storyImages={artistProfile.storyImages.slice(0, 2)}
      />

      <FullBleedImage
        imageUrl={artistProfile.storyImages[2] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E"}
        alt="Story break image"
      />

      <StickyImageSection
        backgroundUrl={artistProfile.storyImages[3] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E"}
        alt="Artist story background"
        textBlocks={textBlocks.slice(2, 4)}
        storyImages={artistProfile.storyImages.slice(2, 4)}
      />

      <FullBleedImage
        imageUrl={artistProfile.storyImages[4] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E"}
        alt="Story break image"
      />

      <StickyImageSection
        backgroundUrl={artistProfile.storyImages[5] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E"}
        alt="Artist story background"
        textBlocks={textBlocks.slice(4, 6)}
        storyImages={artistProfile.storyImages.slice(4, 6)}
      />

      {/* End of Story Section */}
      <section className="py-20 bg-[#121212]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-400">
            Connect with {artistId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </h2>
          <div className="flex justify-center space-x-6 mb-8">
            {artistProfile.instagramId && (
              <a
                href={`https://instagram.com/${artistProfile.instagramId.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                📸 Instagram
              </a>
            )}
            {artistProfile.youtubeLink && (
              <a
                href={artistProfile.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                🎥 YouTube
              </a>
            )}
          </div>
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

export default DatabaseArtistStory;
