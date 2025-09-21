import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { testFirebaseConnection } from '../utils/testFirebaseConnection';

const SystemTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    gemini: { success: boolean; message: string };
    firebase: { success: boolean; message: string };
  }>({
    gemini: { success: false, message: '' },
    firebase: { success: false, message: '' }
  });

  const testGemini = async () => {
    try {
      console.log('🧪 Testing Gemini API...');
      
      const GEMINI_API_KEY = '';
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = "Hello, this is a test. Please respond with 'Gemini API is working correctly' if you can read this.";
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Gemini Response:', text);
      setResults(prev => ({
        ...prev,
        gemini: { success: true, message: text }
      }));
    } catch (err) {
      console.error('❌ Gemini Error:', err);
      setResults(prev => ({
        ...prev,
        gemini: { success: false, message: err instanceof Error ? err.message : 'Unknown error occurred' }
      }));
    }
  };

  const testFirebase = async () => {
    try {
      const result = await testFirebaseConnection();
      setResults(prev => ({
        ...prev,
        firebase: { 
          success: result.success, 
          message: result.success 
            ? `Connected successfully. Found ${result.artistsCount} artists.`
            : (result.error || 'Unknown error occurred')
        }
      }));
    } catch (err) {
      console.error('❌ Firebase Error:', err);
      setResults(prev => ({
        ...prev,
        firebase: { success: false, message: err instanceof Error ? err.message : 'Unknown error occurred' }
      }));
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);
    setResults({
      gemini: { success: false, message: '' },
      firebase: { success: false, message: '' }
    });

    // Test Firebase first
    await testFirebase();
    
    // Then test Gemini
    await testGemini();
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-400 mb-2">
              System Test
            </h1>
            <p className="text-gray-300">
              Test Firebase and Gemini API connections
            </p>
          </div>

          {/* Firebase Test Result */}
          <div className="mb-6 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white">🔥 Firebase Connection</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${
                results.firebase.success 
                  ? 'bg-green-500/20 text-green-400' 
                  : results.firebase.message 
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-gray-500/20 text-gray-400'
              }`}>
                {results.firebase.success ? '✅ Success' : results.firebase.message ? '❌ Error' : '⏳ Pending'}
              </span>
            </div>
            {results.firebase.message && (
              <p className={`text-sm ${
                results.firebase.success ? 'text-green-300' : 'text-red-300'
              }`}>
                {results.firebase.message}
              </p>
            )}
          </div>

          {/* Gemini Test Result */}
          <div className="mb-6 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white">🤖 Gemini API</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${
                results.gemini.success 
                  ? 'bg-green-500/20 text-green-400' 
                  : results.gemini.message 
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-gray-500/20 text-gray-400'
              }`}>
                {results.gemini.success ? '✅ Success' : results.gemini.message ? '❌ Error' : '⏳ Pending'}
              </span>
            </div>
            {results.gemini.message && (
              <p className={`text-sm ${
                results.gemini.success ? 'text-green-300' : 'text-red-300'
              }`}>
                {results.gemini.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={runAllTests}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                  Running Tests...
                </div>
              ) : (
                'Run All Tests'
              )}
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={testFirebase}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
              >
                Test Firebase
              </button>
              <button
                onClick={testGemini}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
              >
                Test Gemini
              </button>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-400">
            <p>This will test both Firebase Firestore connection and Gemini AI API.</p>
            <p className="mt-2">Check the browser console for detailed logs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemTest;
