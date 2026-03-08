import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { from_name, from_email, subject, message } = req.body;

  if (!from_name || !from_email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
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

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
