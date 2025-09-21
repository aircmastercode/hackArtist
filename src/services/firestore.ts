import { collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
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

// Firestore service functions
export class FirestoreService {
  private static readonly USERS_COLLECTION = 'users';
  private static readonly ARTIST_PROFILES_COLLECTION = 'artistProfiles';
  private static readonly PRODUCTS_COLLECTION = 'products';

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
}
