import React from 'react';

interface FullBleedImageProps {
  imageUrl: string;
  alt: string;
}

const FullBleedImage: React.FC<FullBleedImageProps> = ({ imageUrl, alt }) => {
  return (
    <div className="relative h-screen w-full">
      <img
        src={imageUrl}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
};

export default FullBleedImage;
