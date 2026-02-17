import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { sourceId, amount, currency = 'USD' } = await req.json();

    if (!sourceId || !amount) {
      return NextResponse.json({ error: 'Missing sourceId or amount' }, { status: 400 });
    }

    const response = await fetch(`${process.env.SQUARE_API_URL}/v2/payments`, {
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
          amount: Math.round(amount * 100), // convert to cents
          currency,
        },
        location_id: process.env.SQUARE_LOCATION_ID,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Square error:', data);
      return NextResponse.json({ error: data.errors?.[0]?.detail || 'Payment failed' }, { status: 400 });
    }

    return NextResponse.json({ success: true, payment: data.payment });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}