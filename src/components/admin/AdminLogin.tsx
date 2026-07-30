'use client';
import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: (key: string) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [key, setKey] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      setError(false);
      onLogin(key.trim());
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark-900/90 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-canvas dark:bg-brand-dark-900 border border-ink/10 dark:border-canvas/10 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-2xl font-black uppercase tracking-tight text-ink dark:text-canvas mb-2">
          Admin Login
        </h1>
        <p className="text-sm text-ink-secondary dark:text-canvas/60 mb-6 font-mono">
          Enter your admin API key
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={key}
            onChange={(e) => { setKey(e.target.value); setError(false); }}
            placeholder="••••••••••••••••"
            className="w-full bg-transparent border-2 border-ink/20 dark:border-canvas/20 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-accent transition-colors text-ink dark:text-canvas"
            autoFocus
          />
          {error && (
            <p className="text-xs text-red-500 font-mono">API key is required</p>
          )}
          <button
            type="submit"
            className="w-full bg-accent text-on-accent rounded-xl px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-accent-hover transition-colors cursor-pointer"
          >
            Access Panel
          </button>
        </form>
      </div>
    </div>
  );
}
