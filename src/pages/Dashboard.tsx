import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import DashboardNavbar from '../components/DashboardNavbar';
import ProductForm from '../components/ProductForm';

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const [showProductForm, setShowProductForm] = useState(false);

  const handleProductAdded = () => {
    setShowProductForm(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-300">Please log in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <DashboardNavbar />
      
      {/* Main Content */}
      <div className="pt-16">
        {/* Welcome Section */}
        <section className="py-32 bg-gradient-to-br from-orange-900/20 to-yellow-900/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              Welcome, <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-400">{user.artistName}</span>
            </h1>
            <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Ready to showcase your beautiful creations to the world? Start by listing your first product and let your art speak for itself.
            </p>
            <button 
              onClick={() => setShowProductForm(true)}
              className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-black font-bold py-6 px-12 rounded-full text-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/50"
            >
              🎨 List New Product
            </button>
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

export default Dashboard;
