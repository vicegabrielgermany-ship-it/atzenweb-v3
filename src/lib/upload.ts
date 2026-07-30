export async function uploadImage(file: File, apiKey: string): Promise<string> {
  const buf = await file.arrayBuffer();
  const base64 = btoa(new Uint8Array(buf).reduce((s, b) => s + String.fromCharCode(b), ''));

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ file: base64, name: file.name, mime: file.type }),
  });

  if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
  const { url } = await res.json();
  return url;
}
