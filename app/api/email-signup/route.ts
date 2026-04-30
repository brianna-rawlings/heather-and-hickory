import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY;
const KLAVIYO_LIST_ID = 'SpjzTa';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

    // Add to Klaviyo list
    await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/', {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        'Content-Type': 'application/json',
        'revision': '2024-02-15',
      },
      body: JSON.stringify({
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            profiles: {
              data: [
                {
                  type: 'profile',
                  attributes: {
                    email,
                    subscriptions: {
                      email: {
                        marketing: {
                          consent: 'SUBSCRIBED',
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
          relationships: {
            list: {
              data: {
                type: 'list',
                id: KLAVIYO_LIST_ID,
              },
            },
          },
        },
      }),
    });

    // Send welcome email with discount code
    await resend.emails.send({
      from: 'Heather & Hickory <hello@heatherandhickory.com>',
      to: email,
      subject: 'Your 10% off discount code — heather & hickory',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Georgia, serif; background: #f9f7f4; margin: 0; padding: 40px 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: white; padding: 48px; text-align: center;">
            <h1 style="font-size: 28px; color: #4c2a17; font-style: italic; margin: 0 0 8px;">heather & hickory</h1>
            <div style="height: 2px; width: 48px; background: #435e48; margin: 0 auto 32px;"></div>
            <h2 style="font-size: 16px; color: #4c2a17; text-transform: uppercase; letter-spacing: 0.2em; font-weight: bold; margin: 0 0 16px;">welcome to the club</h2>
            <p style="color: #666; font-size: 13px; margin: 0 0 32px; line-height: 1.6;">Thanks for signing up! Here's your exclusive 10% off discount code. Use it at checkout on your first order.</p>
            <div style="background: #f9f7f4; padding: 24px; margin-bottom: 32px;">
              <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; color: #999; margin: 0 0 8px;">your discount code</p>
              <p style="font-size: 28px; font-weight: bold; color: #4c2a17; letter-spacing: 0.2em; margin: 0;">HICKORY10</p>
            </div>
            <a href="https://heatherandhickory.com/shop/shop-all" style="display: inline-block; background: #4c2a17; color: white; padding: 14px 32px; text-decoration: none; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase;">
              Shop Now
            </a>
            <p style="font-size: 12px; color: #999; border-top: 1px solid #e5e5e5; padding-top: 24px; margin-top: 32px;">
              Questions? Contact us at heatherandhickory@gmail.com
            </p>
          </div>
        </body>
        </html>
      `,
    });

    // Notify yourself of new signup
    await resend.emails.send({
      from: 'Heather & Hickory <hello@heatherandhickory.com>',
      to: 'heatherandhickory@gmail.com',
      subject: `New Email Signup — ${email}`,
      html: `<p>New email signup: <strong>${email}</strong></p>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Email signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}