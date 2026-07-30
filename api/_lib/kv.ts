import crypto from 'node:crypto';
import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

if (!process.env.ADMIN_API_KEY) throw new Error('ADMIN_API_KEY env var required');
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

export function requireAuth(req: VercelRequest, res: VercelResponse): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  const token = authHeader.slice(7);
  if (token.length !== ADMIN_API_KEY.length) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  try {
    const valid = crypto.timingSafeEqual(Buffer.from(token), Buffer.from(ADMIN_API_KEY));
    if (!valid) throw new Error();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

export function setCors(res: VercelResponse, origin?: string) {
  const allowedOrigin = origin || process.env.APP_URL || 'http://localhost:3000';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
}

export function respondError(res: VercelResponse, err: unknown, message = 'Internal Server Error') {
  console.error('API Error:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: message });
  }
}

export interface ApiHandler {
  (req: VercelRequest, res: VercelResponse): Promise<void>;
}

export function createHandler(handlers: Record<string, ApiHandler>) {
  return async (req: VercelRequest, res: VercelResponse) => {
    setCors(res, req.headers.origin as string | undefined);
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    const handler = handlers[req.method || 'GET'];
    if (!handler) {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }
    try {
      await handler(req, res);
    } catch (err: any) {
      respondError(res, err, 'Internal Server Error');
    }
  };
}

export function listKey(collection: string) {
  return `ag:${collection}:all`;
}

export function itemKey(collection: string, id: string) {
  return `ag:${collection}:${id}`;
}

export async function getCollection<T>(collection: string): Promise<T[]> {
  const keys = await kv.smembers(listKey(collection));
  if (!keys.length) return [];
  const items = await kv.mget(...keys);
  return items.filter((i): i is T => i !== null && i !== undefined);
}

export async function getItem<T>(collection: string, id: string): Promise<T | null> {
  return kv.get<T>(itemKey(collection, id));
}

export async function saveItem(collection: string, id: string, data: any): Promise<void> {
  await kv.set(itemKey(collection, id), data);
  await kv.sadd(listKey(collection), itemKey(collection, id));
}

export async function deleteItem(collection: string, id: string): Promise<void> {
  await kv.del(itemKey(collection, id));
  await kv.srem(listKey(collection), itemKey(collection, id));
}

export function generateId(): string {
  return crypto.randomUUID();
}
