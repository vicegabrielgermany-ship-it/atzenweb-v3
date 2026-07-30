import React, { useState, useEffect, useRef, useCallback } from 'react';
import ShoppingBag from 'lucide-react/dist/esm/icons/shopping-bag';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import X from 'lucide-react/dist/esm/icons/x';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import CreditCard from 'lucide-react/dist/esm/icons/credit-card';
import Check from 'lucide-react/dist/esm/icons/check';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart';
import Truck from 'lucide-react/dist/esm/icons/truck';
import Lock from 'lucide-react/dist/esm/icons/lock';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import Shirt from 'lucide-react/dist/esm/icons/shirt';
import GlassWater from 'lucide-react/dist/esm/icons/glass-water';
import Tag from 'lucide-react/dist/esm/icons/tag';
import Eye from 'lucide-react/dist/esm/icons/eye';
import { fetchMerch } from '../lib/public-api';
import { MerchItem, CartItem, Language } from '../types';
import { translations } from '../constants/translations';
import fallbackMerch from '../data/merch.json';
import ProductDetail from './ProductDetail';
import { IllustratedHeading } from './IllustratedHeading';

const renderMerchIcon = (imageName: string, className?: string) => {
  const cn = className || "h-16 w-16 text-accent fill-accent/10 stroke-[1.5] transition-transform duration-300 group-hover:scale-110";
  if (imageName === 'cap') {
    return <Tag className={cn} />;
  }
  if (imageName === 'shirt' || imageName === 'hoodie') {
    return <Shirt className={cn} />;
  }
  if (imageName === 'mug' || imageName === 'glass') {
    return <GlassWater className={cn} />;
  }
  return <ShoppingBag className={cn} />;
};

interface MerchShopProps {
  lang: Language;
  onAddCartFeedback: (message: string) => void;
}

export default function MerchShop({ lang, onAddCartFeedback }: MerchShopProps) {
  const t = translations[lang];

  const [merchCatalogue, setMerchCatalogue] = useState<MerchItem[]>(fallbackMerch as MerchItem[]);
  const [viewingProduct, setViewingProduct] = useState<MerchItem | null>(null);

  useEffect(() => {
    fetchMerch().then(data => { if (data) setMerchCatalogue(data); });
  }, []);

  // Cart Management States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    'hoodie': 'L'
  });

  // Focus management for cart drawer
  const cartTriggerRef = useRef<HTMLButtonElement>(null);
  const cartDrawerRef = useRef<HTMLDivElement>(null);

  // Trap focus inside cart drawer when open
  useEffect(() => {
    if (!isCartOpen) return;
    const drawer = cartDrawerRef.current;
    if (!drawer) return;

    // Store the element that had focus before the drawer opened
    const previousFocus = document.activeElement as HTMLElement;

    // Focus the close button inside the drawer
    const closeBtn = drawer.querySelector('button[aria-label]') as HTMLElement;
    if (closeBtn) closeBtn.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = drawer.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    drawer.addEventListener('keydown', handleKeyDown);

    return () => {
      drawer.removeEventListener('keydown', handleKeyDown);
      // Return focus to the trigger element
      if (previousFocus && previousFocus.focus) {
        previousFocus.focus();
      }
    };
  }, [isCartOpen]);

  // Checkout modal states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutCity, setCheckoutCity] = useState('');
  const [checkoutZip, setCheckoutZip] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Cart math
  const cartSubtotal = cart.reduce((acc, curr) => {
    const itemPrice = curr.item.promoPrice || curr.item.price;
    return acc + (itemPrice * curr.quantity);
  }, 0);

  const shippingCost = 0; // Versand ist in allen Produktpreisen inklusive
  const cartTotal = cartSubtotal + shippingCost;

  const handleSizeChange = (itemId: string, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [itemId]: size
    }));
  };

  const addToCart = (item: MerchItem, size?: string, options?: Record<string, string>) => {
    const finalSize = size || (item.sizes ? selectedSizes[item.id] || 'M' : undefined);

    setCart(prev => {
      const existingIndex = prev.findIndex(cartItem =>
        cartItem.item.id === item.id && cartItem.selectedSize === finalSize
      );

      if (existingIndex > -1) {
        return prev.map((cartItem, idx) =>
          idx === existingIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { item, quantity: 1, selectedSize: finalSize, selectedOptions: options }];
      }
    });

    const isEn = lang === 'en';
    const alertMsg = isEn
      ? `Added 1x "${item.name}"${finalSize ? ` (Size ${finalSize})` : ''} to your Atzen-Cart!`
      : `"${item.name}"${finalSize ? ` (Größe ${finalSize})` : ''} wurde in deinen Atzen-Warenkorb gelegt!`;

    onAddCartFeedback(alertMsg);
  };

  const removeFromCart = (itemId: string, size?: string) => {
    setCart(prev => prev.filter(cartItem =>
      !(cartItem.item.id === itemId && cartItem.selectedSize === size)
    ));
  };

  const updateQuantity = (itemId: string, amount: number, size?: string) => {
    setCart(prev => prev.map(cartItem => {
      if (cartItem.item.id === itemId && cartItem.selectedSize === size) {
        const nextQ = cartItem.quantity + amount;
        return {
          ...cartItem,
          quantity: nextQ < 1 ? 1 : nextQ
        };
      }
      return cartItem;
    }));
  };

  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutName || !checkoutEmail || !checkoutAddress || !checkoutCity || !checkoutZip) return;

    setCheckoutLoading(true);
    setCheckoutError('');

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          customer: {
            name: checkoutName,
            email: checkoutEmail,
            address: checkoutAddress,
            city: checkoutCity,
            zip: checkoutZip,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Checkout failed');
    }
    setCheckoutLoading(false);
  };

  const closeAndReset = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setCheckoutName('');
    setCheckoutEmail('');
    setCheckoutAddress('');
    setCheckoutCity('');
    setCheckoutZip('');
    setCheckoutError('');
  };

  return (
    <section id="merch-shop" className="relative bg-canvas dark:bg-primary-deep py-24 px-4 md:px-8 border-t border-ink/10 dark:border-canvas/10 texture-print">

      {/* Decorative backdrop accent */}
      <div className="absolute top-1/2 right-1/4 h-80 w-80 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

      <div className="relative content-width">

        {viewingProduct ? (
          <ProductDetail
            item={viewingProduct}
            lang={lang}
            onAddToCart={(item, size, options) => addToCart(item, size, options)}
            onClose={() => { setViewingProduct(null); window.scrollTo(0, 0); }}
            allItems={merchCatalogue}
            onViewItem={(item) => { setViewingProduct(item); window.scrollTo(0, 0); }}
          />
        ) : (<>

        {/* Header Display */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <IllustratedHeading
              text={t.shopTitle}
              src="/elemente/HEADLINE3_AtzenShop.png"
              className="max-w-[320px]"
            />
            <p className="mt-4 max-w-2xl text-sm md:text-base font-sans font-bold" style={{ color: '#1A1A1A' }}>
              {t.shopSubtitle}
            </p>
          </div>

          {/* Quick Cart Trigger */}
          <button
            ref={cartTriggerRef}
            onClick={() => setIsCartOpen(true)}
            aria-label={lang === 'en' ? `Open cart (${cart.reduce((a, c) => a + c.quantity, 0)} items)` : `Warenkorb öffnen (${cart.reduce((a, c) => a + c.quantity, 0)} Artikel)`}
            className="cursor-pointer self-start md:self-auto px-0 py-2 text-sm font-bold font-mono bg-transparent border-none" style={{ color: '#1A1A1A' }}
          >
            {t.shopCartTitle} ({cart.reduce((a, c) => a + c.quantity, 0)})
          </button>
        </div>

        {/* Shop Listing Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {merchCatalogue.map((item) => {
            const sizeMapKey = item.id;
            const currentSize = selectedSizes[sizeMapKey] || 'M';
            const priceToDisplay = item.promoPrice || item.price;
            const thumb = item.images?.[0] || item.image;

            return (
              <div
                key={item.id}
                className="relative bg-canvas dark:bg-brand-dark-900 p-5 transition-all duration-300 flex flex-col justify-between shadow-md hover:-translate-y-2 hover:shadow-xl border border-ink/5 dark:border-canvas/10 group"
              >
                {/* Sale Promo Badge option */}
                {item.promoPrice && (
                  <span className="absolute -top-2 -left-2 ribbon bg-accent text-ink text-xs font-black uppercase font-display px-4 py-1.5 z-10 shadow-sm -rotate-3">
                    SALE ATZE
                  </span>
                )}

                {/* Styled illustration frame placeholder */}
                <div onClick={() => { setViewingProduct(item); window.scrollTo(0, 0); }} className="relative aspect-[4/3] bg-ink/5 dark:bg-canvas/5 flex items-center justify-center select-none mb-4 overflow-hidden group-hover:bg-ink/10 dark:group-hover:bg-canvas/10 transition-colors p-3 cursor-pointer">
                  {(thumb?.startsWith('http') || thumb?.startsWith('/')) ? (
                    <img
                      src={thumb}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    renderMerchIcon(thumb, "h-20 w-20 text-ink dark:text-canvas fill-ink/5 dark:fill-canvas/5 stroke-[1.5] transition-all duration-300 group-hover:scale-110 group-hover:fill-accent/40 relative z-10")
                  )}
                </div>

                {/* Listing metadata info */}
                <div className="space-y-2 grow flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-ink dark:text-canvas">{item.category}</span>
                    <h3 onClick={() => { setViewingProduct(item); window.scrollTo(0, 0); }} className="text-2xl font-mono font-bold text-ink dark:text-canvas leading-snug mt-1 normal-case cursor-pointer hover:underline">
                      {t[`shopItem${item.id.toUpperCase()}Name` as keyof typeof t] || item.name}
                    </h3>
                    <p className="text-xs font-bold font-sans text-ink dark:text-canvas mt-2 line-clamp-2">
                      {t[`shopItem${item.id.toUpperCase()}Desc` as keyof typeof t] || item.description}
                    </p>
                  </div>

                  {/* Pricing and actions */}
                  <div className="mt-4 pt-4 border-t border-ink/10 dark:border-canvas/10 space-y-3">

                    {/* Price Tag values */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-ink dark:text-canvas font-display" style={{ fontFeatureSettings: '"tnum"' }}>
                        €{priceToDisplay.toFixed(2)}
                      </span>
                      {item.promoPrice && (
                        <span className="text-sm font-black line-through text-ink/50 dark:text-canvas/50 font-display" style={{ fontFeatureSettings: '"tnum"' }}>
                          €{item.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(item, currentSize)}
                        className="flex-1 cursor-pointer bg-ink dark:bg-accent hover:bg-ink/90 dark:hover:bg-accent-hover text-canvas dark:text-on-accent font-display font-bold uppercase py-3 px-4 transition-all hover:shadow-lg flex items-center justify-center gap-2 border-none text-sm"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {t.shopAddToCart}
                      </button>
                      <button
                        onClick={() => { setViewingProduct(item); window.scrollTo(0, 0); }}
                        className="cursor-pointer bg-canvas dark:bg-brand-dark-900 text-ink dark:text-canvas border border-ink/20 dark:border-canvas/20 hover:bg-ink/5 dark:hover:bg-canvas/5 font-display font-bold uppercase py-3 px-3 transition-all flex items-center justify-center text-sm"
                        aria-label={lang === 'en' ? 'View details' : 'Details ansehen'}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>

        </>)}

        {/* CART DRAWER BACKDROP MASK (Slide over mockup layout) */}
        {isCartOpen && (
          <div className="fixed inset-0 z-40 bg-ink/40 dark:bg-ink/60 backdrop-blur-md transition-all duration-300 flex justify-end">

            {/* Click backdrop to exit */}
            <div className="absolute inset-0 cursor-default" onClick={() => setIsCartOpen(false)} />

            {/* Slide-over panel sheet */}
            <div
              ref={cartDrawerRef}
              role="dialog"
              aria-modal="true"
              aria-label={t.shopCartTitle}
              className="relative w-full max-w-md bg-canvas dark:bg-brand-dark-900 h-full flex flex-col justify-between p-6 shadow-2xl z-50 animate-slideLeft border-l dark:border-canvas/10"
            >

              {/* Drawer Top Header section */}
              <div className="flex justify-between items-center border-b border-ink/10 dark:border-canvas/10 pb-4">
                <h3 className="text-2xl font-display font-black text-ink dark:text-canvas flex items-center gap-2">
                  <ShoppingCart className="h-6 w-6 text-ink dark:text-canvas" />
                  {t.shopCartTitle}
                </h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  aria-label={lang === 'en' ? 'Close cart' : 'Warenkorb schließen'}
                  className="p-2 rounded-full hover:bg-ink/5 dark:hover:bg-canvas/5 text-ink dark:text-canvas transition-colors cursor-pointer border-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Cart List section */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 custom-scrollbar pr-2">
                {cart.length === 0 ? (
                  <div className="text-center py-20 text-ink/50 dark:text-canvas/50">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-ink/30 dark:text-canvas/30" />
                    <p className="text-lg font-display font-bold">{t.shopCartEmpty}</p>
                  </div>
                ) : (
                  cart.map((cartItem) => {
                    const priceUnit = cartItem.item.promoPrice || cartItem.item.price;
                    const priceTotalNum = priceUnit * cartItem.quantity;

                    return (
                      <div
                        key={`${cartItem.item.id}-${cartItem.selectedSize}`}
                        className="flex items-center gap-4 rounded-xl bg-canvas dark:bg-brand-dark-900 p-3 border border-ink/10 dark:border-canvas/10 shadow-sm"
                      >
                        {/* Img circle box */}
                        <div className="h-16 w-16 rounded-lg bg-ink/5 dark:bg-canvas/5 flex items-center justify-center shrink-0 overflow-hidden">
                          {(cartItem.item.images?.[0]?.startsWith('http') || cartItem.item.images?.[0]?.startsWith('/')) ? (
                            <img src={cartItem.item.images[0]} alt={cartItem.item.name} className="w-full h-full object-cover" />
                          ) : (
                            renderMerchIcon(cartItem.item.image, "h-8 w-8 text-ink dark:text-canvas fill-ink/10 dark:fill-canvas/10 stroke-[1.5]")
                          )}
                        </div>

                        {/* Text detail metadata */}
                        <div className="grow select-none">
                          <h4 className="text-sm font-display font-black text-ink dark:text-canvas tracking-tight">{cartItem.item.name}</h4>
                          {cartItem.selectedSize && (
                            <span className="inline-block mt-1 text-[10px] bg-ink/5 dark:bg-canvas/10 text-ink dark:text-canvas font-bold px-2 py-0.5 rounded-full">
                              Größe {cartItem.selectedSize}
                            </span>
                          )}
                          <p className="text-xs font-bold text-ink/90 dark:text-canvas/90 mt-1 font-mono text-body-tabular" style={{ fontFeatureSettings: '"tnum"' }}>€{priceUnit.toFixed(2)}</p>
                        </div>

                        {/* Quantities adjuster inputs */}
                        <div className="flex items-center gap-2 rounded-lg bg-ink/5 dark:bg-canvas/10 p-1">
                          <button
                            onClick={() => updateQuantity(cartItem.item.id, -1, cartItem.selectedSize)}
                            aria-label={lang === 'en' ? 'Decrease quantity' : 'Menge verringern'}
                            className="cursor-pointer h-7 w-7 rounded-md bg-canvas dark:bg-brand-dark-900 shadow-sm text-sm font-bold font-mono text-ink dark:text-canvas hover:bg-ink dark:hover:bg-accent hover:text-canvas dark:hover:text-on-accent transition-colors border-none"
                          >
                            -
                          </button>
                          <span className="text-sm font-black font-mono text-ink dark:text-canvas px-1 text-body-tabular" style={{ fontFeatureSettings: '"tnum"' }} aria-label={lang === 'en' ? `Quantity: ${cartItem.quantity}` : `Menge: ${cartItem.quantity}`}>{cartItem.quantity}</span>
                          <button
                            onClick={() => updateQuantity(cartItem.item.id, 1, cartItem.selectedSize)}
                            aria-label={lang === 'en' ? 'Increase quantity' : 'Menge erhöhen'}
                            className="cursor-pointer h-7 w-7 rounded-md bg-canvas dark:bg-brand-dark-900 shadow-sm text-sm font-bold font-mono text-ink dark:text-canvas hover:bg-ink dark:hover:bg-accent hover:text-canvas dark:hover:text-on-accent transition-colors border-none"
                          >
                            +
                          </button>
                        </div>

                        {/* Total price for product stack to display and trash trigger */}
                        <div className="text-right shrink-0 flex flex-col items-end gap-2 select-none ml-2">
                          <span className="text-sm font-black font-mono text-ink dark:text-canvas text-body-tabular" style={{ fontFeatureSettings: '"tnum"' }}>
                            €{priceTotalNum.toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(cartItem.item.id, cartItem.selectedSize)}
                            aria-label={lang === 'en' ? `Remove ${cartItem.item.name} from cart` : `${cartItem.item.name} aus Warenkorb entfernen`}
                            className="text-ink/40 dark:text-canvas/40 hover:text-ink dark:hover:text-canvas transition-colors p-1 border-none bg-transparent cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Checkout Math and Submit Actions */}
              {cart.length > 0 && (
                <div className="border-t border-ink/10 dark:border-canvas/10 pt-4 space-y-4">
                  <div className="space-y-2 text-sm font-mono font-bold text-ink dark:text-canvas">
                    <div className="flex justify-between">
                      <span className="select-none">Zwischensumme:</span>
                      <span className="text-body-tabular" style={{ fontFeatureSettings: '"tnum"' }}>€{cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="select-none flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Versandkosten:
                      </span>
                      <span className="text-body-tabular" style={{ fontFeatureSettings: '"tnum"' }}>
                        <span className="text-primary bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-full text-xs border border-primary/20 dark:border-primary/30">auf unseren Nacken ✌️</span>
                      </span>
                    </div>
                    <div className="border-t border-ink/10 dark:border-canvas/10 my-3 pt-3 flex justify-between text-lg font-black text-ink dark:text-canvas font-display">
                      <span className="uppercase tracking-wide">Gesamtwert:</span>
                      <span className="text-body-tabular" style={{ fontFeatureSettings: '"tnum"' }}>€{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full cursor-pointer rounded-xl bg-accent text-ink font-display font-black uppercase py-4 text-lg flex items-center justify-center gap-2 hover:bg-accent/80 transition-all shadow-md hover:shadow-lg border-none"
                  >
                    <Lock className="h-5 w-5" />
                    {t.shopCartCheckout}
                  </button>
                  <p className="text-center text-[10px] font-mono font-bold text-ink/60 dark:text-canvas/60 uppercase tracking-wider select-none flex items-center justify-center gap-1.5">
                    <ShieldCheck className="h-3 w-3" />
                    SSL, AES-256 Bit Encrypted Secure Checkout
                  </p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* CHECKOUT MODAL — Stripe Checkout */}
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 dark:bg-ink/70 backdrop-blur-md animate-fadeIn">

            <div className="relative w-full max-w-md bg-canvas dark:bg-brand-dark-900 rounded-3xl p-6 md:p-8 shadow-2xl border dark:border-canvas/10">

              <button
                onClick={closeAndReset}
                aria-label={lang === 'en' ? 'Close checkout' : 'Kasse schließen'}
                className="absolute top-4 right-4 text-ink/50 dark:text-canvas/50 hover:bg-ink/5 dark:hover:bg-canvas/5 hover:text-ink dark:hover:text-canvas rounded-full transition-colors p-2 border-none bg-transparent cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <form onSubmit={handleStripeCheckout} className="space-y-6">
                <div className="border-b border-ink/10 dark:border-canvas/10 pb-4">
                  <h3 className="text-2xl font-display font-black text-ink dark:text-canvas flex items-center gap-3 tracking-tight">
                    <Lock className="h-6 w-6 text-ink/90 dark:text-canvas/90" />
                    {lang === 'en' ? 'Secure Checkout' : 'Sichere Kasse'}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-accent/30 dark:bg-accent/15 rounded-xl p-4 text-xs font-bold text-ink dark:text-canvas space-y-2 border border-accent dark:border-accent/30">
                    <p className="font-black text-ink dark:text-canvas flex items-center gap-2 font-display text-sm uppercase tracking-wide">
                      <Truck className="h-4 w-4" />
                      {lang === 'en' ? 'Shipping Information' : 'Versand-Informationen'}
                    </p>
                    <p className="font-sans leading-relaxed">
                      {lang === 'en'
                        ? '✓ DHL Premium delivery (GoGreen Climate Neutral). Shipping costs are on us — already included in the price. Ships in 2-4 business days.'
                        : '✓ DHL GoGreen (Klimaneutraler Premium-Versand). Versandkosten auf unseren Nacken ✌️ — schon im Preis inklusive. Lieferzeit ca. 2-4 Werktage.'}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-display font-black text-ink/90 dark:text-canvas/90 uppercase pl-1">Name:</label>
                    <input
                      type="text"
                      required
                      value={checkoutName}
                      onChange={e => setCheckoutName(e.target.value)}
                      placeholder="Atze Schulz"
                      className="w-full rounded-xl border border-ink/20 dark:border-canvas/20 bg-canvas dark:bg-brand-dark-900 p-3 text-sm font-bold font-sans text-ink dark:text-canvas placeholder-ink/30 dark:placeholder-canvas/30 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-display font-black text-ink/90 dark:text-canvas/90 uppercase pl-1">E-Mail:</label>
                    <input
                      type="email"
                      required
                      value={checkoutEmail}
                      onChange={e => setCheckoutEmail(e.target.value)}
                      placeholder="atze@example.com"
                      className="w-full rounded-xl border border-ink/20 dark:border-canvas/20 bg-canvas dark:bg-brand-dark-900 p-3 text-sm font-bold font-sans text-ink dark:text-canvas placeholder-ink/30 dark:placeholder-canvas/30 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-display font-black text-ink/90 dark:text-canvas/90 uppercase pl-1">Straße & Hausnummer:</label>
                    <input
                      type="text"
                      required
                      value={checkoutAddress}
                      onChange={e => setCheckoutAddress(e.target.value)}
                      placeholder="Oranienstraße 12"
                      className="w-full rounded-xl border border-ink/20 dark:border-canvas/20 bg-canvas dark:bg-brand-dark-900 p-3 text-sm font-bold font-sans text-ink dark:text-canvas placeholder-ink/30 dark:placeholder-canvas/30 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-xs font-display font-black text-ink/90 dark:text-canvas/90 uppercase pl-1">Stadt:</label>
                      <input
                        type="text"
                        required
                        value={checkoutCity}
                        onChange={e => setCheckoutCity(e.target.value)}
                        placeholder="Berlin"
                        className="w-full rounded-xl border border-ink/20 dark:border-canvas/20 bg-canvas dark:bg-brand-dark-900 p-3 text-sm font-bold font-sans text-ink dark:text-canvas placeholder-ink/30 dark:placeholder-canvas/30 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-display font-black text-ink/90 dark:text-canvas/90 uppercase pl-1">PLZ:</label>
                      <input
                        type="text"
                        required
                        value={checkoutZip}
                        onChange={e => setCheckoutZip(e.target.value)}
                        placeholder="10999"
                        className="w-full rounded-xl border border-ink/20 dark:border-canvas/20 bg-canvas dark:bg-brand-dark-900 p-3 text-sm font-bold font-sans text-ink dark:text-canvas placeholder-ink/30 dark:placeholder-canvas/30 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
                      />
                    </div>
                  </div>
                </div>

                {checkoutError && (
                  <div className="rounded-xl bg-ink/5 dark:bg-ink/10 border border-ink/20 dark:border-canvas/20 p-3 text-xs font-bold text-ink dark:text-canvas">
                    {checkoutError}
                  </div>
                )}

                <div className="pt-4 border-t border-ink/10 dark:border-canvas/10 flex justify-between items-center font-display mt-6">
                  <span className="text-lg font-black uppercase text-ink dark:text-canvas">Zu Bezahlen:</span>
                  <span className="text-3xl font-black text-ink dark:text-canvas text-body-tabular" style={{ fontFeatureSettings: '"tnum"' }}>€{cartTotal.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={checkoutLoading}
                  className="w-full cursor-pointer rounded-xl bg-ink dark:bg-accent text-canvas dark:text-on-accent py-4 text-lg font-display font-black uppercase tracking-wider hover:bg-ink/90 dark:hover:bg-accent-hover transition-all text-center shadow-md hover:shadow-xl hover:-translate-y-0.5 mt-4 border-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkoutLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      {lang === 'en' ? 'Pay with Stripe' : 'Mit Stripe bezahlen'}
                    </span>
                  )}
                </button>
              </form>

            </div>
          </div>
        )}

      </div>

    </section>
  );
}
