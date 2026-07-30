import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateId, setCors, respondError } from './_lib/kv.js';
import Stripe from 'stripe';

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
  setCors(res, req.headers.origin as string | undefined);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const stripeKey = await getStripeKey();
    if (!stripeKey) {
      res.status(400).json({ error: 'Stripe not configured. Add Stripe Secret Key in Admin > Settings.' });
      return;
    }

    const { items, customer, email } = req.body;

    if (!items?.length || !customer?.name || !customer?.email) {
      res.status(400).json({ error: 'Missing items or customer information' });
      return;
    }

    const stripe = new Stripe(stripeKey);

    const lineItems = items.map((cartItem: any) => {
      const unitAmount = Math.round((cartItem.item.promoPrice || cartItem.item.price) * 100);
      const description = cartItem.selectedSize
        ? `Size: ${cartItem.selectedSize}`
        : cartItem.selectedOptions
        ? Object.entries(cartItem.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(', ')
        : undefined;

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: cartItem.item.name,
            description,
          },
          unit_amount: unitAmount,
        },
        quantity: cartItem.quantity,
      };
    });

    const orderId = generateId();
    const appUrl = process.env.APP_URL || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: email || customer.email,
      success_url: `${appUrl}/#checkout/success?order=${orderId}`,
      cancel_url: `${appUrl}/#checkout/cancel`,
      shipping_address_collection: { allowed_countries: ['DE'] },
      locale: 'de',
      metadata: { orderId },
    });

    const subtotal = items.reduce((acc: number, ci: any) => {
      return acc + ((ci.item.promoPrice || ci.item.price) * ci.quantity);
    }, 0);
    const shipping = 0; // Versand ist in allen Produktpreisen inklusive
    const total = subtotal + shipping;

    const order = {
      id: orderId,
      items: items.map((ci: any) => ({
        itemId: ci.item.id,
        name: ci.item.name,
        quantity: ci.quantity,
        price: ci.item.promoPrice || ci.item.price,
        options: ci.selectedOptions || (ci.selectedSize ? { Size: ci.selectedSize } : undefined),
      })),
      subtotal,
      shipping,
      total,
      customer: {
        name: customer.name,
        email: customer.email,
        address: customer.address,
        city: customer.city,
        zip: customer.zip,
      },
      status: 'pending',
      stripeSessionId: session.id,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`ag:orders:${orderId}`, order);
    await kv.sadd('ag:orders:all', `ag:orders:${orderId}`);

    res.json({ url: session.url, sessionId: session.id, orderId });
  } catch (err: any) {
    respondError(res, err, 'Checkout failed');
  }
}
