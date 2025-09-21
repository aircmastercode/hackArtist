import React, { useState } from 'react';

interface StateData {
  name: string;
  crafts: string[];
  images: string[];
}

const InteractiveMapSection: React.FC = () => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const stateData: Record<string, StateData> = {
    'rajasthan': {
      name: 'Rajasthan',
      crafts: ['Blue Pottery', 'Bandhani Fabric'],
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop'
      ]
    },
    'gujarat': {
      name: 'Gujarat',
      crafts: ['Kutch Embroidery', 'Patola Silk'],
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop'
      ]
    },
    'west-bengal': {
      name: 'West Bengal',
      crafts: ['Terracotta', 'Kantha Embroidery'],
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop'
      ]
    },
    'tamil-nadu': {
      name: 'Tamil Nadu',
      crafts: ['Tanjore Painting', 'Chettinad Textiles'],
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop'
      ]
    },
    'kerala': {
      name: 'Kerala',
      crafts: ['Kathakali Masks', 'Coir Products'],
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop'
      ]
    }
  };

  const handleMouseEnter = (stateId: string, event: React.MouseEvent) => {
    setHoveredState(stateId);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredState(null);
  };

  return (
    <section className="py-20 bg-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Discover the Soul of India, State by State
        </h2>
        
        <div className="relative">
          {/* Simplified Indian Map SVG */}
          <svg
            viewBox="0 0 800 1000"
            className="w-full h-auto max-w-4xl mx-auto"
            style={{ height: '80vh' }}
          >
            {/* Rajasthan */}
            <path
              id="rajasthan"
              d="M 200 200 L 400 200 L 400 350 L 200 350 Z"
              fill={hoveredState === 'rajasthan' ? '#FDD835' : '#374151'}
              stroke={hoveredState === 'rajasthan' ? '#FB8C00' : 'rgba(255, 255, 255, 0.2)'}
              strokeWidth="2"
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={(e) => handleMouseEnter('rajasthan', e)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
            
            {/* Gujarat */}
            <path
              id="gujarat"
              d="M 100 350 L 200 350 L 200 500 L 100 500 Z"
              fill={hoveredState === 'gujarat' ? '#FDD835' : '#374151'}
              stroke={hoveredState === 'gujarat' ? '#FB8C00' : 'rgba(255, 255, 255, 0.2)'}
              strokeWidth="2"
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={(e) => handleMouseEnter('gujarat', e)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
            
            {/* West Bengal */}
            <path
              id="west-bengal"
              d="M 500 300 L 600 300 L 600 450 L 500 450 Z"
              fill={hoveredState === 'west-bengal' ? '#FDD835' : '#374151'}
              stroke={hoveredState === 'west-bengal' ? '#FB8C00' : 'rgba(255, 255, 255, 0.2)'}
              strokeWidth="2"
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={(e) => handleMouseEnter('west-bengal', e)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
            
            {/* Tamil Nadu */}
            <path
              id="tamil-nadu"
              d="M 300 600 L 500 600 L 500 750 L 300 750 Z"
              fill={hoveredState === 'tamil-nadu' ? '#FDD835' : '#374151'}
              stroke={hoveredState === 'tamil-nadu' ? '#FB8C00' : 'rgba(255, 255, 255, 0.2)'}
              strokeWidth="2"
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={(e) => handleMouseEnter('tamil-nadu', e)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
            
            {/* Kerala */}
            <path
              id="kerala"
              d="M 200 700 L 300 700 L 300 850 L 200 850 Z"
              fill={hoveredState === 'kerala' ? '#FDD835' : '#374151'}
              stroke={hoveredState === 'kerala' ? '#FB8C00' : 'rgba(255, 255, 255, 0.2)'}
              strokeWidth="2"
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={(e) => handleMouseEnter('kerala', e)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
          </svg>

          {/* Custom Tooltip */}
          {hoveredState && stateData[hoveredState] && (
            <div
              className="fixed z-50 bg-[#212121] border border-white/20 rounded-lg p-4 shadow-2xl backdrop-blur-sm"
              style={{
                left: tooltipPosition.x + 10,
                top: tooltipPosition.y - 10,
                transform: 'translateY(-100%)'
              }}
            >
              <h3 className="text-lg font-bold text-white mb-2">
                {stateData[hoveredState].name}
              </h3>
              
              <div className="flex space-x-2 mb-3">
                {stateData[hoveredState].images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={stateData[hoveredState].crafts[index]}
                    className="w-12 h-12 rounded object-cover"
                  />
                ))}
              </div>
              
              <p className="text-sm text-gray-300 mb-2">
                {stateData[hoveredState].crafts.join(', ')}
              </p>
              
              <p className="text-xs text-yellow-400">
                Click to explore
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default InteractiveMapSection;
