'use client';
import AdminCrud from './AdminCrud';

const FIELDS = [
  { key: 'id', label: 'ID', type: 'number' as const, required: true },
  { key: 'year', label: 'Year', required: true },
  { key: 'title', label: 'Title (DE)', required: true },
  { key: 'titleEn', label: 'Title (EN)', required: true },
  { key: 'text', label: 'Text (DE)', type: 'textarea' as const, required: true },
  { key: 'textEn', label: 'Text (EN)', type: 'textarea' as const, required: true },
  { key: 'tagline', label: 'Tagline (DE)' },
  { key: 'taglineEn', label: 'Tagline (EN)' },
  { key: 'image', label: 'Icon Name / Image', type: 'image' as const, imageConfig: { maxWidth: 1200, maxHeight: 800, maxSizeKB: 100, hint: 'Recommended: 1200×800px landscape, ≤100KB. Auto-compressed to WebP.' } },
];

export default function AdminStory({ apiKey }: { apiKey: string }) {
  return (
    <AdminCrud
      endpoint="story"
      apiKey={apiKey}
      title="Story Nodes"
      fields={FIELDS}
      displayField="title"
      idField="id"
    />
  );
}
