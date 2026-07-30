import { Language } from '../types';

interface CheckoutCancelOverlayProps {
  lang: Language;
  onClose: () => void;
}

export default function CheckoutCancelOverlay({ lang, onClose }: CheckoutCancelOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 bg-canvas dark:bg-primary-deep flex items-center justify-center p-4">
      <div className="max-w-md text-center space-y-6">
        <h2 className="text-3xl font-handwritten font-bold text-ink dark:text-canvas normal-case">
          {lang === 'en' ? 'Checkout Cancelled' : 'Zahlung abgebrochen'}
        </h2>
        <p className="text-ink/90 dark:text-canvas/90">
          {lang === 'en'
            ? 'Your payment was not completed. No charges have been made. You can try again anytime.'
            : 'Deine Zahlung wurde nicht abgeschlossen. Es wurden keine Kosten berechnet. Du kannst es jederzeit erneut versuchen.'}
        </p>
        <button
          onClick={onClose}
          className="rounded-xl bg-ink dark:bg-accent text-canvas dark:text-on-accent font-display font-bold uppercase py-3 px-8 transition-all hover:shadow-lg cursor-pointer border-none"
        >
          {lang === 'en' ? 'Back to Shop' : 'Zurück zum Shop'}
        </button>
      </div>
    </div>
  );
}
