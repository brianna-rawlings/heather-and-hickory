'use client';
import Link from 'next/link';
import ProductCarousel from '@/components/ProductCarousel';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import InstagramFeed from "@/components/InstagramFeed"; // 👈 1. ADD THIS IMPORT TO FIX THE RED SQUIGGLY

// Pieces to feature up top, in display order. Match by name (or partial name) —
// edit this whenever your newest drop changes.
const FEATURED = ['The 1776', 'Grey Heather', 'Fescue'];

export default function Home() {
  const { products, loading, error } = useProducts();

  const featuredProducts = FEATURED
    .map(key => products.find(p => p.name.toLowerCase().includes(key.toLowerCase())))
    .filter(Boolean) as typeof products;

  const featuredIds = new Set(featuredProducts.map(p => p.id));
  const collectionProducts = products
    .filter(p => !featuredIds.has(p.id))
    .sort((a, b) => {
      const aIsShorts = a.category.toLowerCase() === 'shorts';
      const bIsShorts = b.category.toLowerCase() === 'shorts';
      if (aIsShorts && !bIsShorts) return -1;
      if (!aIsShorts && bIsShorts) return 1;
      return 0;
    });

  return (
    <main className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      <video autoPlay loop muted playsInline className="absolute inset-0 z-0 w-full h-full object-cover brightness-[0.8]">
        <source src="/darkmobile.mov" media="(max-width: 767px)" type="video/mp4" />
        <source src="/dark.mov" type="video/mp4" />
      </video>
        <div className="absolute inset-0 z-10 bg-black/10"></div>
        <div className="relative z-20 text-center flex flex-col items-center gap-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/shop/shop-all" className="inline-block border border-white text-white px-10 py-4 uppercase text-xs font-bold hover:bg-white hover:text-[#435e48] transition-all duration-500">
              Shop Now
            </Link>
            <Link href="/story" className="inline-block border border-white text-white px-10 py-4 uppercase text-xs font-bold hover:bg-white hover:text-[#435e48] transition-all duration-500">
              Our Heritage
            </Link>
          </div>
        </div>
      </section>

      {/* SUMMER ESSENTIALS — featured, right-offset on cream */}
      <section className="bg-[#f9f7f4] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-12 items-start">
            {/* Left: heading */}
            <div className="lg:pt-6">
              <h2 className="text-4xl font-serif italic text-[#4c2a17]">Summer Essentials</h2>
              <div className="h-0.5 w-16 bg-[#435e48] mt-4"></div>
              <div className="lg:pt-6">
              <p
                className="mt-3 max-w-xs text-bold leading-relaxed text-[#4c2a17]"
                style={{ fontFamily: 'var(--font-caslon), serif' }}
              >
              Our 1776 Stripe Polo honors America's 250th, joined by two warm-weather staples: the Grey Heather Stripe Polo and the Fescue Green Vest.
              </p>
            </div>  
            </div>

            {/* Right: three pieces filling the rest */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-12">
              {loading &&
                [1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/5] bg-gray-100" />
                    <div className="mt-4 h-3 bg-gray-100 w-2/3" />
                  </div>
                ))}
              {!loading && !error &&
                featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* THE HICKORY COLLECTION — everything else */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
          <div>
            <h2 className="text-4xl font-serif text-[#4c2a17] italic">The Hickory Collection</h2>
            <div className="h-0.5 w-24 bg-[#435e48] mt-4"></div>
          </div>
          <Link href="/shop/shop-all" className="text-xs uppercase tracking-[0.2em] text-[#4c2a17] border-b border-[#4c2a17] pb-1 hover:text-[#435e48] hover:border-[#435e48] transition">
            Browse All Products
          </Link>
        </div>
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16">
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
          <p className="text-center text-red-400 text-sm uppercase tracking-[0.2em]">Failed to load products. Please try again.</p>
        )}
        {!loading && !error && collectionProducts.length > 0 && (
          <div className="group">
            <ProductCarousel products={collectionProducts} />
          </div>
        )}
      </section>

      
    </main>
  );
}