import { createHandler, requireAuth } from '../_lib/kv.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

const BRANDHUB_KEY = 'ag:brandhub';

export default createHandler({
  async GET(req, res) {
    if (!requireAuth(req, res)) return;
    const data = await kv.get(BRANDHUB_KEY);
    res.json(data || defaultBrandHub());
  },

  async PUT(req, res) {
    if (!requireAuth(req, res)) return;
    const existing: any = (await kv.get(BRANDHUB_KEY)) || defaultBrandHub();
    const updated = { ...existing, ...req.body };
    await kv.set(BRANDHUB_KEY, updated);
    res.json(updated);
  }
});

function defaultBrandHub() {
  return {
    colors: [
      { name: 'Atzen Gold', role: 'Primary Brand Accent & Warmth', hex: 'oklch(0.75 0.15 85.0)', rgb: 'rgb(212, 175, 55)', cmyk: 'C0 M17 Y74 M17', usage: 'Buttons, links, highlights, decorative accents', textColor: 'text-ink', bgColor: 'bg-accent' },
      { name: 'Deep Forest', role: 'Primary Background (Dark Mode)', hex: 'oklch(0.25 0.06 150.0)', rgb: 'rgb(26, 47, 35)', cmyk: 'C45 M0 M26 M82', usage: 'Main background, menu overlays', textColor: 'text-canvas', bgColor: 'bg-primary-deep' },
      { name: 'Buttermilk Canvas', role: 'Primary Background (Light Mode)', hex: 'oklch(0.96 0.02 90.0)', rgb: 'rgb(245, 243, 235)', cmyk: 'C0 M1 M4 M4', usage: 'Main background in light mode', textColor: 'text-ink', bgColor: 'bg-canvas' },
      { name: 'Ink Black', role: 'Primary Text', hex: 'oklch(0.15 0.01 150.0)', rgb: 'rgb(25, 28, 25)', cmyk: 'C0 M0 M0 M90', usage: 'Body text, headings', textColor: 'text-canvas', bgColor: 'bg-ink' },
      { name: 'Berlin Magenta', role: 'Secondary Accent', hex: '#B83A3D', rgb: 'rgb(184, 58, 61)', cmyk: 'C0 M68 M67 M28', usage: 'Social media, restricted badges, small accents', textColor: 'text-canvas', bgColor: 'bg-magenta' }
    ],
    values: [
      { title: 'Mission & Dream', description: 'Bringing Franconian Kellerbier into Berlin urban street culture by creating a genuine bridge between traditional Bavarian craftsmanship and the diversity of the city.' },
      { title: 'Brand Personality', description: 'Bold, authentic, unfiltered. A friend you can rely on with a rough exterior and a warm core. Urban meets rural. Heritage with a modern edge.' },
      { title: 'Target Audience', description: 'Beer lovers 25-45 who value quality craftsmanship, cultural authenticity, and consciously local connections.' }
    ],
    coreValues: [
      { title: 'Heritage Honesty', description: 'We respect traditional Franconian purity laws and cooperatively use centuries-old brewery capacities.' },
      { title: 'Cultural Autonomy', description: 'We stay independent. No big corporation dictates our ingredients, prices, or brand voice.' },
      { title: 'Radical Transparency', description: 'We show exactly where our beer is brewed, by whom, and at what cost percentage stays local.' }
    ]
  };
}
