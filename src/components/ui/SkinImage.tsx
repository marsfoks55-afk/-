import React, { useState } from 'react';
import { WeaponCategory, Rarity } from '../../types';
import { Box } from 'lucide-react';

interface SkinImageProps {
  src: string;
  alt: string;
  category?: WeaponCategory | string;
  rarity?: Rarity;
  isCase?: boolean;
  className?: string;
}

export const SkinImage: React.FC<SkinImageProps> = ({
  src,
  alt,
  category = 'rifles',
  rarity = 'milspec',
  isCase = false,
  className = 'w-full h-full',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Clean, high-tech weapon silhouette fallback when image fails or is blocked
  const renderFallbackIcon = () => {
    if (isCase) {
      return (
        <div className="flex flex-col items-center justify-center text-zinc-500">
          <Box className="w-14 h-14 stroke-1 mb-1 opacity-40 text-white" />
          <span className="text-[10px] text-[#969EAA] uppercase font-mono-num font-semibold">
            CS2 CRATE
          </span>
        </div>
      );
    }

    switch (category) {
      case 'knives':
        return (
          <svg className="w-16 h-16 opacity-35 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 4.5l5 5L7 22l-5-5L14.5 4.5z" />
            <path d="M11 8l5 5" />
            <path d="M18 11l-2-2" />
          </svg>
        );
      case 'gloves':
        return (
          <svg className="w-16 h-16 opacity-35 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
            <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
            <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
          </svg>
        );
      case 'pistols':
        return (
          <svg className="w-16 h-16 opacity-35 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 11h11l2-4H3v4z" />
            <path d="M14 7h4v4h-4V7z" />
            <path d="M7 11v6l2 2h3l-1-8" />
          </svg>
        );
      default:
        // Rifles, SMGs, Heavy
        return (
          <svg className="w-18 h-12 opacity-35 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 9h16l4 2v2l-4 1H2V9z" />
            <path d="M7 14v4l2 1h2l-1-5" />
            <path d="M16 14v4" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      {/* Loading Skeleton */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-[#12151A] animate-pulse rounded-xl flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/30 animate-spin" />
        </div>
      )}

      {/* Actual Image */}
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className={`max-w-full max-h-full object-contain pointer-events-none select-none transition-all duration-300 ${
            isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        />
      ) : (
        /* Fallback Graphic */
        <div className="flex flex-col items-center justify-center p-2 text-center select-none">
          {renderFallbackIcon()}
          <span className="text-[10px] text-[#969EAA] font-medium tracking-wider uppercase mt-1">
            {alt.split('|')[0]?.trim() || (isCase ? 'CASE' : 'CS2 ITEM')}
          </span>
        </div>
      )}
    </div>
  );
};
