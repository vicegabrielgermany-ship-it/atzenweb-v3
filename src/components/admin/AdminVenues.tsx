'use client';
import AdminCrud from './AdminCrud';

const FIELDS = [
  { key: 'name', label: 'Name', required: true },
  { key: 'type', label: 'Type', type: 'select' as const, required: true,
    options: [
      { label: 'Supermarkt', value: 'Supermarkt' },
      { label: 'Späti', value: 'Späti' },
      { label: 'Getränkemarkt', value: 'Getränkemarkt' },
      { label: 'Biergarten', value: 'Biergarten' },
      { label: 'Kneipe', value: 'Kneipe' },
      { label: 'Bar', value: 'Bar' },
    ]
  },
  { key: 'isGastronomy', label: 'Gastronomy?', type: 'boolean' as const },
  { key: 'address', label: 'Address', required: true },
  { key: 'rating', label: 'Rating', type: 'text' as const },
  { key: 'isOpen', label: 'Open Now?', type: 'boolean' as const },
  { key: 'openingHours', label: 'Opening Hours' },
  { key: 'hasFood', label: 'Has Food?', type: 'boolean' as const },
  { key: 'dogFriendly', label: 'Dog Friendly?', type: 'boolean' as const },
];

export default function AdminVenues({ apiKey }: { apiKey: string }) {
  return (
    <AdminCrud
      endpoint="venues"
      apiKey={apiKey}
      title="Venues"
      fields={FIELDS}
      displayField="name"
      renderExtraFields={(form, updateForm) => (
        <div className="sm:col-span-2 border border-ink/10 dark:border-canvas/10 rounded-xl p-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-secondary dark:text-canvas/60 mb-3">
            Coordinates
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-secondary dark:text-canvas/60 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={form.longitude ?? ''}
                onChange={e => updateForm('longitude', Number(e.target.value))}
                className="w-full bg-transparent border border-ink/20 dark:border-canvas/20 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent transition-colors text-ink dark:text-canvas"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-secondary dark:text-canvas/60 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={form.latitude ?? ''}
                onChange={e => updateForm('latitude', Number(e.target.value))}
                className="w-full bg-transparent border border-ink/20 dark:border-canvas/20 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent transition-colors text-ink dark:text-canvas"
              />
            </div>
          </div>
        </div>
      )}
      transformForSave={(form) => ({
        name: form.name,
        type: form.type,
        isGastronomy: form.isGastronomy,
        address: form.address,
        distance: form.distance || 0,
        rating: form.rating || '0',
        isOpen: form.isOpen,
        openingHours: form.openingHours || '',
        hasFood: form.hasFood,
        dogFriendly: form.dogFriendly,
        longitude: Number(form.longitude),
        latitude: Number(form.latitude),
      })}
      transformForForm={(item) => ({
        ...item,
        longitude: item.longitude ?? '',
        latitude: item.latitude ?? '',
      })}
    />
  );
}
