import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { respondError } from './_lib/kv.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

const SETTINGS_KEY = 'ag:settings';

async function getStripeKey(): Promise<string | null> {
  let settings: any = null;
  try {
    settings = await kv.get(SETTINGS_KEY);
  } catch {
    // KV not configured (e.g. Admin disabled) — fall back to env var below
  }
  return settings?.stripeSecretKey || process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY || null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const stripeKey = await getStripeKey();
    if (!stripeKey) {
      res.status(400).json({ error: 'Stripe not configured' });
      return;
    }

    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(stripeKey);

    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      respondError(res, new Error('STRIPE_WEBHOOK_SECRET not configured'), 'Webhook not configured');
      return;
    }

    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    const buf = Buffer.concat(chunks);

    let event: any;
    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch {
      res.status(400).json({ error: 'Invalid signature' });
      return;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        const existing: any = await kv.get(`ag:orders:${orderId}`);
        if (existing) {
          existing.status = 'paid';
          existing.stripePaymentIntentId = session.payment_intent;
          await kv.set(`ag:orders:${orderId}`, existing);
        }
      }
    }

    res.json({ received: true });
  } catch (err: any) {
    respondError(res, err, 'Webhook processing failed');
  }
}
