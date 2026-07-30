'use client';
import React from 'react';

interface SidebarLink {
  id: string;
  label: string;
}

const SIDEBAR_LINKS: SidebarLink[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'venues', label: 'Venues' },
  { id: 'story', label: 'Story' },
  { id: 'merch', label: 'Merch' },
  { id: 'orders', label: 'Orders' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'beer-profile', label: 'Beer Profile' },
  { id: 'brandhub', label: 'Brand Hub' },
  { id: 'brand-guidelines', label: 'Brand Guidelines' },
  { id: 'translations', label: 'Translations' },
  { id: 'settings', label: 'Settings' },
];

interface AdminLayoutProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function AdminLayout({ activeSection, onNavigate, onLogout, children }: AdminLayoutProps) {
  return (
    <div className="fixed inset-0 z-50 flex bg-canvas dark:bg-primary-deep">
      <aside className="w-56 bg-ink text-canvas flex flex-col p-4 shrink-0">
        <div className="text-lg font-black uppercase tracking-tight mb-6 px-2">
          AG <span className="text-accent">CMS</span>
        </div>
        <nav className="flex-1 space-y-1">
          {SIDEBAR_LINKS.map(link => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeSection === link.id
                  ? 'bg-accent text-on-accent'
                  : 'text-canvas/70 hover:text-canvas hover:bg-canvas/10'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <button
          onClick={onLogout}
          className="text-sm text-canvas/50 hover:text-canvas transition-colors cursor-pointer px-3 py-2"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
