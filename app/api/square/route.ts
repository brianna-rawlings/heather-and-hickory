import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { sourceId, items } = await req.json();

    if (!sourceId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch real prices from Square instead of trusting the client
    const catalogRes = await fetch(`${process.env.SQUARE_API_URL}/v2/catalog/list?types=ITEM`, {
      headers: {
        'Square-Version': '2024-01-18',
        'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
      },
    });

    if (!catalogRes.ok) {
      return NextResponse.json({ error: 'Failed to verify prices' }, { status: 500 });
    }

    const catalogData = await catalogRes.json();
    const catalogObjects = catalogData.objects || [];

    // Build a map of variation id -> price in cents
    const priceMap: Record<string, number> = {};
    catalogObjects.forEach((obj: any) => {
      if (obj.type === 'ITEM') {
        (obj.item_data?.variations || []).forEach((v: any) => {
          const amount = v.item_variation_data?.price_money?.amount;
          if (amount) priceMap[v.id] = amount;
        });
      }
    });

    // Calculate the real total server-side
    let totalAmount = 0;
    for (const item of items) {
      const { productId, variationId, quantity } = item;

      if (!productId || !quantity || quantity < 1) {
        return NextResponse.json({ error: 'Invalid item in order' }, { status: 400 });
      }

      // If we have a variationId, use its price; otherwise find the first variation of the product
      let unitPrice: number | undefined;

      if (variationId && priceMap[variationId]) {
        unitPrice = priceMap[variationId];
      } else {
        // Fall back to first variation price for the product
        const product = catalogObjects.find((obj: any) => obj.id === productId);
        const firstVariation = product?.item_data?.variations?.[0];
        unitPrice = firstVariation?.item_variation_data?.price_money?.amount;
      }

      if (!unitPrice) {
        return NextResponse.json({ error: `Could not verify price for item ${productId}` }, { status: 400 });
      }

      totalAmount += unitPrice * quantity;
    }

    if (totalAmount <= 0) {
      return NextResponse.json({ error: 'Invalid order total' }, { status: 400 });
    }

    // Process payment with server-verified amount
    const paymentRes = await fetch(`${process.env.SQUARE_API_URL}/v2/payments`, {
      method: 'POST',
      headers: {
        'Square-Version': '2024-01-18',
        'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_id: sourceId,
        idempotency_key: crypto.randomUUID(),
        amount_money: {
          amount: totalAmount,
          currency: 'USD',
        },
        location_id: process.env.SQUARE_LOCATION_ID,
      }),
    });

    const paymentData = await paymentRes.json();

    if (!paymentRes.ok) {
      console.error('Square payment error:', paymentData);
      return NextResponse.json({ error: paymentData.errors?.[0]?.detail || 'Payment failed' }, { status: 400 });
    }

    return NextResponse.json({ success: true, payment: paymentData.payment });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}