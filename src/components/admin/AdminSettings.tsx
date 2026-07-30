'use client';
import { useState, useEffect } from 'react';
import { getCollection, updateItem } from '../../lib/admin-api';
import Eye from 'lucide-react/dist/esm/icons/eye';
import EyeOff from 'lucide-react/dist/esm/icons/eye-off';
import Key from 'lucide-react/dist/esm/icons/key';

const EDITOR_ENDPOINT = 'settings';

interface ApiKeyField {
  key: string;
  label: string;
  placeholder: string;
}

const FIELDS: ApiKeyField[] = [
  { key: 'resendApiKey', label: 'Resend API Key', placeholder: 're_...' },
  { key: 'instagramAccessToken', label: 'Instagram Access Token', placeholder: 'EAAC...' },
  { key: 'deeplApiKey', label: 'DeepL API Key', placeholder: 'DeepL-Auth-Key...' },
  { key: 'stripeSecretKey', label: 'Stripe Secret Key', placeholder: 'sk_live_...' },
  { key: 'stripePublishableKey', label: 'Stripe Publishable Key', placeholder: 'pk_live_...' },
];

export default function AdminSettings({ apiKey }: { apiKey: string }) {
  const [settings, setSettings] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  const load = async () => {
    try {
      const data = await getCollection(EDITOR_ENDPOINT, apiKey);
      setSettings(data);
    } catch {
      setSettings({ resendApiKey: '', stripeSecretKey: '', stripePublishableKey: '' });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateItem(EDITOR_ENDPOINT, 'main', settings, apiKey);
    } catch {}
    setSaving(false);
  };

  const updateField = (field: string, value: string) => {
    setSettings({ ...settings, [field]: value });
  };

  const toggleVisibility = (field: string) => {
    setVisible(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) return <p className="text-sm text-ink-secondary dark:text-canvas/60 font-mono">Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-black uppercase tracking-tight text-ink dark:text-canvas mb-2">
        API Settings
      </h2>
      <p className="text-sm text-ink-secondary dark:text-canvas/60 mb-6 font-mono">
        Manage third-party API keys. Stored securely in Vercel KV.
      </p>

      <div className="border border-ink/10 dark:border-canvas/10 rounded-2xl p-6 bg-canvas dark:bg-brand-dark-900 mb-6">
        <h3 className="font-bold text-ink dark:text-canvas mb-4 flex items-center gap-2">
          <Key className="w-4 h-4" />
          API Keys
        </h3>
        <p className="text-xs text-ink-secondary dark:text-canvas/50 mb-4">
          Keys are stored in Vercel KV and read by serverless functions at runtime.
          No env var re-deploy needed after updating here.
        </p>

        {FIELDS.map(field => (
          <div key={field.key} className="mb-4 pb-4 border-b border-ink/5 dark:border-canvas/5 last:border-0 last:pb-0 last:mb-0">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-secondary dark:text-canvas/60 mb-1">
              {field.label}
            </label>
            <div className="relative">
              <input
                type={visible[field.key] ? 'text' : 'password'}
                value={settings?.[field.key] || ''}
                onChange={e => updateField(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-transparent border border-ink/20 dark:border-canvas/20 rounded-xl px-3 py-2 pr-10 text-sm font-mono focus:outline-none focus:border-accent transition-colors text-ink dark:text-canvas"
              />
              <button
                type="button"
                onClick={() => toggleVisibility(field.key)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-secondary dark:text-canvas/50 hover:text-accent transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {visible[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border border-ink/10 dark:border-canvas/10 rounded-2xl p-6 bg-canvas dark:bg-brand-dark-900 mb-6">
        <h3 className="font-bold text-ink dark:text-canvas mb-2">Usage</h3>
        <ul className="text-xs text-ink-secondary dark:text-canvas/50 space-y-1 list-disc list-inside">
          <li><strong className="text-ink dark:text-canvas">Resend</strong> — Powers the Newsletter &amp; B2B contact form email delivery</li>
          <li><strong className="text-ink dark:text-canvas">Instagram</strong> — Powers the Instagram feed widget on the homepage</li>
          <li><strong className="text-ink dark:text-canvas">DeepL</strong> — Auto-translates German to British English in the Translations editor</li>
          <li><strong className="text-ink dark:text-canvas">Stripe</strong> — Payment processing for merch shop checkout</li>
        </ul>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-accent text-on-accent px-5 py-2 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-accent-hover transition-colors disabled:opacity-40 cursor-pointer"
      >
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
}
