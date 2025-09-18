import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { productService, categoryService, regionService } from '../services/database';
import { Product, Category, Region } from '../types/database';

interface SearchFilters {
  searchTerm: string;
  category: string;
  region: string;
  priceMin: number;
  priceMax: number;
  sortBy: 'newest' | 'price_low' | 'price_high' | 'featured';
}

const Explore: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    category: '',
    region: '',
    priceMin: 0,
    priceMax: 10000,
    sortBy: 'featured'
  });

  // Load categories and regions on mount
  useEffect(() => {
    const loadStaticData = async () => {
      try {
        const [categoriesData, regionsData] = await Promise.all([
          categoryService.getAll(),
          regionService.getAll()
        ]);
        setCategories(categoriesData);
        setRegions(regionsData);
      } catch (error) {
        console.error('Error loading static data:', error);
      }
    };
    loadStaticData();
  }, []);

  // Search products with filters
  const searchProducts = useCallback(async (isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setProducts([]);
      setLastDoc(null);
    }

    try {
      const searchParams = {
        category: filters.category || undefined,
        region: filters.region || undefined,
        priceMin: filters.priceMin > 0 ? filters.priceMin : undefined,
        priceMax: filters.priceMax < 10000 ? filters.priceMax : undefined,
        sortBy: filters.sortBy,
        limitCount: 20,
        lastDoc: isLoadMore ? lastDoc : undefined
      };

      const result = await productService.search(searchParams);

      if (isLoadMore) {
        setProducts(prev => [...prev, ...result.products]);
      } else {
        setProducts(result.products);
      }

      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters, lastDoc]);

  // Initial load and filter changes
  useEffect(() => {
    searchProducts(false);
  }, [filters]);

  // Infinite scroll setup
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || loadingMore) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          searchProducts(true);
        }
      });
    }, { rootMargin: '400px 0px 400px 0px' });

    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loadingMore, searchProducts]);

  const handleFilterChange = (key: keyof SearchFilters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchProducts(false);
  };

  return (
    <Layout>
      <section className="page-transition" style={{ padding: '24px 16px' }}>
        {/* Search and Filter Header */}
        <div
          className="glass-panel"
          style={{
            position: 'sticky',
            top: 76,
            zIndex: 5,
            marginBottom: 20,
            padding: '16px',
            borderRadius: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <h1 style={{ margin: 0, flex: 'none' }}>Explore the Collection</h1>
            <div style={{ marginLeft: 'auto', color: 'var(--color-text-secondary)' }}>
              {loading ? 'Loading...' : `${products.length} items`}
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <input
                className="input"
                type="text"
                placeholder="Search crafts, techniques, materials..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn-primary">Search</button>
            </div>
          </form>

          {/* Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
            <select
              className="input"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              style={{ background: 'transparent', color: 'var(--color-text-secondary)' }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>

            <select
              className="input"
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
              style={{ background: 'transparent', color: 'var(--color-text-secondary)' }}
            >
              <option value="">All Regions</option>
              {regions.map(region => (
                <option key={region.id} value={region.name}>{region.name}</option>
              ))}
            </select>

            <select
              className="input"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
              style={{ background: 'transparent', color: 'var(--color-text-secondary)' }}
            >
              <option value="featured">Sort: Featured</option>
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>

            {/* Price Range */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                className="input"
                type="number"
                placeholder="Min $"
                min="0"
                value={filters.priceMin || ''}
                onChange={(e) => handleFilterChange('priceMin', parseFloat(e.target.value) || 0)}
                style={{ width: '80px' }}
              />
              <span style={{ color: 'var(--color-text-secondary)' }}>-</span>
              <input
                className="input"
                type="number"
                placeholder="Max $"
                min="0"
                value={filters.priceMax === 10000 ? '' : filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', parseFloat(e.target.value) || 10000)}
                style={{ width: '80px' }}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="glass-panel" style={{ borderRadius: 12, padding: 40, display: 'inline-block' }}>
              <h3>Loading amazing crafts...</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>Discovering artisan treasures</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="glass-panel" style={{ borderRadius: 12, padding: 40, display: 'inline-block' }}>
              <h3>No crafts found</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20 }}>
                Try adjusting your search filters to discover more artisan creations
              </p>
              <button
                onClick={() => setFilters({
                  searchTerm: '',
                  category: '',
                  region: '',
                  priceMin: 0,
                  priceMax: 10000,
                  sortBy: 'featured'
                })}
                className="btn-ghost"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20
          }}>
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="gold-frame" style={{ overflow: 'hidden', height: '100%', transition: 'transform 0.2s ease' }}>
                  <div style={{
                    height: 200,
                    background: 'rgba(212,175,55,0.1)',
                    display: 'grid',
                    placeItems: 'center',
                    overflow: 'hidden'
                  }}>
                    {product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        loading="lazy"
                      />
                    ) : (
                      <div style={{
                        color: 'var(--color-text-secondary)',
                        textAlign: 'center',
                        padding: 20
                      }}>
                        <div style={{ fontSize: 24, marginBottom: 8 }}>🎨</div>
                        <div>No image</div>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: 16 }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: 16 }}>{product.title}</h3>
                    <p style={{
                      margin: '0 0 8px 0',
                      fontSize: 14,
                      color: 'var(--color-text-secondary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {product.artistName}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 8
                    }}>
                      <span style={{ fontSize: 18, fontWeight: 'bold' }}>
                        ${product.priceUsd.toLocaleString()}
                      </span>
                      {product.featured && (
                        <span style={{
                          background: 'var(--color-gold)',
                          color: 'black',
                          fontSize: 10,
                          padding: '2px 6px',
                          borderRadius: 4,
                          fontWeight: 'bold'
                        }}>
                          FEATURED
                        </span>
                      )}
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: 8,
                      fontSize: 12,
                      color: 'var(--color-text-secondary)'
                    }}>
                      <span>{product.category}</span>
                      <span>•</span>
                      <span>{product.region}</span>
                    </div>
                    {product.stock <= 5 && product.stock > 0 && (
                      <div style={{
                        marginTop: 8,
                        fontSize: 12,
                        color: 'orange',
                        fontWeight: 'bold'
                      }}>
                        Only {product.stock} left!
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div style={{
                        marginTop: 8,
                        fontSize: 12,
                        color: 'red',
                        fontWeight: 'bold'
                      }}>
                        Out of Stock
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More Indicator */}
        {hasMore && !loading && products.length > 0 && (
          <div ref={sentinelRef} style={{ textAlign: 'center', padding: '40px 0' }}>
            {loadingMore ? (
              <div style={{ color: 'var(--color-text-secondary)' }}>Loading more crafts...</div>
            ) : (
              <div style={{ color: 'var(--color-text-secondary)' }}>Scroll for more</div>
            )}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Explore;


