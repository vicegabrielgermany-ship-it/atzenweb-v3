import React, { useState, useEffect, useRef } from 'react';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import X from 'lucide-react/dist/esm/icons/x';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import Info from 'lucide-react/dist/esm/icons/info';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Phone from 'lucide-react/dist/esm/icons/phone';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Globe from 'lucide-react/dist/esm/icons/globe';
import Scale from 'lucide-react/dist/esm/icons/scale';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import Copy from 'lucide-react/dist/esm/icons/copy';
import Check from 'lucide-react/dist/esm/icons/check';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';

interface ImpressumProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
}

const SECTIONS = [
  { id: 'general', title: '1. Allgemeine Angaben', label: 'Allgemeine Angaben', titleEn: '1. General Information', labelEn: 'General Info' },
  { id: 'contact', title: '2. Kontaktangaben', label: 'Kontakt', titleEn: '2. Contact Information', labelEn: 'Contact' },
  { id: 'tax', title: '3. Umsatzsteuer-ID', label: 'USt-IdNr.', titleEn: '3. VAT Identification', labelEn: 'VAT ID' },
  { id: 'responsible', title: '4. Redaktionell Verantwortlich', label: 'Inhaltsverantwortung', titleEn: '4. Editorial Responsibility', labelEn: 'Editorial Responsibility' },
  { id: 'copyright', title: '5. Urheberrecht & Bildnachweis', label: 'Urheberrecht', titleEn: '5. Copyright & Image Credits', labelEn: 'Copyright' },
  { id: 'dispute', title: '6. Streitschlichtung', label: 'Streitschlichtung', titleEn: '6. Dispute Resolution', labelEn: 'Dispute Resolution' },
  { id: 'disclaimer', title: '7. Haftungsausschluss', label: 'Haftungsausschluss', titleEn: '7. Disclaimer', labelEn: 'Liability Disclaimer' }
];

export default function Impressum({ lang, isOpen, onClose }: ImpressumProps) {
  const [activeSection, setActiveSection] = useState<string>('general');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const sections = SECTIONS.map(s => document.getElementById(`imp-${s.id}`));
    const container = scrollContainerRef.current;

    const observerOptions = {
      root: container,
      rootMargin: '-10% 0px -60% 0px',
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace('imp-', '');
          setActiveSection(id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleScrollToSelection = (id: string) => {
    const element = document.getElementById(`imp-${id}`);
    if (element && scrollContainerRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);

      const heading = element.querySelector('h2');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  if (!isOpen) return null;

  const isEn = lang === 'en';

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-canvas dark:bg-primary-deep z-50 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="impressum-title"
        id="impressum-interactive-overlay"
      >
        {/* Header Section */}
        <div className="bg-canvas dark:bg-brand-dark-900 border-b border-ink/10 dark:border-canvas/10 shadow-lg px-4 sm:px-6 lg:px-8 h-20 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 border border-primary-deep/25 rounded bg-primary-deep/10 text-primary-deep dark:text-accent font-mono text-xs font-bold">
              DDG // § 5
            </span>
            <div>
              <h1 id="impressum-title" className="text-lg sm:text-xl font-black tracking-tight text-ink dark:text-canvas font-sans">
                Atzengold // Impressum
              </h1>
              <p className="text-[10px] font-mono text-ink-secondary dark:text-canvas/70 tracking-wider uppercase">
                {isEn ? 'Legal Disclosure & Provider Identification' : 'Impressum & Gesetzliche Anbieterkennzeichnung'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 bg-ink/5 hover:bg-ink/10 dark:bg-canvas/10 dark:hover:bg-canvas/20 border border-ink/20 dark:border-canvas/20 text-ink-secondary dark:text-canvas hover:text-ink dark:hover:text-canvas transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label={isEn ? "Close" : "Schließen"}
          >
            <X className="h-4 w-4" />
            <span className="text-xs font-mono font-bold uppercase hidden sm:inline">{isEn ? 'Close' : 'Schließen'}</span>
          </button>
        </div>

        {/* Floating Screen Reader Skiplink */}
        <a
          href="#imp-content-area"
          className="sr-only focus:not-sr-only focus:absolute focus:top-24 focus:left-4 z-50 bg-accent text-ink px-4 py-2 rounded font-mono text-xs font-black shadow-lg"
          onClick={(e) => {
            e.preventDefault();
            const firstHeading = document.querySelector('#imp-content-area h2');
            if (firstHeading) {
              (firstHeading as HTMLElement).focus();
              firstHeading.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          {isEn ? 'Skip to main content' : 'Zum Hauptinhalt springen'}
        </a>

        {/* Main Body Grid */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 content-width w-full px-4 sm:px-6 lg:px-8 py-6 gap-8">

          {/* LEFT COLUMN: Sticky Table of Contents */}
          <nav
            className="hidden lg:block lg:col-span-3 border-r border-ink/10 dark:border-canvas/10 pr-6 overflow-y-auto space-y-2 select-none h-[calc(100vh-180px)] sticky top-0"
            aria-label={isEn ? "Table of contents" : "Inhaltsverzeichnis"}
          >
            <div className="pb-3 text-xs font-mono font-bold tracking-widest text-ink-secondary dark:text-canvas/70 uppercase flex items-center gap-2">
              <Scale className="h-3.5 w-3.5 text-accent" />
              <span>{isEn ? 'Sections' : 'Inhaltsverzeichnis'}</span>
            </div>

            <ul className="space-y-1.5" role="tablist" aria-orientation="vertical">
              {SECTIONS.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <li key={sec.id} role="none">
                    <button
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`imp-${sec.id}`}
                      id={`tab-imp-${sec.id}`}
                      tabIndex={0}
                      onClick={() => handleScrollToSelection(sec.id)}
                      className={`w-full text-left group flex items-center justify-between text-xs py-2 px-3 rounded-lg border font-mono font-bold transition-all focus:outline-none focus:ring-1 focus:ring-accent truncate cursor-pointer ${
                        isActive
                          ? 'bg-accent/10 text-ink dark:text-canvas border-accent/20 shadow-md translate-x-1.5 font-black'
                          : 'bg-canvas dark:bg-brand-dark-900 border-ink/10 dark:border-canvas/10 shadow-sm text-ink-secondary dark:text-canvas/70 hover:text-ink dark:hover:text-canvas hover:bg-ink/5 dark:hover:bg-canvas/5'
                      }`}
                    >
                      <span className="truncate">{isEn ? sec.labelEn : sec.label}</span>
                      <ChevronRight className={`h-3 w-3 shrink-0 transition-transform ${
                        isActive ? 'text-accent scale-110 translate-x-0.5' : 'text-ink-mute dark:text-canvas/50 group-hover:text-ink-secondary dark:group-hover:text-canvas/70'
                      }`} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* RIGHT COLUMN: Content */}
          <div
            ref={scrollContainerRef}
            id="imp-content-area"
            className="col-span-1 lg:col-span-9 overflow-y-auto pr-2 scroll-smooth select-text h-[calc(100vh-180px)] focus:outline-none"
            tabIndex={0}
            role="document"
            aria-label={isEn ? "Legal disclosure document context" : "Impressum Textinhalt"}
          >
            <div className="space-y-8 max-w-4xl pb-32">

              {/* Introduction Deck */}
              <div className="p-6 rounded-2xl bg-ink/5 dark:bg-canvas/5 border border-ink/10 dark:border-canvas/10 mb-6 space-y-3.5">
                <span className="text-[10px] font-mono text-primary-deep dark:text-accent uppercase tracking-widest font-black block bg-primary-deep/5 dark:bg-accent/10 py-1 px-2.5 rounded border border-primary-deep/10 dark:border-accent/20 w-fit">
                  {isEn ? 'German Digital Services Act § 5 Compliance' : 'Offizielle Anbieterkennzeichnung nach § 5 DDG'}
                </span>
                <p className="text-xs text-ink-secondary dark:text-canvas/80 leading-relaxed">
                  {isEn ? (
                    "The following information constitutes the legally mandatory provider identification and disclosures under German law (Telemediengesetz TMG and Medienstaatsvertrag MStV) for Web presence, commercial branding, and media distribution channels managed by Atzengold."
                  ) : (
                    "Die folgenden Angaben stellen die gesetzlichen Pflichtangaben zur Anbieterkennzeichnung sowie weitreichende rechtliche Hinweise zur Internetpräsenz und Medienverbreitung der Marke Atzengold dar."
                  )}
                </p>
                <p className="text-[11px] font-mono text-ink-mute dark:text-canvas/60">
                  {isEn ? 'Last Updated: June 2026 // Atzengold Corporate Legal' : 'Letzte Aktualisierung: Juni 2026 // Atzengold GbR Rechtsabteilung'}
                </p>
              </div>

              {/* Section 1: Allgemeine Angaben */}
              <section
                id="imp-general"
                className="scroll-mt-6 border-b border-ink/10 dark:border-canvas/10 pb-8 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent shrink-0" />
                  <h2 className="text-lg font-extrabold text-ink dark:text-canvas font-sans tracking-tight focus:outline-none focus:text-accent">
                    {isEn ? '1. Provider & Operator Identification' : '1. Diensteanbieter und Vertretungsverhältnisse'}
                  </h2>
                </div>

                <p className="text-sm text-ink dark:text-canvas leading-relaxed">
                  {isEn ? (
                    "The website and beer brand Atzengold are operated by Gabriel Platt (Atzengold GbR):"
                  ) : (
                    "Die Webseiten, Onlinekanäle sowie die Getränkeproduktion der Marke Atzengold werden von Gabriel Platt betrieben:"
                  )}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-canvas dark:bg-brand-dark-900 border border-ink/10 dark:border-canvas/10 shadow-sm p-4 rounded-xl space-y-1 text-sm font-mono text-ink dark:text-canvas relative group">
                    <p className="text-xs text-ink-secondary dark:text-canvas/70 uppercase tracking-widest font-bold">
                      {isEn ? 'Legal Entity Name' : 'Name des Unternehmens'}
                    </p>
                    <p className="text-ink dark:text-canvas font-bold select-all">Atzengold GbR</p>
                    <button
                      onClick={() => copyToClipboard('Atzengold GbR', 'entity')}
                      className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-ink-mute dark:text-canvas/50 hover:text-accent cursor-pointer"
                      title={isEn ? 'Copy' : 'Kopieren'}
                    >
                      {copiedText === 'entity' ? <Check className="h-4.5 w-4.5 text-primary" /> : <Copy className="h-4.5 w-4.5" />}
                    </button>
                  </div>

                  <div className="bg-canvas dark:bg-brand-dark-900 border border-ink/10 dark:border-canvas/10 shadow-sm p-4 rounded-xl space-y-1 text-sm font-mono text-ink dark:text-canvas relative group">
                    <p className="text-xs text-ink-secondary dark:text-canvas/70 uppercase tracking-widest font-bold">
                      {isEn ? 'Authorized Representative / Managing Director' : 'Geschäftsführer / Vertreten durch'}
                    </p>
                    <p className="text-ink dark:text-canvas font-bold select-all">Gabriel Platt</p>
                    <button
                      onClick={() => copyToClipboard('Gabriel Platt', 'director')}
                      className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-ink-mute dark:text-canvas/50 hover:text-accent cursor-pointer"
                      title={isEn ? 'Copy' : 'Kopieren'}
                    >
                      {copiedText === 'director' ? <Check className="h-4.5 w-4.5 text-primary" /> : <Copy className="h-4.5 w-4.5" />}
                    </button>
                  </div>

                  <div className="bg-canvas dark:bg-brand-dark-900 border border-ink/10 dark:border-canvas/10 shadow-sm p-4 rounded-xl space-y-1 text-sm font-mono text-ink dark:text-canvas sm:col-span-2 relative group">
                    <p className="text-xs text-ink-secondary dark:text-canvas/70 uppercase tracking-widest font-bold">
                      {isEn ? 'Registered Office Address' : 'Ladungsfähige Anschrift'}
                    </p>
                    <p className="text-ink dark:text-canvas select-all">Nürnberger Str. 97, 90762 Fürth, Germany</p>
                    <p className="text-xs text-ink-mute dark:text-canvas/60 mt-1">
                      {isEn ? 'Bavaria, Germany' : 'Mittelfranken, Bayern'}
                    </p>
                    <button
                      onClick={() => copyToClipboard('Nürnberger Str. 97, 90762 Fürth', 'address')}
                      className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-ink-mute dark:text-canvas/50 hover:text-accent cursor-pointer"
                      title={isEn ? 'Copy' : 'Kopieren'}
                    >
                      {copiedText === 'address' ? <Check className="h-4.5 w-4.5 text-primary" /> : <Copy className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>
              </section>

              {/* Section 2: Kontaktangaben */}
              <section
                id="imp-contact"
                className="scroll-mt-6 border-b border-ink/10 dark:border-canvas/10 pb-8 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-accent shrink-0" />
                  <h2 className="text-lg font-extrabold text-ink dark:text-canvas font-sans tracking-tight focus:outline-none focus:text-accent">
                    {isEn ? '2. Direct Contact Channels' : '2. Direkte Kontaktmöglichkeiten'}
                  </h2>
                </div>

                <p className="text-sm text-ink dark:text-canvas leading-relaxed">
                  {isEn ? (
                    "According to § 5 Abs. 1 Nr. 2 TMG, we maintain direct, efficient electronic and telephone channels for instant correspondence:"
                  ) : (
                    "Zur Gewährleistung einer schnellen und effizienten Kontaktaufnahme halten wir folgende direkte Übermittlungskanäle vor:"
                  )}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="tel:+4917662345740"
                    className="flex items-center gap-4 bg-canvas dark:bg-brand-dark-900 border border-ink/10 dark:border-canvas/10 shadow-sm p-4 rounded-xl hover:border-accent/30 transition-all group cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <Phone className="h-5 w-5 text-ink-mute dark:text-canvas/60 group-hover:text-accent shrink-0" />
                    <div className="font-mono text-sm leading-tight">
                      <p className="text-[10px] text-ink-secondary dark:text-canvas/70 uppercase tracking-widest font-bold">Telefon (Direct Line)</p>
                      <p className="text-ink dark:text-canvas font-bold select-all mt-1">+49 (0) 176 623 457 40</p>
                    </div>
                  </a>

                  <a
                    href="mailto:gp@atzengold.net"
                    className="flex items-center gap-4 bg-canvas dark:bg-brand-dark-900 border border-ink/10 dark:border-canvas/10 shadow-sm p-4 rounded-xl hover:border-accent/30 transition-all group cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <Mail className="h-5 w-5 text-ink-mute dark:text-canvas/60 group-hover:text-accent shrink-0" />
                    <div className="font-mono text-sm leading-tight truncate w-full">
                      <p className="text-[10px] text-ink-secondary dark:text-canvas/70 uppercase tracking-widest font-bold">Elektronische Post (E-Mail)</p>
                      <p className="text-ink dark:text-canvas font-bold select-all mt-1 truncate">gp@atzengold.net</p>
                    </div>
                  </a>
                </div>
              </section>

              {/* Section 3: Umsatzsteuer-ID */}
              <section
                id="imp-tax"
                className="scroll-mt-6 border-b border-ink/10 dark:border-canvas/10 pb-8 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-accent shrink-0" />
                  <h2 className="text-lg font-extrabold text-ink dark:text-canvas font-sans tracking-tight focus:outline-none focus:text-accent">
                    {isEn ? '3. VAT Identification Number' : '3. Umsatzsteuer-Identifikationsnummer'}
                  </h2>
                </div>

                <p className="text-sm text-ink dark:text-canvas leading-relaxed">
                  {isEn ? (
                    "Value Added Tax identifier under section 27a of the German VAT Act (Umsatzsteuergesetz - UStG):"
                  ) : (
                    "Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz (UStG):"
                  )}
                </p>

                <div className="bg-canvas dark:bg-brand-dark-900 border border-ink/10 dark:border-canvas/10 shadow-sm p-5 rounded-xl flex justify-between items-center group relative font-mono select-all">
                  <div>
                    <span className="text-[10px] text-ink-secondary dark:text-canvas/70 uppercase tracking-widest font-bold block mb-1">
                      {isEn ? 'VAT Identification Number (USt-IdNr.)' : 'Umsatzsteuer-ID'}
                    </span>
                    <strong className="text-accent text-lg tracking-wider">DE346497049</strong>
                  </div>
                  <button
                    onClick={() => copyToClipboard('DE346497049', 'ustid')}
                    className="p-2 border border-ink/10 dark:border-canvas/10 rounded bg-ink/5 dark:bg-canvas/5 hover:border-accent/20 text-ink-mute dark:text-canvas/60 hover:text-ink dark:hover:text-canvas cursor-pointer transition-all"
                    title={isEn ? 'Copy' : 'Kopieren'}
                  >
                    {copiedText === 'ustid' ? <Check className="h-4.5 w-4.5 text-primary" /> : <Copy className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </section>

              {/* Section 4: Redaktionell Verantwortlich */}
              <section
                id="imp-responsible"
                className="scroll-mt-6 border-b border-ink/10 dark:border-canvas/10 pb-8 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-accent shrink-0" />
                  <h2 className="text-lg font-extrabold text-ink dark:text-canvas font-sans tracking-tight focus:outline-none focus:text-accent">
                    {isEn ? '4. Editorial & Content Responsibility' : '4. Inhaltsverantwortlicher nach Medienrecht'}
                  </h2>
                </div>

                <p className="text-sm text-ink dark:text-canvas leading-relaxed">
                  {isEn ? (
                    "Responsible for journalistic-editorial content pursuant to section 18 paragraph 2 of the German State Media Treaty (Medienstaatsvertrag - MStV):"
                  ) : (
                    "Verantwortlich für journalistische und redaktionell gestaltete Angebote im Sinne des § 18 Abs. 2 MStV (Staatsvertrag über den Rundfunk und die Telemedien):"
                  )}
                </p>

                <div className="bg-canvas dark:bg-brand-dark-900 border border-ink/10 dark:border-canvas/10 shadow-sm p-4 rounded-xl space-y-1 text-sm font-mono text-ink dark:text-canvas relative group">
                  <p className="text-xs text-ink-secondary dark:text-canvas/70 uppercase tracking-widest font-bold">
                    {isEn ? 'Editor-in-Chief / Content Officer' : 'Verantwortliche Person'}
                  </p>
                  <p className="text-ink dark:text-canvas font-bold select-all">Gabriel Platt</p>
                  <p className="text-ink-secondary dark:text-canvas/80 select-all">Nürnberger Str. 97, 90762 Fürth</p>

                  <button
                    onClick={() => copyToClipboard('Gabriel Platt, Nürnberger Str. 97, 90762 Fürth', 'responsible')}
                    className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-ink-mute dark:text-canvas/50 hover:text-accent cursor-pointer"
                    title={isEn ? 'Copy' : 'Kopieren'}
                  >
                    {copiedText === 'responsible' ? <Check className="h-4.5 w-4.5 text-primary" /> : <Copy className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </section>

              {/* Section 5: Urheberrecht & Bildnachweis */}
              <section
                id="imp-copyright"
                className="scroll-mt-6 border-b border-ink/10 dark:border-canvas/10 pb-8 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-accent shrink-0" />
                  <h2 className="text-lg font-extrabold text-ink dark:text-canvas font-sans tracking-tight focus:outline-none focus:text-accent">
                    {isEn ? '5. Intellectual Property & Media Rights' : '5. Urheberrecht & Bildnachweise'}
                  </h2>
                </div>

                <div className="space-y-3.5 text-xs text-ink-secondary dark:text-canvas/80 leading-relaxed">
                  <p>
                    {isEn ? (
                      "The publications, creative assets, designs, illustrations, brand guides and content crafted on this website by Atzengold are protected by German Copyright Law (Urheberrecht). Under no circumstances are unauthorized downloads, reproduction, editing or commercial syndication of these files permitted without explicitly signed legal contract."
                    ) : (
                      "Die durch die Seitenbetreiber erstellten Inhalte, Designs, Logos, Layouts und Fotografien auf diesen Seiten unterliegen dem deutschen Urheberrecht (UrhG). Jede Art der Vervielfältigung, Bearbeitung, Verbreitung und Verwertung außerhalb der Grenzen des Urheberrechtes bedarf der ausdrücklichen schriftlichen Zustimmung des Urhebers."
                    )}
                  </p>
                  <div className="bg-canvas dark:bg-brand-dark-900 border border-ink/10 dark:border-canvas/10 shadow-sm p-4 rounded-lg space-y-2 mt-4">
                    <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block">
                      {isEn ? 'OFFICIAL PHOTO & ASSET LICENSES' : 'BILDNACHWEIS / URHEBER SCHÖPFER'}
                    </span>
                    <p className="font-mono text-ink dark:text-canvas text-xs">
                      {isEn ? 'Photographer & Visual Creator:' : 'Schöpfer und Urheber sämtlicher Lichtbildwerke:'} <strong className="text-ink dark:text-canvas">Atzengold, Gabriel Platt</strong>
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 6: Streitschlichtung */}
              <section
                id="imp-dispute"
                className="scroll-mt-6 border-b border-ink/10 dark:border-canvas/10 pb-8 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-accent shrink-0" />
                  <h2 className="text-lg font-extrabold text-ink dark:text-canvas font-sans tracking-tight focus:outline-none focus:text-accent">
                    {isEn ? '6. Dispute Resolution (ODR Platform)' : '6. Außergerichtliche Streitbeilegung für Verbraucher'}
                  </h2>
                </div>

                <div className="space-y-4 text-xs text-ink-secondary dark:text-canvas/80 leading-relaxed">
                  <p>
                    {isEn ? (
                      "The European Commission provides an online platform for dispute resolution (ODR/OS-Plattform) which serves as an alternative focal point to resolve legal matters amicably without courts:"
                    ) : (
                      "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie im Internet über die verlinkte Webadresse erreichen können. Diese Plattform dient als Anlaufstelle zur außergerichtlichen Beilegung von Streitigkeiten:"
                    )}
                  </p>

                  <div className="bg-canvas dark:bg-brand-dark-900 border border-ink/10 dark:border-canvas/10 shadow-sm p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 font-mono">
                    <div className="truncate">
                      <span className="text-[9px] text-ink-secondary dark:text-canvas/70 uppercase tracking-widest font-black block mb-1">
                        {isEn ? 'Consumer ODR Portal Web Link' : 'Offizielle OS-Plattform Adresse'}
                      </span>
                      <a
                        href="https://ec.europa.eu/consumers/odr/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent-hover underline font-semibold flex items-center gap-1.5 focus:outline-none truncate"
                      >
                        ec.europa.eu/consumers/odr/
                        <ExternalLink className="h-3 w-3 inline shrink-0" />
                      </a>
                    </div>
                  </div>

                  <p className="text-[11px] border-l-2 border-accent/30 pl-3 italic text-ink-mute dark:text-canvas/70 mt-2 bg-accent/5 py-2.5 rounded-r">
                    {isEn ? (
                      "Alternative Dispute Resolution Disclaimer: We are neither legally obliged nor willing to participate in any formal dispute resolution proceedings before a consumer arbitration board (Verbraucherschlichtungsstelle under § 36 VSBG)."
                    ) : (
                      "Verbraucherstreitbeilegung: Wir sind weder gesetzlich verpflichtet noch dazu bereit, im Falle einer Streitigkeit mit einem Verbraucher an einem formalen Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."
                    )}
                  </p>
                </div>
              </section>

              {/* Section 7: Haftungsausschluss */}
              <section
                id="imp-disclaimer"
                className="scroll-mt-6 pb-8 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-accent shrink-0" />
                  <h2 className="text-lg font-extrabold text-ink dark:text-canvas font-sans tracking-tight focus:outline-none focus:text-accent">
                    {isEn ? '7. Official Legal Liability Disclaimer' : '7. Rechtlicher Haftungsausschluss (Disclaimer)'}
                  </h2>
                </div>

                <div className="space-y-5 text-xs text-ink-secondary dark:text-canvas/80 leading-relaxed font-sans">
                  <div className="space-y-2">
                    <strong className="text-ink dark:text-canvas font-bold block uppercase tracking-wider text-[11px]">
                      {isEn ? '(A) Liability for Information (Haftung für Inhalte)' : '(A) Haftung für Inhalte'}
                    </strong>
                    <p>
                      {isEn ? (
                        "As a Service Provider, we are legally responsible for our own custom information published on these pages under § 7 Abs. 1 DDG. However, pursuant to §§ 8 to 10 DDG, we are not legally obliged to actively monitor third-party transmitted data or investigate potential background context pointing to unlawful incidents. Our legal liabilities to remove or restrict specific information upon formal knowledge remain entirely unaffected. Liability begins ONLY once we obtain concrete knowledge of a verified breach. Upon verified evidence, such breach items shall be removed instantly."
                      ) : (
                        "Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen."
                      )}
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-ink/10 dark:border-canvas/10 pt-4">
                    <strong className="text-ink dark:text-canvas font-bold block uppercase tracking-wider text-[11px]">
                      {isEn ? '(B) Liability for External References (Haftung für Links)' : '(B) Haftung für verlinkte Inhalte'}
                    </strong>
                    <p>
                      {isEn ? (
                        "Our media channels contain hyperlinks pointing directly to external websites of third-parties. Since these underlying sites are controlled by foreign entities, we cannot accept any legal guarantee or liability for their content. The respective operator remains legally responsible at all times. All referenced items were checked thoroughly for breaches at the exact time of original linking, with no breach indicators visible. We cannot reasonably perform permanent live inspections of external targets without concrete clues of a breach. Links pointing to breached content shall be expunged the moment we are officially informed."
                      ) : (
                        "Unser Webangebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinerlei Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr oder Haftung übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen."
                      )}
                    </p>
                  </div>
                </div>
              </section>

            </div>
          </div>

        </div>
      </div>
    </AnimatePresence>
  );
}
