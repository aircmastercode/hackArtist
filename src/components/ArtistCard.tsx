import React from 'react';

interface ArtistCardProps {
  name: string;
  craft: string;
  location: string;
  bio: string;
  image: string;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ name, craft, location, bio, image }) => {
  return (
    <div className="bg-[#212121] rounded-xl border border-white/10 hover:border-orange-500 hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden group">
      {/* Artist Image */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
        
        <p className="text-orange-500 text-sm mb-3">
          {craft} from {location}
        </p>
        
        <p className="text-gray-300 text-sm italic leading-relaxed mb-4">
          "{bio}"
        </p>
        
        <button className="w-full text-white border border-orange-500 hover:bg-orange-500 hover:text-black transition-all duration-300 py-2 px-4 rounded-lg font-medium">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default ArtistCard;
