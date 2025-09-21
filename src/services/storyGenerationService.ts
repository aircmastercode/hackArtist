import { genAI } from '../agents/config/gemini';
import { FirestoreService, Artist, Product } from '../services/firestore';
import { ArtistStory as StoryFormat, TextBlockData, StickyImageSectionData, FullBleedImageData } from '../data/storyData';

export interface ArtistStory {
  id?: string;
  artistId: string;
  title: string;
  paragraphs: string[];
  generatedAt: string;
  isActive: boolean;
}

export interface GeneratedStoryData {
  id?: string;
  artistId: string;
  storyData: StoryFormat;
  generatedAt: string;
  isActive: boolean;
}

export class StoryGenerationService {
  // Cultural context and problems for different Indian states
  private static getStateContext(state: string): { culture: string; problems: string; artHeritage: string } {
    const stateContexts: { [key: string]: { culture: string; problems: string; artHeritage: string } } = {
      'Rajasthan': {
        culture: 'Rich royal heritage, vibrant festivals, traditional music and dance, colorful attire, and warm hospitality',
        problems: 'Water scarcity, desertification, migration of youth to cities, preservation of traditional crafts',
        artHeritage: 'Miniature paintings, blue pottery, block printing, jewelry making, and traditional textiles'
      },
      'Gujarat': {
        culture: 'Diverse cultural heritage, Navratri celebrations, traditional folk dances like Garba, and strong community bonds',
        problems: 'Industrial pollution, urbanization affecting traditional communities, preservation of handicrafts',
        artHeritage: 'Patola silk weaving, Bandhani tie-dye, Kutch embroidery, and traditional pottery'
      },
      'Maharashtra': {
        culture: 'Marathi culture, Ganesh Chaturthi celebrations, classical music, and strong literary traditions',
        problems: 'Urban-rural divide, farmer suicides, preservation of traditional arts in modern cities',
        artHeritage: 'Warli paintings, Paithani sarees, traditional jewelry, and folk art'
      },
      'Karnataka': {
        culture: 'Diverse linguistic heritage, classical Carnatic music, traditional festivals, and rich temple architecture',
        problems: 'IT boom affecting traditional communities, water disputes, preservation of classical arts',
        artHeritage: 'Mysore paintings, sandalwood carvings, traditional silk weaving, and classical dance'
      },
      'Tamil Nadu': {
        culture: 'Ancient Dravidian culture, classical Bharatanatyam dance, traditional music, and temple festivals',
        problems: 'Urbanization, preservation of classical arts, economic disparities, and cultural identity',
        artHeritage: 'Tanjore paintings, traditional jewelry, classical dance, and temple architecture'
      },
      'Kerala': {
        culture: 'God\'s own country, traditional Ayurveda, classical Kathakali dance, and strong matrilineal traditions',
        problems: 'Climate change affecting traditional livelihoods, preservation of classical arts, and modernization',
        artHeritage: 'Kathakali, traditional mural paintings, coir products, and classical music'
      },
      'West Bengal': {
        culture: 'Bengali Renaissance heritage, Durga Puja celebrations, literature, and intellectual traditions',
        problems: 'Industrial decline, preservation of traditional crafts, economic challenges, and cultural identity',
        artHeritage: 'Terracotta pottery, traditional textiles, classical music, and folk art'
      },
      'Odisha': {
        culture: 'Ancient Kalinga heritage, traditional Odissi dance, temple architecture, and tribal cultures',
        problems: 'Natural disasters, preservation of traditional arts, economic development, and cultural preservation',
        artHeritage: 'Pattachitra paintings, traditional textiles, classical dance, and temple art'
      },
      'Assam': {
        culture: 'Northeastern heritage, Bihu festivals, traditional music, and diverse tribal cultures',
        problems: 'Flooding, preservation of traditional crafts, economic development, and cultural identity',
        artHeritage: 'Traditional textiles, bamboo crafts, classical music, and folk art'
      },
      'Punjab': {
        culture: 'Sikh heritage, vibrant festivals, traditional music, and strong agricultural traditions',
        problems: 'Agricultural challenges, preservation of traditional crafts, and cultural preservation',
        artHeritage: 'Traditional textiles, jewelry making, folk music, and agricultural crafts'
      }
    };

    return stateContexts[state] || {
      culture: 'Rich cultural heritage, traditional festivals, and strong community bonds',
      problems: 'Preservation of traditional arts, economic development, and cultural identity',
      artHeritage: 'Traditional crafts, classical arts, and cultural expressions'
    };
  }

  // Generate a story in the proper format for the Stories section
  static async generateStoryForStoriesSection(artist: Artist, products: Product[]): Promise<GeneratedStoryData> {
    try {
      console.log(`🎭 Generating story for Stories section: ${artist.artistName} from ${artist.state}`);
      
      const stateContext = this.getStateContext(artist.state);
      const productCategories = Array.from(new Set(products.map(p => p.category)));
      const productNames = products.map(p => p.productName);
      
      const prompt = `You are a master storyteller creating a beautiful, immersive story for an Indian artist. Create a story in JSON format that matches this exact structure:

{
  "hero": {
    "title": "Compelling title about the art form and artist",
    "subtitle": "Location and cultural context",
    "imageUrl": "https://images.unsplash.com/photo-[relevant-art-image]?w=1920&h=1080&fit=crop&crop=center"
  },
  "sections": [
    {
      "type": "sticky-image-section",
      "backgroundUrl": "https://images.unsplash.com/photo-[relevant-background]?w=1920&h=1080&fit=crop&crop=center",
      "alt": "Description of the background image",
      "textBlocks": [
        {
          "type": "text",
          "alignment": "left",
          "content": "First paragraph about the art form, its history, and cultural significance"
        },
        {
          "type": "text", 
          "alignment": "right",
          "content": "Second paragraph about the artist's journey and connection to the tradition"
        }
      ]
    },
    {
      "type": "full-bleed-image",
      "imageUrl": "https://images.unsplash.com/photo-[art-detail]?w=1920&h=1080&fit=crop&crop=center",
      "alt": "Close-up of the art form showing details"
    },
    {
      "type": "sticky-image-section",
      "backgroundUrl": "https://images.unsplash.com/photo-[workshop-scene]?w=1920&h=1080&fit=crop&crop=center",
      "alt": "Artist at work in their traditional setting",
      "textBlocks": [
        {
          "type": "text",
          "alignment": "center",
          "content": "Paragraph about the techniques, materials, and process"
        },
        {
          "type": "text",
          "alignment": "left", 
          "content": "Paragraph about challenges faced and how art provides hope"
        },
        {
          "type": "text",
          "alignment": "right",
          "content": "Paragraph about the impact on community and cultural preservation"
        }
      ]
    },
    {
      "type": "full-bleed-image",
      "imageUrl": "https://images.unsplash.com/photo-[finished-artwork]?w=1920&h=1080&fit=crop&crop=center",
      "alt": "Beautiful finished artwork showcasing the tradition"
    },
    {
      "type": "sticky-image-section",
      "backgroundUrl": "https://images.unsplash.com/photo-[cultural-celebration]?w=1920&h=1080&fit=crop&crop=center",
      "alt": "Cultural celebration or festival scene",
      "textBlocks": [
        {
          "type": "text",
          "alignment": "center",
          "content": "Final paragraph about hope for the future and keeping traditions alive"
        }
      ]
    }
  ]
}

ARTIST CONTEXT:
- Name: ${artist.artistName}
- State: ${artist.state}
- Cultural Heritage: ${stateContext.culture}
- Local Challenges: ${stateContext.problems}
- Traditional Arts: ${stateContext.artHeritage}
- Product Categories: ${productCategories.join(', ')}
- Product Names: ${productNames.join(', ')}

REQUIREMENTS:
1. Create a heart-touching, authentic story about this artist and their art form
2. Use appropriate Unsplash image URLs that match the content
3. Focus on the cultural significance and emotional journey
4. Include specific details about their products and techniques
5. Make it inspiring and educational
6. Each text block should be 2-3 sentences
7. Use proper alignment (left, right, center) for visual variety
8. Return ONLY the JSON, no other text

Generate a beautiful story that captures the essence of ${artist.artistName}'s art and cultural heritage.`;

      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const storyText = response.text().trim();
      
      // Parse the JSON response
      let storyData: StoryFormat;
      try {
        // Clean up the response to extract JSON
        const jsonMatch = storyText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          storyData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error('Error parsing story JSON:', parseError);
        // Fallback to a default story structure
        storyData = this.createFallbackStory(artist, stateContext, productCategories);
      }
      
      const generatedStory: GeneratedStoryData = {
        artistId: artist.id!,
        storyData,
        generatedAt: new Date().toISOString(),
        isActive: true
      };

      console.log(`✅ Story generated successfully for Stories section: ${artist.artistName}`);
      return generatedStory;
      
    } catch (error) {
      console.error('❌ Error generating story for Stories section:', error);
      throw new Error(`Failed to generate story for Stories section: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Create a fallback story structure if JSON parsing fails
  private static createFallbackStory(artist: Artist, stateContext: any, productCategories: string[]): StoryFormat {
    return {
      hero: {
        title: `The Art of ${productCategories[0] || 'Traditional Craft'} in ${artist.state}`,
        subtitle: `A Journey of ${artist.artistName}`,
        imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&h=1080&fit=crop&crop=center"
      },
      sections: [
        {
          type: 'sticky-image-section',
          backgroundUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1920&h=1080&fit=crop&crop=center',
          alt: 'Traditional artisan at work',
          textBlocks: [
            {
              type: 'text',
              alignment: 'left',
              content: `In the heart of ${artist.state}, ${artist.artistName} carries forward a tradition that has been passed down through generations. The art of ${productCategories[0] || 'traditional craft'} is not just a skill, but a way of life that connects the past with the present.`
            },
            {
              type: 'text',
              alignment: 'right',
              content: `The cultural heritage of ${stateContext.culture} provides the foundation for this beautiful art form. Each piece created tells a story of resilience, creativity, and the enduring spirit of Indian craftsmanship.`
            }
          ]
        },
        {
          type: 'full-bleed-image',
          imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&crop=center',
          alt: 'Detailed view of traditional artwork'
        },
        {
          type: 'sticky-image-section',
          backgroundUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&h=1080&fit=crop&crop=center',
          alt: 'Artist working with traditional materials',
          textBlocks: [
            {
              type: 'text',
              alignment: 'center',
              content: `Despite the challenges of ${stateContext.problems}, artists like ${artist.artistName} continue to preserve these precious traditions. Their dedication ensures that future generations can experience the beauty and cultural richness of Indian art.`
            }
          ]
        }
      ]
    };
  }

  // Generate a heart-touching story for an artist (for MyStory page)
  static async generateArtistStory(artist: Artist, products: Product[]): Promise<ArtistStory> {
    try {
      console.log(`🎭 Generating story for artist: ${artist.artistName} from ${artist.state}`);
      
      const stateContext = this.getStateContext(artist.state);
      const productCategories = Array.from(new Set(products.map(p => p.category)));
      const productNames = products.map(p => p.productName);
      
      const prompt = `You are a master storyteller who creates heart-touching, authentic stories about Indian artists. Create a beautiful, emotional story about an artist named "${artist.artistName}" from ${artist.state}.

CONTEXT:
- Artist Name: ${artist.artistName}
- State: ${artist.state}
- Cultural Heritage: ${stateContext.culture}
- Local Challenges: ${stateContext.problems}
- Traditional Arts: ${stateContext.artHeritage}
- Product Categories: ${productCategories.join(', ')}
- Product Names: ${productNames.join(', ')}

STORY REQUIREMENTS:
1. Create a 6-paragraph story that is deeply emotional and heart-touching
2. Each paragraph should be 3-4 sentences long
3. Include the artist's journey, struggles, cultural background, and passion for art
4. Mention specific products they create and their significance
5. Incorporate local cultural elements and challenges
6. Make it feel authentic and personal, like a real person's story
7. Use simple, beautiful language that connects with readers
8. Include moments of struggle, hope, and triumph
9. Show how their art preserves culture and helps their community
10. End with a message of hope and cultural pride

STORY STRUCTURE:
- Paragraph 1: Introduction and early life/cultural background
- Paragraph 2: Discovery of art and initial struggles
- Paragraph 3: Learning traditional techniques and cultural significance
- Paragraph 4: Challenges faced and how art became a lifeline
- Paragraph 5: Creating specific products and their impact
- Paragraph 6: Hope for the future and cultural preservation

Make the story deeply moving, authentic, and inspiring. Focus on the human connection to art, culture, and community.`;

      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const fullStory = response.text();

      // Parse the story into paragraphs
      const paragraphs = this.parseStoryIntoParagraphs(fullStory);
      
      // Generate a title
      const title = await this.generateStoryTitle(artist.artistName, artist.state, paragraphs[0]);
      
      const story: ArtistStory = {
        artistId: artist.id!,
        title,
        paragraphs,
        generatedAt: new Date().toISOString(),
        isActive: true
      };

      console.log(`✅ Story generated successfully for ${artist.artistName}`);
      return story;
      
    } catch (error) {
      console.error('❌ Error generating story:', error);
      throw new Error(`Failed to generate story for artist: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Parse the generated story into 6 paragraphs
  private static parseStoryIntoParagraphs(fullStory: string): string[] {
    // Split by double line breaks or paragraph markers
    let paragraphs = fullStory.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    // If we have more than 6 paragraphs, combine some
    if (paragraphs.length > 6) {
      const combinedParagraphs = [];
      const paragraphsPerSection = Math.ceil(paragraphs.length / 6);
      
      for (let i = 0; i < 6; i++) {
        const start = i * paragraphsPerSection;
        const end = Math.min(start + paragraphsPerSection, paragraphs.length);
        const combined = paragraphs.slice(start, end).join(' ').trim();
        combinedParagraphs.push(combined);
      }
      paragraphs = combinedParagraphs;
    }
    
    // If we have fewer than 6 paragraphs, split longer ones
    while (paragraphs.length < 6) {
      const longestIndex = paragraphs.reduce((maxIndex, paragraph, index) => 
        paragraph.length > paragraphs[maxIndex].length ? index : maxIndex, 0);
      
      const longestParagraph = paragraphs[longestIndex];
      const sentences = longestParagraph.split(/[.!?]+/).filter(s => s.trim().length > 0);
      
      if (sentences.length > 2) {
        const midPoint = Math.ceil(sentences.length / 2);
        const firstHalf = sentences.slice(0, midPoint).join('. ') + '.';
        const secondHalf = sentences.slice(midPoint).join('. ') + '.';
        
        paragraphs.splice(longestIndex, 1, firstHalf, secondHalf);
      } else {
        break;
      }
    }
    
    // Ensure we have exactly 6 paragraphs
    return paragraphs.slice(0, 6).map(p => p.trim());
  }

  // Generate a compelling title for the story
  private static async generateStoryTitle(artistName: string, state: string, firstParagraph: string): Promise<string> {
    try {
      const prompt = `Generate a compelling, emotional title for an artist's story. 

Artist: ${artistName}
State: ${state}
First paragraph: ${firstParagraph}

Create a title that:
1. Is 4-8 words long
2. Captures the essence of their journey
3. Is emotional and inspiring
4. References their art or cultural heritage
5. Is in English but feels authentic to Indian culture

Examples of good titles:
- "Threads of Tradition, Dreams of Tomorrow"
- "Colors of Resilience, Stories of Hope"
- "From Clay to Creation, From Struggle to Strength"
- "Weaving Dreams, Preserving Heritage"
- "Art Born from Adversity, Hope Woven in Threads"

Generate only the title, nothing else.`;

      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const title = response.text().trim();
      
      return title;
    } catch (error) {
      console.error('❌ Error generating title:', error);
      return `The Artisan's Journey: ${artistName}'s Story`;
    }
  }

  // Generate stories for all artists (both MyStory and Stories section)
  static async generateStoriesForAllArtists(): Promise<void> {
    try {
      console.log('🎭 Starting story generation for all artists...');
      
      const artists = await FirestoreService.getAllArtists();
      console.log(`📊 Found ${artists.length} artists to generate stories for`);
      
      for (const artist of artists) {
        try {
          // Get artist's products
          const products = await FirestoreService.getProductsByArtist(artist.id!);
          console.log(`📦 Found ${products.length} products for ${artist.artistName}`);
          
          // Generate both types of stories
          const [myStory, storiesSectionStory] = await Promise.all([
            this.generateArtistStory(artist, products),
            this.generateStoryForStoriesSection(artist, products)
          ]);
          
          // Save both stories to database
          await Promise.all([
            FirestoreService.saveArtistStory(myStory),
            FirestoreService.saveGeneratedStory(storiesSectionStory)
          ]);
          
          console.log(`✅ Both stories saved for ${artist.artistName}`);
          
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 3000));
          
        } catch (error) {
          console.error(`❌ Error generating stories for ${artist.artistName}:`, error);
        }
      }
      
      console.log('🎉 Story generation completed for all artists!');
      
    } catch (error) {
      console.error('❌ Error in story generation process:', error);
      throw error;
    }
  }

  // Generate stories for Stories section only
  static async generateStoriesForStoriesSection(): Promise<void> {
    try {
      console.log('🎭 Starting Stories section story generation for all artists...');
      
      const artists = await FirestoreService.getAllArtists();
      console.log(`📊 Found ${artists.length} artists to generate Stories section stories for`);
      
      for (const artist of artists) {
        try {
          // Get artist's products
          const products = await FirestoreService.getProductsByArtist(artist.id!);
          console.log(`📦 Found ${products.length} products for ${artist.artistName}`);
          
          // Generate story for Stories section
          const story = await this.generateStoryForStoriesSection(artist, products);
          
          // Save story to database
          await FirestoreService.saveGeneratedStory(story);
          
          console.log(`✅ Stories section story saved for ${artist.artistName}`);
          
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 3000));
          
        } catch (error) {
          console.error(`❌ Error generating Stories section story for ${artist.artistName}:`, error);
        }
      }
      
      console.log('🎉 Stories section story generation completed for all artists!');
      
    } catch (error) {
      console.error('❌ Error in Stories section story generation process:', error);
      throw error;
    }
  }

  // Generate story for a specific artist
  static async generateStoryForArtist(artistId: string): Promise<ArtistStory> {
    try {
      const artist = await FirestoreService.getArtistById(artistId);
      if (!artist) {
        throw new Error('Artist not found');
      }
      
      const products = await FirestoreService.getProductsByArtist(artistId);
      const story = await this.generateArtistStory(artist, products);
      
      await FirestoreService.saveArtistStory(story);
      return story;
      
    } catch (error) {
      console.error('❌ Error generating story for artist:', error);
      throw error;
    }
  }
}
