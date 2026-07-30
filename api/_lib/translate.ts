import { kv } from '@vercel/kv';

const SETTINGS_KEY = 'ag:settings';

function getBaseUrl(apiKey: string): string {
  return apiKey.endsWith(':fx') ? 'https://api-free.deepl.com/v2' : 'https://api.deepl.com/v2';
}

export async function translateDEtoENGB(text: string): Promise<string | null> {
  try {
    const settings: any = await kv.get(SETTINGS_KEY);
    const apiKey = settings?.deeplApiKey;
    if (typeof apiKey !== 'string' || !apiKey) return null;

    const baseUrl = getBaseUrl(apiKey);
    const res = await fetch(`${baseUrl}/translate`, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        source_lang: 'DE',
        target_lang: 'EN-GB',
      }),
    });

    if (!res.ok) {
      console.error('DeepL API error:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return data?.translations?.[0]?.text ?? null;
  } catch (err) {
    console.error('DeepL translate error:', err);
    return null;
  }
}
