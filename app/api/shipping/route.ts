import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const CARRIER_TRACKING_URLS: Record<string, string> = {
  USPS: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=',
  UPS: 'https://www.ups.com/track?tracknum=',
  FedEx: 'https://www.fedex.com/fedextrack/?trknbr=',
};

export async function POST(req: NextRequest) {
  try {
    const { orderId, customerEmail, customerName, trackingNumber, carrier } = await req.json();

    if (!orderId || !customerEmail || !customerName || !trackingNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const trackingUrl = `${CARRIER_TRACKING_URLS[carrier] || CARRIER_TRACKING_URLS.USPS}${trackingNumber}`;

    await resend.emails.send({
      from: 'Heather & Hickory <orders@heatherandhickory.com>',
      to: customerEmail,
      subject: `Your Order Has Shipped — #${orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Georgia, serif; background: #f9f7f4; margin: 0; padding: 40px 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: white; padding: 48px;">
            <h1 style="font-size: 28px; color: #4c2a17; font-style: italic; margin: 0 0 8px;">heather & hickory</h1>
            <div style="height: 2px; width: 48px; background: #435e48; margin-bottom: 32px;"></div>

            <h2 style="font-size: 16px; color: #4c2a17; text-transform: uppercase; letter-spacing: 0.2em; font-weight: bold; margin: 0 0 8px;">Your Order Has Shipped!</h2>
            <p style="color: #666; font-size: 13px; margin: 0 0 32px;">Great news, ${customerName}! Your order is on its way.</p>

            <div style="background: #f9f7f4; padding: 24px; margin-bottom: 24px;">
              <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #999; margin: 0 0 8px;">Order #${orderId}</p>
              <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #999; margin: 0 0 8px;">Carrier: ${carrier}</p>
              <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #999; margin: 0 0 16px;">Tracking Number: ${trackingNumber}</p>
              <a href="${trackingUrl}" style="display: inline-block; background: #4c2a17; color: white; padding: 14px 28px; text-decoration: none; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase;">
                Track Your Order
              </a>
            </div>

            <p style="font-size: 12px; color: #999; border-top: 1px solid #e5e5e5; padding-top: 24px; margin: 0;">
              Questions? Reply to this email or contact us at heatherandhickory@gmail.com.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Shipping email error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}