'use client';
import { useSaleActive } from '@/components/lib/sale';

export default function SaleContent({ children }: { children: React.ReactNode }) {
  const active = useSaleActive();
  return <div className={active ? 'pt-8 transition-all duration-500 ease-in-out' : ''}>{children}</div>;
}