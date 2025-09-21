import { FirestoreService, ArtistProfile } from '../services/firestore';

// Story data for each artist with 6 paragraphs each
const artistStories = {
  'ramesh-kumar': {
    artistId: 'ramesh-kumar', // This will be the user ID in the database
    instagramId: '@ramesh_pottery',
    youtubeLink: 'https://youtube.com/@rameshpottery',
    story: {
      paragraph1: 'For four decades, I have been shaping clay into vessels that carry the essence of my village. Each pot tells a story of tradition, patience, and the timeless connection between earth and human hands.',
      paragraph2: 'The art of terracotta pottery in West Bengal dates back centuries. My ancestors passed down techniques that I now share with the world through ShilpSetu.',
      paragraph3: 'Every morning, I wake up before dawn to prepare my clay. The process of kneading and shaping the earth is like a meditation, connecting me to generations of potters who came before me.',
      paragraph4: 'My workshop is filled with the sounds of the potter\'s wheel and the gentle rhythm of my hands molding clay. Each piece I create carries the spirit of my village and the stories of our people.',
      paragraph5: 'The firing process is where magic happens. The clay transforms in the kiln, becoming strong and beautiful, just like how challenges in life make us stronger and more resilient.',
      paragraph6: 'Every piece I create is unique, shaped by the rhythm of my hands and the stories in my heart. Through ShilpSetu, these stories now reach homes across the world.'
    },
    storyImages: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    ]
  },
  'priya-sharma': {
    artistId: 'priya-sharma',
    instagramId: '@priya_bluepottery',
    youtubeLink: 'https://youtube.com/@priyabluepottery',
    story: {
      paragraph1: 'Blue pottery is not just an art form—it\'s a legacy of Rajasthan\'s royal courts. Each piece I paint carries the elegance and grandeur of Jaipur\'s heritage.',
      paragraph2: 'The distinctive blue color comes from cobalt oxide, while the white base is made from a special blend of quartz, glass, and clay. This technique has been perfected over generations.',
      paragraph3: 'I learned this art from my grandmother, who learned it from her mother. The patterns I paint are not just decorative—they tell stories of our royal past and cultural traditions.',
      paragraph4: 'Each brushstroke is deliberate, each color carefully chosen. The intricate floral and geometric patterns reflect the beauty of Rajasthan\'s palaces and gardens.',
      paragraph5: 'The firing process is crucial—it transforms the painted clay into the characteristic blue pottery that has made Jaipur famous worldwide.',
      paragraph6: 'Through ShilpSetu, I share this royal art with the world, ensuring that the beauty of Rajasthan\'s blue pottery continues to enchant generations to come.'
    },
    storyImages: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    ]
  },
  'arjun-patel': {
    artistId: 'arjun-patel',
    instagramId: '@arjun_kutchembroidery',
    youtubeLink: 'https://youtube.com/@arjunkutchembroidery',
    story: {
      paragraph1: 'Kutch embroidery is more than decoration—it\'s a language of colors and patterns that tells the story of our desert land, its people, and their dreams.',
      paragraph2: 'Each stitch is placed with intention, creating geometric patterns that have been passed down through generations of women in our community.',
      paragraph3: 'The vibrant colors I use reflect the spirit of Kutch—the bright reds of the desert sunset, the deep blues of the Arabian Sea, and the golden yellows of our fields.',
      paragraph4: 'My mother taught me that every pattern has meaning. The mirror work represents the reflection of our souls, while the intricate stitches tell stories of our ancestors.',
      paragraph5: 'Working on each piece is like painting with thread. The needle becomes my brush, and the fabric my canvas, creating beautiful stories that speak to the heart.',
      paragraph6: 'Through ShilpSetu, I bring the vibrant culture of Kutch to homes worldwide, sharing not just beautiful embroidery, but the stories woven into every thread.'
    },
    storyImages: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    ]
  },
  'lakshmi-devi': {
    artistId: 'lakshmi-devi',
    instagramId: '@lakshmi_kantha',
    youtubeLink: 'https://youtube.com/@lakshmikantha',
    story: {
      paragraph1: 'Kantha embroidery is the art of storytelling through stitches. My grandmother taught me that every pattern holds a memory, every color carries an emotion.',
      paragraph2: 'This traditional craft transforms old saris into beautiful quilts and textiles, giving new life to precious memories and creating new stories for future generations.',
      paragraph3: 'The running stitch technique creates beautiful patterns that flow like rivers across the fabric. Each stitch is a prayer, each pattern a blessing.',
      paragraph4: 'I remember sitting with my grandmother as she taught me the different stitches. Her hands moved with such grace and purpose, creating magic with every thread.',
      paragraph5: 'The colors I choose tell stories too—the deep reds of love, the peaceful blues of tranquility, and the vibrant greens of hope and renewal.',
      paragraph6: 'Through ShilpSetu, I share the warmth and love embedded in every Kantha piece, connecting hearts across the world through the universal language of craft.'
    },
    storyImages: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    ]
  },
  'suresh-iyer': {
    artistId: 'suresh-iyer',
    instagramId: '@suresh_tanjore',
    youtubeLink: 'https://youtube.com/@sureshtanjore',
    story: {
      paragraph1: 'Tanjore painting is not just art—it\'s a form of worship. Each painting I create is a prayer, bringing divine energy into the homes of those who cherish them.',
      paragraph2: 'The use of gold leaf and precious stones makes each painting a treasure, while the intricate details tell stories from our rich mythology and spiritual traditions.',
      paragraph3: 'I begin each painting with a prayer, asking for divine guidance to create something that will inspire and uplift those who see it.',
      paragraph4: 'The process is meticulous—first the sketch, then the base colors, followed by the intricate details, and finally the gold leaf work that brings the painting to life.',
      paragraph5: 'Each painting takes weeks to complete, but the time spent is a form of meditation, connecting me to the divine and to the ancient traditions of our land.',
      paragraph6: 'Through ShilpSetu, I share the divine beauty of Tanjore painting with the world, spreading the spiritual essence of our ancient art form.'
    },
    storyImages: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    ]
  }
};

export const populateArtistStories = async () => {
  console.log('🎨 Starting to populate artist stories...');
  
  try {
    for (const [artistId, storyData] of Object.entries(artistStories)) {
      console.log(`📝 Adding story for ${artistId}...`);
      
      const profileData: Omit<ArtistProfile, 'id'> = {
        ...storyData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      };
      
      await FirestoreService.addOrUpdateArtistProfile(profileData);
      console.log(`✅ Successfully added story for ${artistId}`);
    }
    
    console.log('🎉 All artist stories have been populated successfully!');
  } catch (error) {
    console.error('❌ Error populating artist stories:', error);
    throw error;
  }
};

// Function to test the population
export const testPopulateStories = async () => {
  try {
    await populateArtistStories();
    console.log('✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};
