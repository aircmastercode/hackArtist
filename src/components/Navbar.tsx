import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-400">
              ShilpSetu
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="/explore"
                className="text-white hover:text-yellow-400 transition-colors duration-300 px-3 py-2 text-sm font-medium"
              >
                Explore
              </a>
              <a
                href="/our-story"
                className="text-white hover:text-yellow-400 transition-colors duration-300 px-3 py-2 text-sm font-medium"
              >
                Stories
              </a>
            </div>
          </div>

          {/* Login/Signup Button */}
          <div className="flex-shrink-0">
            <button className="bg-gradient-to-r from-red-600 to-orange-500 hover:brightness-110 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
              Login / Signup
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

export default Navbar;
