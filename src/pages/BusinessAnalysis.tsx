import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import DashboardNavbar from '../components/DashboardNavbar';
import AnalyticsService, { AnalyticsData } from '../agents/services/analyticsService';

const BusinessAnalysis: React.FC = () => {
  const { user } = useUser();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.id) {
      loadAnalytics();
    }
  }, [user?.id]);

  const loadAnalytics = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      setError('');
      console.log('🚀 Starting analytics load for user:', user.id);
      
      const data = await AnalyticsService.getArtistAnalytics(user.id);
      console.log('✅ Analytics data loaded successfully:', data);
      setAnalyticsData(data);
    } catch (err) {
      console.error('❌ Error loading analytics:', err);
      setError(`Failed to load analytics data: ${err instanceof Error ? err.message : 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-300">Please log in to access business analysis.</p>
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
            <p className="text-xl">Loading your business analytics...</p>
            <p className="text-gray-400 mt-2">This may take a few moments</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#121212] text-white">
        <DashboardNavbar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-2xl mx-auto px-4">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-4">Error Loading Analytics</h1>
            <p className="text-gray-300 mb-8">{error}</p>
            <button 
              onClick={loadAnalytics}
              className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <DashboardNavbar />
      
      {/* Hero Section */}
      <section className="pt-16 pb-8 bg-gradient-to-br from-orange-900/20 to-yellow-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Business Analytics
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              AI-powered insights for {user.artistName} from {user.state}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'pricing', label: 'Pricing Analysis', icon: '💰' },
              { id: 'festivals', label: 'Festival Offers', icon: '🎉' },
              { id: 'market', label: 'Market Analysis', icon: '📈' },
              { id: 'ecommerce', label: 'E-commerce', icon: '🛒' },
              { id: 'schemes', label: 'Gov Schemes', icon: '🏛️' },
              { id: 'exhibitions', label: 'Exhibitions', icon: '🎪' },
              { id: 'products', label: 'Product Ideas', icon: '💡' },
              { id: 'reports', label: 'Sales Reports', icon: '📋' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-black'
                    : 'bg-gray-800/50 text-white hover:bg-gray-700/50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {analyticsData && (
            <div className="space-y-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">💰 Pricing Analysis</h3>
                    <p className="text-gray-300 text-sm mb-4">{analyticsData.priceAnalysis.currentPricing}</p>
                    <div className="text-orange-400 text-sm">
                      {analyticsData.priceAnalysis.recommendations.length} recommendations
                    </div>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">🎉 Festival Offers</h3>
                    <p className="text-gray-300 text-sm mb-4">{analyticsData.festivalOffers.length} festival strategies</p>
                    <div className="text-orange-400 text-sm">
                      Upcoming: {analyticsData.festivalOffers[0]?.festival || 'Diwali'}
                    </div>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">📈 Market Analysis</h3>
                    <p className="text-gray-300 text-sm mb-4">{analyticsData.marketAnalysis.competitors.length} competitors identified</p>
                    <div className="text-orange-400 text-sm">
                      {analyticsData.marketAnalysis.opportunities.length} opportunities
                    </div>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">🛒 E-commerce Platforms</h3>
                    <p className="text-gray-300 text-sm mb-4">{analyticsData.ecommerceSuggestions.length} platform suggestions</p>
                    <div className="text-orange-400 text-sm">
                      Top: {analyticsData.ecommerceSuggestions[0]?.platform || 'Amazon Handmade'}
                    </div>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">🏛️ Government Schemes</h3>
                    <p className="text-gray-300 text-sm mb-4">{analyticsData.governmentSchemes.length} schemes available</p>
                    <div className="text-orange-400 text-sm">
                      Location: {user.state}
                    </div>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">💡 Product Ideas</h3>
                    <p className="text-gray-300 text-sm mb-4">{analyticsData.productIdeas.length} trending ideas</p>
                    <div className="text-orange-400 text-sm">
                      Latest trends for 2024-2025
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing Analysis Tab */}
              {activeTab === 'pricing' && (
                <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-6">💰 Pricing Analysis</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-orange-400 mb-2">Current Pricing</h3>
                      <p className="text-gray-300">{analyticsData.priceAnalysis.currentPricing}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-orange-400 mb-2">Market Comparison</h3>
                      <p className="text-gray-300">{analyticsData.priceAnalysis.marketComparison}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-orange-400 mb-2">Recommendations</h3>
                      <ul className="space-y-2">
                        {analyticsData.priceAnalysis.recommendations.map((rec, index) => (
                          <li key={index} className="text-gray-300 flex items-start">
                            <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-orange-400 mb-2">Competitive Advantage</h3>
                      <p className="text-gray-300">{analyticsData.priceAnalysis.competitiveAdvantage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Festival Offers Tab */}
              {activeTab === 'festivals' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">🎉 Festival Offers & Strategies</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analyticsData.festivalOffers.map((offer, index) => (
                      <div key={index} className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
                        <h3 className="text-xl font-semibold text-orange-400 mb-4">{offer.festival}</h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-gray-400">Offer Type:</span>
                            <span className="text-white ml-2">{offer.offerType}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Discount:</span>
                            <span className="text-white ml-2">{offer.discountPercentage}%</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Target Audience:</span>
                            <span className="text-white ml-2">{offer.targetAudience}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Strategy:</span>
                            <p className="text-gray-300 mt-1">{offer.marketingStrategy}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Market Analysis Tab */}
              {activeTab === 'market' && (
                <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-6">📈 Market Analysis</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-orange-400 mb-4">Competitors</h3>
                      <ul className="space-y-2">
                        {analyticsData.marketAnalysis.competitors.map((competitor, index) => (
                          <li key={index} className="text-gray-300 flex items-start">
                            <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {competitor}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-orange-400 mb-4">Market Trends</h3>
                      <ul className="space-y-2">
                        {analyticsData.marketAnalysis.marketTrends.map((trend, index) => (
                          <li key={index} className="text-gray-300 flex items-start">
                            <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {trend}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-orange-400 mb-4">Opportunities</h3>
                      <ul className="space-y-2">
                        {analyticsData.marketAnalysis.opportunities.map((opportunity, index) => (
                          <li key={index} className="text-gray-300 flex items-start">
                            <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-orange-400 mb-4">Recommendations</h3>
                      <ul className="space-y-2">
                        {analyticsData.marketAnalysis.recommendations.map((rec, index) => (
                          <li key={index} className="text-gray-300 flex items-start">
                            <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* E-commerce Tab */}
              {activeTab === 'ecommerce' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">🛒 E-commerce Platform Suggestions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analyticsData.ecommerceSuggestions.map((suggestion, index) => (
                      <div key={index} className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
                        <h3 className="text-xl font-semibold text-orange-400 mb-4">{suggestion.platform}</h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-gray-400">Why Recommended:</span>
                            <p className="text-gray-300 mt-1">{suggestion.reason}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Commission:</span>
                            <span className="text-white ml-2">{suggestion.commission}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Target Audience:</span>
                            <span className="text-white ml-2">{suggestion.targetAudience}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Setup Guide:</span>
                            <p className="text-gray-300 mt-1">{suggestion.setupGuide}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Government Schemes Tab */}
              {activeTab === 'schemes' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">🏛️ Government Schemes for {user.state}</h2>
                  <div className="grid grid-cols-1 gap-6">
                    {analyticsData.governmentSchemes.map((scheme, index) => (
                      <div key={index} className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
                        <h3 className="text-xl font-semibold text-orange-400 mb-4">{scheme.schemeName}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-gray-400">Description:</span>
                            <p className="text-gray-300 mt-1">{scheme.description}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Eligibility:</span>
                            <p className="text-gray-300 mt-1">{scheme.eligibility}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Benefits:</span>
                            <p className="text-gray-300 mt-1">{scheme.benefits}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Application Process:</span>
                            <p className="text-gray-300 mt-1">{scheme.applicationProcess}</p>
                          </div>
                          <div className="md:col-span-2">
                            <span className="text-gray-400">Contact Info:</span>
                            <p className="text-gray-300 mt-1">{scheme.contactInfo}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exhibitions Tab */}
              {activeTab === 'exhibitions' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">🎪 National & International Exhibitions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analyticsData.exhibitions.map((exhibition, index) => (
                      <div key={index} className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-semibold text-orange-400">{exhibition.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            exhibition.type === 'International' 
                              ? 'bg-blue-500/20 text-blue-400' 
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {exhibition.type}
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <span className="text-gray-400">Location:</span>
                            <span className="text-white ml-2">{exhibition.location}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Date:</span>
                            <span className="text-white ml-2">{exhibition.date}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Application Deadline:</span>
                            <span className="text-white ml-2">{exhibition.applicationDeadline}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Description:</span>
                            <p className="text-gray-300 mt-1">{exhibition.description}</p>
                          </div>
                          {exhibition.website && (
                            <div>
                              <a 
                                href={exhibition.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-orange-400 hover:text-orange-300 underline"
                              >
                                Visit Website
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Ideas Tab */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">💡 Trending Product Ideas for 2024-2025</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analyticsData.productIdeas.map((idea, index) => (
                      <div key={index} className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
                        <h3 className="text-xl font-semibold text-orange-400 mb-4">{idea.productName}</h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-gray-400">Description:</span>
                            <p className="text-gray-300 mt-1">{idea.description}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Target Market:</span>
                            <span className="text-white ml-2">{idea.targetMarket}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Estimated Price:</span>
                            <span className="text-white ml-2">{idea.estimatedPrice}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Materials:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {idea.materials.map((material, idx) => (
                                <span key={idx} className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
                                  {material}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Why Trending:</span>
                            <p className="text-gray-300 mt-1">{idea.trendReason}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sales Reports Tab */}
              {activeTab === 'reports' && (
                <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-6">📋 Sales & Engagement Report</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-orange-400 mb-4">Sales Overview</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-400">Total Products:</span>
                          <span className="text-white ml-2">{analyticsData.salesReport.totalSales}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Growth Rate:</span>
                          <span className="text-white ml-2">{analyticsData.salesReport.growthRate}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Top Products:</span>
                          <ul className="mt-2 space-y-1">
                            {analyticsData.salesReport.topProducts.map((product, index) => (
                              <li key={index} className="text-gray-300 flex items-start">
                                <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                {product}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-orange-400 mb-4">Social Media Engagement</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-400">Instagram:</span>
                          <span className="text-white ml-2">{analyticsData.salesReport.socialMediaEngagement.instagram}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">YouTube:</span>
                          <span className="text-white ml-2">{analyticsData.salesReport.socialMediaEngagement.youtube}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Overall:</span>
                          <span className="text-white ml-2">{analyticsData.salesReport.socialMediaEngagement.overall}</span>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-orange-400 mb-4">Recommendations</h3>
                      <ul className="space-y-2">
                        {analyticsData.salesReport.recommendations.map((rec, index) => (
                          <li key={index} className="text-gray-300 flex items-start">
                            <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default BusinessAnalysis;
