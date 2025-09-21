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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

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

  const handleDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      await FirestoreService.deleteProduct(productToDelete);
      console.log('✅ Product deleted successfully');
      
      // Remove the product from the local state
      setProducts(products.filter(p => p.id !== productToDelete));
      
      // Close the confirmation modal
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      // You could add a toast notification here
    }
  };

  const cancelDeleteProduct = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
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
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onDelete={handleDeleteProduct}
                    showDeleteButton={true}
                  />
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-white/10">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                Delete Product
              </h3>
              
              <p className="text-gray-300 mb-8">
                Are you sure you want to delete this product? This action cannot be undone and will permanently remove the product from your collection and the database.
              </p>
              
              <div className="flex space-x-4">
                <button
                  onClick={cancelDeleteProduct}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteProduct}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MyProducts;
