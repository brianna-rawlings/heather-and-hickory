import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimit.get(ip);
  if (!limit || now > limit.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (limit.count >= 10) return false;
  limit.count++;
  return true;
}

const resend = new Resend(process.env.RESEND_API_KEY);

const SHIPPING_STANDARD = 700;
const SHIPPING_EXPEDITED = 1400;

const DISCOUNT_CODES_BACKEND: Record<string, { freeShipping: boolean; percentOff: number }> = {
  'HICKORY10': { freeShipping: false, percentOff: 10 },
  'KASITZ20': { freeShipping: false, percentOff: 20 },
  'HERITAGE15': { freeShipping: false, percentOff: 15 },
};

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many payment attempts. Please try again later.' }, { status: 429 });
    }

    const { sourceId, items, customer, shippingMethod, discountCode } = await req.json();

    if (!sourceId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!customer?.email || !customer?.name || !customer?.address) {
      return NextResponse.json({ error: 'Missing customer information' }, { status: 400 });
    }

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

    const priceMap: Record<string, number> = {};
    const nameMap: Record<string, string> = {};
    catalogObjects.forEach((obj: any) => {
      if (obj.type === 'ITEM') {
        (obj.item_data?.variations || []).forEach((v: any) => {
          const amount = v.item_variation_data?.price_money?.amount;
          if (amount) {
            priceMap[v.id] = amount;
            nameMap[v.id] = `${obj.item_data.name} (${v.item_variation_data.name})`;
          }
        });
      }
    });

    let subtotal = 0;
    const lineItems: any[] = [];
    const orderItems: { name: string; quantity: number; price: string }[] = [];

    for (const item of items) {
      const { productId, variationId, quantity, name } = item;
      if (!productId || !quantity || quantity < 1) {
        return NextResponse.json({ error: 'Invalid item in order' }, { status: 400 });
      }

      let unitPrice: number | undefined;
      if (variationId && priceMap[variationId]) {
        unitPrice = priceMap[variationId];
      } else {
        const product = catalogObjects.find((obj: any) => obj.id === productId);
        unitPrice = product?.item_data?.variations?.[0]?.item_variation_data?.price_money?.amount;
      }

      if (!unitPrice) {
        return NextResponse.json({ error: `Could not verify price for item ${productId}` }, { status: 400 });
      }

      subtotal += unitPrice * quantity;
      const itemName = name || nameMap[variationId] || 'Item';

      lineItems.push({
        name: itemName,
        quantity: String(quantity),
        base_price_money: { amount: unitPrice, currency: 'USD' },
        ...(variationId ? { catalog_object_id: variationId } : {}),
      });

      orderItems.push({
        name: itemName,
        quantity,
        price: `$${((unitPrice * quantity) / 100).toFixed(2)}`,
      });
    }

    const discount = DISCOUNT_CODES_BACKEND[discountCode?.toUpperCase()];
    const discountAmount = discount?.percentOff ? Math.round(subtotal * discount.percentOff / 100) : 0;
    const subtotalAfterDiscount = subtotal - discountAmount;

    let shippingAmount = shippingMethod === 'expedited' ? SHIPPING_EXPEDITED : shippingMethod === 'pickup' ? 0 : SHIPPING_STANDARD;
    if (shippingMethod === 'standard' && (discount?.freeShipping || subtotalAfterDiscount >= 5000)) {
      shippingAmount = 0;
    }

    const taxRate = customer.address.state?.toUpperCase() === 'KS' ? 0.065 : 0;
    const taxAmount = Math.round(subtotalAfterDiscount * taxRate);
    const totalAmount = subtotalAfterDiscount + shippingAmount + taxAmount;

    if (totalAmount <= 0) {
      return NextResponse.json({ error: 'Invalid order total' }, { status: 400 });
    }

    // Step 1: Create Square Order
    const orderRes = await fetch(`${process.env.SQUARE_API_URL}/v2/orders`, {
      method: 'POST',
      headers: {
        'Square-Version': '2024-01-18',
        'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idempotency_key: crypto.randomUUID(),
        order: {
          location_id: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
          line_items: lineItems,
          ...(discountAmount > 0 ? {
            discounts: [{
              name: discountCode?.toUpperCase() || 'Discount',
              amount_money: { amount: discountAmount, currency: 'USD' },
              scope: 'ORDER',
            }],
          } : {}),
          ...(shippingAmount > 0 ? {
            service_charges: [{
              name: shippingMethod === 'expedited' ? 'Expedited Shipping' : 'Standard Shipping',
              amount_money: { amount: shippingAmount, currency: 'USD' },
              calculation_phase: 'TOTAL_PHASE',
            }],
          } : {}),
          ...(taxAmount > 0 ? {
            taxes: [{
              name: 'Kansas Sales Tax',
              percentage: '6.5',
              scope: 'ORDER',
            }],
          } : {}),
          fulfillments: [{
            type: 'SHIPMENT',
            state: 'PROPOSED',
            shipment_details: {
              recipient: {
                display_name: customer.name,
                email_address: customer.email,
                address: {
                  address_line_1: customer.address.line1,
                  ...(customer.address.line2 ? { address_line_2: customer.address.line2 } : {}),
                  locality: customer.address.city,
                  administrative_district_level_1: customer.address.state,
                  postal_code: customer.address.zip,
                  country: 'US',
                },
              },
            },
          }],
          metadata: {
            customer_name: customer.name,
            customer_email: customer.email,
            shipping_method: shippingMethod,
            ...(discountCode ? { discount_code: discountCode } : {}),
          },
        },
      }),
    });

    const orderData = await orderRes.json();

    if (!orderRes.ok) {
      console.error('Square order creation error:', orderData);
      return NextResponse.json({ error: orderData.errors?.[0]?.detail || 'Failed to create order' }, { status: 400 });
    }

    const squareOrderId = orderData.order?.id;
    // Use Square's calculated total to avoid mismatch with Apple Pay
    const orderTotal = orderData.order?.total_money?.amount || totalAmount;

    // Step 2: Process payment attached to the order
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
        amount_money: { amount: orderTotal, currency: 'USD' },
        order_id: squareOrderId,
        location_id: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
        buyer_email_address: customer.email,
        note: `Order for ${customer.name}${discountCode ? ` | Code: ${discountCode}` : ''}`,
      }),
    });

    const paymentData = await paymentRes.json();

    if (!paymentRes.ok) {
      console.error('Square payment error:', paymentData);
      return NextResponse.json({ error: paymentData.errors?.[0]?.detail || 'Payment failed' }, { status: 400 });
    }

    const orderId = squareOrderId?.slice(-8).toUpperCase() || 'HH' + Date.now().toString().slice(-6);

    // Send confirmation email to customer
    await resend.emails.send({
      from: 'Heather & Hickory <orders@heatherandhickory.com>',
      to: customer.email,
      subject: `Order Confirmed — #${orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Georgia, serif; background: #f9f7f4; margin: 0; padding: 40px 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: white; padding: 48px;">
            <h1 style="font-size: 28px; color: #4c2a17; font-style: italic; margin: 0 0 8px;">heather & hickory</h1>
            <div style="height: 2px; width: 48px; background: #435e48; margin-bottom: 32px;"></div>
            <h2 style="font-size: 16px; color: #4c2a17; text-transform: uppercase; letter-spacing: 0.2em; font-weight: bold; margin: 0 0 8px;">Order Confirmed</h2>
            <p style="color: #666; font-size: 13px; margin: 0 0 32px;">Thank you, ${customer.name}! Your order has been received and is being processed.</p>
            <div style="background: #f9f7f4; padding: 24px; margin-bottom: 24px;">
              <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #999; margin: 0 0 16px;">Order #${orderId}</p>
              ${orderItems.map(item => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="font-size: 13px; color: #4c2a17;">${item.name} × ${item.quantity}</span>
                  <span style="font-size: 13px; color: #435e48; font-weight: bold;">${item.price}</span>
                </div>
              `).join('')}
              ${discountAmount > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="font-size: 13px; color: #435e48;">Discount (${discountCode})</span>
                  <span style="font-size: 13px; color: #435e48;">-$${(discountAmount / 100).toFixed(2)}</span>
                </div>` : ''}
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-size: 13px; color: #4c2a17;">Shipping</span>
                <span style="font-size: 13px; color: #435e48;">${shippingAmount === 0 ? 'Free' : `$${(shippingAmount / 100).toFixed(2)}`}</span>
              </div>
              ${taxAmount > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="font-size: 13px; color: #4c2a17;">Tax (KS 6.5%)</span>
                  <span style="font-size: 13px; color: #435e48;">$${(taxAmount / 100).toFixed(2)}</span>
                </div>` : ''}
              <div style="border-top: 1px solid #e5e5e5; margin-top: 16px; padding-top: 16px; display: flex; justify-content: space-between;">
                <span style="font-size: 13px; font-weight: bold; color: #4c2a17;">Total</span>
                <span style="font-size: 13px; font-weight: bold; color: #4c2a17;">$${(orderTotal / 100).toFixed(2)}</span>
              </div>
            </div>
            <div style="margin-bottom: 32px;">
              <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #999; margin: 0 0 8px;">Shipping To</p>
              <p style="font-size: 13px; color: #4c2a17; margin: 0; line-height: 1.6;">
                ${customer.name}<br>
                ${customer.address.line1}${customer.address.line2 ? '<br>' + customer.address.line2 : ''}<br>
                ${customer.address.city}, ${customer.address.state} ${customer.address.zip}
              </p>
            </div>
            <p style="font-size: 12px; color: #999; border-top: 1px solid #e5e5e5; padding-top: 24px; margin: 0;">
              Questions? Reply to this email or contact us at heatherandhickory@gmail.com.<br>
              We'll send a shipping confirmation with tracking once your order is on its way.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    // Notify store of new order
    await resend.emails.send({
      from: 'Heather & Hickory <orders@heatherandhickory.com>',
      to: 'heatherandhickory@gmail.com',
      subject: `New Order #${orderId} — $${(orderTotal / 100).toFixed(2)}`,
      html: `
        <div style="font-family: sans-serif; padding: 24px;">
          <h2>New Order Received!</h2>
          <p><strong>Order:</strong> #${orderId}</p>
          <p><strong>Customer:</strong> ${customer.name}</p>
          <p><strong>Email:</strong> ${customer.email}</p>
          <p><strong>Address:</strong> ${customer.address.line1}, ${customer.address.city}, ${customer.address.state} ${customer.address.zip}</p>
          ${discountCode ? `<p><strong>Discount Code:</strong> ${discountCode}</p>` : ''}
          <h3>Items:</h3>
          ${orderItems.map(item => `<p>${item.name} × ${item.quantity} — ${item.price}</p>`).join('')}
          ${discountAmount > 0 ? `<p><strong>Discount:</strong> -$${(discountAmount / 100).toFixed(2)}</p>` : ''}
          <p><strong>Shipping:</strong> ${shippingMethod === 'pickup' ? '🎓 CAMPUS PICKUP — arrange delivery with student' : shippingAmount === 0 ? 'Free' : `$${(shippingAmount / 100).toFixed(2)}`}</p>
          ${taxAmount > 0 ? `<p><strong>Tax (KS 6.5%):</strong> $${(taxAmount / 100).toFixed(2)}</p>` : ''}
          <h3>Total: $${(orderTotal / 100).toFixed(2)}</h3>
        </div>
      `,
    });

    return NextResponse.json({ success: true, payment: paymentData.payment, orderId });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}