'use client';
import Link from 'next/link';
import { useSaleActive } from '@/components/sale';

export default function SaleBanner() {
  const active = useSaleActive();

  if (!active) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-8 flex items-center justify-center bg-[#4c2a17] text-white px-4">
      <Link href="/shop/sale" className="text-[10px] uppercase tracking-[0.2em] text-center hover:opacity-80 transition-opacity">
        End of Summer! Blue Heather Polo &amp; Whispering Clover Polo, 20% Off!
      </Link>
    </div>
  );
}