import { Category, Region } from '../types/database';

export const seedCategories: Omit<Category, 'id'>[] = [
  {
    name: 'Pottery & Ceramics',
    description: 'Traditional clay work, earthenware, and ceramic art pieces',
    culturalContext: 'Ancient craft spanning thousands of years across all continents',
    popularRegions: ['Rajasthan', 'Gujarat', 'Tamil Nadu', 'West Bengal'],
    tags: ['handmade', 'clay', 'functional', 'decorative', 'traditional'],
    isActive: true
  },
  {
    name: 'Textiles & Weaving',
    description: 'Hand-woven fabrics, traditional clothing, and textile art',
    culturalContext: 'Rich tradition of fabric creation using traditional looms and techniques',
    popularRegions: ['Assam', 'Odisha', 'Andhra Pradesh', 'Kashmir'],
    tags: ['handwoven', 'fabric', 'traditional', 'clothing', 'patterns'],
    isActive: true
  },
  {
    name: 'Wood Carving',
    description: 'Sculptural and functional wooden artifacts',
    culturalContext: 'Traditional woodworking techniques passed down through generations',
    popularRegions: ['Kerala', 'Karnataka', 'Rajasthan', 'Uttar Pradesh'],
    tags: ['wood', 'carving', 'sculpture', 'furniture', 'decorative'],
    isActive: true
  },
  {
    name: 'Metal Work',
    description: 'Brass, copper, silver and other metal crafts',
    culturalContext: 'Ancient metalworking traditions creating both utility and art',
    popularRegions: ['Rajasthan', 'Uttar Pradesh', 'Tamil Nadu', 'Kerala'],
    tags: ['metal', 'brass', 'copper', 'silver', 'jewelry', 'vessels'],
    isActive: true
  },
  {
    name: 'Paintings & Art',
    description: 'Traditional paintings, folk art, and contemporary works',
    culturalContext: 'Diverse painting traditions reflecting regional cultures and stories',
    popularRegions: ['Rajasthan', 'Madhya Pradesh', 'Odisha', 'West Bengal'],
    tags: ['painting', 'folk art', 'traditional', 'contemporary', 'canvas'],
    isActive: true
  },
  {
    name: 'Jewelry & Accessories',
    description: 'Traditional and contemporary jewelry pieces',
    culturalContext: 'Ornamental arts reflecting cultural identity and craftsmanship',
    popularRegions: ['Rajasthan', 'Gujarat', 'Tamil Nadu', 'Odisha'],
    tags: ['jewelry', 'accessories', 'traditional', 'ornamental', 'precious'],
    isActive: true
  },
  {
    name: 'Stone & Marble Work',
    description: 'Carved stone sculptures and marble inlay work',
    culturalContext: 'Architectural and sculptural traditions in stone and marble',
    popularRegions: ['Rajasthan', 'Uttar Pradesh', 'Karnataka', 'Odisha'],
    tags: ['stone', 'marble', 'carving', 'sculpture', 'architectural'],
    isActive: true
  },
  {
    name: 'Bamboo & Cane',
    description: 'Eco-friendly bamboo and cane crafts',
    culturalContext: 'Sustainable craft traditions using natural materials',
    popularRegions: ['Assam', 'West Bengal', 'Kerala', 'Tripura'],
    tags: ['bamboo', 'cane', 'eco-friendly', 'sustainable', 'functional'],
    isActive: true
  },
  {
    name: 'Leather Work',
    description: 'Traditional leather goods and artistic pieces',
    culturalContext: 'Leather crafting traditions for both utility and decoration',
    popularRegions: ['Rajasthan', 'Tamil Nadu', 'Uttar Pradesh', 'Punjab'],
    tags: ['leather', 'traditional', 'accessories', 'footwear', 'bags'],
    isActive: true
  },
  {
    name: 'Glass Work',
    description: 'Blown glass, stained glass, and decorative glass items',
    culturalContext: 'Artistic glass-making traditions and contemporary innovations',
    popularRegions: ['Uttar Pradesh', 'Rajasthan', 'West Bengal', 'Maharashtra'],
    tags: ['glass', 'blown glass', 'decorative', 'artistic', 'contemporary'],
    isActive: true
  }
];

export const seedRegions: Omit<Region, 'id'>[] = [
  {
    name: 'Rajasthan',
    country: 'India',
    description: 'Land of kings with rich tradition in pottery, textiles, and metalwork',
    culturalSignificance: 'Royal heritage reflected in vibrant crafts and intricate designs',
    famousCrafts: ['Blue Pottery', 'Bandhani Textiles', 'Brass Work', 'Miniature Paintings'],
    coordinates: { latitude: 27.0238, longitude: 74.2179 }
  },
  {
    name: 'West Bengal',
    country: 'India',
    description: 'Cultural hub known for artistic traditions and craftsmanship',
    culturalSignificance: 'Center of Bengali culture with rich artistic heritage',
    famousCrafts: ['Dokra Metal Craft', 'Kantha Embroidery', 'Terracotta', 'Paintings'],
    coordinates: { latitude: 22.9868, longitude: 87.8550 }
  },
  {
    name: 'Kerala',
    country: 'India',
    description: 'Gods own country with unique coconut and wood-based crafts',
    culturalSignificance: 'Spice trade heritage influencing artistic expressions',
    famousCrafts: ['Wood Carving', 'Coconut Shell Craft', 'Metal Mirrors', 'Coir Products'],
    coordinates: { latitude: 10.8505, longitude: 76.2711 }
  },
  {
    name: 'Gujarat',
    country: 'India',
    description: 'Vibrant state known for textiles, pottery, and mirror work',
    culturalSignificance: 'Trading heritage reflected in diverse craft traditions',
    famousCrafts: ['Rogan Art', 'Patola Silk', 'Kutch Embroidery', 'Pottery'],
    coordinates: { latitude: 23.0225, longitude: 72.5714 }
  },
  {
    name: 'Odisha',
    country: 'India',
    description: 'Ancient state with temple art and traditional crafts',
    culturalSignificance: 'Temple architecture influencing craft designs and motifs',
    famousCrafts: ['Pattachitra Paintings', 'Stone Carving', 'Silver Filigree', 'Applique Work'],
    coordinates: { latitude: 20.9517, longitude: 85.0985 }
  },
  {
    name: 'Tamil Nadu',
    country: 'India',
    description: 'Southern state with bronze work and temple crafts',
    culturalSignificance: 'Dravidian culture reflected in artistic expressions',
    famousCrafts: ['Bronze Sculptures', 'Tanjore Paintings', 'Silk Weaving', 'Wood Carving'],
    coordinates: { latitude: 11.1271, longitude: 78.6569 }
  },
  {
    name: 'Uttar Pradesh',
    country: 'India',
    description: 'Heartland with Mughal influenced crafts and techniques',
    culturalSignificance: 'Mughal and Hindu traditions creating unique art forms',
    famousCrafts: ['Chikankari Embroidery', 'Zardozi Work', 'Brassware', 'Marble Inlay'],
    coordinates: { latitude: 26.8467, longitude: 80.9462 }
  },
  {
    name: 'Kashmir',
    country: 'India',
    description: 'Paradise on earth known for exquisite shawls and carpets',
    culturalSignificance: 'Persian and Central Asian influences in craft traditions',
    famousCrafts: ['Pashmina Shawls', 'Kashmiri Carpets', 'Walnut Wood Carving', 'Paper Mache'],
    coordinates: { latitude: 34.0837, longitude: 74.7973 }
  },
  {
    name: 'Assam',
    country: 'India',
    description: 'Northeast state famous for silk production and bamboo crafts',
    culturalSignificance: 'Tribal traditions and silk culture heritage',
    famousCrafts: ['Muga Silk', 'Bamboo Craft', 'Cane Work', 'Traditional Jewelry'],
    coordinates: { latitude: 26.2006, longitude: 92.9376 }
  },
  {
    name: 'Karnataka',
    country: 'India',
    description: 'South Indian state with sandalwood and rosewood crafts',
    culturalSignificance: 'Vijayanagara empire influence on artistic traditions',
    famousCrafts: ['Sandalwood Carving', 'Mysore Paintings', 'Rosewood Inlay', 'Silk Weaving'],
    coordinates: { latitude: 15.3173, longitude: 75.7139 }
  }
];

// Sample product data for testing
export const sampleProducts = [
  {
    title: 'Blue Pottery Vase',
    description: 'Traditional Rajasthani blue pottery vase with intricate floral patterns',
    culturalStory: 'Blue pottery of Jaipur is a traditional craft that originated in Persia and was brought to India by Mughal rulers.',
    priceUsd: 85,
    currency: 'USD',
    category: 'Pottery & Ceramics',
    region: 'Rajasthan',
    materials: ['Clay', 'Natural Pigments', 'Glaze'],
    stock: 5,
    isCustomizable: false,
    tags: ['blue pottery', 'vase', 'decorative', 'traditional'],
    searchKeywords: ['blue pottery', 'jaipur', 'rajasthan', 'vase', 'decorative'],
    technique: 'Hand-thrown and painted',
    culturalSignificance: 'Symbol of Jaipur royal heritage',
    timeToProduce: 7,
    difficulty: 'Advanced' as const,
    status: 'active' as const,
    featured: true
  }
];