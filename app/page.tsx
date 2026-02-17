'use client';
import Link from 'next/link';
import ProductCarousel from '@/components/ProductCarousel';
import { useProducts } from '@/hooks/useProducts';

export default function Home() {
  const { products, loading, error } = useProducts();

  return (
    <main className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative h-[75vh] w-full overflow-hidden flex items-center justify-center">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 z-0 w-full h-full object-cover brightness-[0.7]"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-10 bg-black/20"></div>
        <div className="relative z-20 text-center space-x-6">
          <Link 
            href="/shop/shop-all"
            className="inline-block border border-white text-white px-10 py-4 uppercase text-xs font-bold hover:bg-white hover:text-[#435e48] transition-all duration-500"
          >
            Shop Now
          </Link>
          <Link 
            href="/story"
            className="inline-block border border-white text-white px-10 py-4 uppercase text-xs font-bold hover:bg-white hover:text-[#435e48] transition-all duration-500"
          >
            Our Story
          </Link>
        </div>
      </section>

      {/* PRODUCT CAROUSEL SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
          <div>
            <h2 className="text-4xl font-serif text-[#4c2a17] italic">The Heather Spring Collection</h2>
            <div className="h-0.5 w-24 bg-[#435e48] mt-4"></div>
          </div>
          <Link 
            href="/shop/shop-all" 
            className="text-xs uppercase tracking-[0.2em] text-[#4c2a17] border-b border-[#4c2a17] pb-1 hover:text-[#435e48] hover:border-[#435e48] transition"
          >
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
          <p className="text-center text-red-400 text-sm uppercase tracking-[0.2em]">
            Failed to load products. Please try again.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="group">
            <ProductCarousel products={products} />
          </div>
        )}
      </section>
    </main>
  );
}