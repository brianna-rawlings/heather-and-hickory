'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);

  const shopCategories = [
    { name: 'Shop All', slug: 'shop-all' },
    { name: 'Polos & T-Shirts', slug: 'polos-t-shirts' },
    { name: 'Hoodies & Zips', slug: 'hoodies-zips' },
    { name: 'Hats & Accessories', slug: 'hats-accessories' }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 w-full transition-all duration-500 ease-in-out !bg-transparent hover:!bg-[#435e48] px-6 py-4 lg:py-6 grid grid-cols-3 items-center group/nav">
        
        {/* LEFT: Logo (desktop) / hidden (mobile) */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="transition-transform hover:scale-105 hidden lg:block">
            <Image 
              src="/new.png" 
              alt="Heather & Hickory Logo" 
              width={130} 
              height={130} 
              className="object-contain transition-all duration-500 group-hover/nav:brightness-0 group-hover/nav:invert"
              priority
            />
          </Link>
          <div className="hidden lg:flex space-x-8 text-[12px] uppercase tracking-[0.3em] font-bold whitespace-nowrap">
            <div className="relative group/shop py-2">
              <button className="flex items-center gap-2 uppercase tracking-[0.3em] transition-colors duration-300 text-[#4c2a17] group-hover/nav:text-white whitespace-nowrap">
                the hickory shop
                <ChevronDown size={14} className="transition-transform duration-300 group-hover/shop:rotate-180" />
              </button>
              <div className="absolute left-0 top-full w-64 pt-4 opacity-0 invisible group-hover/shop:opacity-100 group-hover/shop:visible transition-all duration-300 ease-in-out z-50">
                <div className="bg-white shadow-2xl border border-gray-100 py-8 px-10 flex flex-col space-y-5">
                  {shopCategories.map((category) => (
                    <Link key={category.slug} href={`/shop/${category.slug}`} className="text-[#4c2a17] text-[10px] tracking-[0.2em] hover:text-[#435e48] transition-colors duration-200">
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              <span className="absolute bottom-1 left-0 w-full h-[1px] bg-[#4c2a17] group-hover/nav:bg-white scale-x-0 transition-transform duration-300 origin-center group-hover/shop:scale-x-100"></span>
            </div>
            <Link href="/story" className="relative py-2 transition-colors duration-300 text-[#4c2a17] group-hover/nav:text-white group/story whitespace-nowrap">
              Our Heritage
              <span className="absolute bottom-1 left-0 w-full h-[1px] bg-[#4c2a17] group-hover/nav:bg-white scale-x-0 transition-transform duration-300 origin-center group-hover/story:scale-x-100"></span>
            </Link>
          </div>
        </div>

        {/* CENTER: Branding */}
        <div className="flex justify-center">
          <Link href="/">
            <h1 
              className="text-xl lg:text-4xl tracking-tight transition-colors duration-300 text-[#4c2a17] group-hover/nav:text-white whitespace-nowrap" 
              style={{ fontFamily: '"Bodoni 72 Oldstyle", "Bodoni 72", serif' }}
            >
              heather & hickory.
            </h1>
          </Link>
        </div>

        {/* RIGHT: Cart + Hamburger */}
        <div className="flex justify-end items-center gap-4">
          <button onClick={() => setIsOpen(true)} className="relative">
            <img
              src="/golf-bag.svg"
              alt="cart"
              width={32}
              height={32}
              className="transition-all duration-300 [filter:invert(22%)_sepia(30%)_saturate(700%)_hue-rotate(330deg)_brightness(55%)_contrast(95%)] group-hover/nav:[filter:brightness(0)_invert(1)]"
            />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#4c2a17] group-hover/nav:bg-white group-hover/nav:text-[#435e48] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-[#4c2a17] group-hover/nav:text-white transition-colors duration-300">
            <Menu size={22} strokeWidth={1.2} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-[100] bg-[#435e48] flex flex-col px-8 py-8 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between mb-12">
          <h2 style={{ fontFamily: '"Bodoni 72 Oldstyle", "Bodoni 72", serif' }} className="text-2xl text-white">
            heather & hickory.
          </h2>
          <button onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-white transition-colors">
            <X size={24} strokeWidth={1.2} />
          </button>
        </div>

        <div className="flex flex-col space-y-6">
          <div>
            <button
              onClick={() => setMobileShopOpen(!mobileShopOpen)}
              className="flex items-center justify-between w-full text-white text-xs uppercase tracking-[0.3em] font-bold py-2 border-b border-white/10"
            >
              The Hickory Shop
              <ChevronDown size={16} className={`transition-transform duration-300 ${mobileShopOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileShopOpen && (
              <div className="mt-3 ml-4 flex flex-col space-y-3">
                {shopCategories.map(category => (
                  <Link key={category.slug} href={`/shop/${category.slug}`} onClick={() => setMobileOpen(false)} className="text-white/70 text-xs uppercase tracking-[0.2em] hover:text-white transition-colors py-1">
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {[
            { label: 'Our Heritage', href: '/story' },
            { label: 'Shipping', href: '/shipping' },
            { label: 'Returns & Exchanges', href: '/returns' },
          ].map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="text-white text-xs uppercase tracking-[0.3em] font-bold py-2 border-b border-white/10 hover:text-white/70 transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mt-auto">
          <p className="text-white/30 text-[10px] uppercase tracking-widest">© 2026 Heather & Hickory Golf Co.</p>
        </div>
      </div>
    </>
  );
}