import { model } from '../agents/config/gemini';

export interface ImageEnhancementResult {
  success: boolean;
  enhancedImage?: string; // Base64 data URL
  error?: string;
}

export class ImageEnhancementService {
  /**
   * Enhance a product image for museum/studio presentation
   */
  static async enhanceProductImage(imageDataUrl: string, productName: string, category: string): Promise<ImageEnhancementResult> {
    try {
      console.log('🎨 Starting image enhancement for:', productName);
      
      // Extract base64 data from data URL
      const base64Data = imageDataUrl.split(',')[1];
      if (!base64Data) {
        throw new Error('Invalid image data URL');
      }

      // Create enhancement prompt based on product details
      const enhancementPrompt = [
        { 
          text: `IMPORTANT: This is a product image for e-commerce. You must preserve ALL product details exactly as they are - no changes to the actual product, colors, textures, patterns, size, or any physical characteristics. Only improve the PHOTOGRAPHY PRESENTATION: Adjust lighting to be more professional and even. Improve the background to be clean and neutral. Enhance the overall image quality and sharpness. Make the product look more appealing for online sales while keeping the product itself 100% identical to the original. Do not change, add, or remove any product features, colors, or details.` 
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
          const enhancedDataUrl = `data:image/png;base64,${enhancedBase64}`;
          
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
    category: string
  ): Promise<ImageEnhancementResult[]> {
    try {
      console.log(`🎨 Enhancing ${images.length} images for:`, productName);
      
      // Process images sequentially to avoid overwhelming the API
      const results: ImageEnhancementResult[] = [];
      
      for (let i = 0; i < images.length; i++) {
        console.log(`📤 Enhancing image ${i + 1}/${images.length}...`);
        const result = await this.enhanceProductImage(images[i], productName, category);
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
