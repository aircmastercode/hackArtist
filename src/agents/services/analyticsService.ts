import { FirestoreService, Product } from '../../services/firestore';
import AIAnalysisTool, { 
  PriceAnalysis, 
  FestivalOffer, 
  MarketAnalysis, 
  EcommerceSuggestion, 
  GovernmentScheme, 
  Exhibition, 
  ProductIdea, 
  SalesReport 
} from '../tools/aiAnalysis';
import WebSearchTool from '../tools/webSearch';

export interface AnalyticsData {
  priceAnalysis: PriceAnalysis;
  festivalOffers: FestivalOffer[];
  marketAnalysis: MarketAnalysis;
  ecommerceSuggestions: EcommerceSuggestion[];
  governmentSchemes: GovernmentScheme[];
  exhibitions: Exhibition[];
  productIdeas: ProductIdea[];
  salesReport: SalesReport;
}

export class AnalyticsService {
  /**
   * Get comprehensive analytics for an artist
   */
  static async getArtistAnalytics(artistId: string): Promise<AnalyticsData> {
    try {
      console.log('🔍 Starting analytics for artist:', artistId);
      
      // Fetch artist data
      const [products, artistProfile] = await Promise.all([
        FirestoreService.getProductsByArtist(artistId),
        FirestoreService.getArtistProfileByArtistId(artistId)
      ]);

      console.log('📊 Fetched data:', { productsCount: products.length, hasProfile: !!artistProfile });

      // Get artist info for context
      const artist = await FirestoreService.getArtistById(artistId);
      if (!artist) {
        throw new Error('Artist not found');
      }

      const artistState = artist.state;
      const primaryCraft = this.getPrimaryCraft(products);

      // If no products, create some sample data for analysis
      if (products.length === 0) {
        console.log('⚠️ No products found, using sample data for analysis');
        products.push({
          id: 'sample-1',
          productName: 'Sample Handicraft Product',
          category: 'Handicraft',
          price: 1500,
          rawImages: ['https://via.placeholder.com/400'],
          artisanNotes: 'A beautiful handmade product',
          artistId: artistId,
          artistName: artist.artistName,
          createdAt: new Date().toISOString(),
          isActive: true
        });
      }

      console.log('🎯 Analysis context:', { artistState, primaryCraft });

      // Generate analytics one by one to avoid overwhelming the API
      console.log('💰 Starting price analysis...');
      const priceAnalysis = await AIAnalysisTool.analyzePricing(products, artistState);
      
      console.log('🎉 Starting festival offers...');
      const festivalOffers = await AIAnalysisTool.generateFestivalOffers(products, artistState);
      
      console.log('📈 Starting market analysis...');
      const marketAnalysis = await AIAnalysisTool.analyzeMarketCompetition(products, artistState);
      
      console.log('🛒 Starting ecommerce suggestions...');
      const ecommerceSuggestions = await AIAnalysisTool.suggestEcommercePlatforms(products);
      
      console.log('🏛️ Starting government schemes...');
      const governmentSchemes = await AIAnalysisTool.getGovernmentSchemes(artistState, primaryCraft);
      
      console.log('🎪 Starting exhibitions...');
      const exhibitions = await AIAnalysisTool.getExhibitions(primaryCraft, artistState);
      
      console.log('💡 Starting product ideas...');
      const productIdeas = await AIAnalysisTool.suggestProductIdeas(primaryCraft, products);
      
      console.log('📋 Starting sales report...');
      const salesReport = await AIAnalysisTool.generateSalesReport(products, artistProfile);

      console.log('✅ All analytics completed successfully');

      return {
        priceAnalysis,
        festivalOffers,
        marketAnalysis,
        ecommerceSuggestions,
        governmentSchemes,
        exhibitions,
        productIdeas,
        salesReport
      };
    } catch (error) {
      console.error('❌ Analytics service error:', error);
      throw error;
    }
  }

  /**
   * Get price analysis only
   */
  static async getPriceAnalysis(artistId: string): Promise<PriceAnalysis> {
    const products = await FirestoreService.getProductsByArtist(artistId);
    const artist = await FirestoreService.getArtistById(artistId);
    
    if (!artist) {
      throw new Error('Artist not found');
    }

    return AIAnalysisTool.analyzePricing(products, artist.state);
  }

  /**
   * Get festival offers only
   */
  static async getFestivalOffers(artistId: string): Promise<FestivalOffer[]> {
    const products = await FirestoreService.getProductsByArtist(artistId);
    const artist = await FirestoreService.getArtistById(artistId);
    
    if (!artist) {
      throw new Error('Artist not found');
    }

    return AIAnalysisTool.generateFestivalOffers(products, artist.state);
  }

  /**
   * Get market analysis only
   */
  static async getMarketAnalysis(artistId: string): Promise<MarketAnalysis> {
    const products = await FirestoreService.getProductsByArtist(artistId);
    const artist = await FirestoreService.getArtistById(artistId);
    
    if (!artist) {
      throw new Error('Artist not found');
    }

    return AIAnalysisTool.analyzeMarketCompetition(products, artist.state);
  }

  /**
   * Get ecommerce suggestions only
   */
  static async getEcommerceSuggestions(artistId: string): Promise<EcommerceSuggestion[]> {
    const products = await FirestoreService.getProductsByArtist(artistId);
    return AIAnalysisTool.suggestEcommercePlatforms(products);
  }

  /**
   * Get government schemes only
   */
  static async getGovernmentSchemes(artistId: string): Promise<GovernmentScheme[]> {
    const [products, artist] = await Promise.all([
      FirestoreService.getProductsByArtist(artistId),
      FirestoreService.getArtistById(artistId)
    ]);
    
    if (!artist) {
      throw new Error('Artist not found');
    }

    const primaryCraft = this.getPrimaryCraft(products);
    return AIAnalysisTool.getGovernmentSchemes(artist.state, primaryCraft);
  }

  /**
   * Get exhibitions only
   */
  static async getExhibitions(artistId: string): Promise<Exhibition[]> {
    const [products, artist] = await Promise.all([
      FirestoreService.getProductsByArtist(artistId),
      FirestoreService.getArtistById(artistId)
    ]);
    
    if (!artist) {
      throw new Error('Artist not found');
    }

    const primaryCraft = this.getPrimaryCraft(products);
    return AIAnalysisTool.getExhibitions(primaryCraft, artist.state);
  }

  /**
   * Get product ideas only
   */
  static async getProductIdeas(artistId: string): Promise<ProductIdea[]> {
    const products = await FirestoreService.getProductsByArtist(artistId);
    const primaryCraft = this.getPrimaryCraft(products);
    return AIAnalysisTool.suggestProductIdeas(primaryCraft, products);
  }

  /**
   * Get sales report only
   */
  static async getSalesReport(artistId: string): Promise<SalesReport> {
    const [products, artistProfile] = await Promise.all([
      FirestoreService.getProductsByArtist(artistId),
      FirestoreService.getArtistProfileByArtistId(artistId)
    ]);

    if (!artistProfile) {
      throw new Error('Artist profile not found');
    }

    return AIAnalysisTool.generateSalesReport(products, artistProfile);
  }

  /**
   * Helper method to determine primary craft from products
   */
  private static getPrimaryCraft(products: Product[]): string {
    if (products.length === 0) return 'handicraft';
    
    const categoryCount: { [key: string]: number } = {};
    products.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });

    const primaryCategory = Object.keys(categoryCount).reduce((a, b) => 
      categoryCount[a] > categoryCount[b] ? a : b
    );

    return primaryCategory;
  }

  /**
   * Search web for additional information
   */
  static async searchWeb(query: string): Promise<any> {
    return WebSearchTool.search(query);
  }

  /**
   * Search for government schemes with web search
   */
  static async searchGovernmentSchemes(state: string, category: string): Promise<any> {
    return WebSearchTool.searchGovernmentSchemes(state, category);
  }

  /**
   * Search for exhibitions with web search
   */
  static async searchExhibitions(craft: string, location: string): Promise<any> {
    return WebSearchTool.searchExhibitions(craft, location);
  }
}

export default AnalyticsService;
