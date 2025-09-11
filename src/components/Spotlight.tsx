import React, { useRef, useState } from 'react';

type SpotlightProps = {
  src: string;
  alt?: string;
  radius?: number; // in px
  dimOpacity?: number; // 0..1
  className?: string;
  style?: React.CSSProperties;
};

const Spotlight: React.FC<SpotlightProps> = ({
  src,
  alt = '',
  radius = 180,
  dimOpacity = 0.55,
  className,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [spotPos, setSpotPos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => setSpotPos(null);

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    background: spotPos
      ? `radial-gradient(${radius}px ${radius}px at ${spotPos.x}px ${spotPos.y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 52%, rgba(0,0,0,${dimOpacity}) 60%, rgba(0,0,0,${dimOpacity}))`
      : `rgba(0,0,0,${dimOpacity})`,
    transition: 'background 120ms ease-out',
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img src={src} alt={alt} style={{ display: 'block', width: '100%', height: 'auto', filter: 'saturate(1.02) contrast(1.04)' }} />
      <div style={overlayStyle} />
    </div>
  );
};

export default Spotlight;


