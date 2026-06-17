import { useEffect, useState } from 'react';

// Father's Day display window — keep in sync with the FATHERSDAY20 code
// window in app/checkout/page.tsx and app/api/square/route.ts
export const SALE_START = new Date('2026-06-17T04:00:00Z').getTime();
export const SALE_END = new Date('2026-06-22T04:00:00Z').getTime(); // Sun 11:59pm ET

export function useSaleActive() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const now = Date.now();
    setActive(now >= SALE_START && now <= SALE_END);
  }, []);
  return active;
}