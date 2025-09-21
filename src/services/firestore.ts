import { collection, addDoc, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
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

// Firestore service functions
export class FirestoreService {
  private static readonly COLLECTION_NAME = 'users';

  // Add a new artist to Firestore
  static async addArtist(artistData: Omit<Artist, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), {
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
        collection(db, this.COLLECTION_NAME),
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
      const docRef = doc(db, this.COLLECTION_NAME, id);
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

  // Check if email already exists
  static async checkEmailExists(email: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
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
}
