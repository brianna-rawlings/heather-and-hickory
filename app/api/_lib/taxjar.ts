// app/api/_lib/taxjar.ts
// Sales-tax calculation. Provider: Stripe Tax (calculation only — payments
// still run through Square). Swap providers here without touching anything else.
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

interface ToAddress {
  zip?: string;
  state?: string;
  city?: string;
  street?: string;
}

export interface TaxResult {
  amountToCollectCents: number;
  rate: number;
  freightTaxable: boolean;
  hasNexus: boolean;
  source: 'stripe' | 'fallback';
  calculationId?: string;
}

// Safety net if Stripe is unreachable: old flat KS rate so checkout never breaks.
function fallback(amountCents: number, state?: string): TaxResult {
  const isKS = (state || '').toUpperCase() === 'KS';
  const rate = isKS ? 0.065 : 0;
  return {
    amountToCollectCents: Math.round(amountCents * rate),
    rate,
    freightTaxable: false,
    hasNexus: isKS,
    source: 'fallback',
  };
}

/**
 * @param amountCents   Taxable goods total AFTER discounts, in cents.
 * @param shippingCents Shipping charge, in cents.
 * @param to            Destination (customer) address.
 */
export async function calculateTax(
  amountCents: number,
  shippingCents: number,
  to: ToAddress
): Promise<TaxResult> {
  if (!process.env.STRIPE_SECRET_KEY || !to.zip || !to.state) {
    return fallback(amountCents, to.state);
  }
  try {
    const calc = await stripe.tax.calculations.create({
      currency: 'usd',
      line_items: [{ amount: Math.max(0, Math.round(amountCents)), reference: 'order' }],
      ...(shippingCents > 0 ? { shipping_cost: { amount: Math.round(shippingCents) } } : {}),
      customer_details: {
        address: {
          line1: to.street || '',
          city: to.city || '',
          state: to.state,
          postal_code: to.zip,
          country: 'US',
        },
        address_source: 'shipping',
      },
    });

    const taxCents = calc.tax_amount_exclusive || 0;
    const shippingTaxCents = calc.shipping_cost?.amount_tax || 0;
    const freightTaxable = shippingTaxCents > 0;
    const base = amountCents + (freightTaxable ? shippingCents : 0);

    return {
      amountToCollectCents: taxCents,
      rate: base > 0 ? taxCents / base : 0,
      freightTaxable,
      hasNexus: taxCents > 0,
      source: 'stripe',
      calculationId: calc.id ?? undefined,
    };
  } catch (err) {
    console.error('Stripe Tax error:', err);
    return fallback(amountCents, to.state);
  }
}

// After the Square payment succeeds, record the calculation as a tax transaction
// so it appears in Stripe's tax reports/exports. Self-contained — never throws.
export async function recordTaxTransaction(calculationId: string, orderRef: string) {
  if (!process.env.STRIPE_SECRET_KEY || !calculationId) return;
  try {
    await stripe.tax.transactions.createFromCalculation({
      calculation: calculationId,
      reference: orderRef,
    });
  } catch (err) {
    console.error('Stripe Tax transaction record failed:', err);
  }
}