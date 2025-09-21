import { collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Artist interface
export interface Artist {
  id?: string;
  artistName: string;
  state: string;
  phoneNumber: string;
  email: string;
  password: string; // In production, this should be hashed
  createdAt: string;
  isActive: boolean;
}

// Artist Profile interface (extended information)
export interface ArtistProfile {
  id?: string;
  artistId: string; // Reference to the user in users collection
  instagramId: string;
  youtubeLink: string;
  story: {
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
    paragraph4: string;
    paragraph5: string;
    paragraph6: string;
  };
  storyImages: string[]; // Array of image URLs generated from story
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// Product interface
export interface Product {
  id?: string;
  productName: string;
  category: string;
  rawImages: string[]; // Array of image URLs
  artisanNotes: string;
  price: number;
  artistId: string; // Reference to the artist who created this product
  artistName: string; // For easier querying
  createdAt: string;
  isActive: boolean;
}

// Business Analysis interface
export interface BusinessAnalysis {
  id?: string;
  artistId: string; // Reference to the artist
  analysisData: any; // The complete analytics data
  lastUpdated: string; // When this analysis was last generated
  productCount: number; // Number of products when analysis was generated
  isActive: boolean;
}

// Artist Story interface
export interface ArtistStory {
  id?: string;
  artistId: string;
  title: string;
  paragraphs: string[];
  generatedAt: string;
  isActive: boolean;
}

// Generated Story Data interface (for Stories section)
export interface GeneratedStoryData {
  id?: string;
  artistId: string;
  storyData: any; // The complete story structure for Stories section
  generatedAt: string;
  isActive: boolean;
}

// Firestore service functions
export class FirestoreService {
  private static readonly USERS_COLLECTION = 'users';
  private static readonly ARTIST_PROFILES_COLLECTION = 'artistProfiles';
  private static readonly PRODUCTS_COLLECTION = 'products';
  private static readonly BUSINESS_ANALYSIS_COLLECTION = 'businessAnalysis';
  private static readonly ARTIST_STORIES_COLLECTION = 'artistStories';
  private static readonly GENERATED_STORIES_COLLECTION = 'generatedStories';

  // Add a new artist to Firestore
  static async addArtist(artistData: Omit<Artist, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.USERS_COLLECTION), {
        ...artistData,
        createdAt: new Date().toISOString(),
        isActive: true
      });
      console.log('Artist added with ID: ', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding artist: ', error);
      throw new Error('Failed to create artist account');
    }
  }

  // Get artist by email
  static async getArtistByEmail(email: string): Promise<Artist | null> {
    try {
      const q = query(
        collection(db, this.USERS_COLLECTION),
        where('email', '==', email),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as Artist;
    } catch (error) {
      console.error('Error getting artist by email: ', error);
      throw new Error('Failed to retrieve artist information');
    }
  }

  // Get artist by ID
  static async getArtistById(id: string): Promise<Artist | null> {
    try {
      const docRef = doc(db, this.USERS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Artist;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting artist by ID: ', error);
      throw new Error('Failed to retrieve artist information');
    }
  }

  // Get all artists
  static async getAllArtists(): Promise<Artist[]> {
    try {
      const q = query(
        collection(db, this.USERS_COLLECTION),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      const artists: Artist[] = [];
      
      querySnapshot.forEach((doc) => {
        artists.push({
          id: doc.id,
          ...doc.data()
        } as Artist);
      });
      
      return artists;
    } catch (error) {
      console.error('Error getting all artists: ', error);
      throw new Error('Failed to retrieve artists');
    }
  }

  // Check if email already exists
  static async checkEmailExists(email: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, this.USERS_COLLECTION),
        where('email', '==', email)
      );
      
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking email existence: ', error);
      throw new Error('Failed to check email availability');
    }
  }

  // Authenticate artist (login)
  static async authenticateArtist(email: string, password: string): Promise<Artist | null> {
    try {
      const artist = await this.getArtistByEmail(email);
      
      if (artist && artist.password === password) {
        return artist;
      }
      
      return null;
    } catch (error) {
      console.error('Error authenticating artist: ', error);
      throw new Error('Authentication failed');
    }
  }

  // Artist Profile-related methods

  // Add or update artist profile
  static async addOrUpdateArtistProfile(profileData: Omit<ArtistProfile, 'id'>): Promise<string> {
    try {
      // Check if profile already exists
      const existingProfile = await this.getArtistProfileByArtistId(profileData.artistId);
      
      if (existingProfile) {
        // Update existing profile
        const docRef = doc(db, this.ARTIST_PROFILES_COLLECTION, existingProfile.id!);
        await updateDoc(docRef, {
          ...profileData,
          updatedAt: new Date().toISOString(),
        });
        return existingProfile.id!;
      } else {
        // Create new profile
        const docRef = await addDoc(collection(db, this.ARTIST_PROFILES_COLLECTION), {
          ...profileData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
        });
        return docRef.id;
      }
    } catch (error) {
      console.error('Error adding/updating artist profile: ', error);
      throw new Error('Failed to save artist profile');
    }
  }

  // Get artist profile by artist ID
  static async getArtistProfileByArtistId(artistId: string): Promise<ArtistProfile | null> {
    try {
      const q = query(
        collection(db, this.ARTIST_PROFILES_COLLECTION),
        where('artistId', '==', artistId),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as ArtistProfile;
    } catch (error) {
      console.error('Error getting artist profile: ', error);
      throw new Error('Failed to retrieve artist profile');
    }
  }

  // Get all artist profiles
  static async getAllArtistProfiles(): Promise<ArtistProfile[]> {
    try {
      const q = query(
        collection(db, this.ARTIST_PROFILES_COLLECTION),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      const profiles: ArtistProfile[] = [];
      
      querySnapshot.forEach((doc) => {
        profiles.push({
          id: doc.id,
          ...doc.data()
        } as ArtistProfile);
      });
      
      return profiles;
    } catch (error) {
      console.error('Error getting all artist profiles: ', error);
      throw new Error('Failed to retrieve artist profiles');
    }
  }

  // Product-related methods

  // Add a new product
  static async addProduct(productData: Omit<Product, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.PRODUCTS_COLLECTION), {
        ...productData,
        createdAt: new Date().toISOString(),
        isActive: true,
      });
      console.log('Product added with ID: ', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding product: ', error);
      throw new Error('Failed to add product');
    }
  }

  // Get products by artist ID
  static async getProductsByArtist(artistId: string): Promise<Product[]> {
    try {
      const q = query(
        collection(db, this.PRODUCTS_COLLECTION),
        where('artistId', '==', artistId),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      const products: Product[] = [];
      
      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        } as Product);
      });
      
      return products;
    } catch (error) {
      console.error('Error getting products by artist: ', error);
      throw new Error('Failed to retrieve products');
    }
  }

  // Get all active products
  static async getAllProducts(): Promise<Product[]> {
    try {
      const q = query(
        collection(db, this.PRODUCTS_COLLECTION),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      const products: Product[] = [];
      
      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        } as Product);
      });
      
      return products;
    } catch (error) {
      console.error('Error getting all products: ', error);
      throw new Error('Failed to retrieve products');
    }
  }

  // Get product by ID
  static async getProductById(productId: string): Promise<Product | null> {
    try {
      const docRef = doc(db, this.PRODUCTS_COLLECTION, productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Product;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting product by ID: ', error);
      throw new Error('Failed to retrieve product');
    }
  }

  // Delete a product
  static async deleteProduct(productId: string): Promise<boolean> {
    try {
      const docRef = doc(db, this.PRODUCTS_COLLECTION, productId);
      await deleteDoc(docRef);
      console.log('Product deleted successfully with ID: ', productId);
      return true;
    } catch (error) {
      console.error('Error deleting product: ', error);
      throw new Error('Failed to delete product');
    }
  }

  // Business Analysis methods

  // Save or update business analysis
  static async saveBusinessAnalysis(analysisData: Omit<BusinessAnalysis, 'id'>): Promise<string> {
    try {
      // Check if analysis already exists for this artist
      const existingAnalysis = await this.getBusinessAnalysisByArtistId(analysisData.artistId);
      
      if (existingAnalysis) {
        // Update existing analysis
        const docRef = doc(db, this.BUSINESS_ANALYSIS_COLLECTION, existingAnalysis.id!);
        await updateDoc(docRef, {
          analysisData: analysisData.analysisData,
          lastUpdated: analysisData.lastUpdated,
          productCount: analysisData.productCount,
          isActive: true
        });
        return existingAnalysis.id!;
      } else {
        // Create new analysis
        const docRef = await addDoc(collection(db, this.BUSINESS_ANALYSIS_COLLECTION), {
          ...analysisData,
          isActive: true
        });
        return docRef.id;
      }
    } catch (error) {
      console.error('Error saving business analysis: ', error);
      throw new Error('Failed to save business analysis');
    }
  }

  // Get business analysis by artist ID
  static async getBusinessAnalysisByArtistId(artistId: string): Promise<BusinessAnalysis | null> {
    try {
      const q = query(
        collection(db, this.BUSINESS_ANALYSIS_COLLECTION),
        where('artistId', '==', artistId),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as BusinessAnalysis;
    } catch (error) {
      console.error('Error getting business analysis: ', error);
      throw new Error('Failed to retrieve business analysis');
    }
  }

  // Check if analysis needs to be updated (based on product count)
  static async shouldUpdateAnalysis(artistId: string): Promise<boolean> {
    try {
      const [analysis, products] = await Promise.all([
        this.getBusinessAnalysisByArtistId(artistId),
        this.getProductsByArtist(artistId)
      ]);

      if (!analysis) {
        return true; // No analysis exists, need to create one
      }

      // Check if product count has changed
      return analysis.productCount !== products.length;
    } catch (error) {
      console.error('Error checking if analysis should update: ', error);
      return true; // If error, assume we need to update
    }
  }

  // Artist Story methods

  // Save or update artist story
  static async saveArtistStory(storyData: Omit<ArtistStory, 'id'>): Promise<string> {
    try {
      // Check if story already exists for this artist
      const existingStory = await this.getArtistStoryByArtistId(storyData.artistId);
      
      if (existingStory) {
        // Update existing story
        const docRef = doc(db, this.ARTIST_STORIES_COLLECTION, existingStory.id!);
        await updateDoc(docRef, {
          title: storyData.title,
          paragraphs: storyData.paragraphs,
          generatedAt: storyData.generatedAt,
          isActive: true
        });
        return existingStory.id!;
      } else {
        // Create new story
        const docRef = await addDoc(collection(db, this.ARTIST_STORIES_COLLECTION), {
          ...storyData,
          generatedAt: new Date().toISOString()
        });
        return docRef.id;
      }
    } catch (error) {
      console.error('Error saving artist story: ', error);
      throw new Error('Failed to save artist story');
    }
  }

  // Get artist story by artist ID
  static async getArtistStoryByArtistId(artistId: string): Promise<ArtistStory | null> {
    try {
      const q = query(
        collection(db, this.ARTIST_STORIES_COLLECTION),
        where('artistId', '==', artistId),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as ArtistStory;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting artist story: ', error);
      throw new Error('Failed to retrieve artist story');
    }
  }

  // Get all artist stories
  static async getAllArtistStories(): Promise<ArtistStory[]> {
    try {
      const q = query(
        collection(db, this.ARTIST_STORIES_COLLECTION),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      const stories: ArtistStory[] = [];
      
      querySnapshot.forEach((doc) => {
        stories.push({
          id: doc.id,
          ...doc.data()
        } as ArtistStory);
      });
      
      return stories;
    } catch (error) {
      console.error('Error getting all artist stories: ', error);
      throw new Error('Failed to retrieve artist stories');
    }
  }

  // Delete artist story
  static async deleteArtistStory(storyId: string): Promise<boolean> {
    try {
      const docRef = doc(db, this.ARTIST_STORIES_COLLECTION, storyId);
      await updateDoc(docRef, {
        isActive: false
      });
      console.log('Artist story deleted successfully with ID: ', storyId);
      return true;
    } catch (error) {
      console.error('Error deleting artist story: ', error);
      throw new Error('Failed to delete artist story');
    }
  }

  // Generated Stories methods (for Stories section)

  // Save or update generated story data
  static async saveGeneratedStory(storyData: Omit<GeneratedStoryData, 'id'>): Promise<string> {
    try {
      // Check if story already exists for this artist
      const existingStory = await this.getGeneratedStoryByArtistId(storyData.artistId);
      
      if (existingStory) {
        // Update existing story
        const docRef = doc(db, this.GENERATED_STORIES_COLLECTION, existingStory.id!);
        await updateDoc(docRef, {
          storyData: storyData.storyData,
          generatedAt: storyData.generatedAt,
          isActive: true
        });
        return existingStory.id!;
      } else {
        // Create new story
        const docRef = await addDoc(collection(db, this.GENERATED_STORIES_COLLECTION), {
          ...storyData,
          generatedAt: new Date().toISOString()
        });
        return docRef.id;
      }
    } catch (error) {
      console.error('Error saving generated story: ', error);
      throw new Error('Failed to save generated story');
    }
  }

  // Get generated story by artist ID
  static async getGeneratedStoryByArtistId(artistId: string): Promise<GeneratedStoryData | null> {
    try {
      const q = query(
        collection(db, this.GENERATED_STORIES_COLLECTION),
        where('artistId', '==', artistId),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as GeneratedStoryData;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting generated story: ', error);
      throw new Error('Failed to retrieve generated story');
    }
  }

  // Get all generated stories
  static async getAllGeneratedStories(): Promise<GeneratedStoryData[]> {
    try {
      const q = query(
        collection(db, this.GENERATED_STORIES_COLLECTION),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      const stories: GeneratedStoryData[] = [];
      
      querySnapshot.forEach((doc) => {
        stories.push({
          id: doc.id,
          ...doc.data()
        } as GeneratedStoryData);
      });
      
      return stories;
    } catch (error) {
      console.error('Error getting all generated stories: ', error);
      throw new Error('Failed to retrieve generated stories');
    }
  }

  // Delete generated story
  static async deleteGeneratedStory(storyId: string): Promise<boolean> {
    try {
      const docRef = doc(db, this.GENERATED_STORIES_COLLECTION, storyId);
      await updateDoc(docRef, {
        isActive: false
      });
      console.log('Generated story deleted successfully with ID: ', storyId);
      return true;
    } catch (error) {
      console.error('Error deleting generated story: ', error);
      throw new Error('Failed to delete generated story');
    }
  }
}
