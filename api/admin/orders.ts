import { createHandler, requireAuth, getCollection, getItem, saveItem, deleteItem, generateId } from '../_lib/kv.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const COLLECTION = 'orders';

export default createHandler({
  async GET(req, res) {
    if (!requireAuth(req, res)) return;
    const { id } = req.query;
    if (id && typeof id === 'string') {
      const item = await getItem<any>(COLLECTION, id);
      if (!item) { res.status(404).json({ error: 'Not found' }); return; }
      res.json(item);
    } else {
      const items = await getCollection<any>(COLLECTION);
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      res.json(items);
    }
  },

  async POST(req, res) {
    if (!requireAuth(req, res)) return;
    const body = req.body;
    const id = body.id || generateId();
    const item = { ...body, id };
    await saveItem(COLLECTION, id, item);
    res.status(201).json(item);
  },

  async PUT(req, res) {
    if (!requireAuth(req, res)) return;
    const { id } = req.query;
    if (!id || typeof id !== 'string') { res.status(400).json({ error: 'id required' }); return; }
    const existing = await getItem<any>(COLLECTION, id);
    if (!existing) { res.status(404).json({ error: 'Not found' }); return; }
    const updated = { ...existing, ...req.body, id };
    await saveItem(COLLECTION, id, updated);
    res.json(updated);
  },

  async DELETE(req, res) {
    if (!requireAuth(req, res)) return;
    const { id } = req.query;
    if (!id || typeof id !== 'string') { res.status(400).json({ error: 'id required' }); return; }
    await deleteItem(COLLECTION, id);
    res.json({ success: true });
  }
});
