import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { testCachingSystem } from '../utils/testCachingSystem';

const CachingTest: React.FC = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testCaching = async () => {
    if (!user?.id) {
      setError('No user logged in. Please login first.');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError('');
    
    try {
      console.log('🧪 Testing Caching System...');
      const response = await testCachingSystem(user.id);
      
      if (response.success) {
        setResult(response);
      } else {
        setError(response.error || 'Unknown error occurred');
      }
    } catch (err) {
      console.error('❌ Caching Test Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Login Required</h1>
            <p className="text-gray-300 mb-6">
              You need to be logged in to test the caching system.
            </p>
            <a 
              href="/login" 
              className="bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-400 mb-2">
              Caching System Test
            </h1>
            <p className="text-gray-300">
              Test the business analysis caching system for {user.artistName}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <h3 className="font-semibold text-red-400 mb-2">❌ Error</h3>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <h3 className="font-semibold text-green-400 mb-4">✅ Caching System Test Results</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-300">Test Status:</span>
                  <span className="text-green-200">{result.success ? 'PASSED' : 'FAILED'}</span>
                </div>
                {result.responseTime && (
                  <div className="flex justify-between">
                    <span className="text-green-300">Response Time:</span>
                    <span className="text-green-200">{result.responseTime}ms</span>
                  </div>
                )}
                <div className="mt-4 p-3 bg-green-600/20 rounded-lg">
                  <p className="text-green-200 text-xs">
                    The caching system is working correctly. Business analysis data is now cached in Firestore 
                    and will only be regenerated when new products are added.
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={testCaching}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                Testing Caching System...
              </div>
            ) : (
              'Test Caching System'
            )}
          </button>

          <div className="mt-6 text-sm text-gray-400">
            <p>This will test the business analysis caching system:</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Check if analysis should be updated</li>
              <li>Retrieve cached analysis data</li>
              <li>Test analytics retrieval (uses cache if available)</li>
              <li>Verify analysis data is properly cached</li>
              <li>Measure response time improvements</li>
            </ul>
            <p className="mt-2">Check the browser console for detailed logs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CachingTest;
