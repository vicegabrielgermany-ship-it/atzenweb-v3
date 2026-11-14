import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import X from 'lucide-react/dist/esm/icons/x';
import { Language } from '../types';

// Teaser fürs Bier-Zapf-Spiel (www.atzengold.net/spiel/).
// Nach Ende des Gewinnspiels blenden sich Störer und Leiste von selbst aus.
export const SPIEL_URL = '/spiel/';
const GEWINNSPIEL_ENDE = Date.parse('2026-12-31T23:59:59+01:00');
export const gewinnspielLaeuft = () => Date.now() < GEWINNSPIEL_ENDE;

const STERN_ZACKEN = (() => {
  const pts: string[] = [];
  for (let k = 0; k < 32; k++) {
    const r = k % 2 ? 44 : 50, a = (k * Math.PI) / 16;
    pts.push(`${(50 + Math.cos(a) * r).toFixed(1)},${(50 + Math.sin(a) * r).toFixed(1)}`);
  }
  return pts.join(' ');
})();

/** Inhalt des Störers: drehender Stern, stehende Schrift. */
function StoererInhalt({ en, gross }: { en: boolean; gross: boolean }) {
  return (
    <>
      {/* Nur der Stern dreht sich (gegen den Uhrzeigersinn), die Schrift bleibt stehen */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
        animate={{ rotate: -360 }}
        transition={{ duration: 14, ease: 'linear', repeat: Infinity }}
      >
        <polygon points={STERN_ZACKEN} fill="var(--color-accent)" stroke="var(--color-ink)" strokeWidth="1.6" />
      </motion.svg>
      <span className="relative flex flex-col items-center justify-center w-full h-full text-ink text-center leading-tight px-2">
        <span className={(gross ? 'text-[19px]' : 'text-[13px]') + ' font-bold leading-[1.05]'}>{en ? <>BEER TAP<br />GAME</> : <>BIER-ZAPF<br />SPIEL</>}</span>
        <span className={(gross ? 'text-[42px]' : 'text-[30px]') + ' font-bold leading-[0.9] my-0.5'} aria-hidden="true">→</span>
        <span className={(gross ? 'text-[14px]' : 'text-[10px]') + ' font-bold leading-[1.15]'}>{en ? <>Win tasty<br />merch</> : <>Gewinne<br />lecker Merch</>}</span>
      </span>
    </>
  );
}

const GROSS = 170;   // Durchmesser des Störers am Desktop (px)

/**
 * Goldener Störer an der mitfahrenden Flasche (Seitenleiste).
 * Desktop (schwebend): größer, pulsiert und ragt zu einem Drittel über den Inhalt in der Mitte.
 * Da die Seitenleiste scrollbar ist und alles abschneidet, was übersteht, liegt der Störer
 * dort fest auf der Seite und richtet sich an seinem Platz in der Seitenleiste aus.
 */
export function SpielStoerer({ lang, onClick, schwebend = false }: { lang: Language; onClick?: () => void; schwebend?: boolean }) {
  const anker = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    if (!schwebend) return;
    const el = anker.current;
    if (!el) return;
    const leiste = el.closest('aside');
    let raf = 0;
    const messen = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const a = el.getBoundingClientRect();
        if (!leiste || a.width === 0 && a.height === 0 && !el.offsetParent) { setPos(null); return; }
        const rand = leiste.getBoundingClientRect().right;
        setPos({ left: rand - (GROSS * 2) / 3, top: Math.max(8, a.top + 18) });   // etwas Abstand zum „Bier finden“-Knopf
      });
    };
    messen();
    const ro = new ResizeObserver(messen);
    ro.observe(document.documentElement);
    if (leiste) { ro.observe(leiste); leiste.addEventListener('scroll', messen, { passive: true }); }
    window.addEventListener('resize', messen);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); leiste?.removeEventListener('scroll', messen); window.removeEventListener('resize', messen); };
  }, [schwebend]);

  if (!gewinnspielLaeuft()) return null;
  const en = lang === 'en';
  const label = en ? 'Beer tap game – win tasty merch' : 'Bier-Zapf Spiel – gewinne lecker Merch';

  if (schwebend) {
    return (
      <>
        <span ref={anker} aria-hidden="true" className="absolute -top-2 right-0 w-0 h-0" />
        {pos && createPortal(
          <motion.a
            href={SPIEL_URL}
            onClick={onClick}
            aria-label={label}
            className="fixed z-[45] hidden lg:block rounded-full drop-shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            style={{ left: pos.left, top: pos.top, width: GROSS, height: GROSS }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: [1, 1.09, 1] }}
            transition={{ opacity: { duration: 0.4 }, scale: { duration: 1.4, ease: 'easeInOut', repeat: Infinity } }}
            whileHover={{ scale: 1.14 }}
          >
            <StoererInhalt en={en} gross />
          </motion.a>,
          document.body,
        )}
      </>
    );
  }

  return (
    <motion.a
      href={SPIEL_URL}
      onClick={onClick}
      aria-label={label}
      className="absolute z-10 block w-[118px] h-[118px] -top-2 right-0 drop-shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ opacity: { duration: 0.4 } }}
      whileHover={{ scale: 1.1 }}
    >
      <StoererInhalt en={en} gross={false} />
    </motion.a>
  );
}

/** Leiste am unteren Rand fürs Handy: erscheint 2 Sekunden nach dem Seitenaufruf, lässt sich wegklicken. */
export function SpielLeiste({ lang, hidden }: { lang: Language; hidden: boolean }) {
  const [bereit, setBereit] = useState(false);
  const [zu, setZu] = useState(() => {
    try { return sessionStorage.getItem('ag_spiel_leiste_zu') === '1'; } catch { return false; }
  });

  useEffect(() => {
    const t = setTimeout(() => setBereit(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (!gewinnspielLaeuft()) return null;
  const en = lang === 'en';
  const sichtbar = bereit && !zu && !hidden;
  const schliessen = () => {
    setZu(true);
    try { sessionStorage.setItem('ag_spiel_leiste_zu', '1'); } catch { /* egal */ }
  };

  return (
    <AnimatePresence>
      {sichtbar && (
        <motion.div
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          exit={{ y: '110%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 260 }}
          className="fixed inset-x-0 bottom-0 z-40 lg:hidden px-3 pt-2"
          style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}
          role="complementary"
          aria-label={en ? 'Beer tap game' : 'Bier-Zapf Spiel'}
        >
          <div className="flex items-center gap-2 bg-accent border-2 border-ink shadow-lg pl-3 pr-1 py-1.5">
            <a href={SPIEL_URL} className="flex-1 min-w-0 flex items-center gap-2 text-ink no-underline">
              <span className="relative flex-1 min-w-0 leading-tight">
                <span className="block text-[17px] font-bold tracking-wide [-webkit-text-stroke:0.6px_currentColor]">{en ? 'BEER TAP GAME' : 'BIER-ZAPF SPIEL'}</span>
                <span className="block text-[13px] font-bold truncate">{en ? 'Win tasty merch' : 'Gewinne lecker Merch'}</span>
                {/* Bierkrug saust unter der Schrift von links nach rechts durch, immer wieder */}
                <span aria-hidden="true" className="block relative h-5 overflow-hidden">
                  <motion.span
                    className="absolute inset-y-0 left-0 flex items-center justify-end w-[calc(100%+1.5rem)]"
                    initial={{ x: '-100%' }}
                    animate={{ x: ['-100%', '0%'] }}
                    transition={{ duration: 2.2, ease: 'linear', repeat: Infinity, repeatDelay: 0.6 }}
                  >
                    <span className="block w-6 text-center text-base leading-none">🍺</span>
                  </motion.span>
                </span>
              </span>
              <span className="shrink-0 bg-ink text-canvas text-[20px] leading-none font-bold px-4 py-2" aria-hidden="true">
                →
              </span>
            </a>
            <button
              onClick={schliessen}
              aria-label={en ? 'Hide' : 'Ausblenden'}
              className="shrink-0 p-2 text-ink/70 hover:text-ink"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
