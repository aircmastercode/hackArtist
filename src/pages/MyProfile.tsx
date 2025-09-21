import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import DashboardNavbar from '../components/DashboardNavbar';
import ArtistProfileForm from '../components/ArtistProfileForm';
import { FirestoreService, ArtistProfile } from '../services/firestore';

const MyProfile: React.FC = () => {
  const { user } = useUser();
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [artistProfile, setArtistProfile] = useState<ArtistProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Load artist profile
  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  const loadProfile = async () => {
    if (!user?.id) return;
    
    setIsLoadingProfile(true);
    try {
      const profile = await FirestoreService.getArtistProfileByArtistId(user.id);
      setArtistProfile(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleProfileSaved = () => {
    setShowProfileForm(false);
    loadProfile(); // Reload profile after saving
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-300">Please log in to access your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <DashboardNavbar />
      
      {/* Main Content */}
      <div className="pt-16">
        {/* Header Section */}
        <section className="py-20 bg-gradient-to-br from-orange-900/20 to-yellow-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                My Profile
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Complete your artist profile to share your story with the world
              </p>
              {!artistProfile && (
                <button 
                  onClick={() => setShowProfileForm(true)}
                  className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
                >
                  Complete Your Profile
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Profile Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoadingProfile ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : artistProfile ? (
              <div className="space-y-8">
                {/* Basic Info */}
                <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                    <button 
                      onClick={() => setShowProfileForm(true)}
                      className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-black font-bold py-2 px-4 rounded-lg transition-all duration-300"
                    >
                      Edit Profile
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Artist Name</label>
                      <p className="text-white text-lg">{user.artistName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                      <p className="text-white text-lg">{user.state}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Instagram ID</label>
                      <p className="text-white text-lg">{artistProfile.instagramId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">YouTube Link</label>
                      <a 
                        href={artistProfile.youtubeLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-orange-300 text-lg underline"
                      >
                        View Channel
                      </a>
                    </div>
                  </div>
                </div>

                {/* Story Section */}
                <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-6">My Story</h2>
                  <div className="space-y-6">
                    {Object.entries(artistProfile.story).map(([key, paragraph], index) => (
                      <div key={key} className="space-y-4">
                        <h3 className="text-lg font-semibold text-orange-400">Paragraph {index + 1}</h3>
                        <p className="text-gray-300 leading-relaxed">{paragraph}</p>
                        {artistProfile.storyImages[index] && (
                          <div className="mt-4">
                            <img 
                              src={artistProfile.storyImages[index]} 
                              alt={`Story image ${index + 1}`}
                              className="w-full max-w-md rounded-lg shadow-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">👤</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Complete Your Profile</h3>
                <p className="text-gray-300 mb-8 max-w-md mx-auto">
                  Share your story, social media links, and connect with the world through your art.
                </p>
                <button 
                  onClick={() => setShowProfileForm(true)}
                  className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Complete Your Profile
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Profile Form Modal */}
      {showProfileForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <ArtistProfileForm 
              onProfileSaved={handleProfileSaved}
              onCancel={() => setShowProfileForm(false)}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default MyProfile;
