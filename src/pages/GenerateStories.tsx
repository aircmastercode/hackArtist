import React, { useState } from 'react';
import { StoryGenerationService } from '../services/storyGenerationService';
import { FirestoreService } from '../services/firestore';
import DashboardNavbar from '../components/DashboardNavbar';

const GenerateStories: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  const [generatedStories, setGeneratedStories] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleGenerateAllStories = async () => {
    setIsGenerating(true);
    setError('');
    setGeneratedStories([]);
    
    try {
      setGenerationProgress('🎭 Starting story generation for all artists...');
      
      await StoryGenerationService.generateStoriesForAllArtists();
      
      setGenerationProgress('✅ Story generation completed successfully!');
      setGeneratedStories(['All artist stories have been generated and saved to the database.']);
      
    } catch (error) {
      console.error('❌ Error generating stories:', error);
      setError(`Failed to generate stories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateStoriesSection = async () => {
    setIsGenerating(true);
    setError('');
    setGeneratedStories([]);
    
    try {
      setGenerationProgress('🎭 Starting Stories section story generation for all artists...');
      
      await StoryGenerationService.generateStoriesForStoriesSection();
      
      setGenerationProgress('✅ Stories section story generation completed successfully!');
      setGeneratedStories(['All Stories section stories have been generated and saved to the database.']);
      
    } catch (error) {
      console.error('❌ Error generating Stories section stories:', error);
      setError(`Failed to generate Stories section stories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSingleStory = async () => {
    setIsGenerating(true);
    setError('');
    setGeneratedStories([]);
    
    try {
      setGenerationProgress('🎭 Getting all artists...');
      
      const artists = await FirestoreService.getAllArtists();
      if (artists.length === 0) {
        setError('No artists found in the database.');
        return;
      }
      
      const firstArtist = artists[0];
      setGenerationProgress(`🎭 Generating story for ${firstArtist.artistName}...`);
      
      const story = await StoryGenerationService.generateStoryForArtist(firstArtist.id!);
      
      setGenerationProgress('✅ Story generated successfully!');
      setGeneratedStories([
        `Story generated for ${firstArtist.artistName}:`,
        `Title: ${story.title}`,
        '',
        'Paragraphs:',
        ...story.paragraphs.map((p, i) => `${i + 1}. ${p}`)
      ]);
      
    } catch (error) {
      console.error('❌ Error generating story:', error);
      setError(`Failed to generate story: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <DashboardNavbar />
      
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Generate Artist Stories
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Create heart-touching, authentic stories for all artists based on their state, culture, and products
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <div className="space-y-6">
              {/* Generation Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={handleGenerateAllStories}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Generating...' : 'Generate All Stories (MyStory + Stories Section)'}
                </button>
                
                <button
                  onClick={handleGenerateStoriesSection}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Generating...' : 'Generate Stories Section Only'}
                </button>
                
                <button
                  onClick={handleGenerateSingleStory}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-blue-500 to-purple-400 hover:from-blue-600 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Generating...' : 'Generate Single Story (Test)'}
                </button>
              </div>

              {/* Progress Display */}
              {isGenerating && (
                <div className="bg-gray-700/50 rounded-lg p-6">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                    <p className="text-orange-400 font-medium">{generationProgress}</p>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-red-400 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Results Display */}
              {generatedStories.length > 0 && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-green-400 font-bold text-lg">Generation Results</h3>
                  </div>
                  <div className="space-y-2">
                    {generatedStories.map((line, index) => (
                      <p key={index} className="text-gray-300">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Information */}
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-6">
                <h3 className="text-blue-400 font-bold text-lg mb-3">About Story Generation</h3>
                <div className="text-gray-300 space-y-2">
                  <p>• Stories are generated using AI based on each artist's state, cultural background, and products</p>
                  <p>• Each story contains 6 heart-touching paragraphs about the artist's journey</p>
                  <p>• Stories incorporate local cultural elements, challenges, and traditional arts</p>
                  <p>• Generated stories are automatically saved to the Firestore database</p>
                  <p>• Stories will be displayed in the "My Story" section for each artist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateStories;
