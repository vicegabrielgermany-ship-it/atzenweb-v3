const BASE = '/api/admin';

function headers(apiKey?: string): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (apiKey) h['Authorization'] = `Bearer ${apiKey}`;
  return h;
}

export async function getCollection(endpoint: string, apiKey?: string) {
  const res = await fetch(`${BASE}/${endpoint}`, { headers: headers(apiKey) });
  if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.statusText}`);
  return res.json();
}

export async function getItem(endpoint: string, id: string, apiKey?: string) {
  const res = await fetch(`${BASE}/${endpoint}?id=${id}`, { headers: headers(apiKey) });
  if (!res.ok) throw new Error(`GET ${endpoint}/${id} failed`);
  return res.json();
}

export async function createItem(endpoint: string, data: any, apiKey?: string) {
  const res = await fetch(`${BASE}/${endpoint}`, {
    method: 'POST',
    headers: headers(apiKey),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`POST ${endpoint} failed`);
  return res.json();
}

export async function updateItem(endpoint: string, id: string, data: any, apiKey?: string) {
  const res = await fetch(`${BASE}/${endpoint}?id=${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: headers(apiKey),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`PUT ${endpoint}/${id} failed`);
  return res.json();
}

export async function deleteItem(endpoint: string, id: string, apiKey?: string) {
  const res = await fetch(`${BASE}/${endpoint}?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: headers(apiKey),
  });
  if (!res.ok) throw new Error(`DELETE ${endpoint}/${id} failed`);
  return res.json();
}
