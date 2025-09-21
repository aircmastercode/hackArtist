/**
 * Simple image compression utility for Firestore storage
 * Compresses base64 images to reduce file size for Firestore's 1MB limit
 */

export interface CompressionResult {
  compressed: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export class ImageCompression {
  /**
   * Compress a base64 image for Firestore storage
   */
  static compressImage(base64DataUrl: string, quality: number = 0.5): Promise<CompressionResult> {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          // Aggressive compression for Firestore storage (1MB limit)
          const maxWidth = 600;  // Optimized for Firestore
          const maxHeight = 600; // Optimized for Firestore
          let { width, height } = img;
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress with aggressive settings for Firestore
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          
          const originalSize = Math.round(base64DataUrl.length * 0.75 / 1024);
          const compressedSize = Math.round(compressedDataUrl.length * 0.75 / 1024);
          const compressionRatio = Math.round((1 - compressedSize / originalSize) * 100);
          
          console.log('📏 Image compressed for Firestore:', {
            original: `${originalSize}KB`,
            compressed: `${compressedSize}KB`,
            compression: `${compressionRatio}% smaller`,
            quality,
            dimensions: `${width}x${height}`
          });
          
          resolve({
            compressed: compressedDataUrl,
            originalSize,
            compressedSize,
            compressionRatio
          });
        };
        
        img.onerror = () => reject(new Error('Failed to load image for compression'));
        img.src = base64DataUrl;
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Compress multiple images in parallel
   */
  static async compressMultipleImages(
    images: string[], 
    quality: number = 0.5
  ): Promise<CompressionResult[]> {
    try {
      console.log(`🗜️ Compressing ${images.length} images for Firestore storage...`);
      
      const results = await Promise.all(
        images.map(img => this.compressImage(img, quality))
      );
      
      const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
      const totalCompressed = results.reduce((sum, r) => sum + r.compressedSize, 0);
      const avgCompression = Math.round((1 - totalCompressed / totalOriginal) * 100);
      
      console.log(`✅ Compression complete:`, {
        totalOriginal: `${totalOriginal}KB`,
        totalCompressed: `${totalCompressed}KB`,
        averageCompression: `${avgCompression}% smaller`
      });
      
      return results;
    } catch (error) {
      console.error('❌ Error compressing images:', error);
      throw error;
    }
  }

  /**
   * Check if an image is too large for Firestore (1MB limit)
   */
  static isImageTooLarge(base64DataUrl: string): boolean {
    const base64Data = base64DataUrl.split(',')[1];
    if (!base64Data) return true;
    
    const sizeInBytes = base64Data.length * 0.75; // Base64 is ~33% larger than binary
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    return sizeInMB > 0.8; // Leave buffer for other document data
  }

  /**
   * Get image size in KB
   */
  static getImageSize(base64DataUrl: string): number {
    const base64Data = base64DataUrl.split(',')[1];
    if (!base64Data) return 0;
    
    const sizeInBytes = base64Data.length * 0.75;
    return Math.round(sizeInBytes / 1024);
  }
}

export default ImageCompression;
