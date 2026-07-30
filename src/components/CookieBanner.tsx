import React, { useState, useEffect } from 'react';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import Info from 'lucide-react/dist/esm/icons/info';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Check from 'lucide-react/dist/esm/icons/check';
import X from 'lucide-react/dist/esm/icons/x';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import { Language } from '../types';
import { motion, AnimatePresence } from 'motion/react';

import klaro from 'klaro/dist/klaro-no-css';
import { klaroConfig } from '../config/klaroConfig';

interface CookieBannerProps {
  lang: Language;
  onConsentSaved: (consents: { marketing: boolean; functional: boolean; essential: boolean }) => void;
  onTriggerNotification?: (message: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onShowPrivacy?: () => void;
  onShowImpressum?: () => void;
}

export default function CookieBanner({ lang, onConsentSaved, onTriggerNotification, isOpen, onClose, onShowPrivacy, onShowImpressum }: CookieBannerProps) {
  const [show, setShow] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [functional, setFunctional] = useState(false);
  const [essential] = useState(true); // Essenziell is always required
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Use either controlled isOpen or internal show state
  const isCurrentlyShowing = isOpen !== undefined ? isOpen : show;

  const getKlaroManager = () => {
    return klaro?.getManager(klaroConfig);
  };

  useEffect(() => {
    const manager = getKlaroManager();
    if (!manager) return;

    manager.loadConsents();

    // Check if consent has already been given (Klaro state holds the consents)
    const hasConsented = manager.confirmed;

    if (!hasConsented) {
      if (isOpen === undefined) {
        // Show banner on initial visit (delayed slightly for elegant entrance)
        const timer = setTimeout(() => {
          setShow(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } else {
      const consents = manager.consents;
      onConsentSaved({
        marketing: !!consents['marketing-analytics'],
        functional: !!consents['functional-prefs'],
        essential: true
      });
      setMarketing(!!consents['marketing-analytics']);
      setFunctional(!!consents['functional-prefs']);
    }
  }, [onConsentSaved, isOpen]);

  const handleSave = () => {
    const manager = getKlaroManager();
    if (manager) {
      manager.updateConsent('marketing-analytics', marketing);
      manager.updateConsent('functional-prefs', functional);
      manager.saveAndApplyConsents();
    }

    const consent = { marketing, functional, essential };
    onConsentSaved(consent);
    setShow(false);
    if (onClose) onClose();

    if (onTriggerNotification) {
      let toastMsg = '';
      if (lang === 'en') {
        toastMsg = marketing
          ? '🍪 Cookie Preferences Saved: Marketing and analytics tracking activated!'
          : '🍪 Cookie Preferences Saved: Essential-only storage activated.';
      } else {
        toastMsg = marketing
          ? '🍪 Cookie-Präferenzen gespeichert: Marketing- und Analyse-Cookies aktiviert!'
          : '🍪 Cookie-Präferenzen gespeichert: Nur essenzielle Cookies aktiviert.';
      }
      onTriggerNotification(toastMsg);
    }
  };

  const handleAcceptAll = () => {
    const manager = getKlaroManager();
    if (manager) {
      manager.updateConsent('marketing-analytics', true);
      manager.updateConsent('functional-prefs', true);
      manager.saveAndApplyConsents();
    }

    setMarketing(true);
    setFunctional(true);
    const consent = { marketing: true, functional: true, essential: true };
    onConsentSaved(consent);
    setShow(false);
    if (onClose) onClose();

    if (onTriggerNotification) {
      const toastMsg = lang === 'en'
        ? '🍪 All cookies accepted! Highly personalized street analytics online.'
        : '🍪 Alle Cookies akzeptiert! Optimierte Marketing- und Personalisierungsfunktionen aktiv.';
      onTriggerNotification(toastMsg);
    }
  };

  const handleDeclineAll = () => {
    const manager = getKlaroManager();
    if (manager) {
      manager.updateConsent('marketing-analytics', false);
      manager.updateConsent('functional-prefs', false);
      manager.saveAndApplyConsents();
    }

    setMarketing(false);
    setFunctional(false);
    const consent = { marketing: false, functional: false, essential: true };
    onConsentSaved(consent);
    setShow(false);
    if (onClose) onClose();

    if (onTriggerNotification) {
      const toastMsg = lang === 'en'
        ? '🍪 Disallowed optional cookies. Running in core essential-only privacy mode.'
        : '🍪 Optionale Cookies abgelehnt. Nur essenzielle Funktionen sind aktiv.';
      onTriggerNotification(toastMsg);
    }
  };

  // Helper button to reset and show dialog manually
  const forceOpenDialog = () => {
    setShow(true);
  };

  if (!isCurrentlyShowing) {
    return null;
  }

  // Local translations for high fidelity
  const localT = {
    de: {
      brand: "Atzengold - von der Strasse für die Strasse",
      title: "Wir schützen deine Privatsphäre",
      desc: "Auf dieser Website kommen Cookies und ähnliche Technologien zum Einsatz, die der Leistungsoptimierung, der Personalisierung von Anzeigen sowie weiteren Marketing- und/oder Analysezwecken dienen können. Über die unten stehenden Funktionen haben Sie die Möglichkeit, Ihr Einwilligungsverhalten zu steuern, also Einwilligungen zu erteilen, zu verweigern oder zu widerrufen.",
      privacy: "Datenschutzerklärung",
      imprint: "Impressum",
      marketing: "Marketing",
      functional: "Funktionell",
      essential: "Essenziell",
      more: "Mehr",
      save: "Speichern",
      decline: "Ablehnen",
      acceptAll: "Alles akzeptieren",
      powered: "Powered by Usercentrics Consent Management"
    },
    en: {
      brand: "Atzengold - From the Street, For the Street",
      title: "We value and protect your privacy",
      desc: "On this website, cookies and similar technologies are used, which may serve the purpose of performance optimization, personalization of ads, and other marketing and/or analysis purposes. Via the settings below, you have the option to control your consent preferences, granting, refusing, or withdrawing permissions at all times.",
      privacy: "Privacy Policy",
      imprint: "Legal Disclosure",
      marketing: "Marketing",
      functional: "Functional Options",
      essential: "Essential",
      more: "More Info",
      save: "Save Preferences",
      decline: "Decline All",
      acceptAll: "Accept All Cookies",
      powered: "Powered by Usercentrics Consent Management"
    }
  };

  const activeT = localT[lang] || localT.de;

  return (
    <div className="fixed inset-0 bg-ink/60 dark:bg-ink/85 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
      <motion.div
        id="cookie-consent-modal"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-canvas dark:bg-brand-dark-900 text-ink dark:text-canvas max-w-2xl w-full border border-ink/10 dark:border-canvas/10 rounded-3xl shadow-2xl overflow-hidden text-left flex flex-col font-sans"
      >
        {/* Banner Content Main Block */}
        <div className="p-6 md:p-8 space-y-6">

          {/* Header & Logo styling matching screenshot but fully brand aligned */}
          <div className="flex justify-between items-start border-b border-ink/10 dark:border-canvas/10 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3.5xl font-black uppercase tracking-tight text-ink dark:text-canvas font-heading">
                {activeT.brand}
              </h1>
              <h2 className="text-base sm:text-lg font-bold text-ink-secondary dark:text-canvas/80 tracking-tight mt-1 uppercase">
                {activeT.title}
              </h2>
            </div>
            <div className="p-3 bg-ink/5 dark:bg-canvas/5 rounded-full shadow-inner">
              <ShieldCheck className="h-6 w-6 text-ink dark:text-canvas" />
            </div>
          </div>

          {!isDetailsOpen ? (
            <>
              {/* Core informational text */}
              <p className="text-ink-secondary dark:text-canvas/70 text-xs sm:text-sm leading-relaxed font-medium">
                {activeT.desc}
              </p>

              {/* High precision underline legal links */}
              <div className="flex gap-4 text-xs font-bold text-ink-mute dark:text-canvas/50">
                <a
                  href="#datenschutz"
                  className="hover:text-ink dark:hover:text-canvas underline underline-offset-4 focus:outline-none transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onShowPrivacy) {
                      onShowPrivacy();
                    } else {
                      alert("Datenschutzerklärung: Atzengold processes telemetry logs locally.");
                    }
                  }}
                >
                  {activeT.privacy}
                </a>
                <a
                  href="#impressum"
                  className="hover:text-ink dark:hover:text-canvas underline underline-offset-4 focus:outline-none transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onShowImpressum) {
                      onShowImpressum();
                    } else {
                      alert("Impressum: Atzengold GbR. Germany.");
                    }
                  }}
                >
                  {activeT.imprint}
                </a>
              </div>

              {/* Switch toggles styled like screenshot but brand integrated */}
              <div className="border-t border-b border-ink/10 dark:border-canvas/10 py-4 my-2 flex flex-col sm:flex-row items-center justify-between gap-4">

                {/* 1. Marketing Toggle */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                  <span className="text-sm font-bold text-ink dark:text-canvas uppercase tracking-wide">{activeT.marketing}</span>
                  <button
                    role="switch"
                    aria-checked={marketing}
                    aria-label={activeT.marketing}
                    onClick={() => setMarketing(!marketing)}
                    className={`cursor-pointer w-12 h-6 rounded-full flex items-center p-1 transition-colors relative duration-300 shadow-inner ${
                      marketing ? 'bg-accent' : 'bg-ink/20 dark:bg-canvas/20'
                    }`}
                  >
                    <div
                      className="bg-canvas dark:bg-canvas w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold transition-transform duration-300 shadow-sm"
                      style={{ transform: marketing ? 'translateX(24px)' : 'translateX(0px)' }}
                    >
                      {marketing ? <Check className="h-2.5 w-2.5 text-on-accent stroke-3" /> : <X className="h-2.5 w-2.5 text-ink-mute stroke-3" />}
                    </div>
                  </button>
                </div>

                {/* 2. Functional Toggle */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                  <span className="text-sm font-bold text-ink dark:text-canvas uppercase tracking-wide">{activeT.functional}</span>
                  <button
                    role="switch"
                    aria-checked={functional}
                    aria-label={activeT.functional}
                    onClick={() => setFunctional(!functional)}
                    className={`cursor-pointer w-12 h-6 rounded-full flex items-center p-1 transition-colors relative duration-300 shadow-inner ${
                      functional ? 'bg-accent' : 'bg-ink/20 dark:bg-canvas/20'
                    }`}
                  >
                    <div
                      className="bg-canvas dark:bg-canvas w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold transition-transform duration-300 shadow-sm"
                      style={{ transform: functional ? 'translateX(24px)' : 'translateX(0px)' }}
                    >
                      {functional ? <Check className="h-2.5 w-2.5 text-on-accent stroke-3" /> : <X className="h-2.5 w-2.5 text-ink-mute stroke-3" />}
                    </div>
                  </button>
                </div>

                {/* 3. Essential Toggle (Checked & Disabled/Locked) */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                  <span className="text-sm font-bold text-ink-mute dark:text-canvas/40 uppercase tracking-wide">{activeT.essential}</span>
                  <button
                    role="switch"
                    aria-checked={true}
                    aria-label={activeT.essential}
                    disabled
                    className="w-12 h-6 rounded-full bg-ink/10 dark:bg-canvas/10 flex items-center p-1 relative cursor-not-allowed opacity-80 shadow-inner border-none"
                  >
                    <div className="bg-canvas dark:bg-canvas w-4 h-4 rounded-full flex items-center justify-center translate-x-[24px] shadow-sm">
                      <Check className="h-2.5 w-2.5 text-primary dark:text-primary stroke-3" />
                    </div>
                  </button>
                </div>

              </div>
            </>
          ) : (
            <div className="space-y-4 animate-fadeIn pb-2 text-ink-secondary dark:text-canvas/70 max-h-[250px] overflow-y-auto pr-1 text-xs">
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="flex items-center gap-1 text-ink-mute hover:text-ink dark:text-canvas/50 dark:hover:text-canvas font-bold mb-3 cursor-pointer uppercase py-1 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> {lang === 'en' ? 'Back' : 'Zurück'}
              </button>
              <h3 className="font-bold text-sm text-ink dark:text-canvas uppercase border-b border-ink/10 dark:border-canvas/10 pb-1">1. {activeT.essential} Cookies</h3>
              <p>{lang === 'en' ? 'Essential cookies are needed to render proper application components such as age verification, language session persistence, and selected locations.' : 'Essenzielle Cookies werden benötigt, um zentrale Funktionen wie Altersverifikation, Sprachspeicherung und ausgewählte Standorte korrekt darzustellen.'}</p>

              <h3 className="font-bold text-sm text-ink dark:text-canvas uppercase border-b border-ink/10 dark:border-canvas/10 pb-1">2. {activeT.functional} Cookies</h3>
              <p>{lang === 'en' ? 'Functional cookies track preferred beer choices and UI perspective preferences. This enables the 3D map coordinates to save state.' : 'Funktionelle Cookies speichern bevorzugte Bierauswahl und UI-Einstellungen. Dadurch können die 3D-Kartenkoordinaten gespeichert werden.'}</p>

              <h3 className="font-bold text-sm text-ink dark:text-canvas uppercase border-b border-ink/10 dark:border-canvas/10 pb-1">3. {activeT.marketing} Cookies</h3>
              <p>{lang === 'en' ? 'Marketing and analytical cookies record real-time inventory tracking notification states to log updates onto your screen and alert on-demand deliveries.' : 'Marketing- und Analyse-Cookies erfassen Echtzeit-Bestandsinformationen, um Updates auf deinem Bildschirm anzuzeigen und bei Bedarf auf Lieferungen hinzuweisen.'}</p>
            </div>
          )}

          {/* Buttons matching colors perfectly */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 pt-4 border-t border-ink/10 dark:border-canvas/10 font-bold text-sm">
            <button
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              className="px-6 py-3 rounded-full cursor-pointer bg-transparent hover:bg-ink/5 dark:bg-canvas/10 dark:hover:bg-canvas/20 text-ink dark:text-canvas transition-all text-xs uppercase font-black whitespace-nowrap border border-ink/20 dark:border-canvas/20"
            >
              {isDetailsOpen ? 'BACK' : activeT.more}
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-full cursor-pointer bg-ink hover:bg-ink/90 text-canvas dark:bg-canvas dark:hover:bg-canvas/90 dark:text-ink transition-all text-xs uppercase shadow-md hover:shadow-lg hover:-translate-y-0.5 font-black whitespace-nowrap"
            >
              {activeT.save}
            </button>
            <button
              onClick={handleDeclineAll}
              className="px-6 py-3 rounded-full cursor-pointer bg-transparent border border-ink/20 text-ink-secondary hover:border-ink hover:text-ink dark:border-canvas/20 dark:text-canvas/80 dark:hover:border-canvas dark:hover:text-canvas transition-all text-xs uppercase font-black whitespace-nowrap"
            >
              {activeT.decline}
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-6 py-3 rounded-full cursor-pointer bg-ink text-canvas hover:bg-ink/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-xs uppercase font-black whitespace-nowrap"
            >
              {activeT.acceptAll}
            </button>
          </div>

        </div>

        {/* Footer brand disclaimer */}
        <div className="bg-ink/5 dark:bg-canvas/5 p-3 text-center text-[10px] text-ink-mute dark:text-canvas/40 font-mono uppercase">
          {activeT.powered}
        </div>
      </motion.div>
    </div>
  );
}
