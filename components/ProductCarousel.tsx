'use client';
import { useEffect, useRef } from 'react';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string | number;
  name: string;
  price: string;
  category: string;
  image: string;
  images?: string[];
}

export default function ProductCarousel({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplicate products for seamless infinite loop
  const doubled = [...products, ...products];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationId: number;
    let position = 0;
    const speed = 1.0; // pixels per frame — adjust to make faster or slower

    const animate = () => {
      position += speed;
      // Reset when we've scrolled through the first set
      const halfWidth = track.scrollWidth / 2;
      if (position >= halfWidth) position = 0;
      track.style.transform = `translateX(-${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    // Pause on hover
    const pause = () => cancelAnimationFrame(animationId);
    const resume = () => { animationId = requestAnimationFrame(animate); };

    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', resume);

    return () => {
      cancelAnimationFrame(animationId);
      track.removeEventListener('mouseenter', pause);
      track.removeEventListener('mouseleave', resume);
    };
  }, [products]);

  return (
    <div className="relative overflow-hidden select-none">
      <div
        ref={trackRef}
        className="flex gap-10"
        style={{ width: 'max-content' }}
      >
        {doubled.map((product, i) => (
          <div
            key={`${product.id}-${i}`}
            style={{ width: '320px' }}
            className="flex-shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}