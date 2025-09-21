import { model } from '../config/gemini';
import { Product } from '../../services/firestore';

export interface PriceAnalysis {
  currentPricing: string;
  marketComparison: string;
  recommendations: string[];
  competitiveAdvantage: string;
}

export interface FestivalOffer {
  festival: string;
  offerType: string;
  discountPercentage: number;
  marketingStrategy: string;
  targetAudience: string;
}

export interface MarketAnalysis {
  competitors: string[];
  marketTrends: string[];
  opportunities: string[];
  threats: string[];
  recommendations: string[];
}

export interface EcommerceSuggestion {
  platform: string;
  reason: string;
  setupGuide: string;
  commission: string;
  targetAudience: string;
}

export interface GovernmentScheme {
  schemeName: string;
  description: string;
  eligibility: string;
  benefits: string;
  applicationProcess: string;
  contactInfo: string;
}

export interface Exhibition {
  name: string;
  location: string;
  date: string;
  type: string;
  description: string;
  applicationDeadline: string;
  website: string;
}

export interface ProductIdea {
  productName: string;
  description: string;
  targetMarket: string;
  estimatedPrice: string;
  materials: string[];
  trendReason: string;
}

export interface SalesReport {
  totalSales: number;
  topProducts: string[];
  growthRate: string;
  recommendations: string[];
  socialMediaEngagement: {
    instagram: string;
    youtube: string;
    overall: string;
  };
}

export class AIAnalysisTool {
  /**
   * Analyze product pricing
   */
  static async analyzePricing(products: Product[], artistState: string): Promise<PriceAnalysis> {
    try {
      const productInfo = products.map(p => `${p.productName} - ₹${p.price} (${p.category})`).join('\n');
      
      const prompt = `
        Analyze the pricing strategy for these handicraft products from ${artistState}:
        
        Products:
        ${productInfo}
        
        Provide analysis on:
        1. Current pricing competitiveness
        2. Market comparison with similar products
        3. Specific pricing recommendations
        4. Competitive advantages
        
        Return ONLY a valid JSON object with these exact keys: currentPricing, marketComparison, recommendations, competitiveAdvantage
        The recommendations should be an array of strings.
        Example: {"currentPricing": "text", "marketComparison": "text", "recommendations": ["rec1", "rec2"], "competitiveAdvantage": "text"}
      `;

      console.log('🔍 Analyzing pricing for products:', productInfo);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('📝 Raw Gemini response:', text);
      
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const analysis = JSON.parse(jsonMatch[0]);
      console.log('✅ Parsed analysis:', analysis);
      return analysis;
    } catch (error) {
      console.error('Price analysis error:', error);
      return {
        currentPricing: 'Analysis unavailable - API error',
        marketComparison: 'Unable to fetch market data',
        recommendations: ['Review pricing strategy', 'Consider market research'],
        competitiveAdvantage: 'Focus on unique value proposition'
      };
    }
  }

  /**
   * Generate festival offers
   */
  static async generateFestivalOffers(products: Product[], artistState: string): Promise<FestivalOffer[]> {
    try {
      const productCategories = Array.from(new Set(products.map(p => p.category)));
      
      const prompt = `
        Generate festival-specific offers for handicraft products in ${artistState}.
        Product categories: ${productCategories.join(', ')}
        
        Consider major Indian festivals like Diwali, Holi, Raksha Bandhan, etc.
        
        Return ONLY a valid JSON array with objects containing these exact keys: festival, offerType, discountPercentage, marketingStrategy, targetAudience
        Example: [{"festival": "Diwali", "offerType": "Discount", "discountPercentage": 15, "marketingStrategy": "text", "targetAudience": "text"}]
      `;

      console.log('🎉 Generating festival offers for categories:', productCategories);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('📝 Raw festival response:', text);
      
      // Clean the response to extract JSON array
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }
      
      const offers = JSON.parse(jsonMatch[0]);
      console.log('✅ Parsed festival offers:', offers);
      return offers;
    } catch (error) {
      console.error('Festival offers error:', error);
      return [{
        festival: 'Diwali',
        offerType: 'Festive Discount',
        discountPercentage: 15,
        marketingStrategy: 'Social media promotion with festive themes',
        targetAudience: 'Gift buyers and home decor enthusiasts'
      }, {
        festival: 'Holi',
        offerType: 'Bundle Offer',
        discountPercentage: 20,
        marketingStrategy: 'Colorful product showcases',
        targetAudience: 'Festival celebration buyers'
      }];
    }
  }

  /**
   * Analyze market competition
   */
  static async analyzeMarketCompetition(products: Product[], artistState: string): Promise<MarketAnalysis> {
    try {
      const productInfo = products.map(p => `${p.productName} (${p.category})`).join('\n');
      
      const prompt = `
        Analyze market competition for handicraft products in ${artistState}:
        
        Products: ${productInfo}
        
        Provide analysis on:
        1. Main competitors (list 5-7)
        2. Current market trends
        3. Business opportunities
        4. Potential threats
        5. Strategic recommendations
        
        Format as JSON with keys: competitors (array), marketTrends (array), opportunities (array), threats (array), recommendations (array)
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      console.error('Market analysis error:', error);
      return {
        competitors: ['Local artisans', 'Online marketplaces'],
        marketTrends: ['Growing demand for authentic products'],
        opportunities: ['Export potential', 'Online presence'],
        threats: ['Mass production', 'Price competition'],
        recommendations: ['Focus on quality', 'Build brand identity']
      };
    }
  }

  /**
   * Suggest ecommerce platforms
   */
  static async suggestEcommercePlatforms(products: Product[]): Promise<EcommerceSuggestion[]> {
    try {
      const categories = Array.from(new Set(products.map(p => p.category)));
      
      const prompt = `
        Suggest ecommerce platforms for selling handicraft products in categories: ${categories.join(', ')}
        
        For each platform, provide:
        - Platform name
        - Reason for recommendation
        - Setup guide (brief steps)
        - Commission structure
        - Target audience
        
        Format as JSON array with keys: platform, reason, setupGuide, commission, targetAudience
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      console.error('Ecommerce suggestions error:', error);
      return [{
        platform: 'Amazon Handmade',
        reason: 'Large customer base and artisan-focused',
        setupGuide: 'Create seller account, upload products, set pricing',
        commission: '15% per sale',
        targetAudience: 'Online shoppers looking for unique products'
      }];
    }
  }

  /**
   * Get government schemes
   */
  static async getGovernmentSchemes(artistState: string, craft: string): Promise<GovernmentScheme[]> {
    try {
      const prompt = `
        List government schemes available for handicraft artisans in ${artistState}, India.
        Focus on schemes for: ${craft} artisans
        
        For each scheme, provide:
        - Scheme name
        - Description
        - Eligibility criteria
        - Benefits offered
        - Application process
        - Contact information
        
        Format as JSON array with keys: schemeName, description, eligibility, benefits, applicationProcess, contactInfo
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      console.error('Government schemes error:', error);
      return [{
        schemeName: 'PMEGP (Prime Minister Employment Generation Programme)',
        description: 'Credit-linked subsidy scheme for setting up micro-enterprises',
        eligibility: 'Artisans, entrepreneurs, self-help groups',
        benefits: 'Up to 35% subsidy on project cost',
        applicationProcess: 'Apply through District Industries Centre',
        contactInfo: 'Contact local DIC office'
      }];
    }
  }

  /**
   * Get exhibitions and fairs
   */
  static async getExhibitions(craft: string, location: string): Promise<Exhibition[]> {
    try {
      const prompt = `
        List national and international exhibitions for ${craft} artisans in ${location} for 2024-2025.
        
        For each exhibition, provide:
        - Exhibition name
        - Location
        - Date
        - Type (national/international)
        - Description
        - Application deadline
        - Website
        
        Format as JSON array with keys: name, location, date, type, description, applicationDeadline, website
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      console.error('Exhibitions error:', error);
      return [{
        name: 'India International Trade Fair',
        location: 'New Delhi',
        date: 'November 2024',
        type: 'International',
        description: 'Largest trade fair in India showcasing handicrafts',
        applicationDeadline: 'September 2024',
        website: 'https://iitf.in'
      }];
    }
  }

  /**
   * Suggest new product ideas
   */
  static async suggestProductIdeas(craft: string, currentProducts: Product[]): Promise<ProductIdea[]> {
    try {
      const existingProducts = currentProducts.map(p => p.productName).join(', ');
      
      const prompt = `
        Suggest new product ideas for ${craft} artisans.
        Current products: ${existingProducts}
        
        Focus on trending designs and market demands for 2024-2025.
        
        For each idea, provide:
        - Product name
        - Description
        - Target market
        - Estimated price range
        - Required materials
        - Why it's trending
        
        Format as JSON array with keys: productName, description, targetMarket, estimatedPrice, materials (array), trendReason
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      console.error('Product ideas error:', error);
      return [{
        productName: 'Eco-friendly Home Decor Set',
        description: 'Sustainable handicraft items for modern homes',
        targetMarket: 'Environmentally conscious consumers',
        estimatedPrice: '₹2000-5000',
        materials: ['Natural fibers', 'Eco-friendly dyes'],
        trendReason: 'Growing demand for sustainable products'
      }];
    }
  }

  /**
   * Generate sales and engagement report
   */
  static async generateSalesReport(products: Product[], artistProfile: any): Promise<SalesReport> {
    try {
      const totalValue = products.reduce((sum, p) => sum + p.price, 0);
      const topProducts = products
        .sort((a, b) => b.price - a.price)
        .slice(0, 3)
        .map(p => p.productName);
      
      const prompt = `
        Generate a sales and social media engagement report for a handicraft artisan.
        
        Products: ${products.length} items with total value ₹${totalValue}
        Top products: ${topProducts.join(', ')}
        Social media: Instagram: ${artistProfile.instagramId}, YouTube: ${artistProfile.youtubeLink}
        
        Provide:
        - Total sales analysis
        - Top performing products
        - Growth rate assessment
        - Recommendations for improvement
        - Social media engagement analysis
        
        Format as JSON with keys: totalSales, topProducts (array), growthRate, recommendations (array), socialMediaEngagement (object with instagram, youtube, overall)
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('📝 Raw sales report response:', text);
      
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const report = JSON.parse(jsonMatch[0]);
      console.log('✅ Parsed sales report:', report);
      return report;
    } catch (error) {
      console.error('Sales report error:', error);
      return {
        totalSales: products.length,
        topProducts: products.slice(0, 3).map(p => p.productName),
        growthRate: '15% increase expected',
        recommendations: ['Increase social media presence', 'Focus on top products'],
        socialMediaEngagement: {
          instagram: 'Good potential for growth',
          youtube: 'Consider video content',
          overall: 'Moderate engagement'
        }
      };
    }
  }
}

export default AIAnalysisTool;
