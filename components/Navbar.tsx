'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart();

  const shopCategories = [
    { name: 'Shop All', slug: 'shop-all' },
    { name: 'Polos & T-Shirts', slug: 'polos-t-shirts' },
    { name: 'Hoodies & Zips', slug: 'hoodies-zips' },
    { name: 'Hats & Accessories', slug: 'hats-accessories' }
  ];

  return (
    <nav className="fixed top-0 left-0 z-50 w-full transition-all duration-500 ease-in-out !bg-transparent hover:!bg-[#435e48] px-8 py-6 grid grid-cols-3 items-center group/nav">
      
      {/* LEFT: Logo & Links */}
      <div className="flex items-center space-x-6">
        <Link href="/" className="transition-transform hover:scale-105">
          <Image 
            src="/handh2logo.png" 
            alt="Heather & Hickory Logo" 
            width={150} 
            height={150} 
            className="object-contain transition-all duration-500 
             group-hover/nav:brightness-0 
             group-hover/nav:invert"
            priority
          />
        </Link>
        <div className="hidden md:flex space-x-6 text-[11px] uppercase tracking-[0.25em] font-bold">
          {/* THE HICKORY SHOP WITH DROPDOWN */}
          <div className="relative group/shop py-2">
            <button className="flex items-center gap-2 uppercase tracking-[0.3em] transition-colors duration-300 text-[#4c2a17] group-hover/nav:text-white">
              the hickory shop
              <ChevronDown size={14} className="transition-transform duration-300 group-hover/shop:rotate-180" />
            </button>
            {/* DROPDOWN MENU */}
            <div className="absolute left-0 top-full w-64 pt-4 opacity-0 invisible group-hover/shop:opacity-100 group-hover/shop:visible transition-all duration-300 ease-in-out z-50">
              <div className="bg-white shadow-2xl border border-gray-100 py-8 px-10 flex flex-col space-y-5">
                {shopCategories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/shop/${category.slug}`}
                    className="text-[#4c2a17] text-[10px] tracking-[0.2em] hover:text-[#435e48] transition-colors duration-200"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Animated Underline */}
            <span className="absolute bottom-1 left-0 w-full h-[1px] bg-[#4c2a17] group-hover/nav:bg-white scale-x-0 transition-transform duration-300 origin-center group-hover/shop:scale-x-100"></span>
          </div>
          <Link
            href="/story" 
            className="relative py-2 transition-colors duration-300 text-[#4c2a17] group-hover/nav:text-white group/story"
          >
            Our Heritage
            <span className="absolute bottom-1 left-0 w-full h-[1px] bg-[#4c2a17] group-hover/nav:bg-white scale-x-0 transition-transform duration-300 origin-center group-hover/story:scale-x-100"></span>
          </Link>
        </div>
      </div>

      {/* CENTER: Branding */}
      <div className="flex justify-center">
        <Link href="/">
          <h1 
            className="text-3xl lg:text-4xl tracking-tight transition-colors duration-300 text-[#4c2a17] group-hover/nav:text-white" 
            style={{ fontFamily: '"Bodoni 72 Oldstyle", "Bodoni 72", serif' }}
          >
            heather & hickory.
          </h1>
        </Link>
      </div>

      {/* RIGHT: Cart Icon */}
      <div className="flex justify-end items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="relative text-[#4c2a17] group-hover/nav:text-white transition-colors duration-300"
        >
          <ShoppingBag size={22} strokeWidth={1.2} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#4c2a17] group-hover/nav:bg-white group-hover/nav:text-[#435e48] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}