import React, { useState } from 'react';
import { populateArtistStories } from '../utils/populateArtistStories';

const PopulateStories: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handlePopulate = async () => {
    setIsLoading(true);
    setResult('');
    
    try {
      await populateArtistStories();
      setResult('✅ Successfully populated all artist stories in the database!');
    } catch (error) {
      console.error('Error:', error);
      setResult('❌ Failed to populate stories. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-400 mb-2">
              Populate Artist Stories
            </h1>
            <p className="text-gray-300">
              Add existing artist stories to the database
            </p>
          </div>

          {result && (
            <div className={`mb-6 p-4 rounded-lg ${
              result.includes('✅') 
                ? 'bg-green-500/20 border border-green-500/50' 
                : 'bg-red-500/20 border border-red-500/50'
            }`}>
              <p className={`text-sm ${
                result.includes('✅') ? 'text-green-400' : 'text-red-400'
              }`}>
                {result}
              </p>
            </div>
          )}

          <button
            onClick={handlePopulate}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                Populating Stories...
              </div>
            ) : (
              'Populate Database'
            )}
          </button>

          <div className="mt-6 text-sm text-gray-400">
            <p>This will add stories for:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Ramesh Kumar (Terracotta Potter)</li>
              <li>Priya Sharma (Blue Pottery Artist)</li>
              <li>Arjun Patel (Kutch Embroidery Master)</li>
              <li>Lakshmi Devi (Kantha Embroidery)</li>
              <li>Suresh Iyer (Tanjore Painting)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopulateStories;
