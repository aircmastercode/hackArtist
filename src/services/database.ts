import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import { Product, User, Order, Review, Category, Region } from '../types/database';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  REVIEWS: 'reviews',
  CATEGORIES: 'categories',
  REGIONS: 'regions',
  MESSAGES: 'messages',
  CONVERSATIONS: 'conversations',
  ANALYTICS: 'analytics'
} as const;

// User operations
export const userService = {
  async create(userId: string, userData: Omit<User, 'uid'>) {
    const userDoc = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userDoc, { ...userData, uid: userId });
    return userId;
  },

  async getById(userId: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    return userDoc.exists() ? userDoc.data() as User : null;
  },

  async update(userId: string, updates: Partial<User>) {
    const userDoc = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userDoc, { ...updates, updatedAt: new Date() });
  },

  async getArtisans(limitCount = 20) {
    const q = query(
      collection(db, COLLECTIONS.USERS),
      where('userType', '==', 'artisan'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as User);
  }
};

// Product operations
export const productService = {
  async create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const product: Omit<Product, 'id'> = {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const docRef = await addDoc(collection(db, COLLECTIONS.PRODUCTS), product);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  },

  async getById(productId: string): Promise<Product | null> {
    const productDoc = await getDoc(doc(db, COLLECTIONS.PRODUCTS, productId));
    return productDoc.exists() ? productDoc.data() as Product : null;
  },

  async update(productId: string, updates: Partial<Product>) {
    const productDoc = doc(db, COLLECTIONS.PRODUCTS, productId);
    await updateDoc(productDoc, { ...updates, updatedAt: new Date() });
  },

  async delete(productId: string) {
    await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, productId));
  },

  async getByArtist(artistId: string, limitCount = 20) {
    const q = query(
      collection(db, COLLECTIONS.PRODUCTS),
      where('artistId', '==', artistId),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Product);
  },

  async getFeatured(limitCount = 12) {
    const q = query(
      collection(db, COLLECTIONS.PRODUCTS),
      where('featured', '==', true),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Product);
  },

  async search(searchParams: {
    category?: string;
    region?: string;
    priceMin?: number;
    priceMax?: number;
    searchTerm?: string;
    sortBy?: 'newest' | 'price_low' | 'price_high' | 'featured';
    limitCount?: number;
    lastDoc?: DocumentSnapshot;
  }) {
    let q = query(collection(db, COLLECTIONS.PRODUCTS));

    // Add filters
    q = query(q, where('status', '==', 'active'));

    if (searchParams.category) {
      q = query(q, where('category', '==', searchParams.category));
    }

    if (searchParams.region) {
      q = query(q, where('region', '==', searchParams.region));
    }

    if (searchParams.priceMin !== undefined) {
      q = query(q, where('priceUsd', '>=', searchParams.priceMin));
    }

    if (searchParams.priceMax !== undefined) {
      q = query(q, where('priceUsd', '<=', searchParams.priceMax));
    }

    // Add sorting
    switch (searchParams.sortBy) {
      case 'price_low':
        q = query(q, orderBy('priceUsd', 'asc'));
        break;
      case 'price_high':
        q = query(q, orderBy('priceUsd', 'desc'));
        break;
      case 'featured':
        q = query(q, orderBy('featured', 'desc'), orderBy('createdAt', 'desc'));
        break;
      default:
        q = query(q, orderBy('createdAt', 'desc'));
    }

    // Add pagination
    if (searchParams.lastDoc) {
      q = query(q, startAfter(searchParams.lastDoc));
    }

    if (searchParams.limitCount) {
      q = query(q, limit(searchParams.limitCount));
    }

    const snapshot = await getDocs(q);
    return {
      products: snapshot.docs.map(doc => doc.data() as Product),
      lastDoc: snapshot.docs[snapshot.docs.length - 1],
      hasMore: snapshot.docs.length === (searchParams.limitCount || 20)
    };
  }
};

// Order operations
export const orderService = {
  async create(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) {
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const order: Omit<Order, 'id'> = {
      ...orderData,
      orderNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), order);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  },

  async getById(orderId: string): Promise<Order | null> {
    const orderDoc = await getDoc(doc(db, COLLECTIONS.ORDERS, orderId));
    return orderDoc.exists() ? orderDoc.data() as Order : null;
  },

  async update(orderId: string, updates: Partial<Order>) {
    const orderDoc = doc(db, COLLECTIONS.ORDERS, orderId);
    await updateDoc(orderDoc, { ...updates, updatedAt: new Date() });
  },

  async getByBuyer(buyerId: string, limitCount = 20) {
    const q = query(
      collection(db, COLLECTIONS.ORDERS),
      where('buyerId', '==', buyerId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Order);
  },

  async getByArtist(artistId: string, limitCount = 20) {
    const q = query(
      collection(db, COLLECTIONS.ORDERS),
      where('artisanOrders', 'array-contains', { artistId }),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Order);
  }
};

// Review operations
export const reviewService = {
  async create(reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) {
    const review: Omit<Review, 'id'> = {
      ...reviewData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const docRef = await addDoc(collection(db, COLLECTIONS.REVIEWS), review);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  },

  async getByProduct(productId: string, limitCount = 20) {
    const q = query(
      collection(db, COLLECTIONS.REVIEWS),
      where('productId', '==', productId),
      where('isApproved', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Review);
  },

  async getByArtist(artistId: string, limitCount = 20) {
    const q = query(
      collection(db, COLLECTIONS.REVIEWS),
      where('artistId', '==', artistId),
      where('isApproved', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Review);
  }
};

// Category operations
export const categoryService = {
  async create(categoryData: Omit<Category, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.CATEGORIES), categoryData);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  },

  async getAll(): Promise<Category[]> {
    const q = query(
      collection(db, COLLECTIONS.CATEGORIES),
      where('isActive', '==', true),
      orderBy('name', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Category);
  },

  async getById(categoryId: string): Promise<Category | null> {
    const categoryDoc = await getDoc(doc(db, COLLECTIONS.CATEGORIES, categoryId));
    return categoryDoc.exists() ? categoryDoc.data() as Category : null;
  }
};

// Region operations
export const regionService = {
  async create(regionData: Omit<Region, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.REGIONS), regionData);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  },

  async getAll(): Promise<Region[]> {
    const q = query(
      collection(db, COLLECTIONS.REGIONS),
      orderBy('name', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Region);
  },

  async getById(regionId: string): Promise<Region | null> {
    const regionDoc = await getDoc(doc(db, COLLECTIONS.REGIONS, regionId));
    return regionDoc.exists() ? regionDoc.data() as Region : null;
  }
};

// Utility functions
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const timestampToDate = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};