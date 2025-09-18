import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { seedCategories, seedRegions } from '../data/seedData';
import { Product } from '../types/database';

// Sample products to create
const sampleProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Traditional Blue Pottery Vase',
    description: 'Handcrafted blue pottery vase featuring intricate floral patterns. Made using traditional techniques passed down through generations.',
    culturalStory: 'Blue pottery of Jaipur originated in Persia and was brought to India by Mughal rulers. This craft uses no clay, only quartz powder, glass, and fuller\'s earth.',
    images: ['/main-image.jpeg'], // Using the existing image for now
    thumbnails: [],
    priceUsd: 125,
    currency: 'USD',
    category: 'Pottery & Ceramics',
    region: 'Rajasthan',
    materials: ['Quartz Powder', 'Natural Pigments', 'Glaze'],
    artistId: 'sample-artist-1',
    artistName: 'Priya Sharma',
    stock: 8,
    isCustomizable: true,
    customizationOptions: {
      colors: ['Blue', 'Green', 'Turquoise'],
      sizes: ['Small', 'Medium', 'Large']
    },
    tags: ['blue pottery', 'vase', 'decorative', 'traditional', 'jaipur'],
    searchKeywords: ['blue pottery', 'jaipur', 'rajasthan', 'vase', 'decorative', 'traditional'],
    technique: 'Hand-thrown and hand-painted',
    culturalSignificance: 'Symbol of Jaipur royal heritage and Persian influence',
    timeToProduce: 7,
    difficulty: 'Advanced',
    status: 'active',
    featured: true
  },
  {
    title: 'Handwoven Pashmina Shawl',
    description: 'Luxurious handwoven pashmina shawl from Kashmir, made from the finest cashmere wool. Features traditional paisley patterns.',
    culturalStory: 'Pashmina weaving is an ancient craft of Kashmir, where artisans use the wool from Changthangi goats that live in the high altitudes of Ladakh.',
    images: ['/main-image.jpeg'],
    thumbnails: [],
    priceUsd: 285,
    currency: 'USD',
    category: 'Textiles & Weaving',
    region: 'Kashmir',
    materials: ['Cashmere Wool', 'Natural Dyes'],
    artistId: 'sample-artist-2',
    artistName: 'Abdul Rahman',
    stock: 3,
    isCustomizable: true,
    customizationOptions: {
      colors: ['Cream', 'Brown', 'Gray', 'Burgundy']
    },
    tags: ['pashmina', 'shawl', 'kashmiri', 'luxury', 'handwoven'],
    searchKeywords: ['pashmina', 'kashmir', 'shawl', 'cashmere', 'handwoven', 'luxury'],
    technique: 'Traditional handloom weaving',
    culturalSignificance: 'Represents the ancient weaving traditions of Kashmir valley',
    timeToProduce: 21,
    difficulty: 'Master',
    status: 'active',
    featured: true
  },
  {
    title: 'Carved Sandalwood Elephant',
    description: 'Intricately carved sandalwood elephant sculpture. Each piece is unique and showcases the natural beauty of sandalwood grain.',
    culturalStory: 'Sandalwood carving is a traditional art form of Karnataka, where artisans create beautiful sculptures that also emit the natural fragrance of sandalwood.',
    images: ['/main-image.jpeg'],
    thumbnails: [],
    priceUsd: 95,
    currency: 'USD',
    category: 'Wood Carving',
    region: 'Karnataka',
    materials: ['Sandalwood'],
    artistId: 'sample-artist-3',
    artistName: 'Ramesh Kumar',
    stock: 12,
    isCustomizable: false,
    tags: ['sandalwood', 'carving', 'elephant', 'sculpture', 'traditional'],
    searchKeywords: ['sandalwood', 'carving', 'elephant', 'karnataka', 'sculpture', 'wood'],
    technique: 'Hand carving with traditional tools',
    culturalSignificance: 'Elephants are considered sacred in Indian culture and sandalwood is used in religious ceremonies',
    timeToProduce: 5,
    difficulty: 'Intermediate',
    status: 'active',
    featured: false
  },
  {
    title: 'Brass Diya with Intricate Patterns',
    description: 'Traditional brass oil lamp (diya) with intricate geometric patterns. Perfect for festivals and daily prayers.',
    culturalStory: 'Brass work is an ancient Indian craft. Diyas have been used for thousands of years in Indian households and temples for lighting during prayers and festivals.',
    images: ['/main-image.jpeg'],
    thumbnails: [],
    priceUsd: 45,
    currency: 'USD',
    category: 'Metal Work',
    region: 'Uttar Pradesh',
    materials: ['Brass'],
    artistId: 'sample-artist-4',
    artistName: 'Meera Devi',
    stock: 25,
    isCustomizable: true,
    customizationOptions: {
      sizes: ['Small', 'Medium', 'Large']
    },
    tags: ['brass', 'diya', 'lamp', 'traditional', 'festival'],
    searchKeywords: ['brass', 'diya', 'lamp', 'traditional', 'indian', 'festival'],
    technique: 'Traditional brass casting and engraving',
    culturalSignificance: 'Used in Hindu rituals and festivals, symbolizes the victory of light over darkness',
    timeToProduce: 3,
    difficulty: 'Beginner',
    status: 'active',
    featured: false
  },
  {
    title: 'Madhubani Painting on Canvas',
    description: 'Vibrant Madhubani painting depicting traditional motifs and nature themes. Hand-painted using natural pigments.',
    culturalStory: 'Madhubani art originated in Bihar and was traditionally done by women on walls during festivals. It depicts religious and cultural themes.',
    images: ['/main-image.jpeg'],
    thumbnails: [],
    priceUsd: 180,
    currency: 'USD',
    category: 'Paintings & Art',
    region: 'Bihar',
    materials: ['Canvas', 'Natural Pigments', 'Brush'],
    artistId: 'sample-artist-5',
    artistName: 'Sunita Jha',
    stock: 6,
    isCustomizable: true,
    customizationOptions: {
      sizes: ['Medium', 'Large'],
      colors: ['Traditional', 'Modern Palette']
    },
    tags: ['madhubani', 'painting', 'folk art', 'traditional', 'bihar'],
    searchKeywords: ['madhubani', 'painting', 'folk art', 'bihar', 'traditional', 'canvas'],
    technique: 'Traditional brush painting with natural pigments',
    culturalSignificance: 'UNESCO recognized art form representing the cultural heritage of Bihar',
    timeToProduce: 10,
    difficulty: 'Advanced',
    status: 'active',
    featured: true
  },
  {
    title: 'Silver Filigree Jewelry Box',
    description: 'Exquisite silver filigree jewelry box from Odisha. Features delicate wirework patterns and traditional motifs.',
    culturalStory: 'Silver filigree work of Cuttack, Odisha is a 500-year-old craft where artisans create intricate patterns using fine silver wires.',
    images: ['/main-image.jpeg'],
    thumbnails: [],
    priceUsd: 320,
    currency: 'USD',
    category: 'Jewelry & Accessories',
    region: 'Odisha',
    materials: ['Silver Wire', 'Silver Sheet'],
    artistId: 'sample-artist-6',
    artistName: 'Bhubaneswar Panda',
    stock: 4,
    isCustomizable: false,
    tags: ['silver', 'filigree', 'jewelry box', 'traditional', 'odisha'],
    searchKeywords: ['silver', 'filigree', 'cuttack', 'odisha', 'jewelry box', 'traditional'],
    technique: 'Traditional silver filigree wirework',
    culturalSignificance: 'Ancient craft patronized by Odisha royalty',
    timeToProduce: 14,
    difficulty: 'Master',
    status: 'active',
    featured: true
  }
];

export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Add categories
    console.log('Adding categories...');
    for (const category of seedCategories) {
      await addDoc(collection(db, 'categories'), {
        ...category,
        id: ''
      });
    }

    // Add regions
    console.log('Adding regions...');
    for (const region of seedRegions) {
      await addDoc(collection(db, 'regions'), {
        ...region,
        id: ''
      });
    }

    // Add sample products
    console.log('Adding sample products...');
    for (const product of sampleProducts) {
      const docRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Update with the actual ID
      await setDoc(doc(db, 'products', docRef.id), {
        ...product,
        id: docRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Export for manual execution
export default seedDatabase;