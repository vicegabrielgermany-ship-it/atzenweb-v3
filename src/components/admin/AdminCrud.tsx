'use client';
import React, { useState, useEffect, useRef } from 'react';
import { getCollection, createItem, updateItem, deleteItem } from '../../lib/admin-api';
import { uploadImage } from '../../lib/upload';

interface ImageFieldConfig {
  hint?: string;
  maxWidth?: number;
  maxHeight?: number;
  maxSizeKB?: number;
  accept?: string;
}

interface AdminCrudProps {
  endpoint: string;
  apiKey: string;
  title: string;
  fields: {
    key: string;
    label: string;
    type?: 'text' | 'number' | 'textarea' | 'boolean' | 'select' | 'image' | 'images';
    options?: { label: string; value: string }[];
    required?: boolean;
    imageConfig?: ImageFieldConfig;
  }[];
  idField?: string;
  displayField?: string;
  transformForSave?: (data: any) => any;
  transformForForm?: (item: any) => any;
  renderExtraFields?: (form: Record<string, any>, updateForm: (key: string, value: any) => void) => React.ReactNode;
}

export default function AdminCrud({ endpoint, apiKey, title, fields, idField = 'id', displayField, transformForSave, transformForForm, renderExtraFields }: AdminCrudProps) {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getCollection(endpoint, apiKey);
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => {
    const initial: Record<string, any> = {};
    fields.forEach(f => {
      if (f.type === 'boolean') initial[f.key] = false;
      else if (f.type === 'number') initial[f.key] = 0;
      else initial[f.key] = '';
    });
    setEditing(null);
    setForm(initial);
  };

  const openEdit = (item: any) => {
    const mapped = transformForForm ? transformForForm(item) : item;
    const initial: Record<string, any> = {};
    fields.forEach(f => {
      initial[f.key] = mapped[f.key] ?? '';
    });
    setEditing(item);
    setForm(initial);
  };

  const handleSave = async () => {
    const data = transformForSave ? transformForSave(form) : form;
    if (editing) {
      await updateItem(endpoint, editing[idField], data, apiKey);
    } else {
      await createItem(endpoint, data, apiKey);
    }
    setEditing(null);
    setForm({});
    await fetchItems();
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Delete ${item[displayField || 'name'] || item[idField]}?`)) return;
    await deleteItem(endpoint, item[idField], apiKey);
    await fetchItems();
  };

  const updateForm = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const [uploading, setUploading] = useState<string | null>(null);

  const handleImageUpload = async (key: string, file: File) => {
    setUploading(key);
    try {
      const url = await uploadImage(file, apiKey);
      updateForm(key, url);
    } catch (err) {
      alert('Upload failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
    setUploading(null);
  };

  const handleImagesUpload = async (key: string, file: File) => {
    setUploading(key);
    try {
      const url = await uploadImage(file, apiKey);
      const arr = [...(Array.isArray(form[key]) ? form[key] : []), url];
      updateForm(key, arr);
    } catch (err) {
      alert('Upload failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
    setUploading(null);
  };

  const isFormValid = () => {
    return fields.every(f => {
      if (!f.required) return true;
      const val = form[f.key];
      if (f.type === 'boolean') return true;
      if (f.type === 'number') return val !== '' && val !== null;
      return val !== '' && val !== undefined && val !== null;
    });
  };

  if (loading) {
    return <p className="text-sm text-ink-secondary dark:text-canvas/60 font-mono">Loading...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black uppercase tracking-tight text-ink dark:text-canvas">{title}</h2>
        <button
          onClick={openNew}
          className="bg-accent text-on-accent px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-accent-hover transition-colors cursor-pointer"
        >
          + Add
        </button>
      </div>

      {form && Object.keys(form).length > 0 && (
        <div className="mb-8 border border-ink/10 dark:border-canvas/10 rounded-2xl p-6 bg-canvas dark:bg-brand-dark-900">
          <h3 className="font-bold text-ink dark:text-canvas mb-4">
            {editing ? 'Edit' : 'New'} {title}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {fields.map(f => (
              <div key={f.key} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-secondary dark:text-canvas/60 mb-1">
                  {f.label}
                </label>
                {f.type === 'textarea' ? (
                  <textarea
                    value={form[f.key] ?? ''}
                    onChange={e => updateForm(f.key, e.target.value)}
                    className="w-full bg-transparent border border-ink/20 dark:border-canvas/20 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent transition-colors text-ink dark:text-canvas"
                    rows={3}
                  />
                ) : f.type === 'boolean' ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!form[f.key]}
                      onChange={e => updateForm(f.key, e.target.checked)}
                      className="rounded border-ink/30 dark:border-canvas/30 text-accent focus:ring-accent/20"
                    />
                    <span className="text-sm text-ink-secondary dark:text-canvas/70">Enabled</span>
                  </label>
                  ) : f.type === 'images' ? (
                  <div className="space-y-3">
                    {Array.isArray(form[f.key]) && form[f.key].length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {form[f.key].map((url: string, idx: number) => (
                          <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-ink/10 dark:border-canvas/10 bg-ink/5 dark:bg-canvas/5">
                            <img
                              src={url}
                              alt={`${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x200/eee/999?text=Error'; }}
                            />
                            <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const arr = [...form[f.key]];
                                    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                                    updateForm(f.key, arr);
                                  }}
                                  className="text-white text-xs bg-canvas/20 hover:bg-canvas/40 rounded p-1 cursor-pointer"
                                  title="Move up"
                                >
                                  ▲
                                </button>
                              )}
                              {idx < form[f.key].length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const arr = [...form[f.key]];
                                    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
                                    updateForm(f.key, arr);
                                  }}
                                  className="text-white text-xs bg-canvas/20 hover:bg-canvas/40 rounded p-1 cursor-pointer"
                                  title="Move down"
                                >
                                  ▼
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  const arr = form[f.key].filter((_: string, i: number) => i !== idx);
                                  updateForm(f.key, arr);
                                }}
                                className="text-white text-xs bg-red-500/70 hover:bg-red-500 rounded p-1 cursor-pointer"
                                title="Remove"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <label className="relative cursor-pointer">
                        <input
                          type="file"
                          accept={f.imageConfig?.accept || 'image/*'}
                          className="sr-only"
                          disabled={uploading === f.key}
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) handleImagesUpload(f.key, file);
                            e.target.value = '';
                          }}
                        />
                        <span className="inline-block border border-ink/20 dark:border-canvas/20 text-ink dark:text-canvas px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-ink/5 dark:hover:bg-canvas/5 transition-colors">
                          {uploading === f.key ? 'Uploading...' : '+ Upload Image'}
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="https://... (paste URL + Enter)"
                        className="flex-1 min-w-[200px] bg-transparent border border-ink/20 dark:border-canvas/20 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent transition-colors text-ink dark:text-canvas"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.currentTarget;
                            const url = input.value.trim();
                            if (url) {
                              const arr = [...(Array.isArray(form[f.key]) ? form[f.key] : []), url];
                              updateForm(f.key, arr);
                              input.value = '';
                            }
                          }
                        }}
                      />
                    </div>
                    {(f.imageConfig?.hint || f.imageConfig?.maxSizeKB || f.imageConfig?.maxWidth) && (
                      <p className="text-[10px] font-mono text-ink-secondary dark:text-canvas/50 leading-relaxed">
                        {f.imageConfig?.hint || [
                          f.imageConfig?.maxWidth && `${f.imageConfig.maxWidth}×${f.imageConfig.maxHeight || f.imageConfig.maxWidth}px`,
                          f.imageConfig?.maxSizeKB && `≤${f.imageConfig.maxSizeKB}KB`,
                          'WebP',
                        ].filter(Boolean).join(' · ') || 'Auto-compressed to WebP'}
                      </p>
                    )}
                  </div>
                ) : f.type === 'image' ? (
                  <div className="space-y-2">
                    {form[f.key] && (
                      <div className="flex items-start gap-3 mb-2">
                        <img
                          src={form[f.key]}
                          alt="Preview"
                          className="w-16 h-16 rounded-xl object-cover border border-ink/10 dark:border-canvas/10"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <input
                          type="text"
                          value={form[f.key] ?? ''}
                          onChange={e => updateForm(f.key, e.target.value)}
                          placeholder="https://..."
                          className="flex-1 bg-transparent border border-ink/20 dark:border-canvas/20 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent transition-colors text-ink dark:text-canvas"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <label className="relative cursor-pointer">
                        <input
                          type="file"
                          accept={f.imageConfig?.accept || 'image/*'}
                          className="sr-only"
                          disabled={uploading === f.key}
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(f.key, file);
                            e.target.value = '';
                          }}
                        />
                        <span className="inline-block border border-ink/20 dark:border-canvas/20 text-ink dark:text-canvas px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-ink/5 dark:hover:bg-canvas/5 transition-colors">
                          {uploading === f.key ? 'Uploading...' : 'Upload'}
                        </span>
                      </label>
                      {!form[f.key] && (
                        <input
                          type="text"
                          value={form[f.key] ?? ''}
                          onChange={e => updateForm(f.key, e.target.value)}
                          placeholder="https://..."
                          className="flex-1 bg-transparent border border-ink/20 dark:border-canvas/20 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent transition-colors text-ink dark:text-canvas"
                        />
                      )}
                    </div>
                    {(f.imageConfig?.hint || f.imageConfig?.maxSizeKB || f.imageConfig?.maxWidth) && (
                      <p className="text-[10px] font-mono text-ink-secondary dark:text-canvas/50 leading-relaxed">
                        {f.imageConfig?.hint || [
                          f.imageConfig?.maxWidth && `${f.imageConfig.maxWidth}×${f.imageConfig.maxHeight || f.imageConfig.maxWidth}px`,
                          f.imageConfig?.maxSizeKB && `≤${f.imageConfig.maxSizeKB}KB`,
                          'WebP',
                        ].filter(Boolean).join(' · ') || 'Auto-compressed to WebP'}
                      </p>
                    )}
                  </div>
                ) : f.type === 'select' && f.options ? (
                  <select
                    value={form[f.key] ?? ''}
                    onChange={e => updateForm(f.key, e.target.value)}
                    className="w-full bg-transparent border border-ink/20 dark:border-canvas/20 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent transition-colors text-ink dark:text-canvas"
                  >
                    <option value="">Select...</option>
                    {f.options.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type === 'number' ? 'number' : 'text'}
                    value={form[f.key] ?? ''}
                    onChange={e => updateForm(f.key, f.type === 'number' ? Number(e.target.value) : e.target.value)}
                    className="w-full bg-transparent border border-ink/20 dark:border-canvas/20 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent transition-colors text-ink dark:text-canvas"
                  />
                )}
              </div>
            ))}
          </div>
          {renderExtraFields?.(form, updateForm)}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={!isFormValid()}
              className="bg-accent text-on-accent px-5 py-2 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-accent-hover transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              Save
            </button>
            <button
              onClick={() => { setEditing(null); setForm({}); }}
              className="border border-ink/20 dark:border-canvas/20 text-ink dark:text-canvas px-5 py-2 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-ink/5 dark:hover:bg-canvas/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-ink-secondary dark:text-canvas/40 font-mono">No items yet.</p>
        )}
        {items.map(item => {
          const label = displayField ? item[displayField] : item[idField];
          return (
            <div
              key={item[idField]}
              className="flex items-center justify-between border border-ink/5 dark:border-canvas/5 rounded-xl px-4 py-3 hover:bg-ink/5 dark:hover:bg-canvas/5 transition-colors"
            >
              <span className="text-sm font-medium text-ink dark:text-canvas truncate mr-4">
                {label}
              </span>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openEdit(item)}
                  className="text-xs font-mono uppercase tracking-wider text-accent hover:text-accent-hover transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="text-xs font-mono uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
