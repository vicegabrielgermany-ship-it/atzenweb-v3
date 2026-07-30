import React, { useState, useEffect } from 'react';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import X from 'lucide-react/dist/esm/icons/x';
import { MerchItem, CartItem, Language } from '../types';
import { translations } from '../constants/translations';

interface ProductDetailProps {
  item: MerchItem;
  lang: Language;
  onAddToCart: (item: MerchItem, size?: string, options?: Record<string, string>) => void;
  onClose: () => void;
  allItems?: MerchItem[];
  onViewItem?: (item: MerchItem) => void;
}

export default function ProductDetail({ item, lang, onAddToCart, onClose, allItems, onViewItem }: ProductDetailProps) {
  const t = translations[lang];
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(item.sizes?.[0] || '');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = item.images?.length ? item.images : (item.image ? [item.image] : []);
  const price = item.promoPrice || item.price;

  useEffect(() => {
    const initial: Record<string, string> = {};
    item.options?.forEach(opt => {
      initial[opt.label] = opt.values[0] || '';
    });
    setSelectedOptions(initial);
  }, [item.id]);

  const handleAddToCart = () => {
    const size = item.sizes && selectedSize ? selectedSize : undefined;
    onAddToCart(item, size, Object.keys(selectedOptions).length ? selectedOptions : undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const renderMerchIcon = (iconName: string, className?: string) => {
    const cn = className || "h-24 w-24 text-ink/20 dark:text-canvas/20";
    if (iconName === 'cap' || iconName === 'tag') return <span className={cn}>🧢</span>;
    if (iconName === 'shirt' || iconName === 'hoodie') return <span className={cn}>👕</span>;
    if (iconName === 'mug' || iconName === 'glass') return <span className={cn}>🍺</span>;
    return <span className={cn}>🛍️</span>;
  };

  return (
    <div className="bg-canvas dark:bg-primary-deep">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-ink dark:text-canvas hover:text-accent transition-colors mb-6 cursor-pointer bg-transparent border-none"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-bold uppercase tracking-wider">{t.shopBack || '← Back to Shop'}</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden bg-ink/5 dark:bg-canvas/5 border border-ink/10 dark:border-canvas/10 flex items-center justify-center">
              {(images[selectedImage]?.startsWith('http') || images[selectedImage]?.startsWith('/')) ? (
                <button
                  onClick={() => setLightboxIndex(selectedImage)}
                  className="w-full h-full cursor-zoom-in border-none p-0 bg-transparent"
                >
                  <img
                    src={images[selectedImage]}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ) : (
                <div className="flex flex-col items-center gap-2 text-ink/30 dark:text-canvas/30">
                  {renderMerchIcon(images[selectedImage] || item.image)}
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(i => (i - 1 + images.length) % images.length)}
                    aria-label={lang === 'en' ? 'Previous image' : 'Vorheriges Bild'}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-canvas/80 dark:bg-ink/80 text-ink dark:text-canvas hover:bg-canvas dark:hover:bg-ink transition-colors shadow-md cursor-pointer border-none"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(i => (i + 1) % images.length)}
                    aria-label={lang === 'en' ? 'Next image' : 'Nächstes Bild'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-canvas/80 dark:bg-ink/80 text-ink dark:text-canvas hover:bg-canvas dark:hover:bg-ink transition-colors shadow-md cursor-pointer border-none"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    aria-label={lang === 'en' ? `View image ${idx + 1}` : `Bild ${idx + 1} anzeigen`}
                    aria-pressed={idx === selectedImage}
                    className={`shrink-0 w-16 h-16 overflow-hidden border-2 transition-colors cursor-pointer ${
                      idx === selectedImage
                        ? 'border-accent'
                        : 'border-transparent hover:border-ink/20 dark:hover:border-canvas/20'
                    }`}
                  >
                    {(url?.startsWith('http') || url?.startsWith('/')) ? (
                      <img src={url} alt={`${item.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-ink/5 dark:bg-canvas/5 flex items-center justify-center text-xs text-ink/30 dark:text-canvas/30">
                        {renderMerchIcon(url, 'h-6 w-6')}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-ink/90 dark:text-canvas/90">{item.category}</span>
              <h1 className="text-3xl md:text-4xl font-mono font-bold text-ink dark:text-canvas normal-case mt-1">
                {t[`shopItem${item.id.toUpperCase()}Name` as keyof typeof t] || item.name}
              </h1>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-ink dark:text-canvas font-display">€{price.toFixed(2)}</span>
              {item.promoPrice && (
                <span className="text-lg font-black line-through text-ink/50 dark:text-canvas/50 font-display">€{item.price.toFixed(2)}</span>
              )}
            </div>

            <p className="text-sm font-medium text-ink dark:text-canvas leading-relaxed">
              {t[`shopItem${item.id.toUpperCase()}Desc` as keyof typeof t] || item.description}
            </p>

            {item.sizes && (
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink dark:text-canvas">{t.shopSize || 'Size'}</span>
                <div className="flex gap-2">
                  {item.sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`cursor-pointer text-sm font-display font-black w-10 h-10 transition-all flex items-center justify-center ${
                        selectedSize === s
                          ? 'bg-accent text-ink shadow-sm ring-2 ring-accent ring-offset-2 ring-offset-canvas dark:ring-offset-primary-deep border-none'
                          : 'bg-canvas dark:bg-brand-dark-900 text-ink dark:text-canvas hover:bg-ink/5 dark:hover:bg-canvas/5 border border-ink/20 dark:border-canvas/20'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {item.options?.map(opt => (
              <div key={opt.label} className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink dark:text-canvas">{opt.label}</span>
                <div className="flex gap-2 flex-wrap">
                  {opt.values.map(v => (
                    <button
                      key={v}
                      onClick={() => setSelectedOptions(prev => ({ ...prev, [opt.label]: v }))}
                      className={`cursor-pointer text-sm font-display font-black px-4 py-2 transition-all ${
                        selectedOptions[opt.label] === v
                          ? 'bg-accent text-ink shadow-sm ring-2 ring-accent ring-offset-2 ring-offset-canvas dark:ring-offset-primary-deep border-none'
                          : 'bg-canvas dark:bg-brand-dark-900 text-ink dark:text-canvas hover:bg-ink/5 dark:hover:bg-canvas/5 border border-ink/20 dark:border-canvas/20'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleAddToCart}
              className={`w-full font-display font-bold uppercase py-4 px-6 transition-all flex items-center justify-center gap-2 text-lg border-none cursor-pointer ${
                added
                  ? 'bg-primary text-canvas'
                  : 'bg-ink dark:bg-accent text-canvas dark:text-on-accent hover:bg-ink/90 dark:hover:bg-accent-hover shadow-md hover:shadow-lg'
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              {added ? (lang === 'en' ? 'Added!' : 'Hinzugefügt!') : t.shopAddToCart}
            </button>
          </div>
        </div>
      </div>

      {allItems && onViewItem && allItems.filter(i => i.id !== item.id).length > 0 && (
        <div className="max-w-5xl mx-auto px-4 pb-12">
          <div className="border-t border-ink/10 pt-10">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-ink/50">{lang === 'en' ? 'Related Products' : 'Weitere Produkte'}</span>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {allItems.filter(i => i.id !== item.id).map(related => {
                const thumb = related.images?.[0] || related.image;
                const price = related.promoPrice || related.price;
                return (
                  <button
                    key={related.id}
                    onClick={() => onViewItem(related)}
                    className="cursor-pointer text-left bg-canvas border border-ink/10 hover:border-ink/30 transition-all hover:-translate-y-1 hover:shadow-md p-3 flex flex-col gap-2 border-none"
                  >
                    <div className="aspect-square bg-ink/5 overflow-hidden flex items-center justify-center">
                      {(thumb?.startsWith('http') || thumb?.startsWith('/')) ? (
                        <img src={thumb} alt={related.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl">{renderMerchIcon(thumb || '', 'h-10 w-10')}</span>
                      )}
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-ink/50">{related.category}</span>
                      <p className="text-sm font-mono font-bold text-ink leading-snug">{related.name}</p>
                      <p className="text-sm font-black text-ink font-display mt-1">€{price.toFixed(2)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {lightboxIndex !== null && (images[lightboxIndex]?.startsWith('http') || images[lightboxIndex]?.startsWith('/')) && (
        <div
          className="fixed inset-0 z-60 bg-ink/90 flex items-center justify-center cursor-zoom-out touch-pinch-zoom"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            aria-label={lang === 'en' ? 'Close lightbox' : 'Leuchtkasten schließen'}
            className="absolute top-4 right-4 p-2 rounded-full bg-canvas/10 hover:bg-canvas/20 text-canvas transition-colors border-none cursor-pointer z-10"
          >
            <X className="h-6 w-6" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); setLightboxIndex(i => (i! - 1 + images.length) % images.length); }}
                aria-label={lang === 'en' ? 'Previous image' : 'Vorheriges Bild'}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-canvas/10 hover:bg-canvas/20 text-canvas transition-colors border-none cursor-pointer z-10"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); setLightboxIndex(i => (i! + 1) % images.length); }}
                aria-label={lang === 'en' ? 'Next image' : 'Nächstes Bild'}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-canvas/10 hover:bg-canvas/20 text-canvas transition-colors border-none cursor-pointer z-10"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          <img
            src={images[lightboxIndex]}
            alt={item.name}
            className="max-w-[95vw] max-h-[95vh] object-contain select-none"
            onClick={e => e.stopPropagation()}
            draggable={false}
          />
        </div>
      )}
    </div>
  );
}
