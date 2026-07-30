import { createHandler, requireAuth } from '../_lib/kv.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

const PROFILE_KEY = 'ag:beer_profile';

export default createHandler({
  async GET(req, res) {
    if (!requireAuth(req, res)) return;
    const profile = await kv.get(PROFILE_KEY);
    res.json(profile || defaultProfile());
  },

  async PUT(req, res) {
    if (!requireAuth(req, res)) return;
    const existing: any = (await kv.get(PROFILE_KEY)) || defaultProfile();
    const updated = { ...existing, ...req.body };
    await kv.set(PROFILE_KEY, updated);
    res.json(updated);
  }
});

function defaultProfile() {
  return {
    abv: '5.2%',
    ibu: '22',
    color: '15 (Strohgelb)',
    originalWort: '12.8°P',
    gauges: [
      { label: 'Yeast Character', targetValue: 85, colorClass: 'bg-accent', textColorClass: 'text-accent' },
      { label: 'Hop Bitterness', targetValue: 60, colorClass: 'bg-ink', textColorClass: 'text-ink' },
      { label: 'Citrus Notes', targetValue: 45, colorClass: 'bg-primary', textColorClass: 'text-primary' }
    ],
    characteristics: [
      { key: 'brewAbv', label: 'ABV', value: '5.2%' },
      { key: 'brewUnfiltered', label: 'Style', value: 'Unfiltered' },
      { key: 'brewModel', label: 'Model', value: 'Cuckoo Brewing' }
    ]
  };
}
