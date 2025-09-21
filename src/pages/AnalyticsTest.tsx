import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { testAnalyticsService } from '../utils/testAnalyticsService';

const AnalyticsTest: React.FC = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testAnalytics = async () => {
    if (!user?.id) {
      setError('No user logged in. Please login first.');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError('');
    
    try {
      console.log('🧪 Testing Analytics Service...');
      const response = await testAnalyticsService(user.id);
      
      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error || 'Unknown error occurred');
      }
    } catch (err) {
      console.error('❌ Analytics Test Error:', err);
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
              You need to be logged in to test the analytics service.
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
              Analytics Service Test
            </h1>
            <p className="text-gray-300">
              Test the complete analytics service for {user.artistName}
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
              <h3 className="font-semibold text-green-400 mb-4">✅ Analytics Data Retrieved</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <strong className="text-green-300">Price Analysis:</strong>
                  <p className="text-green-200">{result.priceAnalysis?.currentPricing || 'N/A'}</p>
                </div>
                <div>
                  <strong className="text-green-300">Festival Offers:</strong>
                  <p className="text-green-200">{result.festivalOffers?.length || 0} offers generated</p>
                </div>
                <div>
                  <strong className="text-green-300">Market Analysis:</strong>
                  <p className="text-green-200">{result.marketAnalysis?.marketTrends || 'N/A'}</p>
                </div>
                <div>
                  <strong className="text-green-300">E-commerce Suggestions:</strong>
                  <p className="text-green-200">{result.ecommerceSuggestions?.length || 0} platforms suggested</p>
                </div>
                <div>
                  <strong className="text-green-300">Government Schemes:</strong>
                  <p className="text-green-200">{result.governmentSchemes?.length || 0} schemes found</p>
                </div>
                <div>
                  <strong className="text-green-300">Exhibitions:</strong>
                  <p className="text-green-200">{result.exhibitions?.length || 0} exhibitions listed</p>
                </div>
                <div>
                  <strong className="text-green-300">Product Ideas:</strong>
                  <p className="text-green-200">{result.productIdeas?.length || 0} ideas generated</p>
                </div>
                <div>
                  <strong className="text-green-300">Sales Report:</strong>
                  <p className="text-green-200">Total sales: {result.salesReport?.totalSales || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={testAnalytics}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                Testing Analytics Service...
              </div>
            ) : (
              'Test Analytics Service'
            )}
          </button>

          <div className="mt-6 text-sm text-gray-400">
            <p>This will test the complete analytics service including:</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Firebase data fetching</li>
              <li>Gemini AI analysis</li>
              <li>All analytics categories</li>
              <li>Error handling</li>
            </ul>
            <p className="mt-2">Check the browser console for detailed logs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTest;
