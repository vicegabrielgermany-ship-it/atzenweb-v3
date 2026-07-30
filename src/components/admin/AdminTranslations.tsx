'use client';
import { useState, useEffect, useMemo } from 'react';
import { translations } from '../../constants/translations';
import type { TranslationOverride } from '../../types';

const TRANSLATIONS_KEY = 'translations';

interface AdminTranslationsProps {
  apiKey: string;
}

interface Entry {
  key: string;
  de: string;
  en: string;
  override?: TranslationOverride;
  dirty?: boolean;
  saving?: boolean;
}

export default function AdminTranslations({ apiKey }: AdminTranslationsProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const base = translations.de as unknown as Record<string, string>;
      const res = await fetch(`/api/admin/${TRANSLATIONS_KEY}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      const overrides: Record<string, TranslationOverride> = res.ok ? await res.json() : {};

      const all: Entry[] = Object.entries(base).map(([key, val]) => {
        const de = typeof val === 'string' ? val : '';
        const override = overrides[key];
        return {
          key,
          de,
          en: override?.en ?? (translations.en as any)[key] ?? '',
          override,
        };
      });

      all.sort((a, b) => a.key.localeCompare(b.key));
      setEntries(all);
    } catch {
      setEntries([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter(
      e => e.key.toLowerCase().includes(q) || e.de.toLowerCase().includes(q) || e.en.toLowerCase().includes(q)
    );
  }, [entries, search]);

  const updateField = (key: string, field: 'de' | 'en', value: string) => {
    setEntries(prev =>
      prev.map(e => (e.key === key ? { ...e, [field]: value, dirty: true } : e))
    );
  };

  const saveEntry = async (entry: Entry) => {
    setSaving(true);
    setEntries(prev => prev.map(e => (e.key === entry.key ? { ...e, saving: true } : e)));
    try {
      const prevOverride = entry.override;
      const deChanged = entry.de !== (prevOverride?.de ?? entry.de);
      const enManuallyEdited = entry.dirty && entry.en !== (prevOverride?.en ?? entry.en);
      const manualOverride = deChanged && enManuallyEdited;

      const res = await fetch(`/api/admin/${TRANSLATIONS_KEY}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          key: entry.key,
          de: entry.de,
          en: entry.en,
          manualOverride,
        }),
      });

      if (!res.ok) throw new Error('Save failed');

      const result = await res.json();
      setEntries(prev =>
        prev.map(e =>
          e.key === entry.key
            ? { ...e, override: { de: entry.de, en: result.en, autoTranslated: result.autoTranslated }, dirty: false, en: result.en, saving: false }
            : e
        )
      );
      setNotification(`Saved "${entry.key}"`);
    } catch {
      setNotification(`Failed to save "${entry.key}"`);
      setEntries(prev => prev.map(e => (e.key === entry.key ? { ...e, saving: false } : e)));
    }
    setSaving(false);
  };

  const autoTranslateAll = async () => {
    if (!confirm('Auto-translate all untranslated keys to British English? This will skip keys with manual overrides.')) return;
    setSaving(true);
    let count = 0;
    for (const entry of entries) {
      if (entry.override?.autoTranslated === false) continue;
      if (!entry.en || entry.en === entry.de) {
        await saveEntry(entry);
        count++;
      }
    }
    setSaving(false);
    setNotification(`Auto-translated ${count} keys`);
  };

  if (loading) {
    return <p className="text-sm text-ink-secondary dark:text-canvas/60 font-mono">Loading...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-black uppercase tracking-tight text-ink dark:text-canvas">Translations</h2>
        <button
          onClick={autoTranslateAll}
          disabled={saving}
          className="border border-ink/20 dark:border-canvas/20 text-ink dark:text-canvas px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-ink/5 dark:hover:bg-canvas/5 transition-colors disabled:opacity-40 cursor-pointer"
        >
          Auto-Translate All
        </button>
      </div>
      <p className="text-sm text-ink-secondary dark:text-canvas/60 mb-4 font-mono">
        German → British English. Edited fields are saved as manual overrides and won't be overwritten.
      </p>

      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search keys or text..."
          className="w-full max-w-md bg-transparent border border-ink/20 dark:border-canvas/20 rounded-xl px-4 py-2 text-sm font-mono focus:outline-none focus:border-accent transition-colors text-ink dark:text-canvas"
        />
      </div>

      <div className="border border-ink/10 dark:border-canvas/10 rounded-2xl overflow-hidden mb-6">
        <div className="grid grid-cols-[1fr_2fr_2fr_80px] gap-0 bg-ink/5 dark:bg-canvas/5 px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-secondary dark:text-canvas/60">
          <span>Key</span>
          <span>German (DE)</span>
          <span>British English (EN-GB)</span>
          <span className="text-center">Status</span>
        </div>
        <div className="divide-y divide-ink/5 dark:divide-canvas/5 max-h-[60vh] overflow-y-auto">
          {filtered.map(entry => {
            const isManual = entry.override?.autoTranslated === false;
            const isAuto = entry.override?.autoTranslated === true;
            const isPending = !entry.override;
            return (
              <div key={entry.key} className="grid grid-cols-[1fr_2fr_2fr_80px] gap-0 px-4 py-3 items-start hover:bg-ink/5 dark:hover:bg-canvas/5 transition-colors">
                <div className="text-xs font-mono text-ink-secondary dark:text-canvas/50 pt-2 truncate" title={entry.key}>
                  {entry.key}
                </div>
                <div className="pr-2">
                  <textarea
                    value={entry.de}
                    onChange={e => updateField(entry.key, 'de', e.target.value)}
                    rows={2}
                    className="w-full bg-transparent border border-ink/20 dark:border-canvas/20 rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-accent transition-colors text-ink dark:text-canvas resize-none"
                  />
                </div>
                <div className="pr-2">
                  <textarea
                    value={entry.en}
                    onChange={e => updateField(entry.key, 'en', e.target.value)}
                    rows={2}
                    className={`w-full bg-transparent border rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none transition-colors resize-none ${
                      isManual
                        ? 'border-accent/40 dark:border-accent/40 text-ink dark:text-canvas'
                        : 'border-ink/20 dark:border-canvas/20 text-ink dark:text-canvas'
                    }`}
                  />
                </div>
                <div className="flex flex-col items-center gap-1 pt-2">
                  {isManual && <span className="text-[10px] font-mono text-accent" title="Manually edited">★</span>}
                  {isAuto && <span className="text-[10px] font-mono text-ink-secondary dark:text-canvas/40" title="Auto-translated">☆</span>}
                  {isPending && <span className="text-[10px] font-mono text-ink-secondary dark:text-canvas/40" title="Not saved">—</span>}
                  <button
                    onClick={() => saveEntry(entry)}
                    disabled={saving || !entry.dirty}
                    className="text-[10px] font-mono uppercase tracking-wider text-accent hover:text-accent-hover transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {entry.saving ? '...' : 'Save'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-ink-secondary dark:text-canvas/50 font-mono">
        {entries.length} total · {filtered.length} shown · {entries.filter(e => e.override?.autoTranslated === false).length} manual overrides · {entries.filter(e => e.override?.autoTranslated === true).length} auto-translated · {entries.filter(e => !e.override).length} pending
      </p>

      {notification && (
        <div className="fixed bottom-6 right-6 bg-accent text-on-accent px-4 py-2 rounded-xl text-sm font-bold shadow-lg z-50 animate-fade-in">
          {notification}
          <button
            onClick={() => setNotification(null)}
            className="ml-3 text-on-accent/70 hover:text-on-accent cursor-pointer"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
