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
          className="h-full w-full object-cover object-center transition-all duration-500 group-hover:scale-105"
        />

        {/* Arrows — only show if more than 1 image */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-[#4c2a17] text-3xl font-bold drop-shadow-lg transition-all duration-200"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-[#4c2a17] text-3xl font-bold drop-shadow-lg transition-all duration-200"
            >
              ›
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(i); }}
                  className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-[#4c2a17] w-4' : 'bg-[#4c2a17]/40 w-1.5'}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute inset-0 flex items-end justify-center p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="w-full bg-[#4c2a17] text-white py-2 text-sm uppercase tracking-tighter text-center">
            View Product
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1 truncate">
          {product.category}
        </p>
        <h3 className="text-base lg:text-lg font-bodoni text-hickory leading-tight">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-heather-green font-semibold">
          {product.price}
        </p>
      </div>
    </Link>
  );
}