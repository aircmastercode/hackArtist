import React from 'react';
import ArtistCard from './ArtistCard';

const FeaturedArtistsSection: React.FC = () => {
  const featuredArtists = [
    {
      name: "Ramesh Kumar",
      craft: "Terracotta Potter",
      location: "West Bengal",
      bio: "My hands have shaped clay for over 40 years, telling the stories of my village with every pot I create.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Priya Sharma",
      craft: "Blue Pottery Artist",
      location: "Rajasthan",
      bio: "Each piece I create carries the essence of Jaipur's royal heritage, painted with love and tradition.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Arjun Patel",
      craft: "Kutch Embroidery Master",
      location: "Gujarat",
      bio: "Through needle and thread, I weave the vibrant culture of Kutch into every intricate design.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Lakshmi Devi",
      craft: "Kantha Embroidery",
      location: "West Bengal",
      bio: "My grandmother taught me this art, and I continue to preserve our family's legacy through every stitch.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Suresh Iyer",
      craft: "Tanjore Painting",
      location: "Tamil Nadu",
      bio: "With gold leaf and vibrant colors, I bring ancient stories to life on canvas, one painting at a time.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-20 bg-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Meet Our Master Artisans
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Meet our master artisans, each bringing decades of tradition and passion to their craft. These exceptional artists represent the heart of Indian craftsmanship.
          </p>
        </div>

        {/* Artist Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {featuredArtists.map((artist, index) => (
            <ArtistCard
              key={index}
              name={artist.name}
              craft={artist.craft}
              location={artist.location}
              bio={artist.bio}
              image={artist.image}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:shadow-lg hover:shadow-yellow-500/50 text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
            Explore All Artisans
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtistsSection;
