'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
}

export default function ProductCarousel({ products }: { products: Product[] }) {
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef<'left' | 'right' | null>(null);

  const cardWidth = 100 / 3;
  const maxOffset = (products.length - 3) * cardWidth;

  const slide = useCallback((direction: 'left' | 'right') => {
    setOffset(prev => {
      if (direction === 'right') return prev >= maxOffset ? 0 : prev + cardWidth;
      return prev <= 0 ? maxOffset : prev - cardWidth;
    });
  }, [maxOffset, cardWidth]);

  const stopSliding = () => {
    directionRef.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startSliding = (direction: 'left' | 'right') => {
    if (directionRef.current === direction) return;
    stopSliding();
    directionRef.current = direction;
    slide(direction);
    intervalRef.current = setInterval(() => slide(direction), 900);
  };

  useEffect(() => () => stopSliding(), []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const zone = width * 0.18;
    if (x < zone) startSliding('left');
    else if (x > width - zone) startSliding('right');
    else stopSliding();
  };

  const currentIndex = Math.round(offset / cardWidth);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={stopSliding}
    >
      {/* Edge fade gradients */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10" />

      {/* Arrow hints */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center">
          <svg className="w-4 h-4 text-[#4c2a17]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center">
          <svg className="w-4 h-4 text-[#4c2a17]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Sliding track */}
      <div
        className="flex gap-10"
        style={{
          transform: `translateX(-${offset}%)`,
          transition: 'transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          width: `${(products.length / 3) * 100}%`,
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{ width: `${100 / products.length}%` }}
            className="flex-shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {products.length > 3 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: products.length - 2 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setOffset(i * cardWidth)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'bg-[#4c2a17] w-4' : 'bg-gray-300 w-1.5'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}