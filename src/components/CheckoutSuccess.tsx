import { useState, useEffect } from 'react';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import ShoppingBag from 'lucide-react/dist/esm/icons/shopping-bag';
import Truck from 'lucide-react/dist/esm/icons/truck';
import X from 'lucide-react/dist/esm/icons/x';
import { Language, Order } from '../types';
import { translations } from '../constants/translations';

interface CheckoutSuccessProps {
  lang: Language;
  orderId: string | null;
  onClose: () => void;
}

export default function CheckoutSuccess({ lang, orderId, onClose }: CheckoutSuccessProps) {
  const t = translations[lang];
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    fetch(`/api/order?id=${orderId}`)
      .then(r => r.ok ? r.json() : Promise.reject('Not found'))
      .then(data => setOrder(data))
      .catch(() => setError('Bestellung konnte nicht geladen werden.'))
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <div className="fixed inset-0 z-50 bg-canvas dark:bg-primary-deep overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-ink/5 dark:hover:bg-canvas/5 text-ink dark:text-canvas transition-colors cursor-pointer border-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 mb-6">
            <CheckCircle className="h-10 w-10 text-primary dark:text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-handwritten font-bold text-ink dark:text-canvas normal-case mb-3">
            {t.shopCheckoutSuccess}
          </h1>
          <p className="text-sm text-ink/70 dark:text-canvas/70 font-medium">
            {lang === 'en' ? 'Order confirmation' : 'Bestellbestätigung'}
            {orderId && <span className="font-mono text-xs ml-2 opacity-50">#{orderId.slice(0, 8)}</span>}
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full mx-auto" />
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-accent/10 dark:bg-accent/20 border border-accent/20 dark:border-accent/30 p-4 text-sm text-ink dark:text-canvas">
            {error}
          </div>
        )}

        {order && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-ink/5 dark:bg-canvas/5 border border-ink/10 dark:border-canvas/10 p-6 space-y-4">
              <h3 className="font-display font-black text-ink dark:text-canvas uppercase tracking-wide text-sm">
                {lang === 'en' ? 'Items Ordered' : 'Bestellte Artikel'}
              </h3>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-ink/10 dark:border-canvas/10 last:border-0">
                  <div>
                    <p className="font-bold text-ink dark:text-canvas text-sm">{item.name}</p>
                    <p className="text-xs text-ink/60 dark:text-canvas/60 font-mono">
                      {item.quantity}x €{item.price.toFixed(2)}
                      {item.options && Object.entries(item.options).length > 0 && (
                        <span className="ml-2">({Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(', ')})</span>
                      )}
                    </p>
                  </div>
                  <span className="font-black text-ink dark:text-canvas font-mono text-sm">€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-ink/5 dark:bg-canvas/5 border border-ink/10 dark:border-canvas/10 p-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink/70 dark:text-canvas/70">{lang === 'en' ? 'Subtotal' : 'Zwischensumme'}</span>
                <span className="font-bold text-ink dark:text-canvas">€{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink/70 dark:text-canvas/70 flex items-center gap-1.5">
                  <Truck className="h-4 w-4" />
                  {lang === 'en' ? 'Shipping' : 'Versandkosten'}
                </span>
                <span className="font-bold text-ink dark:text-canvas">
                  {order.shipping === 0
                    ? <span className="text-primary dark:text-primary">{lang === 'en' ? "On us ✌️" : 'auf unseren Nacken ✌️'}</span>
                    : `€${order.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-ink/10 dark:border-canvas/10 pt-2 flex justify-between text-lg font-black text-ink dark:text-canvas">
                <span>{lang === 'en' ? 'Total' : 'Gesamtwert'}</span>
                <span>€{order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-ink/5 dark:bg-canvas/5 border border-ink/10 dark:border-canvas/10 p-6 space-y-2 text-sm">
              <h3 className="font-display font-black text-ink dark:text-canvas uppercase tracking-wide text-sm mb-3">
                {lang === 'en' ? 'Shipping Address' : 'Lieferadresse'}
              </h3>
              <p className="text-ink dark:text-canvas font-medium">{order.customer.name}</p>
              <p className="text-ink/70 dark:text-canvas/70">{order.customer.address}</p>
              <p className="text-ink/70 dark:text-canvas/70">{order.customer.zip} {order.customer.city}</p>
              <p className="text-ink/70 dark:text-canvas/70">{order.customer.email}</p>
            </div>

            <p className="text-xs text-ink/50 dark:text-canvas/50 text-center font-mono">
              {lang === 'en' ? 'A confirmation email has been sent.' : 'Eine Bestätigungs-E-Mail wurde versendet.'}
            </p>

            <div className="text-center pt-4">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-xl bg-ink dark:bg-accent text-canvas dark:text-on-accent font-display font-bold uppercase py-3 px-8 transition-all hover:shadow-lg cursor-pointer border-none"
              >
                <ShoppingBag className="h-4 w-4" />
                {lang === 'en' ? 'Back to Shop' : 'Zurück zum Shop'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
