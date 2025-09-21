import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const DashboardNavbar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    // Redirect to home page after logout
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-400">
              ShilpSetu
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                to="/story"
                className={`transition-colors duration-300 px-3 py-2 text-sm font-medium ${
                  location.pathname === '/story'
                    ? 'text-yellow-400'
                    : 'text-white hover:text-yellow-400'
                }`}
              >
                Stories
              </Link>
              <Link
                to="/my-profile"
                className={`transition-colors duration-300 px-3 py-2 text-sm font-medium ${
                  location.pathname === '/my-profile'
                    ? 'text-yellow-400'
                    : 'text-white hover:text-yellow-400'
                }`}
              >
                My Profile
              </Link>
              <Link
                to="/my-story"
                className={`transition-colors duration-300 px-3 py-2 text-sm font-medium ${
                  location.pathname === '/my-story'
                    ? 'text-yellow-400'
                    : 'text-white hover:text-yellow-400'
                }`}
              >
                My Story
              </Link>
              <Link
                to="/my-products"
                className={`transition-colors duration-300 px-3 py-2 text-sm font-medium ${
                  location.pathname === '/my-products'
                    ? 'text-yellow-400'
                    : 'text-white hover:text-yellow-400'
                }`}
              >
                My Products
              </Link>
              <Link
                to="/business-analysis"
                className={`transition-colors duration-300 px-3 py-2 text-sm font-medium ${
                  location.pathname === '/business-analysis'
                    ? 'text-yellow-400'
                    : 'text-white hover:text-yellow-400'
                }`}
              >
                Business Analytics
              </Link>
              <Link
                to="/community"
                className={`transition-colors duration-300 px-3 py-2 text-sm font-medium ${
                  location.pathname === '/community'
                    ? 'text-yellow-400'
                    : 'text-white hover:text-yellow-400'
                }`}
              >
                Community
              </Link>
            </div>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <p className="text-sm text-white font-medium">{user?.artistName}</p>
              <p className="text-xs text-gray-300">{user?.state}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-600 to-orange-500 hover:brightness-110 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white hover:text-yellow-400 focus:outline-none focus:text-yellow-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
