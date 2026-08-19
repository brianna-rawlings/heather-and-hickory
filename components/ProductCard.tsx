'use client';
import Link from 'next/link';
import { useState } from 'react';

interface Product {
  id: string | number;
  name: string;
  price: string;
  image: string;
  images?: string[];
  category: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const allImages = product.images && product.images.length > 0
    ? Array.from(new Set([...product.images, product.image])).filter(Boolean)
    : [product.image];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(i => (i === 0 ? allImages.length - 1 : i - 1));
  };
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(i => (i === allImages.length - 1 ? 0 : i + 1));
  };

  return (
    <Link href={`/shop/product/${product.id}`} className="group cursor-pointer block">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={allImages[currentIndex]}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white text-2xl drop-shadow-md opacity-0 transition-opacity duration-200 group-hover:opacity-70"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white text-2xl drop-shadow-md opacity-0 transition-opacity duration-200 group-hover:opacity-70"
            >
              ›
            </button>

            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(i); }}
                  aria-label={`View image ${i + 1}`}
                  className={`h-[1.5px] w-4 transition-colors duration-300 ${
                    i === currentIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-4">
        <p
          className="text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1 truncate"
          style={{ fontFamily: 'var(--font-jost), sans-serif' }}
        >
          {product.category}
        </p>
        <div className="flex items-baseline justify-between gap-3">
          <h3
            className="text-base text-[#4c2a17] leading-tight transition-colors duration-200 group-hover:text-[#435e48] truncate"
            style={{ fontFamily: 'var(--font-caslon), serif' }}
          >
            {product.name}
          </h3>
          <p
            className="text-sm text-[#435e48] font-semibold whitespace-nowrap"
            style={{ fontFamily: 'var(--font-jost), sans-serif' }}
          >
            {product.price}
          </p>
        </div>
      </div>
    </Link>
  );
}