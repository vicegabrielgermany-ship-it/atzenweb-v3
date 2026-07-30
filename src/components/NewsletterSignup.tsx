import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';

interface NewsletterSignupProps {
  lang?: 'de' | 'en';
  onOpenDatenschutz?: () => void;
}

const LOCAL_TRANSLATIONS = {
  de: {
    title: "Bei Dir noch nicht erhältlich?",
    subtitle: "Sorry, wir sind noch klein, aber lass' Deine PLZ da und wir sagen Dir Bescheid wenn es uns in Deiner Nähe gibt ✌️",
    namePlaceholder: "Vorname",
    plzPlaceholder: "PLZ",
    emailPlaceholder: "E-Mail",
    privacyLabel: "Ich habe die ",
    privacyLink: "Datenschutzerklärung",
    privacyLabelEnd: " gelesen und akzeptiere sie.",
    button: "Abschicken",
    loading: "Wird verschickt...",
    successTitle: "Einwandfrei, Atze!",
    successText: "Danke! Wir melden uns, sobald es Atzengold in deiner Nähe gibt.",
    invalidEmail: "Gib bitte eine richtige E-Mail-Adresse ein!",
    invalidPlz: "Gib bitte eine gültige PLZ ein!",
    invalidPrivacy: "Bitte akzeptiere die Datenschutzerklärung."
  },
  en: {
    title: "Not available near you yet?",
    subtitle: "Sorry, we're still small, but leave your zip code and we'll let you know when we're near you ✌️",
    namePlaceholder: "First name",
    plzPlaceholder: "Zip code",
    emailPlaceholder: "Email",
    privacyLabel: "I have read the ",
    privacyLink: "privacy policy",
    privacyLabelEnd: " and accept it.",
    button: "Submit",
    loading: "Sending...",
    successTitle: "Outstanding, Atze!",
    successText: "Thanks! We'll let you know once Atzengold is available near you.",
    invalidEmail: "Please enter a valid email address!",
    invalidPlz: "Please enter a valid zip code!",
    invalidPrivacy: "Please accept the privacy policy."
  }
};

export default function NewsletterSignup({ lang = 'de', onOpenDatenschutz }: NewsletterSignupProps) {
  const [name, setName] = useState('');
  const [plz, setPlz] = useState('');
  const [email, setEmail] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const t = LOCAL_TRANSLATIONS[lang] || LOCAL_TRANSLATIONS.de;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setStatus('error');
      setErrorMessage(t.invalidEmail);
      return;
    }

    if (!plz || plz.trim().length < 4) {
      setStatus('error');
      setErrorMessage(t.invalidPlz);
      return;
    }

    if (!privacyAccepted) {
      setStatus('error');
      setErrorMessage(t.invalidPrivacy);
      return;
    }

    setStatus('loading');

    fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'newsletter',
        email,
        name,
        plz
      })
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Subscription failed');
        }
        setStatus('success');
        setName('');
        setPlz('');
        setEmail('');
      })
      .catch(() => {
        setStatus('error');
        setErrorMessage(t.invalidEmail);
      });
  };

  return (
    <div
      id="newsletter-signup-box"
      className="relative w-full p-6 md:p-8 border-2 border-primary bg-canvas shadow-md overflow-hidden transition-all"
    >
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center text-center py-6 space-y-3"
          >
            <div className="w-14 h-14 bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-display font-black text-ink">
                {t.successTitle}
              </h3>
              <p className="text-xs max-w-sm font-sans font-medium text-ink-secondary">
                {t.successText}
              </p>
            </div>
            <button
              onClick={() => setStatus('idle')}
              className="mt-1 cursor-pointer text-xs font-mono font-bold uppercase underline tracking-wider text-primary hover:text-primary/80 transition-colors"
            >
              {lang === 'en' ? 'Notify another zip code' : 'Weitere PLZ eintragen'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-handwritten font-bold text-ink flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {t.title}
              </h3>
              <p className="text-sm font-medium font-sans max-w-lg leading-snug text-ink-secondary">
                {t.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-4" aria-label={t.title}>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label htmlFor="newsletter-name" className="sr-only">{t.namePlaceholder}</label>
                  <input
                    id="newsletter-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder={t.namePlaceholder}
                    disabled={status === 'loading'}
                    className="w-full py-3 px-4 bg-white border-2 border-primary text-ink font-sans text-sm placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                <div className="w-full sm:w-28">
                  <label htmlFor="newsletter-plz" className="sr-only">{t.plzPlaceholder}</label>
                  <input
                    id="newsletter-plz"
                    type="text"
                    value={plz}
                    onChange={(e) => {
                      setPlz(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder={t.plzPlaceholder}
                    disabled={status === 'loading'}
                    className="w-full py-3 px-4 bg-white border-2 border-primary text-ink font-sans text-sm placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">{t.emailPlaceholder}</label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder={t.emailPlaceholder}
                    disabled={status === 'loading'}
                    className="w-full py-3 px-4 bg-white border-2 border-primary text-ink font-sans text-sm placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2.5 text-xs text-ink-secondary font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => {
                    setPrivacyAccepted(e.target.checked);
                    if (status === 'error') setStatus('idle');
                  }}
                  className="mt-0.5 h-4 w-4 border-2 border-primary text-primary accent-primary focus:ring-primary shrink-0"
                />
                <span>
                  {t.privacyLabel}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenDatenschutz?.();
                    }}
                    className="underline hover:text-primary transition-colors cursor-pointer"
                  >
                    {t.privacyLink}
                  </button>
                  {t.privacyLabelEnd}
                </span>
              </label>

              <AnimatePresence>
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-2 text-xs font-mono font-bold text-ink bg-primary/5 border border-primary/20 p-3 shadow-sm"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="cursor-pointer bg-primary hover:bg-primary/90 text-canvas px-8 py-3 text-sm font-sans font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:scale-[1.01] active:scale-95 disabled:opacity-70 disabled:cursor-wait w-full sm:w-auto flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t.loading}</span>
                  </>
                ) : (
                  <span>{t.button}</span>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
