const BACKEND_KEY = 'translations';

export default {
  type: 'backend',
  init: () => {},
  read: async (language: string, _namespace: string, callback: (error: any, result: any) => void) => {
    try {
      const res = await fetch(`/api/admin/${BACKEND_KEY}`);
      const overrides: Record<string, any> = res.ok ? await res.json() : {};

      const baseRes = await fetch(`/locales/${language}/translation.json`);
      const base: Record<string, string> = baseRes.ok ? await baseRes.json() : {};

      const merged: Record<string, string> = { ...base };
      for (const [key, val] of Object.entries(overrides)) {
        if (language === 'de' && val.de) merged[key] = val.de;
        else if (language === 'en' && val.en) merged[key] = val.en;
      }

      callback(null, merged);
    } catch (err) {
      callback(err, null);
    }
  },
  create: () => {},
};
