import { useEffect, useState } from 'react';
// End of Season banner window — Blue Heather Polo & Whispering Clover Polo, 20% off.
// Controls both the homepage banner (SaleBanner.tsx) and Navbar's top offset.
export const SALE_START = new Date('2026-08-19T04:00:00Z').getTime(); // Aug 19, 12:00am ET
export const SALE_END = new Date('2026-09-02T03:59:00Z').getTime(); // Sept 1, 11:59pm ET

export function useSaleActive() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const now = Date.now();
    setActive(now >= SALE_START && now <= SALE_END);
  }, []);
  return active;
}