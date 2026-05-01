import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(`${process.env.SQUARE_API_URL}/v2/orders/search`, {
      method: 'POST',
      headers: {
        'Square-Version': '2024-01-18',
        'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location_ids: [process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID],
        query: {
          sort: {
            sort_field: 'CREATED_AT',
            sort_order: 'DESC',
          },
        },
        limit: 50,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Square orders error:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    const data = await response.json();
    const orders = (data.orders || []).map((order: any) => {
      const fulfillment = order.fulfillments?.[0]?.shipment_details;
      const recipient = fulfillment?.recipient;
      const address = recipient?.address;

      // Get customer info from order
      const customerName = recipient?.display_name || order.buyer_email_address?.split('@')[0] || 'Unknown';
      const customerEmail = order.buyer_email_address || '';

      return {
        id: order.id,
        shortId: order.id.slice(-8).toUpperCase(),
        createdAt: order.created_at,
        customerName,
        customerEmail,
        address: {
          line1: address?.address_line_1 || '',
          line2: address?.address_line_2 || '',
          city: address?.locality || '',
          state: address?.administrative_district_level_1 || '',
          zip: address?.postal_code || '',
        },
        items: (order.line_items || []).map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: `$${((item.total_money?.amount || 0) / 100).toFixed(2)}`,
        })),
        total: `$${((order.total_money?.amount || 0) / 100).toFixed(2)}`,
        status: order.state,
        fulfillmentStatus: order.fulfillments?.[0]?.state || 'PROPOSED',
      };
    });

    return NextResponse.json({ orders });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}