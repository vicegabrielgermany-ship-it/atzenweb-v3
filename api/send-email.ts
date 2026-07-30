import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import { setCors, respondError } from './_lib/kv.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res, req.headers.origin as string | undefined);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { type, email, name, company, message, items, plz } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const settings = await kv.get('ag:settings').catch(() => null) as any;
  const apiKey = settings?.resendApiKey || process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('Missing RESEND_API_KEY — set via Admin > Settings or RESEND_API_KEY env var');
    return res.status(500).json({ error: 'Email not configured. Ask the admin to add a Resend API key.' });
  }

  try {
    let subject = 'New Submission from Atzengold';
    let html = '';

    if (type === 'newsletter') {
      subject = 'Atzengold Newsletter Subscription';
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: #0b3d2c;">Prost! Willkommen im Atzengold Verteiler!</h2>
          <p>Es gibt eine neue Newsletter-Anmeldung von:</p>
          ${name ? `<p><strong>Vorname:</strong> ${name}</p>` : ''}
          <p><strong>E-Mail:</strong> <a href="mailto:${email}">${email}</a></p>
          ${plz ? `<p><strong>PLZ:</strong> ${plz}</p>` : ''}
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">Diese E-Mail wurde automatisch über das Atzengold-Webportal gesendet.</p>
        </div>
      `;
    } else if (type === 'b2b') {
      subject = `Atzengold B2B Anfrage: ${company || name}`;
      const itemsList = items && Array.isArray(items) 
        ? `<ul>${items.map((it: any) => `<li>${it}</li>`).join('')}</ul>` 
        : 'Keine Angabe';
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: #0b3d2c; border-bottom: 2px solid #0b3d2c; padding-bottom: 10px;">Neue B2B Portal-Anfrage</h2>
          <p><strong>Name:</strong> ${name || 'N/A'}</p>
          <p><strong>Unternehmen:</strong> ${company || 'N/A'}</p>
          <p><strong>E-Mail:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Nachricht/Anmerkung:</strong></p>
          <blockquote style="background: #f9f9f9; border-left: 5px solid #0b3d2c; padding: 10px 15px; margin: 10px 0;">
            ${message || 'Keine Nachricht hinterlassen'}
          </blockquote>
          <p><strong>Interessierte Produkte/Dienstleistungen:</strong></p>
          ${itemsList}
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">Diese E-Mail wurde automatisch über das Atzengold-Webportal gesendet.</p>
        </div>
      `;
    } else {
      subject = `Atzengold Portal Kontakt: ${name || email}`;
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: #0b3d2c;">Neue Kontaktanfrage</h2>
          <p><strong>Name:</strong> ${name || 'N/A'}</p>
          <p><strong>E-Mail:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Nachricht:</strong></p>
          <blockquote style="background: #f9f9f9; border-left: 5px solid #0b3d2c; padding: 10px 15px; margin: 10px 0;">
            ${message || 'Keine Nachricht hinterlassen'}
          </blockquote>
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">Diese E-Mail wurde automatisch über das Atzengold-Webportal gesendet.</p>
        </div>
      `;
    }

    const recipient = process.env.CONTACT_EMAIL || 'gp@atzengold.net';

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Atzengold Portal <onboarding@resend.dev>',
        to: recipient,
        subject: subject,
        html: html
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API response error:', data);
      return res.status(response.status).json({ error: 'Failed to send email via Resend' });
    }

    return res.status(200).json({ success: true, id: (data as any).id });
  } catch (error: any) {
    respondError(res, error, 'Failed to send email');
  }
}
