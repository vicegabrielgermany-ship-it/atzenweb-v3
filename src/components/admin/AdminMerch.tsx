'use client';
import AdminCrud from './AdminCrud';

const FIELDS = [
  { key: 'name', label: 'Name', required: true },
  { key: 'price', label: 'Price (€)', type: 'number' as const, required: true },
  { key: 'promoPrice', label: 'Promo Price (€)', type: 'number' as const },
  { key: 'description', label: 'Description', type: 'textarea' as const, required: true },
  { key: 'category', label: 'Category', type: 'select' as const, required: true,
    options: [
      { label: 'Apparel', value: 'Apparel' },
      { label: 'Drinkware', value: 'Drinkware' },
      { label: 'Accessory', value: 'Accessory' },
    ]
  },
  { key: 'images', label: 'Images', type: 'images' as const, imageConfig: { maxWidth: 800, maxHeight: 800, maxSizeKB: 100, hint: 'Recommended: 800×800px, ≤100KB. Auto-compressed to WebP. Upload multiple images for gallery.' } },
  { key: 'sizes', label: 'Sizes (comma-separated, e.g. S,M,L,XL)' },
  { key: 'inStock', label: 'In Stock?', type: 'boolean' as const },
];

export default function AdminMerch({ apiKey }: { apiKey: string }) {
  return (
    <AdminCrud
      endpoint="merch"
      apiKey={apiKey}
      title="Merchandise"
      fields={FIELDS}
      displayField="name"
      transformForSave={(form) => {
        const images = Array.isArray(form.images) ? form.images : (form.image ? [form.image] : []);
        return {
          name: form.name,
          price: Number(form.price),
          promoPrice: form.promoPrice ? Number(form.promoPrice) : undefined,
          description: form.description,
          category: form.category,
          image: images[0] || form.image || '',
          images,
          sizes: form.sizes ? form.sizes.split(',').map((s: string) => s.trim()).filter(Boolean) : undefined,
          inStock: form.inStock,
        };
      }}
      transformForForm={(item) => ({
        ...item,
        images: item.images || (item.image ? [item.image] : []),
        sizes: Array.isArray(item.sizes) ? item.sizes.join(', ') : item.sizes || '',
      })}
    />
  );
}
