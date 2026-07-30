'use client';

export default function AdminDashboard({ onNavigate }: { onNavigate?: (section: string) => void }) {
  const collections = [
    { name: 'Venues', count: '—', desc: 'Stockist & gastronomy locations', section: 'venues' },
    { name: 'Story', count: '5', desc: 'Brand narrative timeline nodes', section: 'story' },
    { name: 'Merch', count: '5', desc: 'Shop merchandise items', section: 'merch' },
    { name: 'Orders', count: '—', desc: 'Customer orders & status management', section: 'orders' },
    { name: 'Testimonials', count: '18', desc: 'Customer reviews (DE + EN)', section: 'testimonials' },
    { name: 'Beer Profile', count: '—', desc: 'Flavor gauges & characteristics', section: 'beer-profile' },
    { name: 'Brand Hub', count: '—', desc: 'Colors, values, tone guidelines', section: 'brandhub' },
    { name: 'Translations', count: '—', desc: 'DE → EN-GB with auto-translate & manual overrides', section: 'translations' },
    { name: 'Brand Guidelines', count: '—', desc: 'Full brand guidelines viewer', section: 'brand-guidelines' },
    { name: 'Settings', count: '—', desc: 'API keys (Resend, DeepL, Stripe)', section: 'settings' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-black uppercase tracking-tight text-ink dark:text-canvas mb-2">
        Dashboard
      </h1>
      <p className="text-sm text-ink-secondary dark:text-canvas/60 mb-8 font-mono">
        Manage your Atzengold content
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map(col => (
          <button
            key={col.name}
            onClick={() => onNavigate?.(col.section)}
            className="text-left border border-ink/10 dark:border-canvas/10 rounded-2xl p-6 bg-canvas dark:bg-brand-dark-900 hover:border-accent/40 dark:hover:border-accent/40 transition-colors cursor-pointer"
          >
            <div className="text-2xl font-black text-accent mb-1">{col.count}</div>
            <h3 className="font-bold text-ink dark:text-canvas">{col.name}</h3>
            <p className="text-xs text-ink-secondary dark:text-canvas/50 mt-1">{col.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
