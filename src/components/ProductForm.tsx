import React, { useState, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { FirestoreService, Product } from '../services/firestore';
import { AnalyticsService } from '../agents/services/analyticsService';
import { ImageEnhancementService, ImageEnhancementResult } from '../services/imageEnhancementService';

interface ProductFormProps {
  onProductAdded?: () => void;
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onProductAdded, onCancel }) => {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    rawImages: [] as string[],
    artisanNotes: '',
    price: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [isEnhancingImages, setIsEnhancingImages] = useState(false);
  const [enhancementResults, setEnhancementResults] = useState<ImageEnhancementResult[]>([]);
  const [showEnhancementModal, setShowEnhancementModal] = useState(false);
  const [enhancedImages, setEnhancedImages] = useState<string[]>([]);

  const categories = [
    'Pottery & Ceramics',
    'Textiles & Weaving',
    'Jewelry & Accessories',
    'Woodwork & Carving',
    'Metalwork',
    'Painting & Art',
    'Basketry',
    'Leatherwork',
    'Glasswork',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Convert file to base64 data URL
  const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle file selection
  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    setUploadingImages(true);
    setError('');

    try {
      const validFiles = Array.from(files).filter(file => {
        const isValidType = file.type.startsWith('image/');
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
        
        if (!isValidType) {
          setError('Please select only image files (JPG, PNG, GIF, etc.)');
          return false;
        }
        if (!isValidSize) {
          setError('Image size must be less than 5MB');
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      // Convert files to data URLs
      const dataUrls = await Promise.all(
        validFiles.map(file => fileToDataURL(file))
      );

      setFormData(prev => ({
        ...prev,
        rawImages: [...prev.rawImages, ...dataUrls]
      }));

    } catch (err) {
      console.error('Error processing images:', err);
      setError('Failed to process images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  // Remove image
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rawImages: prev.rawImages.filter((_, i) => i !== index)
    }));
  };

  // Open file dialog
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Enhance images using AI
  const enhanceImages = async () => {
    if (formData.rawImages.length === 0) {
      setError('Please upload images first');
      return;
    }

    if (!formData.productName.trim() || !formData.category) {
      setError('Please fill in product name and category before enhancing images');
      return;
    }

    setIsEnhancingImages(true);
    setError('');

    try {
      console.log('🎨 Starting image enhancement...');
      
      const results = await ImageEnhancementService.enhanceMultipleImages(
        formData.rawImages,
        formData.productName,
        formData.category
      );

      setEnhancementResults(results);
      
      // Check if any enhancements were successful
      const successfulEnhancements = results.filter(r => r.success && r.enhancedImage);
      
      if (successfulEnhancements.length > 0) {
        setEnhancedImages(successfulEnhancements.map(r => r.enhancedImage!));
        setShowEnhancementModal(true);
      } else {
        const errorMessages = results.map(r => r.error).filter(Boolean);
        setError(`Failed to enhance images: ${errorMessages.join(', ')}`);
      }
    } catch (err) {
      console.error('Error enhancing images:', err);
      setError(`Failed to enhance images: ${err instanceof Error ? err.message : 'Unknown error occurred'}`);
    } finally {
      setIsEnhancingImages(false);
    }
  };

  // Accept enhanced images
  const acceptEnhancedImages = () => {
    setFormData(prev => ({
      ...prev,
      rawImages: enhancedImages
    }));
    setShowEnhancementModal(false);
    setEnhancedImages([]);
    setEnhancementResults([]);
  };

  // Reject enhanced images
  const rejectEnhancedImages = () => {
    setShowEnhancementModal(false);
    setEnhancedImages([]);
    setEnhancementResults([]);
  };

  const validateForm = () => {
    if (!formData.productName.trim()) {
      setError('Product name is required');
      return false;
    }
    if (!formData.category) {
      setError('Category is required');
      return false;
    }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      setError('Please enter a valid price');
      return false;
    }
    if (!formData.artisanNotes.trim()) {
      setError('Artisan notes are required');
      return false;
    }
    if (formData.rawImages.length === 0) {
      setError('At least one image is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    if (!user?.id) {
      setError('User not found. Please log in again.');
      return;
    }

    setIsLoading(true);

    try {
      const productData: Omit<Product, 'id'> = {
        productName: formData.productName.trim(),
        category: formData.category,
        rawImages: formData.rawImages.filter(url => url.trim()),
        artisanNotes: formData.artisanNotes.trim(),
        price: Number(formData.price),
        artistId: user.id,
        artistName: user.artistName,
        createdAt: new Date().toISOString(),
        isActive: true
      };

      await FirestoreService.addProduct(productData);
      
      // Reset form
      setFormData({
        productName: '',
        category: '',
        rawImages: [],
        artisanNotes: '',
        price: ''
      });

      // Trigger fresh analysis in the background
      setIsGeneratingAnalysis(true);
      try {
        console.log('🚀 Triggering fresh analysis after product addition...');
        await AnalyticsService.triggerFreshAnalysis(user.id);
        console.log('✅ Analysis updated successfully');
      } catch (analysisError) {
        console.error('⚠️ Failed to update analysis:', analysisError);
        // Don't show error to user as this is background process
      } finally {
        setIsGeneratingAnalysis(false);
      }

      if (onProductAdded) {
        onProductAdded();
      }
      
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-white/10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-400 mb-2">
          List a New Product
        </h2>
        <p className="text-gray-300">
          Share your beautiful creations with the world
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {isGeneratingAnalysis && (
        <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400 mr-3"></div>
            <p className="text-blue-400 text-sm">
              Updating your business analysis with the new product...
            </p>
          </div>
        </div>
      )}

      {isEnhancingImages && (
        <div className="mb-6 p-4 bg-purple-500/20 border border-purple-500/50 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400 mr-3"></div>
            <p className="text-purple-400 text-sm">
              Enhancing your images for professional presentation...
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-300 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
            placeholder="Enter product name"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-white"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category} className="bg-gray-700">
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
            Price (₹) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="1"
            step="0.01"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
            placeholder="Enter price in rupees"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Product Images *
          </label>
          
          {/* Drag and Drop Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              isDragOver
                ? 'border-orange-500 bg-orange-500/10'
                : 'border-gray-600 hover:border-orange-400 hover:bg-gray-700/20'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            {uploadingImages ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
                <p className="text-gray-300">Processing images...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-4 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-300 mb-2">
                  Drag and drop images here, or{' '}
                  <button
                    type="button"
                    onClick={openFileDialog}
                    className="text-orange-400 hover:text-orange-300 font-medium underline"
                  >
                    browse files
                  </button>
                </p>
                <p className="text-gray-400 text-sm">
                  Supports JPG, PNG, GIF up to 5MB each
                </p>
              </div>
            )}
          </div>

          {/* Image Preview Grid */}
          {formData.rawImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-300 mb-3">
                Selected Images ({formData.rawImages.length})
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.rawImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-sm transition-colors duration-300 opacity-0 group-hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhancement Button */}
          {formData.rawImages.length > 0 && formData.productName.trim() && formData.category && (
            <div className="mt-4 text-center space-y-2">
              <button
                type="button"
                onClick={enhanceImages}
                disabled={isEnhancingImages}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isEnhancingImages ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Enhancing Images...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="mr-2">✨</span>
                    Enhance Images with AI
                  </div>
                )}
              </button>
              <p className="text-gray-400 text-xs mt-2">
                AI will enhance your images for professional museum/studio presentation
              </p>
            </div>
          )}
        </div>

        {/* Artisan Notes */}
        <div>
          <label htmlFor="artisanNotes" className="block text-sm font-medium text-gray-300 mb-2">
            Artisan Notes *
          </label>
          <textarea
            id="artisanNotes"
            name="artisanNotes"
            value={formData.artisanNotes}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 resize-none"
            placeholder="Share the inspiration, materials used, techniques, and story behind your creation..."
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                Adding Product...
              </div>
            ) : (
              'Add Product'
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-all duration-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Enhancement Approval Modal */}
      {showEnhancementModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-800 rounded-2xl border border-white/10">
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  ✨ Enhanced Images Ready
                </h3>
                <p className="text-gray-300 mb-2">
                  AI has enhanced your images for professional presentation. Compare and choose:
                </p>
                <p className="text-green-400 text-sm font-medium">
                  ✅ All product details, colors, and features are preserved exactly as original
                </p>
              </div>

              {/* Image Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {formData.rawImages.map((original, index) => {
                  const enhanced = enhancedImages[index];
                  if (!enhanced) return null;

                  return (
                    <div key={index} className="space-y-4">
                      <h4 className="text-lg font-semibold text-white text-center">
                        Image {index + 1}
                      </h4>
                      
                      {/* Original Image */}
                      <div className="relative">
                        <h5 className="text-sm font-medium text-gray-400 mb-2">Original</h5>
                        <img
                          src={original}
                          alt={`Original ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg border border-gray-600"
                        />
                      </div>

                      {/* Enhanced Image */}
                      <div className="relative">
                        <h5 className="text-sm font-medium text-purple-400 mb-2">Enhanced ✨</h5>
                        <img
                          src={enhanced}
                          alt={`Enhanced ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg border border-purple-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={acceptEnhancedImages}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  ✅ Use Enhanced Images
                </button>
                <button
                  onClick={rejectEnhancedImages}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300"
                >
                  ❌ Keep Original Images
                </button>
              </div>

              <p className="text-gray-400 text-sm text-center mt-4">
                Enhanced images maintain all original product details while improving photography presentation for better online sales
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductForm;
