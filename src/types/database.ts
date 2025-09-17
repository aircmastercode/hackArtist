// Database schema types for Firestore collections

export interface User {
  uid: string;
  email: string;
  name: string;
  userType: 'artisan' | 'buyer';
  location?: string;
  categories?: string[];
  bio?: string;
  profileImage?: string;
  contactInfo?: {
    phone?: string;
    website?: string;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
  };
  verification?: {
    isVerified: boolean;
    verifiedAt?: Date;
    documents?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  culturalStory?: string; // AI-generated cultural context
  images: string[]; // Firebase Storage URLs
  thumbnails?: string[]; // Optimized thumbnails
  priceUsd: number;
  currency: string;

  // Product details
  category: string; // pottery, weaving, sculpture, etc.
  subcategory?: string;
  region: string; // geographic origin
  materials: string[];
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
    unit: 'cm' | 'in' | 'mm';
  };

  // Artisan info
  artistId: string;
  artistName: string;

  // Inventory & availability
  stock: number;
  isCustomizable: boolean;
  customizationOptions?: {
    colors?: string[];
    sizes?: string[];
    materials?: string[];
  };

  // SEO & discoverability
  tags: string[];
  searchKeywords: string[];

  // Cultural & educational content
  technique?: string; // traditional technique used
  culturalSignificance?: string;
  timeToProduce?: number; // days/hours
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';

  // Platform management
  status: 'draft' | 'active' | 'sold' | 'inactive';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;

  // AI-enhanced content
  aiGeneratedContent?: {
    description?: string;
    culturalStory?: string;
    keywords?: string[];
    generatedAt: Date;
  };
}

export interface Order {
  id: string;
  orderNumber: string; // human-readable order number

  // Customer info
  buyerId: string;
  buyerName: string;
  buyerEmail: string;

  // Items
  items: OrderItem[];

  // Pricing
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;

  // Shipping
  shippingAddress: Address;
  billingAddress?: Address;

  // Order status
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  trackingNumber?: string;
  estimatedDelivery?: Date;

  // Payment
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'upi' | 'wallet' | 'bank_transfer';
  paymentId?: string; // from payment gateway

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  shippedAt?: Date;
  deliveredAt?: Date;

  // Communication
  notes?: string;
  specialInstructions?: string;

  // Multiple artisans handling
  artisanOrders: ArtisanOrderSegment[];
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  artistId: string;
  artistName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizations?: Record<string, string>;
}

export interface ArtisanOrderSegment {
  artistId: string;
  artistName: string;
  items: OrderItem[];
  subtotal: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'shipped';
  estimatedCompletion?: Date;
  notes?: string;
}

export interface Address {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  orderId?: string;
  buyerId: string;
  buyerName: string;
  artistId: string;

  rating: number; // 1-5
  title?: string;
  comment: string;
  images?: string[];

  // Verification
  isVerifiedPurchase: boolean;

  // Responses
  artistResponse?: {
    comment: string;
    createdAt: Date;
  };

  // Moderation
  isApproved: boolean;
  moderatedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
  parentCategory?: string; // for subcategories
  culturalContext?: string;
  popularRegions: string[];
  tags: string[];
  isActive: boolean;
}

export interface Region {
  id: string;
  name: string;
  country: string;
  description: string;
  culturalSignificance?: string;
  famousCrafts: string[];
  image?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderType: 'artisan' | 'buyer' | 'admin';
  recipientId: string;

  content: string;
  type: 'text' | 'image' | 'order_inquiry' | 'system';

  // Related entities
  productId?: string;
  orderId?: string;

  // Message status
  isRead: boolean;
  readAt?: Date;

  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[]; // user IDs
  participantDetails: {
    [userId: string]: {
      name: string;
      userType: 'artisan' | 'buyer';
      profileImage?: string;
    };
  };

  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: Date;
  };

  // Context
  productId?: string;
  orderId?: string;
  subject?: string;

  createdAt: Date;
  updatedAt: Date;
}

// Analytics and reporting types
export interface ArtisanAnalytics {
  artistId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;

  metrics: {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    productViews: number;
    conversionRate: number;
    customerAcquisition: number;
    returningCustomers: number;
  };

  topProducts: Array<{
    productId: string;
    title: string;
    sales: number;
    revenue: number;
  }>;

  createdAt: Date;
}

export interface PlatformAnalytics {
  id: string;
  date: Date;

  userMetrics: {
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    artisans: number;
    buyers: number;
  };

  transactionMetrics: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    conversionRate: number;
  };

  contentMetrics: {
    totalProducts: number;
    newProducts: number;
    totalReviews: number;
    averageRating: number;
  };
}