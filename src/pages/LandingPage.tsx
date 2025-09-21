import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import InteractiveMapSection from '../components/InteractiveMapSection';
import FeaturedArtistsSection from '../components/FeaturedArtistsSection';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { useUser } from '../context/UserContext';
import { FirestoreService, Product } from '../services/firestore';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Load products for logged-in users
  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated]);

  const loadProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const allProducts = await FirestoreService.getAllProducts();
      setProducts(allProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  return (
    <main className="bg-[#121212] text-white font-sans">
      <Navbar />
      <HeroSection />
      <InteractiveMapSection />
      <FeaturedArtistsSection />
      
      {/* Products Section for Logged-in Users */}
      {isAuthenticated && (
        <section className="py-20 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Discover Amazing Products
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Explore beautiful handcrafted products from our talented artisans
              </p>
            </div>

            {isLoadingProducts ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🎨</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">No Products Available</h3>
                <p className="text-gray-300 max-w-md mx-auto">
                  Be the first to list your beautiful creations and inspire others!
                </p>
              </div>
            )}
          </div>
        </section>
      )}
      
      <Footer />
    </main>
  );
};

export default LandingPage;
