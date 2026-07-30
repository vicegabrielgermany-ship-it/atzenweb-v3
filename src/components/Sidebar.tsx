import { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import X from 'lucide-react/dist/esm/icons/x';
import { Language } from '../types';

const Bottle3D = lazy(() => import('./Bottle3D'));

interface SidebarProps {
  lang: Language;
  onLangChange: () => void;
  isOpen: boolean;
  onClose: () => void;
  onLogoClick?: () => void;
}

const navLinks = [
  { label: 'ROOTS', href: '#roots' },
  { label: 'STORY', href: '#story' },
  { label: 'MEINUNGEN', href: '#testimonials' },
  { label: 'SHOP', href: '#shop' },
];

function SidebarContent({ lang, onLangChange, onNavClick, onLogoClick }: {
  lang: Language;
  onLangChange: () => void;
  onNavClick?: () => void;
  onLogoClick?: () => void;
}) {
  const sidebarStyle = {
    scrollbarWidth: 'none' as const,
    '-ms-overflowStyle': 'none' as const,
  };

  return (
    <>
      {/* Logo GIF — scrolls to top on homepage */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (onLogoClick) {
            onLogoClick();
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          onNavClick?.();
        }}
        className="block mb-2"
      >
        <img src="/elemente/Logo.gif" alt="Atzengold" className="w-[235px] h-auto object-contain" />
      </a>

      <p className="text-[14px] font-bold text-black mb-5">Lecker Bierchen!</p>

      <nav className="flex flex-col gap-2.5 mb-5" aria-label="Site navigation">
        {navLinks.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            onClick={onNavClick}
            className="text-xs text-black underline underline-offset-2 hover:text-black/70 transition-colors uppercase tracking-wide"
          >
            {label}
          </a>
        ))}
      </nav>

      <a
        href="https://www.instagram.com/atzengold/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="mb-4 block w-7 h-7"
      >
        <img src="/elemente/ICON_Insta.png" alt="Instagram" className="w-7 h-7 object-contain" />
      </a>

      {/* Bier Finden — clean bordered button */}
      <a
        href="#map-finder"
        onClick={onNavClick}
        className="block border border-black text-black text-[11px] font-bold uppercase tracking-widest px-4 py-2.5 text-center transition-colors hover:bg-black hover:text-canvas"
      >
        BIER FINDEN
      </a>

      <div className="flex-1 flex flex-col items-center justify-end pb-4">
        <Suspense fallback={
          <div className="w-full aspect-[3/4] bg-ink/5 rounded animate-pulse" />
        }>
          <Bottle3D
            labels={{
              shoulder: '/labels/atzengold-bottle-neck-label.webp',
              body: '/labels/atzengold-bottle-front-label.webp',
              back: '/labels/atzengold-bottle-back-label.webp',
            }}
            autoRotate={true}
            className="w-[min(92vw,500px)] h-[min(64vh,560px)]"
          />
        </Suspense>
      </div>

      <div className="px-6 pb-6">
        <button
          onClick={onLangChange}
          aria-label={lang === 'en' ? 'Sprache wechseln zu Deutsch' : 'Switch language to English'}
          className="text-[9px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors cursor-pointer bg-transparent border-none p-0 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded"
        >
          {lang === 'en' ? 'DE' : 'EN'}
        </button>
      </div>
    </>
  );
}

export default function Sidebar({ lang, onLangChange, isOpen, onClose, onLogoClick }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar — sticky, visible at lg+ */}
      <aside
        className="sticky top-0 h-screen w-[210px] bg-canvas z-40 flex-col px-6 pt-8 pb-0 overflow-y-auto sidebar-scrollbar-hidden hidden lg:flex shrink-0"
        style={{ scrollbarWidth: 'none', '-ms-overflowStyle': 'none' }}
      >
        <SidebarContent lang={lang} onLangChange={onLangChange} onLogoClick={onLogoClick} />
      </aside>

      {/* Mobile drawer — slide-in overlay at < lg */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-50 lg:hidden"
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed left-0 top-0 h-screen w-[280px] max-w-[85vw] bg-canvas z-50 flex flex-col overflow-y-auto lg:hidden"
              style={{ scrollbarWidth: 'none', '-ms-overflowStyle': 'none' }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Menü schließen"
                className="absolute top-4 right-4 z-10 p-2 text-ink/60 hover:text-ink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="px-6 pt-8 pb-0 flex flex-col flex-1">
                <SidebarContent lang={lang} onLangChange={onLangChange} onNavClick={onClose} onLogoClick={onLogoClick} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
