import React from 'react';
import { useOnScreen } from '../hooks/useOnScreen';

interface TextBlockProps {
  content: string;
  alignment: 'left' | 'center' | 'right';
}

const TextBlock: React.FC<TextBlockProps> = ({ content, alignment }) => {
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
        max-w-prose
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
      <p className="text-lg md:text-xl leading-relaxed font-light">
        {content}
      </p>
    </div>
  );
};

export default TextBlock;
