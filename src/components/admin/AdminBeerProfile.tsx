'use client';
import { useState, useEffect } from 'react';
import { getCollection, updateItem } from '../../lib/admin-api';

const EDITOR_ENDPOINT = 'beer-profile';

export default function AdminBeerProfile({ apiKey }: { apiKey: string }) {
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await getCollection(EDITOR_ENDPOINT, apiKey);
      setProfile(data);
    } catch {
      setProfile(null);
    }
  };

  useEffect(() => { load(); }, []);

  const updateGauge = (idx: number, field: string, value: any) => {
    if (!profile) return;
    const gauges = [...(profile.gauges || [])];
    gauges[idx] = { ...gauges[idx], [field]: value };
    setProfile({ ...profile, gauges });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateItem(EDITOR_ENDPOINT, 'main', profile, apiKey);
    } catch {}
    setSaving(false);
  };

  if (!profile) return <p className="text-sm text-ink-secondary dark:text-canvas/60 font-mono">Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-black uppercase tracking-tight text-ink dark:text-canvas mb-6">
        Beer Profile
      </h2>

      <div className="border border-ink/10 dark:border-canvas/10 rounded-2xl p-6 bg-canvas dark:bg-brand-dark-900 mb-6">
        <h3 className="font-bold text-ink dark:text-canvas mb-4">Characteristics</h3>
        <div className="grid grid-cols-3 gap-4">
          {profile.characteristics?.map((c: any, i: number) => (
            <div key={i}>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-secondary dark:text-canvas/60 mb-1">
                {c.label || c.key}
              </label>
              <input
                value={profile.characteristics[i]?.value || ''}
                onChange={e => {
                  const ch = [...(profile.characteristics || [])];
                  ch[i] = { ...ch[i], value: e.target.value };
                  setProfile({ ...profile, characteristics: ch });
                }}
                className="w-full bg-transparent border border-ink/20 dark:border-canvas/20 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent transition-colors text-ink dark:text-canvas"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border border-ink/10 dark:border-canvas/10 rounded-2xl p-6 bg-canvas dark:bg-brand-dark-900 mb-6">
        <h3 className="font-bold text-ink dark:text-canvas mb-4">Flavor Gauges</h3>
        {profile.gauges?.map((g: any, i: number) => (
          <div key={i} className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-ink/5 dark:border-canvas/5 last:border-0">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-secondary dark:text-canvas/60 mb-1">
                Label
              </label>
              <input
                value={g.label}
                onChange={e => updateGauge(i, 'label', e.target.value)}
                className="w-full bg-transparent border border-ink/20 dark:border-canvas/20 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent transition-colors text-ink dark:text-canvas"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-secondary dark:text-canvas/60 mb-1">
                Target Value
              </label>
              <input
                type="number"
                value={g.targetValue}
                onChange={e => updateGauge(i, 'targetValue', Number(e.target.value))}
                className="w-full bg-transparent border border-ink/20 dark:border-canvas/20 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent transition-colors text-ink dark:text-canvas"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-secondary dark:text-canvas/60 mb-1">
                Color Class
              </label>
              <input
                value={g.colorClass}
                onChange={e => updateGauge(i, 'colorClass', e.target.value)}
                className="w-full bg-transparent border border-ink/20 dark:border-canvas/20 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent transition-colors text-ink dark:text-canvas"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-accent text-on-accent px-5 py-2 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-accent-hover transition-colors disabled:opacity-40 cursor-pointer"
      >
        {saving ? 'Saving...' : 'Save Profile'}
      </button>
    </div>
  );
}
