export interface SaleConfig {
    name: string;
    percentOff: number;
    label: string;
  }
  
  // End of Season sale. To end it, remove entries from this array and redeploy —
  // nothing in Square or checkout needs to be touched.
  export const ACTIVE_SALE: SaleConfig[] = [
    { name: 'Blue Heather Polo', percentOff: 20, label: 'End of Season' },
    { name: 'Whispering Clover Polo', percentOff: 20, label: 'End of Season' },
  ];
  
  export function getSale(productName: string): SaleConfig | undefined {
    return ACTIVE_SALE.find(s => productName.startsWith(s.name));
  }
  
  export function applyPercentOff(amountCents: number, percentOff: number): number {
    return Math.round(amountCents * (1 - percentOff / 100));
  }