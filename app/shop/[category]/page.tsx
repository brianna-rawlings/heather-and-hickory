'use client';
import { use, useMemo, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';

const categoryNames: Record<string, string> = {
  'shop-all': 'Shop All',
  'polos-t-shirts': 'Polos & T-Shirts',
  'shorts': 'Shorts',
  'hoodies-zips': 'Hoodies & Zips',
  'hats-accessories': 'Hats & Accessories',
};

const categoryDescriptions: Record<string, string> = {
  'shop-all': 'Shop the full Heather & Hickory collection — golf polos, pullovers, hats, and accessories built for the course.',
  'polos-t-shirts': 'Heritage-inspired golf polos and t-shirts from Heather & Hickory. Built for the course, worn beyond it.',
  'hoodies-zips': 'Golf pullovers and zip-ups from Heather & Hickory. Timeless style for every round.',
  'hats-accessories': 'Golf hats and accessories from Heather & Hickory. Rooted in tradition, made to last.',
};

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

const sortLabels: Record<SortOption, string> = {
  featured: 'Featured',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  'name-asc': 'Name: A–Z',
};

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const { products, loading, error } = useProducts();
  const [sort, setSort] = useState<SortOption>('featured');

  const filteredProducts = products.filter((p) => {
    if (category === 'shop-all') return true;
    const categorySlug = p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return categorySlug === category;
  });

  const sortedProducts = useMemo(() => {
    const withPrice = filteredProducts.map(p => ({
      ...p,
      _priceValue: parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0,
    }));
    switch (sort) {
      case 'price-asc':
        return [...withPrice].sort((a, b) => a._priceValue - b._priceValue);
      case 'price-desc':
        return [...withPrice].sort((a, b) => b._priceValue - a._priceValue);
      case 'name-asc':
        return [...withPrice].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return withPrice;
    }
  }, [filteredProducts, sort]);

  const title = categoryNames[category] || category.replace(/-/g, ' ');
  const description = categoryDescriptions[category];

  return (
    <main className="min-h-screen bg-white pt-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Breadcrumb */}
        <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
          <Link href="/" className="hover:text-[#4c2a17] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#4c2a17]">{title}</span>
        </nav>

        {/* Header row */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div className="max-w-xl">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Golf Apparel & Accessories</p>
            <h1 className="text-4xl md:text-5xl font-serif italic text-[#4c2a17] mb-3">{title}</h1>
            {description && (
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            )}
          </div>

          {!loading && !error && sortedProducts.length > 0 && (
            <div className="flex items-end gap-6 flex-shrink-0">
              <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 whitespace-nowrap">
                {sortedProducts.length} {sortedProducts.length === 1 ? 'Item' : 'Items'}
              </p>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortOption)}
                className="appearance-none bg-transparent text-[10px] uppercase tracking-[0.15em] text-[#435e48] border-b border-[#435e48] pb-0.5 cursor-pointer focus:outline-none whitespace-nowrap"
              >
                {(Object.keys(sortLabels) as SortOption[]).map(key => (
                  <option key={key} value={key}>Sort: {sortLabels[key]}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="h-px bg-gray-100 mb-14"></div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 mb-24">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-100" />
                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-gray-100 w-1/3" />
                  <div className="h-4 bg-gray-100 w-3/4" />
                  <div className="h-3 bg-gray-100 w-1/4" />
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

        {!loading && !error && sortedProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 mb-24">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && !error && sortedProducts.length === 0 && (
          <p className="text-center text-gray-500 py-20">No products found in this category.</p>
        )}
      </div>
    </main>
  );
}