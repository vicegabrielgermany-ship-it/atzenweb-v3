import Instagram from 'lucide-react/dist/esm/icons/instagram';
import Mail from 'lucide-react/dist/esm/icons/mail';
import ShieldAlert from 'lucide-react/dist/esm/icons/shield-alert';
import GoldBarsSVG from './GoldBarsSVG';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
  onShowImpressum: () => void;
  onShowDatenschutz: () => void;
  onShowAGB: () => void;
  onShowWiderrufsrecht: () => void;
  onShowCookies: () => void;
  onLangToggle: () => void;
}

export default function Footer({
  lang,
  onShowImpressum,
  onShowDatenschutz,
  onShowAGB,
  onShowWiderrufsrecht,
  onShowCookies,
  onLangToggle,
}: FooterProps) {
  return (
    <footer className="bg-canvas border-t border-black/10 py-16 px-4 md:px-8 transition-colors duration-200">
      <div className="content-width">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Crests, Logo, Tagline & Contact info */}
          <div className="lg:col-span-4 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="w-full max-w-[240px]">
              <div className="flex items-center gap-4 select-none">
                <GoldBarsSVG className="w-14 h-10 grayscale brightness-75 contrast-150" />
                <img src="/atzengold-logo.webp" alt="Atzengold Logo" className="h-[5.625rem] w-auto object-contain grayscale brightness-75 contrast-150" />
                <GoldBarsSVG className="w-14 h-10 grayscale brightness-75 contrast-150" mirrored />
              </div>
            </div>

            <div className="w-full max-w-[240px]">
              <img src="/elemente/frankenxberlin.webp" alt="Franken x Berlin" className="w-full h-auto" />
            </div>

            <p className="text-sm text-black/70 font-medium max-w-sm">
              {lang === 'en'
                ? 'Traditional unfiltered cellar beer culture. Brewed with heritage ingredients for authentic flavor.'
                : 'Naturtrübe Kellerbier-Kultur für beste Atzen.'}
            </p>

            <div className="text-[11px] text-black/80 font-mono space-y-1 pt-2">
              <div>
                E-Mail: <a href="mailto:info@atzengold.net" className="hover:text-accent underline transition-colors">info@atzengold.net</a>
              </div>
              <div>
                Tel: <a href="tel:+4917662345740" className="hover:text-accent underline transition-colors">+49 (0) 176 623 457 40</a>
              </div>
              <div>
                {lang === 'en' ? 'Address: Atzenhofer Str. 76, 90768 Fürth' : 'Adresse: Atzenhofer Str. 76, 90768 Fürth (Atzenhof)'}
              </div>
            </div>
          </div>

          {/* Right Column: Legal links */}
          <div className="lg:col-span-8 flex flex-col gap-3 lg:pl-16">
            <h4 className="text-xs uppercase tracking-wider text-black/80 font-bold font-sans">
              {lang === 'en' ? 'Legal' : 'Rechtliches'}
            </h4>
            <div className="flex flex-col gap-2 text-sm text-black/80 font-medium items-start">
              <button onClick={onShowImpressum} className="hover:underline transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded">
                Impressum
              </button>
              <button onClick={onShowDatenschutz} className="hover:underline transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded">
                Datenschutz
              </button>
              <button onClick={onShowAGB} className="hover:underline transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded">
                AGB
              </button>
              <button onClick={onShowWiderrufsrecht} className="hover:underline transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded">
                {lang === 'en' ? 'Right of Withdrawal' : 'Widerrufsrecht'}
              </button>
              <button onClick={onShowCookies} className="hover:underline transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded">
                {lang === 'en' ? 'Cookies' : 'Cookie-Einstellungen'}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-black/80">
          <div className="text-center md:text-left text-[11px] font-mono">
            © {CURRENT_YEAR} Atzengold GbR. {lang === 'en' ? 'All rights reserved.' : 'Alle Rechte vorbehalten.'}
          </div>

          <div className="flex gap-4 items-center justify-center">
            <a href="https://www.instagram.com/atzengold/" target="_blank" rel="noreferrer" aria-label="Instagram"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-black/5 hover:bg-accent hover:text-black text-black transition-all duration-200 border border-black/15">
              <Instagram className="h-4.5 w-4.5" />
            </a>
            <button onClick={onLangToggle}
              aria-label={lang === 'en' ? 'Switch to German' : 'Switch to English'}
              title={lang === 'en' ? 'Switch to German' : 'Switch to English'}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-black/5 hover:scale-105 active:scale-95 transition-all duration-200 border border-black/15 p-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 text-black">
              <span className="text-xs font-bold font-mono tracking-wide">{lang === 'en' ? 'EN' : 'DE'}</span>
            </button>
            <a href="mailto:info@atzengold.net" aria-label="E-Mail"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-black/5 hover:bg-accent hover:text-black text-black transition-all duration-200 border border-black/15">
              <Mail className="h-4.5 w-4.5" />
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center md:items-end text-right text-[11px] font-mono">
            <button onClick={() => { localStorage.removeItem('atzengold_age_verified'); window.location.reload(); }}
              className="hover:text-accent underline transition-colors cursor-pointer text-left">
              {lang === 'en' ? 'Reset Age Check' : 'Altersprüfung zurücksetzen'}
            </button>
            <div className="flex items-center gap-1.5 justify-center sm:justify-end text-black/80">
              <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
              <span>{lang === 'en' ? 'Drink responsibly. Age 16+' : 'Genuss ab 16 Jahren.'}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const CURRENT_YEAR = new Date().getFullYear();
