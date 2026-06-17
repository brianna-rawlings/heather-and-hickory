'use client';
import { useSaleActive } from '@/components/sale';

export default function SaleBanner() {
  const active = useSaleActive();
  if (!active) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-8 flex items-center justify-center bg-[#4c2a17] text-white px-4">
      <p className="text-[10px] uppercase tracking-[0.2em] text-center">
        {"Father's Day Sale · Now through Sunday 11:59pm EST · 20% off site-wide with code FATHERSDAY20"}
      </p>
    </div>
  );
}