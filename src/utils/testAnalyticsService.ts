import { AnalyticsService } from '../agents/services/analyticsService';

export const testAnalyticsService = async (artistId: string) => {
  try {
    console.log('🔍 Testing Analytics Service for artist:', artistId);
    
    // Test the analytics service
    const analyticsData = await AnalyticsService.getArtistAnalytics(artistId);
    console.log('✅ Analytics Service test successful:', analyticsData);
    
    return { success: true, data: analyticsData };
  } catch (error) {
    console.error('❌ Analytics Service test failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
};

// Test function that can be called from browser console
(window as any).testAnalytics = testAnalyticsService;
