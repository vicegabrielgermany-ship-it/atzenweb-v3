'use client';
import React, { useState, useEffect } from 'react';
import { getCollection, updateItem } from '../../lib/admin-api';

const EDITOR_ENDPOINT = 'brandhub';

const DEFAULT_BRANDHUB = {
  colors: [
    { name: 'Amber Gold', role: 'Accent — Decorative Only', hex: 'oklch(0.65 0.15 75.0)', rgb: 'rgb(211, 139, 13)', cmyk: 'C0 M34 M94 M17', usage: 'Borders, dividers, icons, decorative highlights (not body text)', textColor: 'text-ink', bgColor: 'bg-accent' },
    { name: 'Deep Forest', role: 'Dark Mode Canvas', hex: 'oklch(0.07 0.05 165.0)', rgb: 'rgb(0, 43, 20)', cmyk: 'C100 M0 M53 M83', usage: 'Dark mode background — AAA 7:1 with cream text', textColor: 'text-canvas', bgColor: 'bg-primary-deep' },
    { name: 'Warm Beige', role: 'Light Mode Canvas', hex: 'oklch(0.85 0.04 75.0)', rgb: 'rgb(237, 206, 167)', cmyk: 'C0 M13 M30 M7', usage: 'Light mode background (brand cream #edcea7)', textColor: 'text-ink', bgColor: 'bg-canvas' },
    { name: 'Ink', role: 'Primary Text (AAA)', hex: 'oklch(0.07 0.05 165.0)', rgb: 'rgb(0, 43, 20)', cmyk: 'C100 M0 M53 M83', usage: 'Body text — AAA 7:1 on cream canvas', textColor: 'text-canvas', bgColor: 'bg-ink' },
    { name: 'Berlin Magenta', role: 'Secondary Accent', hex: '#B83A3D', rgb: 'rgb(184, 58, 61)', cmyk: 'C0 M68 M67 M28', usage: 'Social media, restricted badges, small accents', textColor: 'text-canvas', bgColor: 'bg-magenta' },
  ],
  values: [
    { title: 'Mission & Dream', description: 'Bringing Franconian Kellerbier into Berlin urban street culture by creating a genuine bridge between traditional Bavarian craftsmanship and the diversity of the city.' },
    { title: 'Brand Personality', description: 'Bold, authentic, unfiltered. A friend you can rely on with a rough exterior and a warm core. Urban meets rural. Heritage with a modern edge.' },
    { title: 'Target Audience', description: 'Beer lovers 25-45 who value quality craftsmanship, cultural authenticity, and consciously local connections.' },
  ],
  coreValues: [
    { title: 'Heritage Honesty', description: 'We respect traditional Franconian purity laws and cooperatively use centuries-old brewery capacities.' },
    { title: 'Cultural Autonomy', description: 'We stay independent. No big corporation dictates our ingredients, prices, or brand voice.' },
    { title: 'Radical Transparency', description: 'We show exactly where our beer is brewed, by whom, and at what cost percentage stays local.' },
  ],
};

export default function AdminBrandHub({ apiKey }: { apiKey: string }) {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const d = await getCollection(EDITOR_ENDPOINT, apiKey);
      setData(d);
    } catch {
      setData(DEFAULT_BRANDHUB);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateItem(EDITOR_ENDPOINT, 'main', data, apiKey);
    } catch {}
    setSaving(false);
  };

  const updateField = (section: string, idx: number, field: string, value: any) => {
    if (!data) return;
    const arr = [...(data[section] || [])];
    arr[idx] = { ...arr[idx], [field]: value };
    setData({ ...data, [section]: arr });
  };

  if (loading) return <p className="text-sm text-ink-secondary dark:text-canvas/60 font-mono">Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-black uppercase tracking-tight text-ink dark:text-canvas mb-6">
        Brand Hub
      </h2>

      {/* Colors */}
      <Section title="Colors">
        {data.colors?.map((c: any, i: number) => (
          <div key={i} className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-ink/5 dark:border-canvas/5 last:border-0">
            <input value={c.name} onChange={e => updateField('colors', i, 'name', e.target.value)} placeholder="Name" className="input-field" />
            <input value={c.hex} onChange={e => updateField('colors', i, 'hex', e.target.value)} placeholder="Hex" className="input-field" />
            <input value={c.role} onChange={e => updateField('colors', i, 'role', e.target.value)} placeholder="Role" className="input-field col-span-2" />
            <input value={c.usage} onChange={e => updateField('colors', i, 'usage', e.target.value)} placeholder="Usage" className="input-field col-span-2" />
          </div>
        ))}
      </Section>

      {/* Values */}
      <Section title="Brand Values">
        {data.values?.map((v: any, i: number) => (
          <div key={i} className="mb-4 pb-4 border-b border-ink/5 dark:border-canvas/5 last:border-0">
            <input value={v.title} onChange={e => updateField('values', i, 'title', e.target.value)} placeholder="Title" className="input-field mb-2" />
            <textarea value={v.description} onChange={e => updateField('values', i, 'description', e.target.value)} placeholder="Description" className="input-field" rows={2} />
          </div>
        ))}
      </Section>

      {/* Core Values */}
      <Section title="Core Values">
        {data.coreValues?.map((v: any, i: number) => (
          <div key={i} className="mb-4 pb-4 border-b border-ink/5 dark:border-canvas/5 last:border-0">
            <input value={v.title} onChange={e => updateField('coreValues', i, 'title', e.target.value)} placeholder="Title" className="input-field mb-2" />
            <textarea value={v.description} onChange={e => updateField('coreValues', i, 'description', e.target.value)} placeholder="Description" className="input-field" rows={2} />
          </div>
        ))}
      </Section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-accent text-on-accent px-5 py-2 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-accent-hover transition-colors disabled:opacity-40 cursor-pointer"
      >
        {saving ? 'Saving...' : 'Save Brand Hub'}
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-ink/10 dark:border-canvas/10 rounded-2xl p-6 bg-canvas dark:bg-brand-dark-900 mb-6">
      <h3 className="font-bold text-ink dark:text-canvas mb-4">{title}</h3>
      {children}
    </div>
  );
}
