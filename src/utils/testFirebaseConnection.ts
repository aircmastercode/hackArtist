import { FirestoreService } from '../services/firestore';

export const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Testing Firebase connection...');
    
    // Test basic Firestore connection by trying to get all artists
    const artists = await FirestoreService.getAllArtists();
    console.log('✅ Firebase connection successful. Found artists:', artists.length);
    
    return { success: true, artistsCount: artists.length };
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
};

// Test function that can be called from browser console
(window as any).testFirebase = testFirebaseConnection;
