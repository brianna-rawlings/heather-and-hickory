import Link from 'next/link';
import { Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#435e48] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand */}
          <div>
            <h3 className="text-2xl text-white mb-4" style={{ fontFamily: '"Bodoni 72 Oldstyle", "Bodoni 72", serif' }}>
              heather & hickory.
            </h3>
            <p className="text-white/60 text-xs tracking-[0.2em] uppercase">
              Golf apparel & accessories
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              {/* TikTok icon (lucide doesn't have TikTok, using SVG) */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold mb-6">Shop</h4>
            <div className="flex flex-col space-y-3">
              <Link href="/shop/shop-all" className="text-xs text-white/70 hover:text-white transition-colors tracking-[0.15em] uppercase">Shop All</Link>
              <Link href="/shop/polos-t-shirts" className="text-xs text-white/70 hover:text-white transition-colors tracking-[0.15em] uppercase">Polos & T-Shirts</Link>
              <Link href="/shop/hoodies-zips" className="text-xs text-white/70 hover:text-white transition-colors tracking-[0.15em] uppercase">Hoodies & Zips</Link>
              <Link href="/shop/hats-accessories" className="text-xs text-white/70 hover:text-white transition-colors tracking-[0.15em] uppercase">Hats & Accessories</Link>
            </div>
          </div>

          {/* Info Links */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold mb-6">Info</h4>
            <div className="flex flex-col space-y-3">
              <Link href="/story" className="text-xs text-white/70 hover:text-white transition-colors tracking-[0.15em] uppercase">Our Story</Link>
              <a href="mailto:hello@heatherandhickory.com" className="text-xs text-white/70 hover:text-white transition-colors tracking-[0.15em] uppercase">Contact Us</a>
              <Link href="/shipping" className="text-xs text-white/70 hover:text-white transition-colors tracking-[0.15em] uppercase">Shipping Policy</Link>
              <Link href="/returns" className="text-xs text-white/70 hover:text-white transition-colors tracking-[0.15em] uppercase">Returns & Exchanges</Link>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-white/40 tracking-widest uppercase">
            © 2026 Heather & Hickory Golf Co. All rights reserved.
          </p>
          <p className="text-[10px] text-white/40 tracking-widest uppercase">
            Designed with care in the USA
          </p>
        </div>
      </div>
    </footer>
  );
}