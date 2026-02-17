import ProductCard from '../components/ProductCard';
import Link from 'next/link';
// Import your products from the data file we created
import { MOCK_PRODUCTS } from '../data/products';

// 1. Defining the Product type for TypeScript
interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
}

export default function Home() {
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
          {/* LINK 1: SHOP APPAREL */}
          <Link 
            href="/shop/apparel"
            className="inline-block border border-white text-white px-10 py-4 uppercase text-xs font-bold hover:bg-white hover:text-[#435e48] transition-all duration-500"
          >
            Shop Apparel
          </Link>

          {/* LINK 2: OUR STORY */}
          <Link 
            href="/story"
            className="inline-block border border-white text-white px-10 py-4 uppercase text-xs font-bold hover:bg-white hover:text-[#435e48] transition-all duration-500"
          >
            Our Story
          </Link>
        </div>
      </section>

      {/* PRODUCT GRID SECTION */}
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

        {/* The loop that renders your ProductCard components */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
    </main>
  );
}