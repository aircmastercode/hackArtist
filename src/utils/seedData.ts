import { productService, categoryService, regionService } from '../services/database';
import { Product, Category, Region } from '../types/database';

// Sample categories
const sampleCategories: Omit<Category, 'id'>[] = [
  {
    name: 'Pottery & Ceramics',
    description: 'Traditional clay pottery and ceramic arts',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    popularRegions: ['Rajasthan', 'Gujarat'],
    tags: ['pottery', 'ceramics', 'clay', 'traditional'],
    isActive: true
  },
  {
    name: 'Textiles & Weaving',
    description: 'Handwoven fabrics and traditional textiles',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
    popularRegions: ['Kashmir', 'West Bengal', 'Gujarat'],
    tags: ['textiles', 'weaving', 'fabric', 'traditional'],
    isActive: true
  },
  {
    name: 'Wood Carving',
    description: 'Intricate wooden sculptures and decorative items',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    popularRegions: ['Kerala', 'Uttar Pradesh', 'Karnataka'],
    tags: ['wood', 'carving', 'sculpture', 'traditional'],
    isActive: true
  },
  {
    name: 'Metalwork',
    description: 'Traditional metal crafts and jewelry',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
    popularRegions: ['Gujarat', 'Rajasthan', 'Tamil Nadu'],
    tags: ['metal', 'brass', 'jewelry', 'traditional'],
    isActive: true
  },
  {
    name: 'Paintings',
    description: 'Traditional and contemporary paintings',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
    popularRegions: ['West Bengal', 'Odisha', 'Bihar'],
    tags: ['painting', 'art', 'traditional', 'folk'],
    isActive: true
  }
];

// Sample regions
const sampleRegions: Omit<Region, 'id'>[] = [
  {
    name: 'Rajasthan',
    country: 'India',
    description: 'Land of vibrant arts and crafts',
    culturalSignificance: 'Known for blue pottery, textiles, and folk art',
    famousCrafts: ['Blue Pottery', 'Block Printing', 'Miniature Paintings'],
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400'
  },
  {
    name: 'Gujarat',
    country: 'India',
    description: 'Rich textile and craft traditions',
    culturalSignificance: 'Home to vibrant textiles and metalwork',
    famousCrafts: ['Bandhani', 'Mirror Work', 'Brass Work'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
  },
  {
    name: 'West Bengal',
    country: 'India',
    description: 'Cultural hub of eastern India',
    culturalSignificance: 'Rich tradition of folk art and textiles',
    famousCrafts: ['Madhubani', 'Kantha Embroidery', 'Terracotta'],
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'
  },
  {
    name: 'Kerala',
    country: 'India',
    description: 'Traditional arts of God\'s own country',
    culturalSignificance: 'Known for wood carving and traditional crafts',
    famousCrafts: ['Wood Carving', 'Coir Work', 'Kathakali Masks'],
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400'
  },
  {
    name: 'Kashmir',
    country: 'India',
    description: 'Paradise of traditional crafts',
    culturalSignificance: 'World-famous for pashmina and carpets',
    famousCrafts: ['Pashmina', 'Carpets', 'Paper Mache'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
  }
];

// Sample products
const sampleProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Blue Pottery Vase',
    description: 'Exquisite handcrafted blue pottery vase from Jaipur, featuring traditional Persian motifs and intricate floral patterns.',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800'
    ],
    priceUsd: 125.00,
    currency: 'USD',
    category: 'Pottery & Ceramics',
    region: 'Rajasthan',
    materials: ['Clay', 'Quartz', 'Natural pigments'],
    dimensions: {
      length: 15,
      width: 15,
      height: 25,
      unit: 'cm'
    },
    artistId: 'sample_artist_1',
    artistName: 'Rajesh Kumar',
    stock: 5,
    isCustomizable: true,
    customizationOptions: {
      colors: ['Blue', 'Green', 'White'],
      sizes: ['Small', 'Medium', 'Large']
    },
    tags: ['pottery', 'vase', 'traditional', 'jaipur', 'blue pottery'],
    searchKeywords: ['blue pottery', 'vase', 'jaipur', 'handcrafted', 'traditional'],
    technique: 'Blue Pottery Glazing',
    culturalSignificance: 'Blue pottery is a traditional craft of Jaipur, brought to India by Turko-Persian artisans.',
    timeToProduce: 7,
    difficulty: 'Advanced',
    status: 'active',
    featured: true
  },
  {
    title: 'Handwoven Pashmina Shawl',
    description: 'Luxurious cashmere pashmina shawl hand-woven in Kashmir, featuring delicate embroidery and traditional patterns.',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
      'https://images.unsplash.com/photo-1594838132255-b5af2ba43f85?w=800'
    ],
    priceUsd: 280.00,
    currency: 'USD',
    category: 'Textiles & Weaving',
    region: 'Kashmir',
    materials: ['Cashmere', 'Silk thread'],
    dimensions: {
      length: 200,
      width: 100,
      height: 0.5,
      unit: 'cm'
    },
    artistId: 'sample_artist_2',
    artistName: 'Fatima Shah',
    stock: 3,
    isCustomizable: true,
    customizationOptions: {
      colors: ['Cream', 'Rose', 'Navy', 'Burgundy']
    },
    tags: ['pashmina', 'shawl', 'kashmir', 'luxury', 'handwoven'],
    searchKeywords: ['pashmina', 'cashmere', 'shawl', 'kashmir', 'luxury'],
    technique: 'Traditional Hand Weaving',
    culturalSignificance: 'Pashmina weaving is an ancient art form of Kashmir, passed down through generations.',
    timeToProduce: 14,
    difficulty: 'Master',
    status: 'active',
    featured: true
  },
  {
    title: 'Carved Wooden Elephant',
    description: 'Intricately carved wooden elephant sculpture showcasing traditional Indian craftsmanship and attention to detail.',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800'
    ],
    priceUsd: 95.00,
    currency: 'USD',
    category: 'Wood Carving',
    region: 'Kerala',
    materials: ['Sheesham Wood', 'Natural finish'],
    dimensions: {
      length: 20,
      width: 12,
      height: 18,
      unit: 'cm'
    },
    artistId: 'sample_artist_3',
    artistName: 'Suresh Pal',
    stock: 8,
    isCustomizable: true,
    customizationOptions: {
      sizes: ['Small', 'Medium', 'Large']
    },
    tags: ['elephant', 'carved', 'wooden', 'sculpture', 'traditional'],
    searchKeywords: ['wood carving', 'elephant', 'sculpture', 'traditional', 'handmade'],
    technique: 'Traditional Wood Carving',
    culturalSignificance: 'Elephants symbolize wisdom and good fortune in Indian culture.',
    timeToProduce: 5,
    difficulty: 'Intermediate',
    status: 'active',
    featured: false
  },
  {
    title: 'Brass Temple Bell',
    description: 'Sacred brass temple bell with intricate engravings, handcrafted following ancient metalworking traditions.',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
      'https://images.unsplash.com/photo-1609592094036-a50c6de2cd6e?w=800'
    ],
    priceUsd: 75.00,
    currency: 'USD',
    category: 'Metalwork',
    region: 'Gujarat',
    materials: ['Brass', 'Bronze'],
    dimensions: {
      length: 8,
      width: 8,
      height: 12,
      unit: 'cm'
    },
    artistId: 'sample_artist_4',
    artistName: 'Mohan Mistri',
    stock: 12,
    isCustomizable: false,
    tags: ['bell', 'brass', 'temple', 'spiritual', 'traditional'],
    searchKeywords: ['brass bell', 'temple', 'spiritual', 'metalwork', 'traditional'],
    technique: 'Lost Wax Casting',
    culturalSignificance: 'Temple bells are used in Hindu worship to invoke divine blessings.',
    timeToProduce: 3,
    difficulty: 'Intermediate',
    status: 'active',
    featured: true
  },
  {
    title: 'Madhubani Painting',
    description: 'Vibrant traditional Madhubani painting depicting folk tales and nature motifs, created using natural pigments.',
    images: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
      'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800'
    ],
    priceUsd: 180.00,
    currency: 'USD',
    category: 'Paintings',
    region: 'West Bengal',
    materials: ['Canvas', 'Natural pigments', 'Bamboo brushes'],
    dimensions: {
      length: 40,
      width: 30,
      height: 2,
      unit: 'cm'
    },
    artistId: 'sample_artist_5',
    artistName: 'Sita Devi',
    stock: 2,
    isCustomizable: true,
    customizationOptions: {
      sizes: ['Medium', 'Large']
    },
    tags: ['madhubani', 'painting', 'folk art', 'traditional', 'bihar'],
    searchKeywords: ['madhubani', 'folk painting', 'traditional art', 'bihar', 'mithila'],
    technique: 'Madhubani Folk Painting',
    culturalSignificance: 'Madhubani art originated in the Mithila region and tells stories of love, valor, and devotion.',
    timeToProduce: 10,
    difficulty: 'Advanced',
    status: 'active',
    featured: true
  },
  {
    title: 'Terracotta Garden Planter',
    description: 'Beautiful handcrafted terracotta planter with traditional designs, perfect for indoor and outdoor plants.',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800'
    ],
    priceUsd: 45.00,
    currency: 'USD',
    category: 'Pottery & Ceramics',
    region: 'Rajasthan',
    materials: ['Terracotta clay', 'Natural glaze'],
    dimensions: {
      length: 25,
      width: 25,
      height: 20,
      unit: 'cm'
    },
    artistId: 'sample_artist_1',
    artistName: 'Rajesh Kumar',
    stock: 15,
    isCustomizable: true,
    customizationOptions: {
      sizes: ['Small', 'Medium', 'Large'],
      colors: ['Natural', 'Red', 'Brown']
    },
    tags: ['terracotta', 'planter', 'garden', 'pottery', 'eco-friendly'],
    searchKeywords: ['terracotta', 'planter', 'pottery', 'garden', 'plant pot'],
    technique: 'Traditional Pottery',
    culturalSignificance: 'Terracotta pottery has been used in India for thousands of years for storage and decoration.',
    timeToProduce: 2,
    difficulty: 'Beginner',
    status: 'active',
    featured: false
  }
];

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // 1. Seed categories
    console.log('Adding categories...');
    for (const category of sampleCategories) {
      try {
        await categoryService.create(category);
        console.log(`✅ Added category: ${category.name}`);
      } catch (error) {
        console.log(`ℹ️ Category ${category.name} might already exist`);
      }
    }

    // 2. Seed regions
    console.log('Adding regions...');
    for (const region of sampleRegions) {
      try {
        await regionService.create(region);
        console.log(`✅ Added region: ${region.name}`);
      } catch (error) {
        console.log(`ℹ️ Region ${region.name} might already exist`);
      }
    }

    // 3. Seed products
    console.log('Adding products...');
    for (const product of sampleProducts) {
      try {
        const productId = await productService.create(product);
        console.log(`✅ Added product: ${product.title} (ID: ${productId})`);
      } catch (error) {
        console.log(`❌ Error adding product ${product.title}:`, error);
      }
    }

    console.log('🎉 Database seeding completed!');
    console.log(`📊 Added ${sampleCategories.length} categories, ${sampleRegions.length} regions, and ${sampleProducts.length} products`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// For development - you can call this from browser console
if (typeof window !== 'undefined') {
  (window as any).seedDatabase = seedDatabase;
}