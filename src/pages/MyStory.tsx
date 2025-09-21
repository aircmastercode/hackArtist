import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import DashboardNavbar from '../components/DashboardNavbar';
import { FirestoreService, ArtistProfile } from '../services/firestore';

const MyStory: React.FC = () => {
  const { user } = useUser();
  const [artistProfile, setArtistProfile] = useState<ArtistProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (user?.id) {
      loadArtistProfile();
    }
  }, [user?.id]);

  const loadArtistProfile = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const profile = await FirestoreService.getArtistProfileByArtistId(user.id);
      setArtistProfile(profile);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load your story');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-300">Please log in to access your story.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#121212] text-white">
        <DashboardNavbar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-xl">Loading your story...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !artistProfile) {
    return (
      <main className="min-h-screen bg-[#121212] text-white">
        <DashboardNavbar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-2xl mx-auto px-4">
            <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📖</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">Your Story Awaits</h1>
            <p className="text-gray-300 mb-8">
              {error || "You haven't created your story yet. Complete your profile to share your journey with the world."}
            </p>
            <a
              href="/my-profile"
              className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Complete Your Profile
            </a>
          </div>
        </div>
      </main>
    );
  }

  const storyParagraphs = [
    artistProfile.story.paragraph1,
    artistProfile.story.paragraph2,
    artistProfile.story.paragraph3,
    artistProfile.story.paragraph4,
    artistProfile.story.paragraph5,
    artistProfile.story.paragraph6
  ];

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <DashboardNavbar />
      
      {/* Hero Section */}
      <section className="pt-16 pb-20 bg-gradient-to-br from-orange-900/20 to-yellow-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            My Story
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            The journey of {user.artistName} - {user.state}
          </p>
          <div className="flex justify-center space-x-6">
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
        </div>
      </section>

      {/* Story Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {storyParagraphs.map((paragraph, index) => (
              <div key={index} className="group">
                <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-orange-500/50 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Story Text */}
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <span className="bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-bold px-3 py-1 rounded-full text-sm mr-4">
                          Chapter {index + 1}
                        </span>
                        <div className="h-px bg-gradient-to-r from-orange-500/50 to-transparent flex-1"></div>
                      </div>
                      <p className="text-lg text-gray-200 leading-relaxed">
                        {paragraph}
                      </p>
                    </div>
                    
                    {/* Story Image */}
                    {artistProfile.storyImages[index] && (
                      <div className="flex-shrink-0 w-full lg:w-80">
                        <div className="relative overflow-hidden rounded-xl">
                          <img
                            src={artistProfile.storyImages[index]}
                            alt={`Story chapter ${index + 1}`}
                            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-orange-900/10 to-yellow-900/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-400">
            Share Your Story with the World
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Your story is now part of the ShilpSetu community. Let others discover your journey and connect with your art.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/story"
              className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              View All Artist Stories
            </a>
            <a
              href="/my-profile"
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300"
            >
              Edit My Story
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MyStory;
