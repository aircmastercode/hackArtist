import React from 'react';
import { useOnScreen } from '../hooks/useOnScreen';

interface TextBlockProps {
  content: string;
  alignment: 'left' | 'center' | 'right';
  imageUrl?: string;
  imageAlt?: string;
}

const TextBlock: React.FC<TextBlockProps> = ({ content, alignment, imageUrl, imageAlt }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.2, triggerOnce: true });

  const getAlignmentClasses = () => {
    switch (alignment) {
      case 'left':
        return 'mr-auto';
      case 'right':
        return 'ml-auto';
      case 'center':
        return 'mx-auto';
      default:
        return 'mx-auto';
    }
  };

  return (
    <div
      ref={ref}
      className={`
        ${getAlignmentClasses()}
        max-w-4xl
        bg-[#FAFAFA]
        text-gray-800
        p-8
        md:p-10
        rounded-lg
        shadow-xl
        transition-all
        duration-700
        ease-in-out
        transform
        ${isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
        }
      `}
    >
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Text Content */}
        <div className="flex-1">
          <p className="text-lg md:text-xl leading-relaxed font-light">
            {content}
          </p>
        </div>
        
        {/* Image Content */}
        {imageUrl && (
          <div className="flex-shrink-0 w-full lg:w-80">
            <img
              src={imageUrl}
              alt={imageAlt || 'Story image'}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TextBlock;
