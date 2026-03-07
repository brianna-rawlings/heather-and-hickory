import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await resend.emails.send({
      from: 'Heather & Hickory <hello@heatherandhickory.com>',
      to: 'heatherandhickory@gmail.com',
      replyTo: email,
      subject: `Contact Form: ${subject || 'New Message'} from ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 24px; max-width: 560px;">
          <h2 style="color: #4c2a17;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject || 'Not specified'}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;">
          <p><strong>Message:</strong></p>
          <p style="color: #444; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;">
          <p style="color: #999; font-size: 12px;">Reply directly to this email to respond to ${name}.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}