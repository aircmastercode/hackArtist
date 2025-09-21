import React, { useState, useEffect } from 'react';
import { FirestoreService, Product } from '../services/firestore';
import Navbar from '../components/Navbar';
import DashboardNavbar from '../components/DashboardNavbar';
import { useUser } from '../context/UserContext';

interface ExploreProduct extends Product {
  randomHeight: number;
  randomWidth: number;
}

const Explore: React.FC = () => {
  const { user } = useUser();
  const [products, setProducts] = useState<ExploreProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ExploreProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>(['all']);

  // Generate random dimensions for masonry layout
  const generateRandomDimensions = (): { height: number; width: number } => {
    const heights = [200, 250, 300, 350, 400, 450, 500];
    const widths = [250, 300, 350, 400];
    
    return {
      height: heights[Math.floor(Math.random() * heights.length)],
      width: widths[Math.floor(Math.random() * widths.length)]
    };
  };

  // Load all products from all artists
  useEffect(() => {
    const loadAllProducts = async () => {
      setIsLoading(true);
      try {
        const allProducts = await FirestoreService.getAllProducts();
        
        // Add random dimensions to each product for masonry layout
        const productsWithDimensions: ExploreProduct[] = allProducts.map(product => {
          const dimensions = generateRandomDimensions();
          return {
            ...product,
            randomHeight: dimensions.height,
            randomWidth: dimensions.width
          };
        });

        setProducts(productsWithDimensions);
        setFilteredProducts(productsWithDimensions);

        // Extract unique categories
        const uniqueCategories = ['all', ...Array.from(new Set(allProducts.map(p => p.category)))];
        setCategories(uniqueCategories);

        console.log(`✅ Loaded ${allProducts.length} products from all artists`);
      } catch (error) {
        console.error('❌ Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllProducts();
  }, []);

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.artisanNotes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white">
        {user ? <DashboardNavbar /> : <Navbar />}
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-xl text-gray-300">Discovering amazing art...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {user ? <DashboardNavbar /> : <Navbar />}
      
      {/* Header Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-orange-900/20 to-yellow-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Explore Art
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Discover beautiful creations from talented artists across India
            </p>
            
            {/* Search and Filter Controls */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search Input */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search products, artists, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-800/50 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                  />
                </div>
                
                {/* Category Filter */}
                <div className="md:w-64">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-800/50 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                  >
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-gray-800">
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Results Count */}
              <p className="text-gray-400">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer"
                  style={{
                    gridRowEnd: `span ${Math.ceil(product.randomHeight / 50)}`
                  }}
                >
                  <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/20 h-full">
                    {/* Product Image */}
                    <div 
                      className="relative overflow-hidden bg-gray-700/50"
                      style={{ height: `${product.randomHeight}px` }}
                    >
                      {product.rawImages && product.rawImages.length > 0 ? (
                        <img
                          src={product.rawImages[0]}
                          alt={product.productName}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23374151"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%9CA3AF" font-family="Arial, sans-serif" font-size="16"%3EImage not available%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-700/50">
                          <span className="text-gray-400 text-sm">No image available</span>
                        </div>
                      )}
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-orange-500/90 text-black px-3 py-1 rounded-full text-xs font-bold">
                          {product.category}
                        </span>
                      </div>

                      {/* Price Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-bold">
                          ₹{product.price.toLocaleString()}
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-center">
                          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                        {product.productName}
                      </h3>
                      
                      <p className="text-orange-400 text-sm font-medium mb-3">
                        by {product.artistName}
                      </p>

                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                        {product.artisanNotes}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <button className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-black font-bold py-2 px-4 rounded-lg transition-all duration-300 text-sm">
                          Contact Artist
                        </button>
                        <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300 text-sm">
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">No Products Found</h3>
              <p className="text-gray-300 mb-8 max-w-md mx-auto">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No products have been added yet. Be the first to showcase your art!'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Explore;
