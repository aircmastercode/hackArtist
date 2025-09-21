import React, { useState, useEffect } from 'react';

interface StoryHeroProps {
  title: string;
  subtitle: string;
  imageUrl: string;
}

const StoryHero: React.FC<StoryHeroProps> = ({ title, subtitle, imageUrl }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-10">
        <img
          src={imageUrl}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 z-20"></div>

      {/* Title Card */}
      <div className="absolute inset-0 z-30 flex items-center justify-center">
        <div
          className={`
            text-center px-8 max-w-4xl
            transition-all duration-1000 ease-out
            transform
            ${isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
            }
          `}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 font-light leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div
          className={`
            flex flex-col items-center text-white
            transition-all duration-1000 ease-out
            ${isVisible ? 'opacity-100' : 'opacity-0'}
          `}
          style={{ transitionDelay: '1.5s' }}
        >
          <span className="text-sm mb-2 font-light">Scroll to explore</span>
          <div className="animate-bounce">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryHero;
