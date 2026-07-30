import { createHandler, requireAuth } from '../_lib/kv.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import { translateDEtoENGB } from '../_lib/translate.js';

const TRANSLATIONS_KEY = 'ag:translations';

export default createHandler({
  async GET(req, res) {
    if (!requireAuth(req, res)) return;
    const overrides = await kv.get(TRANSLATIONS_KEY);
    res.json(overrides || {});
  },

  async PUT(req, res) {
    if (!requireAuth(req, res)) return;
    const existing: Record<string, any> = (await kv.get(TRANSLATIONS_KEY)) || {};
    const { key, de, en, manualOverride } = req.body;

    if (!key) {
      res.status(400).json({ error: 'Missing key' });
      return;
    }

    let newEn = en;
    if (!manualOverride) {
      const prev = existing[key];
      const deChanged = de !== prev?.de;
      const enWasAutoTranslated = prev?.autoTranslated !== false;

      if (deChanged && enWasAutoTranslated) {
        const translated = await translateDEtoENGB(de);
        if (translated) newEn = translated;
      }
    }

    existing[key] = { de, en: newEn, autoTranslated: !manualOverride };
    await kv.set(TRANSLATIONS_KEY, existing);
    res.json({ ok: true, key, en: newEn, autoTranslated: !manualOverride });
  },
});
