'use client';
import { useState } from 'react';
import QuickViewModal from '@/components/QuickViewModal';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="group cursor-pointer" onClick={() => setModalOpen(true)}>
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay */}
          <div className="absolute inset-0 flex items-end justify-center p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="w-full bg-[#4c2a17] text-white py-2 text-sm uppercase tracking-tighter text-center">
              Select Size
            </div>
          </div>
        </div>
        {/* Product Details */}
        <div className="mt-4 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">
            {product.category}
          </p>
          <h3 className="text-lg font-bodoni text-hickory">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-heather-green font-semibold">
            {product.price}
          </p>
        </div>
      </div>

      {modalOpen && (
        <QuickViewModal product={product} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}