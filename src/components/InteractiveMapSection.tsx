import React, { useState } from 'react';

interface ArtData {
  name: string;
  imageUrl: string;
}

interface StateData {
  id: string;
  name: string;
  position: { 
    top: string; 
    left: string; 
    width: string; 
    height: string; 
    clipPath?: string; 
  };
  arts: ArtData[];
  exploreLink: string;
}

const indianStatesData: StateData[] = [
  {
    id: 'RJ',
    name: 'Rajasthan',
    position: { top: '25%', left: '15%', width: '18%', height: '25%' },
    arts: [
      { name: 'Blue Pottery', imageUrl: '/assets/placeholder-art-1.png' },
      { name: 'Bandhani', imageUrl: '/assets/placeholder-art-2.png' },
      { name: 'Block Print', imageUrl: '/assets/placeholder-art-3.png' }
    ],
    exploreLink: '/explore?state=Rajasthan',
  },
  {
    id: 'GJ',
    name: 'Gujarat',
    position: { top: '35%', left: '8%', width: '12%', height: '20%' },
    arts: [
      { name: 'Kutch Embroidery', imageUrl: '/assets/placeholder-art-4.png' },
      { name: 'Patola Silk', imageUrl: '/assets/placeholder-art-5.png' }
    ],
    exploreLink: '/explore?state=Gujarat',
  },
  {
    id: 'UP',
    name: 'Uttar Pradesh',
    position: { top: '35%', left: '35%', width: '12%', height: '18%' },
    arts: [
      { name: 'Chikan Embroidery', imageUrl: '/assets/placeholder-art-6.png' },
      { name: 'Varanasi Silk', imageUrl: '/assets/placeholder-art-7.png' }
    ],
    exploreLink: '/explore?state=Uttar-Pradesh',
  },
  {
    id: 'WB',
    name: 'West Bengal',
    position: { top: '45%', left: '55%', width: '8%', height: '15%' },
    arts: [
      { name: 'Kantha Embroidery', imageUrl: '/assets/placeholder-art-8.png' },
      { name: 'Terracotta', imageUrl: '/assets/placeholder-art-9.png' }
    ],
    exploreLink: '/explore?state=West-Bengal',
  },
  {
    id: 'TN',
    name: 'Tamil Nadu',
    position: { top: '65%', left: '45%', width: '15%', height: '20%' },
    arts: [
      { name: 'Tanjore Painting', imageUrl: '/assets/placeholder-art-10.png' },
      { name: 'Chettinad Textiles', imageUrl: '/assets/placeholder-art-11.png' }
    ],
    exploreLink: '/explore?state=Tamil-Nadu',
  },
  {
    id: 'KL',
    name: 'Kerala',
    position: { top: '70%', left: '25%', width: '8%', height: '18%' },
    arts: [
      { name: 'Kathakali Masks', imageUrl: '/assets/placeholder-art-12.png' },
      { name: 'Coir Products', imageUrl: '/assets/placeholder-art-13.png' }
    ],
    exploreLink: '/explore?state=Kerala',
  },
  {
    id: 'MH',
    name: 'Maharashtra',
    position: { top: '45%', left: '25%', width: '12%', height: '20%' },
    arts: [
      { name: 'Paithani Silk', imageUrl: '/assets/placeholder-art-14.png' },
      { name: 'Warli Art', imageUrl: '/assets/placeholder-art-15.png' }
    ],
    exploreLink: '/explore?state=Maharashtra',
  },
  {
    id: 'KA',
    name: 'Karnataka',
    position: { top: '60%', left: '30%', width: '12%', height: '18%' },
    arts: [
      { name: 'Mysore Silk', imageUrl: '/assets/placeholder-art-16.png' },
      { name: 'Bidriware', imageUrl: '/assets/placeholder-art-17.png' }
    ],
    exploreLink: '/explore?state=Karnataka',
  },
  {
    id: 'AP',
    name: 'Andhra Pradesh',
    position: { top: '55%', left: '40%', width: '10%', height: '20%' },
    arts: [
      { name: 'Kalamkari', imageUrl: '/assets/placeholder-art-18.png' },
      { name: 'Kondapalli Toys', imageUrl: '/assets/placeholder-art-19.png' }
    ],
    exploreLink: '/explore?state=Andhra-Pradesh',
  },
  {
    id: 'OR',
    name: 'Odisha',
    position: { top: '50%', left: '50%', width: '8%', height: '15%' },
    arts: [
      { name: 'Pattachitra', imageUrl: '/assets/placeholder-art-20.png' },
      { name: 'Ikat Textiles', imageUrl: '/assets/placeholder-art-21.png' }
    ],
    exploreLink: '/explore?state=Odisha',
  },
  {
    id: 'MP',
    name: 'Madhya Pradesh',
    position: { top: '40%', left: '30%', width: '12%', height: '18%' },
    arts: [
      { name: 'Chanderi Silk', imageUrl: '/assets/placeholder-art-22.png' },
      { name: 'Maheshwari Sarees', imageUrl: '/assets/placeholder-art-23.png' }
    ],
    exploreLink: '/explore?state=Madhya-Pradesh',
  },
  {
    id: 'PB',
    name: 'Punjab',
    position: { top: '20%', left: '30%', width: '8%', height: '12%' },
    arts: [
      { name: 'Phulkari', imageUrl: '/assets/placeholder-art-24.png' },
      { name: 'Punjabi Jutti', imageUrl: '/assets/placeholder-art-25.png' }
    ],
    exploreLink: '/explore?state=Punjab',
  }
];

const InteractiveMapSection: React.FC = () => {
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);

  return (
    <section className="relative py-20 bg-[#121212] min-h-screen flex flex-col items-center justify-start">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-20 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-400">
        Discover the Soul of India, State by State
      </h2>

      <div className="relative w-full px-4">
        {/* Indian Map Base Image */}
        <img
          src="/india.jpeg"
          alt="Map of India"
          className="w-full h-auto opacity-80 mx-auto"
        />

        {/* Interactive State Overlays */}
        {indianStatesData.map((state) => (
          <a
            key={state.id}
            href={state.exploreLink}
            className="absolute transition-all duration-300 cursor-pointer"
            style={{
              top: state.position.top,
              left: state.position.left,
              width: state.position.width,
              height: state.position.height,
              clipPath: state.position.clipPath,
            }}
            onMouseEnter={() => setHoveredStateId(state.id)}
            onMouseLeave={() => setHoveredStateId(null)}
            aria-label={`Explore ${state.name} crafts and artisans`}
          >
            {/* Tooltip for hovered state */}
            {state.id === hoveredStateId && (
              <div className="absolute z-20 p-6 bg-black/90 backdrop-blur-md rounded-2xl shadow-2xl -translate-y-full left-1/2 -translate-x-1/2 mt-[-20px] min-w-[280px] border border-orange-500/30">
                <p className="font-bold text-yellow-400 text-xl mb-4 text-center">{state.name}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {state.arts.map((art, index) => (
                    <div key={index} className="flex flex-col items-center p-3 bg-gray-800/80 rounded-xl border border-gray-600/50">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-full flex items-center justify-center mb-2">
                        <span className="text-black text-sm font-bold">{index + 1}</span>
                      </div>
                      <span className="text-sm text-white text-center leading-tight font-medium">{art.name}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-center border-t border-gray-600/50 pt-3">
                  <p className="text-sm text-orange-400 font-medium">
                    Click to explore artisans
                  </p>
                </div>
              </div>
            )}
          </a>
        ))}
      </div>

    </section>
  );
};

export default InteractiveMapSection;
