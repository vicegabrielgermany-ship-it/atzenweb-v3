'use client';
import AdminCrud from './AdminCrud';

const FIELDS = [
  { key: 'name', label: 'Name', required: true },
  { key: 'role', label: 'Role', required: true },
  { key: 'text', label: 'Text (DE)', type: 'textarea' as const, required: true },
  { key: 'textEn', label: 'Text (EN)', type: 'textarea' as const, required: true },
  { key: 'image', label: 'Image', type: 'image' as const, imageConfig: { maxWidth: 400, maxHeight: 400, maxSizeKB: 100, hint: 'Recommended: 400×400px, square, ≤100KB. Auto-compressed to WebP.' } },
  { key: 'location', label: 'Location',
    options: [
      { label: 'Nürnberg', value: 'nurnberg' },
      { label: 'Fürth', value: 'furth' },
      { label: 'Berlin', value: 'berlin' },
      { label: 'Erlangen', value: 'erlangen' },
    ]
  },
];

export default function AdminTestimonials({ apiKey }: { apiKey: string }) {
  return (
    <AdminCrud
      endpoint="testimonials"
      apiKey={apiKey}
      title="Testimonials"
      fields={FIELDS}
      displayField="name"
      transformForSave={(form) => ({
        name: form.name,
        role: form.role,
        textDE: form.text,
        textEN: form.textEn,
        image: form.image || '',
        location: form.location || undefined,
      })}
      transformForForm={(item) => ({
        name: item.name,
        role: item.role,
        text: item.textDE || '',
        textEn: item.textEN || '',
        image: item.image || '',
        location: item.location || '',
      })}
    />
  );
}
