// app/api/tax/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { calculateTax } from '../_lib/taxjar';

export async function POST(req: NextRequest) {
  try {
    const { amount, shipping, address } = await req.json();
    const amountCents = Math.max(0, Math.round(Number(amount) || 0));
    const shippingCents = Math.max(0, Math.round(Number(shipping) || 0));

    const tax = await calculateTax(amountCents, shippingCents, {
      zip: address?.zip,
      state: address?.state,
      city: address?.city,
      street: address?.line1,
    });

    return NextResponse.json({ taxCents: tax.amountToCollectCents, rate: tax.rate });
  } catch (err) {
    console.error('Tax estimate error:', err);
    return NextResponse.json({ taxCents: 0, rate: 0 });
  }
}