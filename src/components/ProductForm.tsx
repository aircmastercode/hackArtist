import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { FirestoreService, Product } from '../services/firestore';

interface ProductFormProps {
  onProductAdded?: () => void;
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onProductAdded, onCancel }) => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    rawImages: [''],
    artisanNotes: '',
    price: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleImageUrlChange = (index: number, value: string) => {
    const newImages = [...formData.rawImages];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      rawImages: newImages
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      rawImages: [...prev.rawImages, '']
    }));
  };

  const removeImageField = (index: number) => {
    if (formData.rawImages.length > 1) {
      const newImages = formData.rawImages.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        rawImages: newImages
      }));
    }
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
    const validImages = formData.rawImages.filter(url => url.trim());
    if (validImages.length === 0) {
      setError('At least one image URL is required');
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
        rawImages: [''],
        artisanNotes: '',
        price: ''
      });

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

        {/* Image URLs */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Product Images *
          </label>
          {formData.rawImages.map((url, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="url"
                value={url}
                onChange={(e) => handleImageUrlChange(index, e.target.value)}
                placeholder="Enter image URL"
                className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
              />
              {formData.rawImages.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="px-3 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors duration-300"
          >
            + Add another image
          </button>
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
    </div>
  );
};

export default ProductForm;
