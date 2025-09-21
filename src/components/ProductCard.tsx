import React from 'react';
import { Product } from '../services/firestore';

interface ProductCardProps {
  product: Product;
  onDelete?: (productId: string) => void;
  showDeleteButton?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete, showDeleteButton = false }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/20">
      {/* Product Image */}
      <div className="aspect-square bg-gray-700/50 relative overflow-hidden">
        {product.rawImages && product.rawImages.length > 0 ? (
          <img
            src={product.rawImages[0]}
            alt={product.productName}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
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

        {/* Delete Button (only for artist's own products) */}
        {showDeleteButton && onDelete && (
          <div className="absolute bottom-3 right-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(product.id!);
              }}
              className="bg-red-500/90 hover:bg-red-600/90 text-white p-2 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
              title="Delete Product"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
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
            View Details
          </button>
          <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300 text-sm">
            Contact Artist
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
