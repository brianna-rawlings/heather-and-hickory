'use client';
import { use } from 'react';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';

const categoryNames: Record<string, string> = {
  'shop-all': 'Shop All',
  'polos-t-shirts': 'Polos & T-Shirts',
  'hoodies-zips': 'Hoodies & Zips',
  'hats-accessories': 'Hats & Accessories',
};

export default function CategoryClient({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const { products, loading, error } = useProducts();

  const filteredProducts = products.filter((p) => {
    if (category === 'shop-all') return true;
    const categorySlug = p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return categorySlug === category;
  });

  return (
    <main className="min-h-screen bg-white pt-50">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-serif italic text-[#4c2a17] mb-4">
            {categoryNames[category] || category.replace(/-/g, ' ')}
          </h1>
          <div className="h-0.5 w-24 bg-[#435e48] mx-auto"></div>
        </header>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16 mb-24">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-100" />
                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-gray-100 w-1/2 mx-auto" />
                  <div className="h-4 bg-gray-100 w-3/4 mx-auto" />
                  <div className="h-3 bg-gray-100 w-1/4 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-center text-red-400 text-sm uppercase tracking-[0.2em] py-20">
            Failed to load products. Please try again.
          </p>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16 mb-24">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 py-20">No products found in this category.</p>
        )}
      </div>
    </main>
  );
}