import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import DashboardNavbar from '../components/DashboardNavbar';
import ProductForm from '../components/ProductForm';
import ProductCard from '../components/ProductCard';
import { FirestoreService, Product } from '../services/firestore';

const MyProducts: React.FC = () => {
  const { user } = useUser();
  const [showProductForm, setShowProductForm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Load user's products
  useEffect(() => {
    if (user?.id) {
      loadProducts();
    }
  }, [user?.id]);

  const loadProducts = async () => {
    if (!user?.id) return;
    
    setIsLoadingProducts(true);
    try {
      const userProducts = await FirestoreService.getProductsByArtist(user.id);
      setProducts(userProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleProductAdded = () => {
    setShowProductForm(false);
    loadProducts(); // Reload products after adding
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-300">Please log in to access your products.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <DashboardNavbar />
      
      {/* Main Content */}
      <div className="pt-16">
        {/* Header Section */}
        <section className="py-20 bg-gradient-to-br from-orange-900/20 to-yellow-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                My Products
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Manage and showcase your beautiful creations
              </p>
              <button 
                onClick={() => setShowProductForm(true)}
                className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
              >
                + List New Product
              </button>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <h3 className="text-2xl font-bold mb-4">No Products Yet</h3>
                <p className="text-gray-300 mb-8 max-w-md mx-auto">
                  Start showcasing your beautiful creations by listing your first product.
                </p>
                <button 
                  onClick={() => setShowProductForm(true)}
                  className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  List Your First Product
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <ProductForm 
              onProductAdded={handleProductAdded}
              onCancel={() => setShowProductForm(false)}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default MyProducts;
