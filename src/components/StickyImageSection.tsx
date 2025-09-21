import React from 'react';
import TextBlock from './TextBlock';
import { TextBlockData } from '../data/storyData';

interface StickyImageSectionProps {
  backgroundUrl: string;
  alt: string;
  textBlocks: TextBlockData[];
}

const StickyImageSection: React.FC<StickyImageSectionProps> = ({
  backgroundUrl,
  alt,
  textBlocks
}) => {
  // Calculate height based on number of text blocks
  // Each text block needs space to scroll past the sticky image
  const sectionHeight = Math.max(200, textBlocks.length * 120); // vh units

  return (
    <div 
      className="relative w-full"
      style={{ minHeight: `${sectionHeight}vh` }}
    >
      {/* Sticky Background Image */}
      <div className="sticky top-0 h-screen z-10">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
          role="img"
          aria-label={alt}
        />
      </div>

      {/* Content Area with Text Blocks */}
      <div className="relative z-20">
        <div 
          className="flex flex-col justify-around px-4 md:px-8 lg:px-16"
          style={{ 
            minHeight: `${sectionHeight}vh`,
            paddingTop: '20vh',
            paddingBottom: '20vh'
          }}
        >
          {textBlocks.map((textBlock, index) => (
            <div key={index} className="mb-16 md:mb-20">
              <TextBlock
                content={textBlock.content}
                alignment={textBlock.alignment}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StickyImageSection;
