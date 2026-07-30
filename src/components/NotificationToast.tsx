import Bell from 'lucide-react/dist/esm/icons/bell';
import X from 'lucide-react/dist/esm/icons/x';

interface NotificationToastProps {
  message: string;
  onClose: () => void;
  lang: 'de' | 'en';
}

export default function NotificationToast({ message, onClose, lang }: NotificationToastProps) {
  const isEn = lang === 'en';

  return (
    <div
      className="fixed bottom-6 right-6 z-50 max-w-md w-full sm:w-[380px] rounded-2xl border border-ink/10 dark:border-canvas/10 bg-canvas dark:bg-brand-dark-900 p-4 flex gap-3.5 items-start justify-between scroll-smooth shadow-xl animate-slideUp"
    >

      <div className="relative h-10 w-10 shrink-0 rounded-full border border-ink/10 flex items-center justify-center text-ink shadow-md">
        <Bell className="h-5 w-5 animate-bounce" strokeWidth={2} />
      </div>

      <div className="flex-grow select-none">
        <p className="text-xs text-ink-secondary dark:text-canvas/80 font-bold leading-relaxed">
          {message}
        </p>

        <div className="flex items-center gap-4 mt-2.5">
          <button
            onClick={onClose}
            className="cursor-pointer text-[10px] bg-ink hover:opacity-90 text-canvas font-black rounded-full px-3 py-1.5 border border-ink/10 shadow hover:-translate-y-0.5 hover:shadow-md uppercase tracking-wide transition-all"
          >
            {isEn ? 'Awesome!' : 'Prost, Atze!'}
          </button>
        </div>
      </div>

      <button
        onClick={onClose}
        aria-label={lang === 'en' ? 'Close notification' : 'Benachrichtigung schließen'}
        className="p-1 rounded-full border border-ink/10 bg-canvas-soft hover:bg-ink text-ink hover:text-canvas transition-colors cursor-pointer shrink-0 shadow hover:-translate-y-0.5 hover:shadow-md"
      >
        <X className="h-4 w-4" strokeWidth={2} />
      </button>

    </div>
  );
}
