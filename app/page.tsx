import ProductCard from '../components/ProductCard';
import { ShoppingBag, Search } from 'lucide-react'; 
import Image from 'next/image';

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "The Hickory Classic Polo",
    price: "$78.00",
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1581098323225-727ca07c482a?q=80&w=800",
  },
  {
    id: 2,
    name: "Canvas & Leather Sunday Bag",
    price: "$245.00",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800", 
  },
  {
    id: 3,
    name: "Heather Knit Headcover",
    price: "$45.00",
    category: "Headwear",
    image: "https://images.unsplash.com/photo-1601506521937-0121a7c24f42?q=80&w=800",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* NAVIGATION BAR - Transparent to Green on Hover */}
<nav className="fixed top-0 z-50 w-full border-b border-white/10 transition-all duration-500 ease-in-out bg-transparent hover:bg-[#435e48] px-8 py-6 grid grid-cols-3 items-center group/nav">
  
{/* LEFT: Logo Icon + Navigation Links */}
<div className="flex items-center space-x-12">
  <div className="flex-shrink-0">
    <a 
      href="/" 
      className="block transition-transform duration-300 hover:scale-105 active:scale-95"
    >
      <Image 
        src="/handh2logo.png" 
        alt="Heather & Hickory Logo" 
        width={150} 
        height={150} 
        className="object-contain"
        priority
      />
    </a>
  </div>

  <div className="hidden lg:flex space-x-8 text-[12px] uppercase tracking-[0.3em] font-bold">
    {/* 1. THE HICKORY SHOP WITH DROPDOWN */}
    <div className="relative group/shop py-2">
      <button 
        className="uppercase tracking-[0.3em] transition-colors duration-300"
        style={{ color: '#4c2a17' }}
      >
        the hickory shop
      </button>

      {/* DROPDOWN MENU CONTAINER */}
      <div className="absolute left-0 top-full w-64 pt-4 opacity-0 invisible group-hover/shop:opacity-100 group-hover/shop:visible transition-all duration-300 ease-in-out z-50">
        <div className="bg-white shadow-2xl border border-gray-100 py-8 px-10 flex flex-col space-y-5">
        {['Shop All', 'Polos & T-Shirts', 'Hoodies & Zips', 'Hats & Accessories'].map((item) => (
  <a 
    key={item}
    href={`/shop/${item.toLowerCase()}`} 
    className="text-[#4c2a17] text-[10px] tracking-[0.2em] hover:text-[#435e48] transition-colors duration-200"
  >
    {item.replace(/-/g, ' ')}
  </a>
))}
        </div>
      </div>
      
      {/* Animated Underline */}
      <span className="absolute bottom-1 left-0 w-full h-[1px] bg-[#4c2a17] scale-x-0 transition-transform duration-300 origin-center group-hover/shop:scale-x-100"></span>
    </div>

    {/* 2. OUR STORY (Standard Link) */}
    <a 
      href="#" 
      className="relative py-2 transition-colors duration-300 group"
      style={{ color: '#4c2a17' }}
    >
      Our Story
      <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-[#4c2a17] scale-x-0 transition-transform duration-300 origin-center group-hover:scale-x-100"></span>
    </a>
  </div>
</div>

    {/* CENTER: Logo */}
    <div className="flex justify-center">
      <a 
        href="/" 
        className="group transition-transform duration-300 hover:scale-[1.02] active:scale-95"
      >
        <h1 
          className="text-3xl lg:text-4xl tracking-tight cursor-pointer whitespace-nowrap text-white" 
          style={{ 
            fontFamily: '"Bodoni 72 Oldstyle", "Bodoni 72", serif',
            color: '#4c2a17' 
          }}
        >
          heather & hickory.
        </h1>
      </a>
    </div>

  {/* RIGHT: Utility Icons */}
  <div className="flex justify-end items-center space-x-6">
    
    <button className="relative text-white hover:opacity-70 transition-opacity duration-300">
      <ShoppingBag size={22} strokeWidth={1.2} />
      <span className="absolute -top-2 -right-2 bg-[#4c2a17] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
        0
      </span>
    </button>
  </div>
</nav>
      {/* HERO SECTION WITH VIDEO */}
      <section className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center">
  <video
    autoPlay
    loop
    muted
    playsInline
    poster="/hero-image.jpeg" 
    className="absolute z-0 w-full h-full object-cover brightness-[0.7]"
  >
    {/* REMOVED "public/" from the start of the path */}
    <source src="/hero-video.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  {/* Overlay Tint */}
  <div className="absolute inset-0 z-10 bg-black/30"></div>
<div className="absolute inset-0 z-10 bg-black/40"></div>
        <div className="relative z-20 text-center px-4">
          <span className="text-white uppercase tracking-[0.5em] text-[10px] mb-6 block font-bold">
            
          </span>
          <h2 className="text-6xl md:text-8xl text-white font-bodoni italic mb-10 drop-shadow-lg">
            
          </h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="bg-white text-hickory px-10 py-4 uppercase tracking-widest text-xs font-bold hover:bg-hickory hover:text-white transition-all duration-500">
              Shop Apparel
            </button>
            <button className="bg-transparent border border-white text-white px-10 py-4 uppercase tracking-widest text-xs font-bold hover:bg-white hover:text-hickory transition-all duration-500">
              Our Story
            </button>
          </div>
        </div>
      </section>

      {/* PRODUCT GRID SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
          <div>
            <h2 className="text-4xl font-bodoni text-hickory italic">the heather spring collection</h2>
            <div className="h-0.5 w-24 bg-heather-green mt-4"></div>
          </div>
          <a href="#" className="text-xs uppercase tracking-[0.2em] text-hickory border-b border-hickory pb-1 hover:text-heather-green hover:border-heather-green transition">
            Browse All Products
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* FOOTER PREVIEW */}
      <footer className="bg-gray-50 py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="font-bodoni text-2xl text-hickory mb-4">Heather & Hickory</h3>
          <p className="text-gray-500 text-sm tracking-widest uppercase">Tradition never graduates.</p>
        </div>
      </footer>
    </main>
  );
}