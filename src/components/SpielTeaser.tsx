import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import X from 'lucide-react/dist/esm/icons/x';
import { Language } from '../types';

// Teaser fürs Kärwa-Spiel (www.atzengold.net/spiel/).
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

/** Goldener Störer, der an der mitfahrenden Flasche hängt (Seitenleiste). */
export function SpielStoerer({ lang, onClick }: { lang: Language; onClick?: () => void }) {
  if (!gewinnspielLaeuft()) return null;
  const en = lang === 'en';
  return (
    <motion.a
      href={SPIEL_URL}
      onClick={onClick}
      aria-label={en ? 'Beer tap game – win tasty merch' : 'Bier-Zapf Spiel – gewinne lecker Merch'}
      className="absolute z-10 block w-[118px] h-[118px] -top-2 right-0 drop-shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ opacity: { duration: 0.4 } }}
      whileHover={{ scale: 1.1 }}
    >
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
        <span className="text-[13px] font-bold leading-[1.05]">{en ? <>BEER TAP<br />GAME</> : <>BIER-ZAPF<br />SPIEL</>}</span>
        <span className="text-[30px] font-bold leading-[0.9] my-0.5" aria-hidden="true">→</span>
        <span className="text-[10px] font-bold leading-[1.15]">{en ? <>Win tasty<br />merch</> : <>Gewinne<br />lecker Merch</>}</span>
      </span>
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
                <span className="block text-[11px] font-bold tracking-wide">{en ? 'BEER TAP GAME' : 'BIER-ZAPF SPIEL'}</span>
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
