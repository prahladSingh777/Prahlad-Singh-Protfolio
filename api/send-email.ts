import type { IncomingMessage, ServerResponse } from 'http';
import nodemailer from 'nodemailer';

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const { from_name, from_email, subject, message } = req.body || {};

  if (!from_name || !from_email || !message) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Name, email, and message are required' }));
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env['GMAIL_USER'],
      pass: process.env['GMAIL_APP_PASSWORD'],
    },
  });

  try {
    await transporter.sendMail({
      from: `"${from_name}" <${process.env['GMAIL_USER']}>`,
      to: process.env['GMAIL_USER'],
      replyTo: from_email,
      subject: `Portfolio: ${subject || 'New Contact Message'}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h2 style="color:#6366f1;border-bottom:2px solid #6366f1;padding-bottom:10px;">New Portfolio Message</h2>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;">
            <tr><td style="padding:8px 0;color:#666;width:80px;"><strong>Name:</strong></td><td style="padding:8px 0;">${from_name}</td></tr>
            <tr><td style="padding:8px 0;color:#666;"><strong>Email:</strong></td><td style="padding:8px 0;"><a href="mailto:${from_email}">${from_email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#666;"><strong>Subject:</strong></td><td style="padding:8px 0;">${subject || 'N/A'}</td></tr>
          </table>
          <div style="background:#f9fafb;border-radius:8px;padding:16px;margin-top:10px;">
            <strong style="color:#374151;">Message:</strong>
            <p style="color:#4b5563;line-height:1.6;white-space:pre-wrap;">${message}</p>
          </div>
          <p style="color:#9ca3af;font-size:12px;margin-top:20px;">Sent from your portfolio contact form</p>
        </div>
      `,
    });

    res.statusCode = 200;
    res.end(JSON.stringify({ success: true }));
  } catch (error) {
    console.error('Email error:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Failed to send email' }));
  }
}
