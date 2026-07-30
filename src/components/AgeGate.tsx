import { useState, useEffect } from 'react';
import Shield from 'lucide-react/dist/esm/icons/shield';
import { translations } from '../constants/translations';
import { Language } from '../types';

interface AgeGateProps {
  lang: Language;
  onVerified: () => void;
}

export default function AgeGate({ lang, onVerified }: AgeGateProps) {
  const [remember, setRemember] = useState(true);
  const t = translations[lang];

  useEffect(() => {
    const isVerified = localStorage.getItem('atzengold_age_verified');
    if (isVerified === 'true') {
      onVerified();
    }
  }, [onVerified]);

  const handleVerifySuccess = () => {
    if (remember) {
      localStorage.setItem('atzengold_age_verified', 'true');
    }
    onVerified();
  };

  const handleVerifyFailure = () => {
    window.location.href = 'https://bierbewusstgeniessen.de/';
  };

  const titleText = lang === 'en' ? 'Are You Over 16?' : 'Bist Du über 16?';
  const disclaimerText = lang === 'en'
    ? 'Persons under the age of 16 are therefore requested not to enter our website. Thank you for your understanding.'
    : 'Personen unter 16 Jahren werden daher gebeten, unsere Webseiten nicht zu betreten. Wir danken für Ihr Verständnis.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark-900/80 backdrop-blur-md p-4 font-sans">

      {/* Master Frame */}
      <div className="relative w-full max-w-[500px] bg-canvas dark:bg-brand-dark-900 border border-ink/10 dark:border-canvas/10 rounded-3xl p-8 sm:p-12 flex flex-col items-center text-center shadow-2xl">

        {/* Atzengold Logo Motif Block */}
        <div className="relative mb-8 flex items-center justify-center border-b border-ink/10 dark:border-canvas/10 pb-6 w-full">
          <img
            src="/atzengold-logo.webp"
            alt="Atzengold Logo"
            className="h-16 w-auto object-contain drop-shadow-sm filter contrast-125"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-ink dark:text-canvas font-heading tracking-tighter mb-8 transform -rotate-2">
          <span className="relative inline-block">
            {titleText}
            <span className="absolute -bottom-2 left-0 w-full h-3 bg-accent/30 -skew-x-12 -z-10"></span>
          </span>
        </h1>

        {/* Buttons: Side-by-Side organic buttons */}
        <div className="flex flex-row justify-center items-center gap-4 w-full">
          <button
            id="btn-age-verify"
            onClick={handleVerifySuccess}
            className="flex-1 max-w-[150px] cursor-pointer bg-ink text-canvas dark:bg-canvas dark:text-ink hover:bg-accent dark:hover:bg-accent hover:text-ink dark:hover:text-ink rounded-full py-4 px-6 text-lg font-black tracking-widest uppercase transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 whitespace-nowrap"
          >
            {lang === 'en' ? 'YES' : 'JA'}
          </button>

          <button
            id="btn-age-verify-fail"
            onClick={handleVerifyFailure}
            className="flex-1 max-w-[150px] cursor-pointer bg-transparent border border-ink/20 dark:border-canvas/20 text-ink dark:text-canvas hover:bg-ink hover:text-canvas dark:hover:bg-canvas dark:hover:text-ink rounded-full py-4 px-6 text-lg font-black tracking-widest uppercase transition-all duration-300 text-center hover:shadow-xl hover:-translate-y-1 whitespace-nowrap"
          >
            {lang === 'en' ? 'NO' : 'NEIN'}
          </button>
        </div>

        <p className="mt-8 text-[10px] font-mono leading-relaxed text-ink-secondary dark:text-canvas/60 max-w-[340px] mx-auto uppercase">
          {disclaimerText}
        </p>

        {/* Subtle device caching checkbox */}
        <label className="mt-6 flex items-center justify-center gap-3 text-xs text-ink-secondary dark:text-canvas/70 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="peer h-5 w-5 rounded-md border-2 border-ink/30 dark:border-canvas/30 bg-transparent text-accent focus:ring-accent/20 cursor-pointer transition-colors checked:border-accent"
            />
          </div>
          <span className="group-hover:text-ink dark:group-hover:text-canvas transition-colors uppercase font-mono tracking-wider">
            {t.ageGateRemember}
          </span>
        </label>
      </div>
    </div>
  );
}
