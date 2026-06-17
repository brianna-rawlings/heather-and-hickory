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
        {/* Arrows — softened: fade in on hover, white, lighter weight */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white text-2xl drop-shadow-md opacity-0 transition-opacity duration-200 group-hover:opacity-70"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white text-2xl drop-shadow-md opacity-0 transition-opacity duration-200 group-hover:opacity-70"
            >
              ›
            </button>
            {/* Dot indicators */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1 z-10">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(i); }}
                  className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-white w-4' : 'bg-white/50 w-1.5'}`}
                />
              ))}
            </div>
          </>
        )}
        {/* Hover label — slim translucent bar instead of solid block */}
      <div className="absolute inset-x-0 bottom-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="bg-[#4c2a17]/80 py-2 text-center">
            <span className="text-[10px] uppercase tracking-[0.25em] text-white">View Product</span>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p
          className="text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1 truncate"
          style={{ fontFamily: 'var(--font-jost), sans-serif' }}
        >
          {product.category}
        </p>
        <h3
          className="text-base lg:text-lg text-[#4c2a17] leading-tight"
          style={{ fontFamily: 'var(--font-caslon), serif' }}
        >
          {product.name}
        </h3>
        <p
          className="mt-1 text-sm text-[#435e48] font-semibold"
          style={{ fontFamily: 'var(--font-jost), sans-serif' }}
        >
          {product.price}
        </p>
      </div>
    </Link>
  );
}