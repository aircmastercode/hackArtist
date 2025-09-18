import React, { useState, useEffect } from 'react';
import { productService, categoryService, regionService } from '../services/database';

const DebugDatabase: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkDatabase = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Checking database...');

      const [productsData, categoriesData, regionsData] = await Promise.all([
        productService.search({}),
        categoryService.getAll(),
        regionService.getAll()
      ]);

      console.log('📊 Database results:', {
        products: productsData.length,
        categories: categoriesData.length,
        regions: regionsData.length
      });

      setProducts(productsData);
      setCategories(categoriesData);
      setRegions(regionsData);
    } catch (err) {
      console.error('❌ Database check failed:', err);
      setError(err instanceof Error ? err.message : 'Database check failed');
    } finally {
      setLoading(false);
    }
  };

  // Auto-check on mount
  useEffect(() => {
    checkDatabase();
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: 16,
      borderRadius: 8,
      zIndex: 1001,
      maxWidth: 400,
      fontSize: 12
    }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: 14 }}>🔍 Database Debug</h4>

      <button
        onClick={checkDatabase}
        disabled={loading}
        style={{
          background: '#2196F3',
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: 4,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: 12,
          marginBottom: 12
        }}
      >
        {loading ? '🔄 Checking...' : '🔍 Check Database'}
      </button>

      {error && (
        <div style={{ color: '#f44336', marginBottom: 12 }}>
          ❌ Error: {error}
        </div>
      )}

      <div style={{ display: 'grid', gap: 8 }}>
        <div>📊 Products: {products.length}</div>
        <div>🏷️ Categories: {categories.length}</div>
        <div>🌍 Regions: {regions.length}</div>
      </div>

      {products.length > 0 && (
        <details style={{ marginTop: 12 }}>
          <summary style={{ cursor: 'pointer', fontSize: 12 }}>
            👁️ View Products ({products.length})
          </summary>
          <div style={{ maxHeight: 200, overflow: 'auto', marginTop: 8 }}>
            {products.map((product, i) => (
              <div key={i} style={{
                padding: 4,
                borderBottom: '1px solid #333',
                fontSize: 10
              }}>
                {product.title} - ${product.priceUsd}
              </div>
            ))}
          </div>
        </details>
      )}

      <div style={{ marginTop: 12, fontSize: 10, opacity: 0.7 }}>
        Check browser console for detailed logs
      </div>
    </div>
  );
};

export default DebugDatabase;