import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Send email via your email provider
    // Using a simple mailto approach via Resend, Nodemailer, or similar
    // For now we'll use a fetch to a simple email service
    
    const emailBody = `
New contact form submission from heatherandhickory.com

Name: ${name}
Email: ${email}
Subject: ${subject || 'Not specified'}

Message:
${message}

---
Reply directly to: ${email}
    `.trim();

    // If you set up Resend later, replace this block
    // For now, log it and return success so the form works
    console.log('Contact form submission:', { name, email, subject, message });

    // TODO: Add email sending here (Resend, SendGrid, etc.)
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'onboarding@resend.dev',
    //   to: 'heatherandhickory@gmail.com',
    //   subject: `Contact Form: ${subject || 'New Message'} from ${name}`,
    //   text: emailBody,
    // });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}