import { model } from '../agents/config/gemini';

export interface ImageEnhancementResult {
  success: boolean;
  enhancedImage?: string; // Base64 data URL
  error?: string;
}

export class ImageEnhancementService {
  /**
   * Test if Gemini API is working
   */
  static async testGeminiConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testing Gemini API connection...');
      const testPrompt = [
        { text: 'Hello, can you respond with "API working"?' }
      ];
      
      const result = await model.generateContent(testPrompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Gemini API test response:', text);
      return text.includes('API working') || text.length > 0;
    } catch (error) {
      console.error('❌ Gemini API test failed:', error);
      return false;
    }
  }

  /**
   * Generate context-aware enhancement prompt based on product details
   */
  private static generateEnhancementPrompt(productName: string, category: string, artisanNotes?: string): string {
    // Base preservation instruction
    let prompt = `CRITICAL: Preserve the EXACT product appearance - no changes to colors, textures, patterns, size, or physical characteristics. Only enhance the PHOTOGRAPHY PRESENTATION.`;

    // Get category-specific settings
    const settings = this.getEnhancementSettings(category);

    // Build the enhancement prompt
    prompt += `\n\nPRODUCT CONTEXT:
- Product: ${productName}
- Category: ${category}
${artisanNotes ? `- Artisan Notes: ${artisanNotes}` : ''}

ENHANCEMENT REQUIREMENTS:
- Background: ${settings.background}
- Lighting: ${settings.lighting}
- Setting: ${settings.setting}
- Maintain product authenticity while improving presentation quality
- Ensure the product remains the clear focal point
- Apply professional photography standards while preserving handmade character`;

    return prompt;
  }

  /**
   * Enhance a product image for museum/studio presentation
   */
  static async enhanceProductImage(imageDataUrl: string, productName: string, category: string, artisanNotes?: string): Promise<ImageEnhancementResult> {
    try {
      console.log('🎨 Starting image enhancement for:', productName);
      console.log('📋 Enhancement context:', { category, artisanNotes: artisanNotes ? 'Provided' : 'Not provided' });
      
      // Extract base64 data from data URL
      const base64Data = imageDataUrl.split(',')[1];
      if (!base64Data) {
        throw new Error('Invalid image data URL');
      }

      // Generate context-aware enhancement prompt
      const enhancementText = this.generateEnhancementPrompt(productName, category, artisanNotes);
      console.log('🎯 Applied enhancement settings for category:', category);
      
      const enhancementPrompt = [
        { 
          text: enhancementText
        },
        {
          inlineData: {
            mimeType: 'image/png',
            data: base64Data,
          },
        },
      ];
      
      console.log('📤 Sending enhancement request to Gemini...');
      
      const result = await model.generateContent(enhancementPrompt);
      const response = await result.response;
      
      // Check if response has candidates
      if (!response.candidates || response.candidates.length === 0) {
        throw new Error('No response candidates received from Gemini');
      }
      
      const candidate = response.candidates[0];
      if (!candidate.content || !candidate.content.parts) {
        throw new Error('No content parts in response');
      }
      
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          console.log('✅ Image enhancement completed successfully');
          const enhancedBase64 = part.inlineData.data;
          
          // Validate the base64 data
          if (!enhancedBase64 || enhancedBase64.length === 0) {
            throw new Error('Enhanced image data is empty');
          }
          
          const enhancedDataUrl = `data:image/png;base64,${enhancedBase64}`;
          
          // Log image size for debugging
          console.log('📏 Enhanced image size:', Math.round(enhancedBase64.length * 0.75 / 1024), 'KB');
          
          return {
            success: true,
            enhancedImage: enhancedDataUrl
          };
        }
      }
      
      throw new Error('No enhanced image received from Gemini');
    } catch (error) {
      console.error('❌ Image enhancement error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Enhance multiple images in parallel
   */
  static async enhanceMultipleImages(
    images: string[], 
    productName: string, 
    category: string,
    artisanNotes?: string
  ): Promise<ImageEnhancementResult[]> {
    try {
      console.log(`🎨 Enhancing ${images.length} images for:`, productName);
      
      // Process images sequentially to avoid overwhelming the API
      const results: ImageEnhancementResult[] = [];
      
      for (let i = 0; i < images.length; i++) {
        console.log(`📤 Enhancing image ${i + 1}/${images.length}...`);
        const result = await this.enhanceProductImage(images[i], productName, category, artisanNotes);
        results.push(result);
        
        // Add small delay between requests to be respectful to the API
        if (i < images.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      console.log('✅ All images enhanced successfully');
      return results;
    } catch (error) {
      console.error('❌ Multiple image enhancement error:', error);
      return images.map(() => ({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
    }
  }

  /**
   * Get enhancement settings for a specific category (for debugging/preview)
   */
  static getEnhancementSettings(category: string) {
    const categorySettings = {
      'Pottery & Ceramics': {
        background: 'clean, neutral studio background with soft lighting, possibly on a wooden table or stone surface',
        lighting: 'soft, even lighting that highlights the ceramic texture and glaze',
        setting: 'minimalist studio setting that complements the handmade nature'
      },
      'Textiles & Weaving': {
        background: 'neutral fabric backdrop or clean surface that doesn\'t compete with the textile patterns',
        lighting: 'even, diffused lighting to show fabric texture and weave details',
        setting: 'simple presentation that allows the textile work to be the focus'
      },
      'Jewelry & Accessories': {
        background: 'elegant, neutral background or subtle texture that complements the jewelry',
        lighting: 'professional lighting that highlights metal work and gemstones',
        setting: 'sophisticated presentation suitable for luxury items'
      },
      'Woodwork & Carving': {
        background: 'natural wood surface or neutral background that complements the wood grain',
        lighting: 'warm lighting that enhances wood texture and carving details',
        setting: 'craftsman studio atmosphere that emphasizes the woodworking skill'
      },
      'Metalwork': {
        background: 'industrial or neutral background that highlights the metal work',
        lighting: 'dramatic lighting that shows metal texture and craftsmanship',
        setting: 'professional presentation that emphasizes the metalworking artistry'
      },
      'Painting & Art': {
        background: 'gallery-style neutral background or subtle texture',
        lighting: 'museum-quality lighting that shows true colors and brushwork',
        setting: 'art gallery presentation that respects the artistic work'
      },
      'Basketry': {
        background: 'natural, earthy background that complements the woven materials',
        lighting: 'soft, natural lighting that shows weaving patterns and texture',
        setting: 'organic presentation that emphasizes the natural materials'
      },
      'Leatherwork': {
        background: 'neutral background that doesn\'t compete with leather texture',
        lighting: 'warm lighting that highlights leather grain and stitching',
        setting: 'craftsman presentation that shows leatherworking expertise'
      },
      'Glasswork': {
        background: 'clean, neutral background that allows glass transparency to show',
        lighting: 'careful lighting that shows glass clarity and any color variations',
        setting: 'minimalist presentation that emphasizes the glass artistry'
      },
      'Other': {
        background: 'clean, professional neutral background',
        lighting: 'even, professional lighting',
        setting: 'simple, elegant presentation'
      }
    };

    return categorySettings[category as keyof typeof categorySettings] || categorySettings['Other'];
  }

  /**
   * Compare original and enhanced images (for UI display)
   */
  static createImageComparison(original: string, enhanced: string) {
    return {
      original,
      enhanced,
      hasEnhancement: original !== enhanced
    };
  }
}

export default ImageEnhancementService;
