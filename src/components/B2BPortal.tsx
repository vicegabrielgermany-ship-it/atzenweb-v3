import React, { useState } from 'react';
import Briefcase from 'lucide-react/dist/esm/icons/briefcase';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Phone from 'lucide-react/dist/esm/icons/phone';
import ShoppingBag from 'lucide-react/dist/esm/icons/shopping-bag';
import Calculator from 'lucide-react/dist/esm/icons/calculator';
import Check from 'lucide-react/dist/esm/icons/check';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import FileCheck2 from 'lucide-react/dist/esm/icons/file-check-2';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import { translations } from '../constants/translations';
import { Language } from '../types';

interface B2BPortalProps {
  lang: Language;
}

export default function B2BPortal({ lang }: B2BPortalProps) {
  const t = translations[lang];

  // Form states
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  // Quantities for wholesale calculator
  const [crates, setCrates] = useState<number>(5);
  const [kegs, setKegs] = useState<number>(2);

  // Success state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Calculations
  const PRICE_CRATE = 18.90; // Premium wholesale pricing
  const PRICE_KEG = 79.00; // 30L draft keg

  const totalCratesCost = crates * PRICE_CRATE;
  const totalKegsCost = kegs * PRICE_KEG;
  const grandTotal = totalCratesCost + totalKegsCost;

  // Additional technical wholesale specs (Liters, weight)
  const totalLiters = (crates * 10) + (kegs * 30); // 20 bottles of 0.5L = 10L per crate
  const totalWeightKg = (crates * 18.2) + (kegs * 39.5); // Crate is ~18kg full, Keg is ~40kg full

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check fields
    if (!name || !businessName || !email) {
      setErrorText(lang === 'en' ? 'Please fill out at least Name, Business and Email, Atze!' : 'Bitte fülle mindestens Name, Laden/Kneipe und E-Mail aus, Atze!');
      return;
    }

    setErrorText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'b2b',
          name,
          company: businessName,
          email,
          phone,
          message: `Phone: ${phone}. Msg: ${message}`,
          items: [
            `${crates} Crates Atzengold`,
            `${kegs} Kegs Atzengold`,
            `Grand Total: €${grandTotal.toFixed(2)}`
          ]
        })
      });

      if (!response.ok) {
        throw new Error(lang === 'en' ? 'Submission failed. Please try again later.' : 'Verbindung fehlgeschlagen. Bitte versuche es später noch einmal.');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorText(err.message || 'Error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setName('');
    setBusinessName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setCrates(5);
    setKegs(2);
    setIsSubmitted(false);
  };

  return (
    <section id="b2b-gastronomy" className="relative bg-canvas dark:bg-primary-deep py-24 px-4 md:px-8 border-t border-ink/10 dark:border-canvas/10 overflow-hidden z-10 texture-print">

      {/* Background motif */}
      <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none mix-blend-overlay flex items-center justify-center">
        <span className="font-display text-[30vw] tracking-tighter rotate-12 select-none">B2B</span>
      </div>

      <div className="relative content-width z-10">

        {/* Header Block */}
        <div className="mb-12 border-b border-ink/10 dark:border-canvas/10 pb-8">
          <h2 className="text-display-xl text-ink dark:text-canvas max-w-3xl font-handwritten font-bold normal-case">
            {t.b2bTitle}
          </h2>
          <p className="mt-6 text-body-lg text-ink/80 dark:text-canvas/80 max-w-2xl font-mono">
            {t.b2bSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">

          {/* Info and Wholesale Metrics Panel (Left Side, 5 Cols) */}
          <div className="lg:col-span-5 space-y-8">

            {/* Visual Specs / Brand Pitching */}
            <div className="bg-canvas dark:bg-brand-dark-900 rounded-2xl p-6 md:p-8 shadow-xl border border-ink/10 dark:border-canvas/10 space-y-6">
              <h3 className="text-heading-md border-b border-ink/10 dark:border-canvas/10 pb-3 flex items-center gap-2 uppercase text-ink dark:text-canvas">
                <TrendingUp className="h-5 w-5 text-accent" />
                {t.b2bWhyPartners}
              </h3>

              <div className="grid grid-cols-1 gap-6 text-sm font-mono">
                <div className="relative pl-6 stripe-accent before:absolute before:left-0 before:top-0 before:bottom-0 before:w-2 before:bg-accent group">
                  <h4 className="font-bold uppercase tracking-wider text-ink dark:text-canvas mb-1 flex items-center gap-2">
                    <span className="text-accent">01.</span> {t.b2bBrandLoyaltyTitle}
                  </h4>
                  <p className="text-xs text-ink-mute dark:text-canvas/60 leading-relaxed">{t.b2bBrandLoyaltyDesc}</p>
                </div>

                <div className="relative pl-6 stripe-accent before:absolute before:left-0 before:top-0 before:bottom-0 before:w-2 before:bg-accent group">
                  <h4 className="font-bold uppercase tracking-wider text-ink dark:text-canvas mb-1 flex items-center gap-2">
                    <span className="text-accent">02.</span> {t.b2bCooperationTitle}
                  </h4>
                  <p className="text-xs text-ink-mute dark:text-canvas/60 leading-relaxed">{t.b2bCooperationDesc}</p>
                </div>

                <div className="relative pl-6 stripe-accent before:absolute before:left-0 before:top-0 before:bottom-0 before:w-2 before:bg-accent group">
                  <h4 className="font-bold uppercase tracking-wider text-ink dark:text-canvas mb-1 flex items-center gap-2">
                    <span className="text-accent">03.</span> {t.b2bLiveTrackerTitle}
                  </h4>
                  <p className="text-xs text-ink-mute dark:text-canvas/60 leading-relaxed">{t.b2bLiveTrackerDesc}</p>
                </div>
              </div>
            </div>

            {/* Wholesale Pricing Metric Calculator Display */}
            <div className="bg-canvas dark:bg-brand-dark-900 rounded-2xl p-6 md:p-8 shadow-xl border border-ink/10 dark:border-canvas/10 space-y-6">
              <h3 className="text-heading-sm border-b border-ink/10 dark:border-canvas/10 pb-3 flex items-center gap-2 uppercase text-ink dark:text-canvas">
                <Calculator className="h-5 w-5 text-accent" />
                {t.b2bFormCalculator}
              </h3>

              <div className="space-y-6">
                {/* Crates Range Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-mono font-bold border-b border-ink/10 dark:border-canvas/10 border-dashed pb-1">
                    <span className="uppercase text-ink dark:text-canvas">{t.b2bFormCrates}</span>
                    <span className="text-ink dark:text-canvas bg-accent/20 px-2 rounded text-body-tabular">{crates}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={crates}
                    onChange={(e) => setCrates(parseInt(e.target.value) || 0)}
                    className="w-full h-2 rounded-full bg-ink/10 dark:bg-canvas/10 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent accent-accent"
                  />
                  <span className="text-xs font-mono text-ink-mute dark:text-canvas/60 block text-right">{t.b2bPriceCrate}</span>
                </div>

                {/* Kegs Range Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-mono font-bold border-b border-ink/10 dark:border-canvas/10 border-dashed pb-1">
                    <span className="uppercase text-ink dark:text-canvas">{t.b2bFormKegs}</span>
                    <span className="text-ink dark:text-canvas bg-accent/20 px-2 rounded text-body-tabular">{kegs}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={kegs}
                    onChange={(e) => setKegs(parseInt(e.target.value) || 0)}
                    className="w-full h-2 rounded-full bg-ink/10 dark:bg-canvas/10 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent accent-accent"
                  />
                  <span className="text-xs font-mono text-ink-mute dark:text-canvas/60 block text-right">{t.b2bPriceKeg}</span>
                </div>

                {/* Calculated summary metrics */}
                <div className="border-t border-ink/10 dark:border-canvas/10 pt-4 grid grid-cols-2 gap-4 text-sm font-mono">
                  <div className="rounded-xl border border-ink/10 dark:border-canvas/10 p-3 text-center bg-canvas/50 dark:bg-brand-dark-900/50">
                    <span className="text-ink-mute dark:text-canvas/50 select-none uppercase block text-xs">Total Vol:</span>
                    <span className="block font-bold mt-1 text-ink dark:text-canvas text-body-tabular">{totalLiters} L</span>
                  </div>
                  <div className="rounded-xl border border-ink/10 dark:border-canvas/10 p-3 text-center bg-canvas/50 dark:bg-brand-dark-900/50">
                    <span className="text-ink-mute dark:text-canvas/50 select-none uppercase block text-xs">Est. Weight:</span>
                    <span className="block font-bold mt-1 text-ink dark:text-canvas text-body-tabular">~{totalWeightKg.toFixed(0)} kg</span>
                  </div>
                </div>

                {/* Total Value */}
                <div className="rounded-xl mt-2 flex justify-between items-center bg-ink p-5 text-canvas shadow-lg">
                  <span className="text-sm font-bold uppercase tracking-wider">{t.b2bFormTotal}:</span>
                  <span className="text-2xl font-black text-accent font-mono text-body-tabular">
                    €{grandTotal.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Contact order form column (Right Side, 7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-canvas dark:bg-brand-dark-900 rounded-2xl p-6 md:p-8 shadow-xl border border-ink/10 dark:border-canvas/10 h-full">

              {isSubmitted ? (
                <div className="text-center py-12 space-y-6 animate-fadeIn">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center bg-accent text-ink rounded-full shadow-md">
                    <FileCheck2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-display-md text-ink dark:text-canvas uppercase tracking-tight mt-6">
                    {lang === 'en' ? 'Prost, Atze!' : 'Spitzenklasse, Kumpel!'}
                  </h3>
                  <p className="mx-auto max-w-md text-body-md text-ink/80 dark:text-canvas/80 font-mono font-medium">
                    {t.b2bFormSuccess}
                  </p>

                  <div className="bg-canvas dark:bg-brand-dark-900 rounded-xl border border-ink/10 dark:border-canvas/10 p-6 max-w-md mx-auto text-left text-sm font-mono text-ink/80 dark:text-canvas/80 space-y-3 shadow-sm relative overflow-hidden">
                    {/* Tape effect removed in favor of cleaner design */}
                    <p className="font-bold text-ink dark:text-canvas border-b border-ink/10 dark:border-canvas/10 pb-2 uppercase tracking-wider">Receipt Details:</p>
                    <p className="flex justify-between border-b border-ink/5 dark:border-canvas/5 border-dashed pb-1"><span>Name:</span> <span className="font-bold text-ink dark:text-canvas">{name}</span></p>
                    <p className="flex justify-between border-b border-ink/5 dark:border-canvas/5 border-dashed pb-1"><span>Business:</span> <span className="font-bold text-ink dark:text-canvas">{businessName}</span></p>
                    <p className="flex justify-between border-b border-ink/5 dark:border-canvas/5 border-dashed pb-1"><span>Crates:</span> <span className="font-bold text-ink dark:text-canvas text-body-tabular">{crates} ({crates * 10}L)</span></p>
                    <p className="flex justify-between border-b border-ink/5 dark:border-canvas/5 border-dashed pb-1"><span>Kegs:</span> <span className="font-bold text-ink dark:text-canvas text-body-tabular">{kegs} ({kegs * 30}L)</span></p>
                    <p className="flex justify-between pt-2 text-base"><span className="uppercase font-bold text-ink dark:text-canvas">Est. Total:</span> <span className="font-black text-ink dark:text-canvas bg-accent/20 px-2 rounded text-body-tabular">€{grandTotal.toFixed(2)}</span></p>
                  </div>

                  <button
                    onClick={handleReset}
                    className="mt-8 cursor-pointer inline-flex items-center gap-2 bg-ink text-canvas rounded-xl px-6 py-3 font-mono font-bold uppercase hover:bg-zinc-800 transition-colors shadow-md hover:shadow-lg"
                  >
                    ← Send another inquiry
                  </button>
                </div>
              ) : (
                <form id="form-b2b" onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-display-md font-sans font-black text-ink dark:text-canvas uppercase border-b border-ink/10 dark:border-canvas/10 pb-4">
                    {lang === 'en' ? 'Wholesale Inquiry' : 'Direkte B2B-Anfrage'}
                  </h3>

                  {errorText && (
                    <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-sm font-mono font-bold text-red-800 flex items-center gap-3 shadow-sm">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      {errorText}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-sans font-bold text-ink/70 dark:text-canvas/70 uppercase">
                        {t.b2bFormName || 'Name'} <sup className="lowercase text-[10px] opacity-75">{lang === 'en' ? '(required)' : '(erforderlich)'}</sup>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Gabriel"
                        className="w-full rounded-xl border border-ink/20 dark:border-canvas/20 bg-canvas dark:bg-brand-dark-900 p-3 text-sm font-mono text-ink dark:text-canvas placeholder-ink/30 dark:placeholder-canvas/30 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-sans font-bold text-ink/70 dark:text-canvas/70 uppercase">
                        {t.b2bFormBusiness || 'Business'} <sup className="lowercase text-[10px] opacity-75">{lang === 'en' ? '(required)' : '(erforderlich)'}</sup>
                      </label>
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Late-Night Späti Gostenhof"
                        className="w-full rounded-xl border border-ink/20 dark:border-canvas/20 bg-canvas dark:bg-brand-dark-900 p-3 text-sm font-mono text-ink dark:text-canvas placeholder-ink/30 dark:placeholder-canvas/30 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-sans font-bold text-ink/70 dark:text-canvas/70 uppercase">
                        {t.b2bFormEmail || 'Email'} <sup className="lowercase text-[10px] opacity-75">{lang === 'en' ? '(required)' : '(erforderlich)'}</sup>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="atze@kneipe.de"
                        className="w-full rounded-xl border border-ink/20 dark:border-canvas/20 bg-canvas dark:bg-brand-dark-900 p-3 text-sm font-mono text-ink dark:text-canvas placeholder-ink/30 dark:placeholder-canvas/30 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-sans font-bold text-ink/70 dark:text-canvas/70 uppercase">{(t.b2bFormPhone || 'Phone')}</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+49 178 1234567"
                        className="w-full rounded-xl border border-ink/20 dark:border-canvas/20 bg-canvas dark:bg-brand-dark-900 p-3 text-sm font-mono text-ink dark:text-canvas placeholder-ink/30 dark:placeholder-canvas/30 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-sans font-bold text-ink/70 dark:text-canvas/70 uppercase">{(t.b2bFormMessage || 'Message')}</label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={lang === 'en' ? "We need delivery next Friday for our beer garden opening" : "Wir benötigen die Kisten am liebsten bis nächsten Donnerstag für die Eröffnung am Wochenende!"}
                      className="w-full rounded-xl border border-ink/20 dark:border-canvas/20 bg-canvas dark:bg-brand-dark-900 p-3 text-sm font-mono text-ink dark:text-canvas placeholder-ink/30 dark:placeholder-canvas/30 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
                    />
                  </div>

                  <button
                    id="btn-b2b-submit"
                    type="submit"
                    disabled={isLoading}
                    className="w-full cursor-pointer rounded-lg bg-accent text-ink py-4 px-6 text-sm font-mono font-bold uppercase hover:bg-accent/80 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 mt-4 disabled:opacity-50 disabled:cursor-not-allowed border-4 border-ink relative before:absolute before:inset-[3px] before:border before:border-ink before:rounded-[3px] before:pointer-events-none"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    {isLoading ? (lang === 'en' ? 'Sending...' : 'Wird gesendet...') : (t.b2bFormSubmit || 'Submit')}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
