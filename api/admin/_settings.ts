import { createHandler, requireAuth } from '../_lib/kv.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

const SETTINGS_KEY = 'ag:settings';

export default createHandler({
  async GET(req, res) {
    if (!requireAuth(req, res)) return;
    const settings = await kv.get(SETTINGS_KEY);
    res.json(settings || defaultSettings());
  },

  async PUT(req, res) {
    if (!requireAuth(req, res)) return;
    const existing: any = (await kv.get(SETTINGS_KEY)) || defaultSettings();
    const updated = { ...existing, ...req.body };
    await kv.set(SETTINGS_KEY, updated);
    res.json(updated);
  }
});

function defaultSettings() {
  return {
    resendApiKey: '',
    stripeSecretKey: '',
    stripePublishableKey: '',
    instagramAccessToken: '',
    deeplApiKey: '',
  };
}
