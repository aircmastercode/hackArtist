import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productService, categoryService, regionService } from '../services/database';
import { Category, Region } from '../types/database';
import ImageUpload from './ImageUpload';

interface ProductFormData {
  title: string;
  description: string;
  culturalStory: string;
  priceUsd: number;
  category: string;
  region: string;
  materials: string;
  stock: number;
  isCustomizable: boolean;
  tags: string;
  technique: string;
  culturalSignificance: string;
  timeToProduce: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  images: string[];
}

interface ProductFormProps {
  productId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ productId, onSuccess, onCancel }) => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    culturalStory: '',
    priceUsd: 0,
    category: '',
    region: '',
    materials: '',
    stock: 1,
    isCustomizable: false,
    tags: '',
    technique: '',
    culturalSignificance: '',
    timeToProduce: 1,
    difficulty: 'Intermediate',
    images: []
  });

  // Load categories and regions
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, regionsData] = await Promise.all([
          categoryService.getAll(),
          regionService.getAll()
        ]);
        setCategories(categoriesData);
        setRegions(regionsData);
      } catch (error) {
        console.error('Error loading form data:', error);
      }
    };
    loadData();
  }, []);

  // Load existing product if editing
  useEffect(() => {
    if (productId) {
      const loadProduct = async () => {
        try {
          const product = await productService.getById(productId);
          if (product) {
            setFormData({
              title: product.title,
              description: product.description,
              culturalStory: product.culturalStory || '',
              priceUsd: product.priceUsd,
              category: product.category,
              region: product.region,
              materials: product.materials.join(', '),
              stock: product.stock,
              isCustomizable: product.isCustomizable,
              tags: product.tags.join(', '),
              technique: product.technique || '',
              culturalSignificance: product.culturalSignificance || '',
              timeToProduce: product.timeToProduce || 1,
              difficulty: product.difficulty || 'Intermediate',
              images: product.images || []
            });
          }
        } catch (error) {
          console.error('Error loading product:', error);
          setError('Failed to load product data');
        }
      };
      loadProduct();
    }
  }, [productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
               type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userProfile || userProfile.userType !== 'artisan') {
      setError('Only artisans can create products');
      return;
    }

    if (!formData.title || !formData.description || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const productData = {
        title: formData.title,
        description: formData.description,
        culturalStory: formData.culturalStory,
        images: formData.images,
        thumbnails: [],
        priceUsd: formData.priceUsd,
        currency: 'USD',
        category: formData.category,
        region: formData.region,
        materials: formData.materials.split(',').map(m => m.trim()).filter(m => m),
        artistId: userProfile.uid,
        artistName: userProfile.name,
        stock: formData.stock,
        isCustomizable: formData.isCustomizable,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        searchKeywords: [
          formData.title.toLowerCase(),
          formData.category.toLowerCase(),
          formData.region.toLowerCase(),
          ...formData.tags.split(',').map(t => t.trim().toLowerCase()).filter(t => t)
        ],
        technique: formData.technique,
        culturalSignificance: formData.culturalSignificance,
        timeToProduce: formData.timeToProduce,
        difficulty: formData.difficulty,
        status: 'draft' as const,
        featured: false
      };

      if (productId) {
        await productService.update(productId, productData);
      } else {
        await productService.create(productData);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error saving product:', error);
      setError(error.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (userProfile?.userType !== 'artisan') {
    return (
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
        <h3>Access Denied</h3>
        <p>Only verified artisans can create and manage products.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>{productId ? 'Edit Product' : 'Create New Product'}</h2>
        {onCancel && (
          <button onClick={onCancel} className="btn-ghost">Cancel</button>
        )}
      </div>

      {error && (
        <div style={{
          color: 'red',
          padding: '12px',
          background: 'rgba(255,0,0,0.1)',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <label>
            Product Title *
            <input
              className="input"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="e.g. Blue Pottery Vase"
            />
          </label>

          <label>
            Price (USD) *
            <input
              className="input"
              type="number"
              name="priceUsd"
              value={formData.priceUsd}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </label>
        </div>

        <label>
          Description *
          <textarea
            className="input"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            required
            placeholder="Describe your product, its features, and what makes it special..."
          />
        </label>

        <label>
          Cultural Story
          <textarea
            className="input"
            name="culturalStory"
            value={formData.culturalStory}
            onChange={handleInputChange}
            rows={3}
            placeholder="Share the cultural significance, traditional techniques, or family history behind this craft..."
          />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <label>
            Category *
            <select
              className="input"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </label>

          <label>
            Region *
            <select
              className="input"
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Region</option>
              {regions.map(region => (
                <option key={region.id} value={region.name}>{region.name}</option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <label>
            Materials
            <input
              className="input"
              name="materials"
              value={formData.materials}
              onChange={handleInputChange}
              placeholder="e.g. Clay, Natural Pigments, Glaze"
            />
          </label>

          <label>
            Stock Quantity *
            <input
              className="input"
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
              required
            />
          </label>
        </div>

        <label>
          Tags (comma-separated)
          <input
            className="input"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="e.g. handmade, traditional, decorative"
          />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <label>
            Technique Used
            <input
              className="input"
              name="technique"
              value={formData.technique}
              onChange={handleInputChange}
              placeholder="e.g. Hand-thrown and painted"
            />
          </label>

          <label>
            Time to Produce (days)
            <input
              className="input"
              type="number"
              name="timeToProduce"
              value={formData.timeToProduce}
              onChange={handleInputChange}
              min="1"
            />
          </label>

          <label>
            Difficulty Level
            <select
              className="input"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Master">Master</option>
            </select>
          </label>
        </div>

        <label>
          Cultural Significance
          <textarea
            className="input"
            name="culturalSignificance"
            value={formData.culturalSignificance}
            onChange={handleInputChange}
            rows={2}
            placeholder="Explain the cultural or historical importance of this craft..."
          />
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            name="isCustomizable"
            checked={formData.isCustomizable}
            onChange={handleInputChange}
          />
          This product can be customized upon request
        </label>

        <ImageUpload
          images={formData.images}
          onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
          maxImages={5}
          folder="products"
        />

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-ghost">
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : productId ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;