'use client';
import Link from 'next/link';

interface Product {
  id: string | number;
  name: string;
  price: string;
  image: string;
  category: string;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/product/${product.id}`} className="group cursor-pointer block">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
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