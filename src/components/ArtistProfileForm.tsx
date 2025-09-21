import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { FirestoreService, ArtistProfile } from '../services/firestore';

interface ArtistProfileFormProps {
  onProfileSaved?: () => void;
  onCancel?: () => void;
}

const ArtistProfileForm: React.FC<ArtistProfileFormProps> = ({ onProfileSaved, onCancel }) => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    instagramId: '',
    youtubeLink: '',
    story: {
      paragraph1: '',
      paragraph2: '',
      paragraph3: '',
      paragraph4: '',
      paragraph5: '',
      paragraph6: ''
    },
    storyImages: ['', '', '', '', '', ''] // 6 image URLs for 6 paragraphs
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Load existing profile if it exists
  useEffect(() => {
    if (user?.id) {
      loadExistingProfile();
    }
  }, [user?.id]);

  const loadExistingProfile = async () => {
    if (!user?.id) return;
    
    try {
      const existingProfile = await FirestoreService.getArtistProfileByArtistId(user.id);
      if (existingProfile) {
        setFormData({
          instagramId: existingProfile.instagramId,
          youtubeLink: existingProfile.youtubeLink,
          story: existingProfile.story,
          storyImages: existingProfile.storyImages
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('paragraph')) {
      const paragraphKey = name as keyof typeof formData.story;
      setFormData(prev => ({
        ...prev,
        story: {
          ...prev.story,
          [paragraphKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImages = [...formData.storyImages];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      storyImages: newImages
    }));
  };

  const validateForm = () => {
    if (!formData.instagramId.trim()) {
      setError('Instagram ID is required');
      return false;
    }
    if (!formData.youtubeLink.trim()) {
      setError('YouTube link is required');
      return false;
    }
    
    // Check if all story paragraphs are filled
    const storyValues = Object.values(formData.story);
    if (storyValues.some(paragraph => !paragraph.trim())) {
      setError('All 6 story paragraphs are required');
      return false;
    }
    
    // Check if all story images are provided
    if (formData.storyImages.some(image => !image.trim())) {
      setError('All 6 story images are required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    if (!user?.id) {
      setError('User not found. Please log in again.');
      return;
    }

    setIsLoading(true);

    try {
      const profileData: Omit<ArtistProfile, 'id'> = {
        artistId: user.id,
        instagramId: formData.instagramId.trim(),
        youtubeLink: formData.youtubeLink.trim(),
        story: formData.story,
        storyImages: formData.storyImages.filter(url => url.trim()),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      };

      await FirestoreService.addOrUpdateArtistProfile(profileData);
      
      if (onProfileSaved) {
        onProfileSaved();
      }
      
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-white/10">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-white/10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-400 mb-2">
          Complete Your Artist Profile
        </h2>
        <p className="text-gray-300">
          Share your story and connect with the world
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Social Media Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="instagramId" className="block text-sm font-medium text-gray-300 mb-2">
              Instagram ID *
            </label>
            <input
              type="text"
              id="instagramId"
              name="instagramId"
              value={formData.instagramId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
              placeholder="@your_instagram_id"
            />
          </div>

          <div>
            <label htmlFor="youtubeLink" className="block text-sm font-medium text-gray-300 mb-2">
              YouTube Link *
            </label>
            <input
              type="url"
              id="youtubeLink"
              name="youtubeLink"
              value={formData.youtubeLink}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
              placeholder="https://youtube.com/your_channel"
            />
          </div>
        </div>

        {/* Story Section */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Your Story (6 Paragraphs)</h3>
          <div className="space-y-6">
            {Object.entries(formData.story).map(([key, value], index) => (
              <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium text-gray-300 mb-2">
                  Paragraph {index + 1} *
                </label>
                <textarea
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 resize-none"
                  placeholder={`Tell us about your journey... (Paragraph ${index + 1})`}
                />
                
                {/* Story Image for this paragraph */}
                <div className="mt-3">
                  <label htmlFor={`storyImage${index}`} className="block text-sm font-medium text-gray-300 mb-2">
                    Story Image {index + 1} *
                  </label>
                  <input
                    type="url"
                    id={`storyImage${index}`}
                    value={formData.storyImages[index]}
                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                    placeholder="Enter image URL for this paragraph"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                Saving Profile...
              </div>
            ) : (
              'Save Profile'
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-all duration-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ArtistProfileForm;
