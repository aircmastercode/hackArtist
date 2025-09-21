import { FirestoreService } from '../services/firestore';
import { AnalyticsService } from '../agents/services/analyticsService';

export const testCachingSystem = async (artistId: string) => {
  try {
    console.log('🧪 Testing Business Analysis Caching System...');
    
    // Test 1: Check if analysis should update
    console.log('📋 Test 1: Checking if analysis should update...');
    const shouldUpdate = await FirestoreService.shouldUpdateAnalysis(artistId);
    console.log('Should update analysis:', shouldUpdate);
    
    // Test 2: Get cached analysis (if exists)
    console.log('📋 Test 2: Getting cached analysis...');
    const cachedAnalysis = await FirestoreService.getBusinessAnalysisByArtistId(artistId);
    if (cachedAnalysis) {
      console.log('✅ Cached analysis found:', {
        lastUpdated: cachedAnalysis.lastUpdated,
        productCount: cachedAnalysis.productCount,
        hasData: !!cachedAnalysis.analysisData
      });
    } else {
      console.log('❌ No cached analysis found');
    }
    
    // Test 3: Get analytics (should use cache if available)
    console.log('📋 Test 3: Getting analytics (should use cache)...');
    const startTime = Date.now();
    const analyticsData = await AnalyticsService.getArtistAnalytics(artistId);
    const endTime = Date.now();
    
    console.log('✅ Analytics retrieved:', {
      hasPriceAnalysis: !!analyticsData.priceAnalysis,
      hasFestivalOffers: !!analyticsData.festivalOffers,
      hasMarketAnalysis: !!analyticsData.marketAnalysis,
      hasEcommerceSuggestions: !!analyticsData.ecommerceSuggestions,
      hasGovernmentSchemes: !!analyticsData.governmentSchemes,
      hasExhibitions: !!analyticsData.exhibitions,
      hasProductIdeas: !!analyticsData.productIdeas,
      hasSalesReport: !!analyticsData.salesReport,
      responseTime: `${endTime - startTime}ms`
    });
    
    // Test 4: Check if analysis was cached
    console.log('📋 Test 4: Verifying analysis was cached...');
    const updatedCachedAnalysis = await FirestoreService.getBusinessAnalysisByArtistId(artistId);
    if (updatedCachedAnalysis) {
      console.log('✅ Analysis successfully cached:', {
        lastUpdated: updatedCachedAnalysis.lastUpdated,
        productCount: updatedCachedAnalysis.productCount
      });
    }
    
    console.log('🎉 Caching system test completed successfully!');
    return { success: true, responseTime: endTime - startTime };
  } catch (error) {
    console.error('❌ Caching system test failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
};

// Test function that can be called from browser console
(window as any).testCaching = testCachingSystem;
