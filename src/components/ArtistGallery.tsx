import React from 'react';
import { Link } from 'react-router-dom';
import { artists } from '../data/artistsData';

const ArtistGallery: React.FC = () => {
  // Generate random dimensions for each card
  const getRandomDimensions = () => {
    const widths = ['w-64', 'w-72', 'w-80', 'w-96'];
    const heights = ['h-80', 'h-96', 'h-[28rem]', 'h-[32rem]'];
    return {
      width: widths[Math.floor(Math.random() * widths.length)],
      height: heights[Math.floor(Math.random() * heights.length)]
    };
  };

  return (
    <section className="py-20 bg-[#121212] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-400">
            Meet Our Master Artisans
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the incredible stories and craftsmanship of our featured artists, each bringing decades of tradition and passion to their work.
          </p>
        </div>

        {/* Random Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {artists.map((artist, index) => {
            const dimensions = getRandomDimensions();
            return (
              <Link
                key={artist.id}
                to={`/story/${artist.id}`}
                className={`
                  ${dimensions.width} ${dimensions.height}
                  group relative overflow-hidden rounded-2xl
                  bg-gradient-to-br from-gray-800 to-gray-900
                  border border-white/10 hover:border-orange-500/50
                  transition-all duration-500 transform hover:scale-105 hover:-translate-y-2
                  shadow-2xl hover:shadow-orange-500/20
                `}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-10">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 z-30 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                    {artist.name}
                  </h3>
                  <p className="text-orange-400 font-medium mb-2">
                    {artist.craft}
                  </p>
                  <p className="text-gray-300 text-sm mb-3">
                    {artist.location}
                  </p>
                  <p className="text-gray-200 text-sm leading-relaxed line-clamp-3">
                    {artist.bio}
                  </p>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 z-25 bg-gradient-to-br from-orange-500/0 to-yellow-400/0 group-hover:from-orange-500/10 group-hover:to-yellow-400/10 transition-all duration-500"></div>

                {/* Read More Indicator */}
                <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Read Story
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-6">
            Click on any artist card to discover their unique story and craft journey
          </p>
          <div className="flex justify-center space-x-4">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtistGallery;
