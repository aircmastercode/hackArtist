import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#212121] border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-400 mb-4">
              ShilpSetu
            </h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Bridging the gap between traditional Indian craftsmanship and the digital world. 
              Empowering artisans to share their stories and connect with a global audience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/explore" className="text-gray-300 hover:text-yellow-400 transition-colors">Explore</a></li>
              <li><a href="/our-story" className="text-gray-300 hover:text-yellow-400 transition-colors">Our Story</a></li>
              <li><a href="/for-buyers" className="text-gray-300 hover:text-yellow-400 transition-colors">For Buyers</a></li>
              <li><a href="/for-artisans" className="text-gray-300 hover:text-yellow-400 transition-colors">For Artisans</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">support@shilpsetu.com</li>
              <li className="text-gray-300">+91 98765 43210</li>
              <li className="text-gray-300">Mumbai, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 ShilpSetu. All rights reserved. Made with ❤️ for Indian artisans.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
