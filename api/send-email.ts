import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { from_name, from_email, subject, message } = req.body;

  if (!from_name || !from_email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    console.error('Missing GMAIL_USER or GMAIL_APP_PASSWORD env vars');
    return res.status(500).json({ error: 'Server config error' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${from_name}" <${gmailUser}>`,
      to: gmailUser,
      replyTo: from_email,
      subject: `Portfolio: ${subject || 'New Contact Message'}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h2 style="color:#6366f1;border-bottom:2px solid #6366f1;padding-bottom:10px;">New Portfolio Message</h2>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;">
            <tr><td style="padding:8px 0;color:#666;width:80px;"><strong>Name:</strong></td><td>${from_name}</td></tr>
            <tr><td style="padding:8px 0;color:#666;"><strong>Email:</strong></td><td><a href="mailto:${from_email}">${from_email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#666;"><strong>Subject:</strong></td><td>${subject || 'N/A'}</td></tr>
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
  } catch (error: any) {
    console.error('Email send error:', error?.message || error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
