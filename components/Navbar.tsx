import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 transition-all duration-500 ease-in-out bg-[#557058] px-8 py-6 grid grid-cols-3 items-center group/nav">
      {/* LEFT: Logo + Nav */}
      <div className="flex items-center space-x-12">
        <div className="flex-shrink-0">
          <a href="/" className="block transition-transform duration-300 hover:scale-105 active:scale-95">
            <Image src="/handh2logo.png" alt="Logo" width={150} height={150} className="object-contain" priority />
          </a>
        </div>
        <div className="hidden lg:flex space-x-8 text-[12px] uppercase tracking-[0.3em] font-bold">
          <div className="relative group/shop py-2">
            <button className="uppercase tracking-[0.3em]" style={{ color: '#4c2a17' }}>the hickory shop</button>
            <div className="absolute left-0 top-full w-64 pt-4 opacity-0 invisible group-hover/shop:opacity-100 group-hover/shop:visible transition-all duration-300 z-50">
              <div className="bg-white shadow-2xl border border-gray-100 py-8 px-10 flex flex-col space-y-5">
                {[
                  { name: 'Shop All', slug: 'all' },
                  { name: 'Polos & T-Shirts', slug: 'polos-t-shirts' },
                  { name: 'Hoodies & Zips', slug: 'hoodies-zips' },
                  { name: 'Hats & Accessories', slug: 'hats-accessories' }
                ].map((item) => (
                  <a key={item.slug} href={`/shop/${item.slug}`} className="text-[#4c2a17] text-[10px] tracking-[0.2em] hover:text-[#435e48] transition-colors uppercase">
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <a href="#" className="py-2 text-[#4c2a17] uppercase tracking-[0.3em]">Our Story</a>
        </div>
      </div>

      {/* CENTER: Text Logo */}
      <div className="flex justify-center">
        <a href="/" className="group transition-transform hover:scale-[1.02]">
          <h1 className="text-3xl lg:text-4xl tracking-tight text-[#4c2a17]" style={{ fontFamily: '"Bodoni 72 Oldstyle", serif' }}>
            heather & hickory.
          </h1>
        </a>
      </div>

      {/* RIGHT: Cart */}
      <div className="flex justify-end items-center">
        <button className="relative text-white hover:opacity-70">
          <ShoppingBag size={22} strokeWidth={1.2} />
          <span className="absolute -top-2 -right-2 bg-[#4c2a17] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
        </button>
      </div>
    </nav>
  );
}