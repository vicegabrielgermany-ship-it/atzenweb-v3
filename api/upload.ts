import { put } from '@vercel/blob';
import { requireAuth, setCors, respondError } from './_lib/kv.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import sharp from 'sharp';

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

  if (!requireAuth(req, res)) return;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    res.status(500).json({ error: 'Vercel Blob not configured. Create a Blob store in Vercel dashboard and run `vercel env pull .env.local`.' });
    return;
  }

  try {
    const { file, name, mime } = req.body;
    if (!file || typeof file !== 'string') {
      res.status(400).json({ error: 'file (base64) required' });
      return;
    }

    const maxBytes = 5 * 1024 * 1024;
    const decodedLength = Math.ceil(file.length * 3 / 4);
    if (decodedLength > maxBytes) {
      res.status(400).json({ error: 'File exceeds 5MB limit' });
      return;
    }

    let buf = Buffer.from(file, 'base64');
    let contentType = mime || 'image/png';

    const ext = name?.split('.').pop()?.toLowerCase() || 'png';

    if (['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/tiff'].includes(contentType)) {
      let img = sharp(buf).rotate();

      if (contentType === 'image/jpeg') {
        img = img.flatten({ background: { r: 255, g: 255, b: 255 } });
      }

      const metadata = await img.metadata();
      const maxW = 800;
      const maxH = 800;

      if ((metadata.width && metadata.width > maxW) || (metadata.height && metadata.height > maxH)) {
        img = img.resize({ width: Math.min(metadata.width || maxW, maxW), height: Math.min(metadata.height || maxH, maxH), fit: 'inside', withoutEnlargement: true });
      }

      let quality = 80;
      let compressed: Buffer;

      for (let attempt = 0; attempt < 5; attempt++) {
        compressed = await img.webp({ quality }).toBuffer();
        if (compressed.length <= 100 * 1024) break;
        quality = Math.max(quality - 15, 10);
      }

      buf = compressed;
      contentType = 'image/webp';
    }

    const finalExt = contentType === 'image/webp' ? 'webp' : ext;
    const blob = await put(`atzengold/${Date.now()}.${finalExt}`, buf, {
      contentType,
      access: 'public',
    });

    res.json({ url: blob.url });
  } catch (err: any) {
    respondError(res, err, 'Upload failed');
  }
}
