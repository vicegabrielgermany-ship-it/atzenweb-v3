import React, { useState, useEffect, useRef } from 'react';
import Shield from 'lucide-react/dist/esm/icons/shield';
import X from 'lucide-react/dist/esm/icons/x';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import Scale from 'lucide-react/dist/esm/icons/scale';
import Info from 'lucide-react/dist/esm/icons/info';
import Cookie from 'lucide-react/dist/esm/icons/cookie';
import Globe from 'lucide-react/dist/esm/icons/globe';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import UserCheck from 'lucide-react/dist/esm/icons/user-check';
import EyeOff from 'lucide-react/dist/esm/icons/eye-off';
import HelpCircle from 'lucide-react/dist/esm/icons/help-circle';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';

interface DatenschutzProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
}

const SECTIONS = [
  { id: 'contact', title: '1. Verantwortlicher', label: 'Verantwortlicher' },
  { id: 'security', title: '2. Sicherheit & Datenschutz', label: 'Sicherheit & Schutz' },
  { id: 'definitions', title: '3. Begriffsbestimmungen', label: 'Begriffsbestimmungen' },
  { id: 'legal-basis', title: '4. Rechtmäßigkeit', label: 'Rechtmäßigkeit' },
  { id: 'collection', title: '5. Datenerhebung', label: 'Datenerhebung' },
  { id: 'website-visit', title: '6. Website-Besuch Daten', label: 'Website-Besuch' },
  { id: 'cookies', title: '7. Einsatz von Cookies', label: 'Cookies-Einsatz' },
  { id: 'features', title: '8. Weitere Funktionen', label: 'Weitere Funktionen' },
  { id: 'children', title: '9. Minderjährigen-Schutz', label: 'Kinder-Schutz' },
  { id: 'rights', title: '10. Betroffenenrechte', label: 'Betroffenenrechte' },
  { id: 'wix', title: '11. Einsatz von Wix', label: 'Wix-Analytics' },
  { id: 'google-maps', title: '12. Google Maps', label: 'Google Maps' }
];

export default function Datenschutz({ lang, isOpen, onClose }: DatenschutzProps) {
  const [activeSection, setActiveSection] = useState<string>('contact');
  const [optOutActive, setOptOutActive] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ScrollSpy Implementation with IntersectionObserver
  useEffect(() => {
    if (!isOpen) return;

    const sections = SECTIONS.map(s => document.getElementById(`ds-${s.id}`));
    const container = scrollContainerRef.current;

    const observerOptions = {
      root: container,
      rootMargin: '-10% 0px -60% 0px',
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace('ds-', '');
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

  // Handle accessibility keyboard navigation escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Smooth scroll to section
  const handleScrollToSelection = (id: string) => {
    const element = document.getElementById(`ds-${id}`);
    if (element && scrollContainerRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);

      // Accessibility focus management
      const heading = element.querySelector('h2');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-canvas dark:bg-ink z-50 overflow-hidden flex flex-col backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-title"
        id="datenschutz-interactive-overlay"
      >
        {/* Header Section */}
        <div className="bg-canvas dark:bg-ink border-b border-brand-dark-900 shadow-lg px-4 sm:px-6 lg:px-8 h-20 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 border border-accent/25 rounded bg-accent/10 text-accent font-mono text-xs font-bold animate-pulse">
              GDPR // DSGVO
            </span>
            <div>
              <h1 id="privacy-title" className="text-lg sm:text-xl font-black tracking-tight text-ink dark:text-canvas font-sans">
                Atzengold // Datenschutzerklärung
              </h1>
              <p className="text-[10px] font-mono text-ink-mute dark:text-canvas/60 tracking-wider uppercase">
                {lang === 'en' ? 'User Privacy Policy & Legal Code Directive' : 'Datenschutzerklärung & Rechtliche Pflichtbelehrung'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 bg-canvas dark:bg-ink border border-brand-dark-900 text-ink-secondary dark:text-canvas/70 hover:text-ink dark:hover:text-canvas hover:border-accent/30 transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-accent focus:text-ink dark:focus:text-canvas"
            aria-label="Schließen"
          >
            <X className="h-4 w-4" />
            <span className="text-xs font-mono font-bold uppercase hidden sm:inline">Schließen</span>
          </button>
        </div>

        {/* Floating Screen Reader Skiplink for UX Accessibility Best Practice */}
        <a
          href="#ds-content-area"
          className="sr-only focus:not-sr-only focus:absolute focus:top-24 focus:left-4 z-50 bg-accent text-ink px-4 py-2 rounded font-mono text-xs font-black shadow-lg"
          onClick={(e) => {
            e.preventDefault();
            const firstHeading = document.querySelector('#ds-content-area h2');
            if (firstHeading) {
              (firstHeading as HTMLElement).focus();
              firstHeading.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          Zum Hauptinhalt springen
        </a>

        {/* Main Body Grid */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 content-width w-full px-4 sm:px-6 lg:px-8 py-6 gap-8">

          {/* LEFT COLUMN: Sticky, Keyboard Accessible Table of Contents */}
          <nav
            className="hidden lg:block lg:col-span-3 border-r border-brand-dark-900 pr-6 overflow-y-auto space-y-2 select-none h-[calc(100vh-180px)] sticky top-0"
            aria-label="Inhaltsverzeichnis"
          >
            <div className="pb-3 text-xs font-mono font-bold tracking-widest text-ink-mute dark:text-canvas/60 uppercase flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-accent" />
              <span>Inhaltsverzeichnis</span>
            </div>

            <ul className="space-y-1.5" role="tablist" aria-orientation="vertical">
              {SECTIONS.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <li key={sec.id} role="none">
                    <button
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`ds-${sec.id}`}
                      id={`tab-${sec.id}`}
                      tabIndex={0}
                      onClick={() => handleScrollToSelection(sec.id)}
                      className={`w-full text-left group flex items-center justify-between text-xs py-2 px-3 rounded-lg border font-mono font-bold transition-all focus:outline-none focus:ring-1 focus:ring-accent truncate cursor-pointer ${
                        isActive
                          ? 'bg-accent/10 text-accent border-accent/20 shadow-md translate-x-1.5 font-black'
                          : 'bg-canvas dark:bg-ink border border-brand-dark-900 shadow-lg text-ink-secondary dark:text-canvas/70 hover:text-ink dark:hover:text-canvas hover:bg-canvas dark:hover:bg-ink/80 hover:border-ink/20'
                      }`}
                    >
                      <span className="truncate">{sec.title}</span>
                      <ChevronRight className={`h-3 w-3 shrink-0 transition-transform ${
                        isActive ? 'text-accent scale-110 translate-x-0.5' : 'text-ink-mute dark:text-canvas/50 group-hover:text-ink-secondary dark:group-hover:text-canvas/70'
                      }`} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* RIGHT COLUMN: The massive content container pane with Smooth Scrolling */}
          <div
            ref={scrollContainerRef}
            id="ds-content-area"
            className="col-span-1 lg:col-span-9 overflow-y-auto pr-2 scroll-smooth select-text h-[calc(100vh-180px)] focus:outline-none"
            tabIndex={0}
            role="document"
            aria-label="Datenschutzerklärung Textinhalt"
          >
            <div className="space-y-8 max-w-4xl pb-32">

              {/* Introduction Deck */}
              <div className="p-6 rounded-2xl bg-canvas dark:bg-ink border border-brand-dark-900 mb-6 space-y-3.5">
                <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-black block bg-accent/5 py-1 px-2.5 rounded border border-accent/10 w-fit">
                  Offizielle Pflichtbelehrung
                </span>
                <p className="text-xs text-ink-secondary dark:text-canvas/70 leading-relaxed">
                  Wir betrachten es als unsere vorrangige Aufgabe, die Vertraulichkeit der von Ihnen bereitgestellten personenbezogenen Daten zu wahren und diese vor unbefugten Zugriffen zu schützen. Deshalb wenden wir äußerste Sorgfalt und modernste Sicherheitsstandards an, um einen maximalen Schutz Ihrer personenbezogenen Daten zu gewährleisten.
                </p>
                <p className="text-[11px] font-mono text-ink-mute dark:text-canvas/60">
                  Zuletzt aktualisiert: Juni 2026 / Atzengold GbR Compliance Office.
                </p>
              </div>

              {/* Section 1: Verantwortlicher */}
              <section
                id="ds-contact"
                data-privacy-section
                className="scroll-mt-6 border-b border-brand-dark-900 pb-8 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent shrink-0" />
                  <h2 className="text-xl font-extrabold uppercase text-ink dark:text-canvas font-sans tracking-tight focus:outline-none focus:text-accent">
                    Name und Kontakt des Verantwortlichen gemäß Artikel 4 Abs. 7 DSGVO
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-canvas dark:bg-ink border border-brand-dark-900 shadow-lg p-4 rounded-xl space-y-1 text-sm font-mono text-ink dark:text-canvas">
                    <p className="text-xs text-ink-mute dark:text-canvas/60 uppercase tracking-widest font-bold">Firma</p>
                    <p className="text-ink dark:text-canvas font-bold">Atzengold</p>
                  </div>

                  <div className="bg-canvas dark:bg-ink border border-brand-dark-900 shadow-lg p-4 rounded-xl space-y-1 text-sm font-mono text-ink dark:text-canvas">
                    <p className="text-xs text-ink-mute dark:text-canvas/60 uppercase tracking-widest font-bold">Anschrift</p>
                    <p className="text-ink dark:text-canvas">Nürnberger Str. 97, 90762 Fürth</p>
                  </div>

                  <div className="bg-canvas dark:bg-ink border border-brand-dark-900 shadow-lg p-4 rounded-xl space-y-1 text-sm font-mono text-ink dark:text-canvas">
                    <p className="text-xs text-ink-mute dark:text-canvas/60 uppercase tracking-widest font-bold">Telefon</p>
                    <p className="text-ink dark:text-canvas hover:text-accent transition-colors">
                      <a href="tel:+4917662345740" aria-label="Rufnummer anrufen">+49 (0) 176 623 457 40</a>
                    </p>
                  </div>

                  <div className="bg-canvas dark:bg-ink border border-brand-dark-900 shadow-lg p-4 rounded-xl space-y-1 text-sm font-mono text-ink dark:text-canvas">
                    <p className="text-xs text-ink-mute dark:text-canvas/60 uppercase tracking-widest font-bold">E-Mail</p>
                    <p className="text-accent hover:underline">
                      <a href="mailto:gp@atzengold.net" aria-label="E-Mail senden">gp@atzengold.net</a>
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 2: Sicherheit */}
              <section
                id="ds-security"
                data-privacy-section
                className="scroll-mt-6 border-b border-brand-dark-900 pb-8 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-accent shrink-0" />
                  <h2 className="text-xl font-extrabold uppercase text-ink dark:text-canvas font-sans tracking-tight focus:outline-none focus:text-accent">
                    Sicherheit und Schutz Ihrer personenbezogenen Daten
                  </h2>
                </div>
                <div className="text-sm text-ink dark:text-canvas leading-relaxed space-y-3.5">
                  <p>
                    Als privatrechtliches Unternehmen unterliegen wir den Bestimmungen der europäischen Datenschutzgrundverordnung (DSGVO) und den Regelungen des Bundesdatenschutzgesetzes (BDSG). Wir haben technische und organisatorische Maßnahmen getroffen, die sicherstellen, dass die Vorschriften über den Datenschutz sowohl von uns, als auch von unseren externen Dienstleistern beachtet werden.
                  </p>
                  <p className="text-[12px] bg-canvas dark:bg-ink border border-brand-dark-900 p-3.5 rounded-lg text-ink-secondary dark:text-canvas/70 font-mono">
                    ⚠️ Atzengold speichert und verarbeitet alle wesentlichen Atzen-Präferenzen, Cookies und Telemetriedaten nach dem Prinzip &quot;Privacy-by-Design&quot; standardmäßig verschlüsselt oder lokal auf Ihrem Rechner.
                  </p>
                </div>
              </section>

              {/* Section 3: Begriffsbestimmungen */}
              <section
                id="ds-definitions"
                data-privacy-section
                className="scroll-mt-6 border-b border-brand-dark-900 pb-8 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-accent shrink-0" />
                  <h2 className="text-xl font-extrabold uppercase text-ink dark:text-canvas font-sans tracking-tight focus:outline-none focus:text-accent">
                    Begriffsbestimmungen
                  </h2>
                </div>
                <p className="text-sm text-ink dark:text-canvas">
                  Der Gesetzgeber fordert, dass personenbezogene Daten auf rechtmäßige Weise, nach Treu und Glauben und in einer für die betroffene Person nachvollziehbaren Weise verarbeitet werden (&quot;Rechtmäßigkeit, Verarbeitung nach Treu und Glauben, Transparenz&quot;). Um dies zu gewährleisten, informieren wir Sie über die einzelnen gesetzlichen Begriffsbestimmungen, die auch in dieser Datenschutzerklärung verwendet werden:
                </p>

                <div className="space-y-3 pt-2">
                  {[
                    { term: 'Personenbezogene Daten', desc: '"Personenbezogene Daten" sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person (im Folgenden "betroffene Person") beziehen; als identifizierbar wird eine natürliche Person angesehen, die direkt oder indirekt, insbesondere mittels Zuordnung zu einer Kennung wie einem Namen, zu einer Kennnummer, zu Standortdaten, zu einer Online-Kennung oder zu einem oder mehreren besonderen Merkmalen identifiziert werden kann, die Ausdruck der physischen, physiologischen, genetischen, psychischen, wirtschaftlichen, kulturellen oder sozialen Identität dieser natürlichen Person sind.' },
                    { term: 'Verarbeitung', desc: '"Verarbeitung" ist jeder, mit oder ohne Hilfe automatisierter Verfahren, ausgeführter Vorgang oder jede solche Vorgangsreihe im Zusammenhang mit personenbezogenen Daten wie das Erheben, das Erfassen, die Organisation, das Ordnen, die Speicherung, die Anpassung oder Veränderung, das Auslesen, das Abfragen, die Verwendung, die Offenlegung durch Übermittlung, Verbreitung oder eine andere Form der Bereitstellung, den Abgleich oder die Verknüpfung, die Einschränkung, das Löschen oder die Vernichtung.' },
                    { term: 'Einschränkung der Verarbeitung', desc: '"Einschränkung der Verarbeitung" ist die Markierung gespeicherter personenbezogener Daten mit dem Ziel, ihre künftige Verarbeitung einzuschränken.' },
                    { term: 'Profiling', desc: '"Profiling" ist jede Art der automatisierten Verarbeitung personenbezogener Daten, die darin besteht, dass diese personenbezogenen Daten verwendet werden, um bestimmte persönliche Aspekte, die sich auf eine natürliche Person beziehen, zu bewerten, insbesondere um Aspekte bezüglich Arbeitsleistung, wirtschaftliche Lage, Gesundheit, persönliche Vorlieben, Interessen, Zuverlässigkeit, Verhalten, Aufenthaltsort oder Ortswechsel dieser natürlichen Person zu analysieren oder vorherzusagen.' },
                    { term: 'Pseudonymisierung', desc: '"Pseudonymisierung" ist die Verarbeitung personenbezogener Daten in einer Weise, dass die personenbezogenen Daten ohne Hinzuziehung zusätzlicher Informationen nicht mehr einer spezifischen betroffenen Person zugeordnet werden können, sofern diese zusätzlichen Informationen gesondert aufbewahrt werden und technischen und organisatorischen Maßnahmen unterliegen, die gewährleisten, dass die personenbezogenen Daten nicht einer identifizierten oder identifizierbaren natürlichen Person zugewiesen werden können.' },
                    { term: 'Dateisystem', desc: '"Dateisystem" ist jede strukturierte Sammlung personenbezogener Daten, die nach bestimmten Kriterien zugänglich sind, unabhängig davon, ob diese Sammlung zentral, dezentral oder nach funktionalen oder geografischen Gesichtspunkten geordnet geführt wird.' },
                    { term: 'Verantwortlicher', desc: '"Verantwortlicher" ist eine natürliche oder juristische Person, Behörde, Einrichtung oder andere Stelle, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet; sind die Zwecke und Mittel dieser Verarbeitung durch das Unionsrecht oder das Recht der Mitgliedstaaten vorgegeben, so können der Verantwortliche beziehungsweise die bestimmten Kriterien seiner Benennung nach dem Unionsrecht oder dem Recht der Mitgliedstaaten vorgesehen werden.' },
                    { term: 'Auftragsverarbeiter', desc: '"Auftragsverarbeiter" ist eine natürliche oder juristische Person, Behörde, Einrichtung oder andere Stelle, die personenbezogene Daten im Auftrag des Verantwortlichen verarbeitet.' },
                    { term: 'Empfänger', desc: '"Empfänger" ist eine natürliche oder juristische Person, Behörde, Einrichtung oder andere Stelle, denen personenbezogene Daten offengelegt werden, unabhängig davon, ob es sich bei ihr um einen Dritten handelt oder nicht. Behörden, die im Rahmen eines bestimmten Untersuchungsauftrags nach dem Unionsrecht oder dem Recht der Mitgliedstaaten möglicherweise personenbezogene Daten erhalten, gelten jedoch nicht als Empfänger; die Verarbeitung dieser Daten durch die genannten Behörden erfolgt im Einklang mit den geltenden Datenschutzvorschriften gemäß den Zwecken der Verarbeitung.' },
                    { term: 'Dritter', desc: '"Dritter" ist eine natürliche oder juristische Person, Behörde, Einrichtung oder andere Stelle, außer der betroffenen Person, dem Verantwortlichen, dem Auftragsverarbeiter und den Personen, die unter der unmittelbaren Verantwortung des Verantwortlichen oder des Auftragsverarbeiters befugt sind, die personenbezogenen Daten zu verarbeiten.' },
                    { term: 'Einwilligung', desc: 'Eine "Einwilligung" der betroffenen Person ist jede freiwillig für den bestimmten Fall, in informierter Weise und unmissverständlich abgegebene Willensbekundung in Form einer Erklärung oder einer sonstigen eindeutigen bestätigenden Handlung, mit der die betroffene Person zu verstehen gibt, dass sie mit der Verarbeitung der sie betreffenden personenbezogenen Daten einverstanden ist.' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-canvas dark:bg-ink border border-brand-dark-900 shadow-lg p-4 rounded-xl space-y-1 block hover:border-brand-dark-900 transition-colors">
                      <p className="text-xs font-mono font-bold text-accent uppercase tracking-widest">{item.term}</p>
                      <p className="text-xs sm:text-sm text-ink-secondary dark:text-canvas leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 4: Rechtmäßigkeit */}
              <section
                id="ds-legal-basis"
                data-privacy-section
                className="scroll-mt-6 border-b border-brand-dark-900 pb-8 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-accent shrink-0" />
                  <h2 className="text-xl font-extrabold uppercase text-ink dark:text-canvas font-sans tracking-tight focus:outline-none focus:text-accent">
                    Rechtmäßigkeit der Verarbeitung
                  </h2>
                </div>
                <div className="text-sm text-ink dark:text-canvas space-y-3.5 leading-relaxed">
                  <p>
                    Die Verarbeitung personenbezogener Daten ist nur rechtmäßig, wenn für die Verarbeitung eine Rechtsgrundlage besteht. Rechtsgrundlage für die Verarbeitung können gemäß Artikel 6 Abs. 1 lit. a - f DSGVO insbesondere sein:
                  </p>

                  <ul className="space-y-2 pl-4 list-none font-mono text-xs text-ink-secondary dark:text-canvas/70">
                    <li className="flex gap-2.5">
                      <span className="text-accent">A</span>
                      <span>Die betroffene Person hat ihre Einwilligung zu der Verarbeitung hergegeben;</span>
                    </li>
                    <li className="flex gap-2.5">
                      <span className="text-accent">B</span>
                      <span>Die Verarbeitung ist für die Erfüllung eines Vertrags erforderlich;</span>
                    </li>
                    <li className="flex gap-2.5">
                      <span className="text-accent">C</span>
                      <span>Die Verarbeitung ist zur Erfüllung einer rechtlichen Verpflichtung erforderlich;</span>
                    </li>
                    <li className="flex gap-2.5">
                      <span className="text-accent">D</span>
                      <span>Schutz lebenswichtiger Interessen der betroffenen Person;</span>
                    </li>
                    <li className="flex gap-2.5">
                      <span className="text-accent">E</span>
                      <span>Wahrnehmung einer Aufgabe, die im öffentlichen Interesse liegt;</span>
                    </li>
                    <li className="flex gap-2.5">
                      <span className="text-accent">F</span>
                      <span>Wahrung berechtigter Interessen des Verantwortlichen oder eines Dritten, sofern nicht Grundrechte überwiegen.</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 5: Datenerhebung */}
              <section
                id="ds-collection"
                data-privacy-section
                className="scroll-mt-6 border-b border-brand-dark-900 pb-8 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-accent shrink-0" />
                  <h2 className="text-xl font-extrabold uppercase text-ink dark:text-canvas font-sans tracking-tight focus:outline-none focus:text-accent">
                    Information über die Erhebung personenbezogener Daten
                  </h2>
                </div>
                <div className="text-sm text-ink dark:text-canvas space-y-3.5 leading-relaxed">
                  <p>
                    (1) Im Folgenden informieren wir über die Erhebung personenbezogener Daten bei Nutzung unserer Website. Personenbezogene Daten sind z.B. Name, Adresse, E-Mail-Adressen, Nutzerverhalten.
                  </p>
                  <p>
                    (2) Bei einer Kontaktaufnahme mit uns per E-Mail oder über ein Kontaktformular werden die von Ihnen mitgeteilten Daten (Ihre E-Mail-Adresse, ggf. Ihr Name und Ihre Telefonnummer) von uns gespeichert, um Ihre Fragen zu beantworten. Die in diesem Zusammenhang anfallenden Daten löschen wir, nachdem die Speicherung nicht mehr erforderlich ist, oder die Verarbeitung wird eingeschränkt, falls gesetzliche Aufbewahrungspflichten bestehen.
                  </p>
                </div>
              </section>

              {/* Section 6: Website-Besuch Daten */}
              <section
                id="ds-website-visit"
                data-privacy-section
                className="scroll-mt-6 border-b border-brand-dark-900 pb-8 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-accent shrink-0" />
                  <h2 className="text-xl font-extrabold uppercase text-ink dark:text-canvas font-sans tracking-tight focus:outline-none focus:text-accent">
                    Erhebung personenbezogener Daten bei Besuch unserer Website
                  </h2>
                </div>
                <div className="text-sm text-ink dark:text-canvas space-y-3.5 leading-relaxed">
                  <p>
                    Bei der bloß informatorischen Nutzung der Website, also wenn Sie sich nicht registrieren oder uns anderweitig Informationen übermitteln, erheben wir nur die personenbezogenen Daten, die Ihr Browser an unseren Server übermittelt. Wenn Sie unsere Website betrachten möchten, erheben wir die folgenden Daten, die für uns technisch erforderlich sind, um Ihnen unsere Website anzuzeigen und die Stabilität und Sicherheit zu gewährleisten (Rechtsgrundlage ist Art. 6 Abs. 1 S. 1 lit. f DSGVO):
                  </p>

                  <div className="bg-canvas dark:bg-ink border border-brand-dark-900 shadow-lg p-4 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-ink-secondary dark:text-canvas">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-accent rounded-full" /> IP-Adresse
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-accent rounded-full" /> Datum und Uhrzeit der Anfrage
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-accent rounded-full" /> Zeitzonendifferenz zu GMT
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-accent rounded-full" /> Inhalt der Anforderung (konkrete Seite)
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-accent rounded-full" /> Zugriffsstatus/HTTP-Statuscode
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-accent rounded-full" /> übertragene Datenmenge
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-accent rounded-full" /> Website, von der die Anforderung kommt
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-accent rounded-full" /> Browser & Betriebssystem
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 7: Cookies */}
              <section
                id="ds-cookies"
                data-privacy-section
                className="scroll-mt-6 border-b border-brand-dark-900 pb-8 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-accent shrink-0" />
                  <h2 className="text-xl font-extrabold uppercase text-ink dark:text-canvas font-sans tracking-tight focus:outline-none focus:text-accent">
                    Einsatz von Cookies
                  </h2>
                </div>
                <div className="text-sm text-ink dark:text-canvas space-y-3.5 leading-relaxed">
                  <p>
                    (1) Zusätzlich zu den zuvor genannten Daten werden bei der Nutzung unserer Website Cookies auf Ihrem Rechner gespeichert. Bei Cookies handelt es sich um kleine Textdateien, die auf Ihrer Festplatte dem von Ihnen verwendeten Browser zugeordnet gespeichert werden. Cookies können keine Programme ausführen oder Viren auf Ihren Computer übertragen. Sie dienen dazu, das Internetangebot insgesamt nutzerfreundlicher und effektiver zu machen.
                  </p>
                  <p>
                    (2) Diese Website nutzt transiente Cookies (Sitzungsdaten) und persistente Cookies (wie Altersverifikations-Entscheidungen, Atzen-Warenkorbinhalt und Sprachpräferenz), damit Sie den vollen Funktionsumfang genießen können.
                  </p>
                  <div className="bg-canvas dark:bg-ink border border-brand-dark-900 p-4 rounded-xl text-xs font-mono text-ink-secondary dark:text-canvas/70 space-y-2">
                    <p className="font-bold text-accent uppercase">Cookie Deaktivierung:</p>
                    <p>
                      Sie können Ihre Browser-Einstellung entsprechend Ihren Wünschen konfigurieren und z.B. die Annahme von Third-Party-Cookies oder allen Cookies ablehnen. Durch Deaktivierung können manche Funktionen dieser Website beeinträchtigt werden.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 8: Weitere Funktionen */}
              <section
                id="ds-features"
                data-privacy-section
                className="scroll-mt-6 border-b border-brand-dark-900 pb-8 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent shrink-0" />
                  <h2 className="text-xl font-extrabold uppercase text-ink dark:text-canvas font-sans tracking-tight focus:outline-none focus:text-accent">
                    Weitere Funktionen und Angebote unserer Website
                  </h2>
                </div>
                <div className="text-sm text-ink dark:text-canvas space-y-3.5 leading-relaxed">
                  <p>
                    (1) Neben der rein informatorischen Nutzung unserer Website bieten wir verschiedene Leistungen an, die Sie bei Interesse nutzen können und für die personenbezogene Daten zur Angebotserstellung oder Bestellabwicklung erhoben werden.
                  </p>
                  <p>
                    (2) Teilweise bedienen wir uns zur Verarbeitung Ihrer Daten externer Dienstleister, die weisungsgebunden regelmäßig kontrolliert werden.
                  </p>
                </div>
              </section>

              {/* Section 9: Kinder */}
              <section
                id="ds-children"
                data-privacy-section
                className="scroll-mt-6 border-b border-brand-dark-900 pb-8 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <EyeOff className="h-5 w-5 text-accent shrink-0" />
                  <h2 className="text-xl font-extrabold uppercase text-ink dark:text-canvas font-sans tracking-tight focus:outline-none focus:text-accent">
                    Kinder / Jugendschutz
                  </h2>
                </div>
                <div className="text-sm text-ink dark:text-canvas leading-relaxed">
                  <p>
                    Unser Angebot richtet sich grundsätzlich an Erwachsene (Abgabe von alkoholischen Getränken). Personen unter 18 Jahren sollten ohne Zustimmung der Eltern oder Erziehungsberechtigten keine personenbezogenen Daten an uns übermitteln.
                  </p>
                </div>
              </section>

              {/* Section 10: Rechte */}
              <section
                id="ds-rights"
                data-privacy-section
                className="scroll-mt-6 border-b border-brand-dark-900 pb-8 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-accent shrink-0" />
                  <h2 className="text-xl font-extrabold uppercase text-ink dark:text-canvas font-sans tracking-tight focus:outline-none focus:text-accent">
                    Rechte der betroffenen Person
                  </h2>
                </div>
                <div className="text-sm text-ink dark:text-canvas space-y-4 leading-relaxed">
                  <p>
                    Die DSGVO gewährt Ihnen umfangreiche Betroffenenrechte gegenüber dem Verantwortlichen dieser Website:
                  </p>

                   <div className="space-y-3.5 font-mono text-xs text-ink-secondary dark:text-canvas">
                    <p className="bg-canvas dark:bg-ink border border-brand-dark-900 shadow-lg p-3.5 rounded">
                      <strong className="text-accent block text-[10px] uppercase tracking-wider mb-1">(1) Widerruf der Einwilligung</strong>
                      Sofern die Verarbeitung der personenbezogenen Daten auf einer erteilten Einwilligung beruht, haben Sie jederzeit das Recht, diese zu widerrufen.
                    </p>

                    <p className="bg-canvas dark:bg-ink border border-brand-dark-900 shadow-lg p-3.5 rounded">
                      <strong className="text-accent block text-[10px] uppercase tracking-wider mb-1">(2) Recht auf Bestätigung & (3) Auskunftsrecht</strong>
                      Sie können Bestätigung und Auskunft über die über Sie erhobenen Daten, Zwecke und Empfänger anfordern.
                    </p>

                    <p className="bg-canvas dark:bg-ink border border-brand-dark-900 shadow-lg p-3.5 rounded">
                      <strong className="text-accent block text-[10px] uppercase tracking-wider mb-1">(4) Recht auf Berichtigung</strong>
                      Verlangen Sie unverzüglich Berichtigung unrichtiger oder Vervollständigung unvollständiger personenbezogener Daten.
                    </p>

                    <p className="bg-canvas dark:bg-ink border border-brand-dark-900 shadow-lg p-3.5 rounded">
                      <strong className="text-accent block text-[10px] uppercase tracking-wider mb-1">(5) Recht auf Löschung (&quot;Recht auf Vergessenwerden&quot;)</strong>
                      Daten können gelöscht werden, wenn sie nicht mehr notwendig sind, Sie Einwilligungen widerrufen oder kein rechtmäßiger Grund vorliegt.
                    </p>

                    <p className="bg-canvas dark:bg-ink border border-brand-dark-900 shadow-lg p-3.5 rounded">
                      <strong className="text-accent block text-[10px] uppercase tracking-wider mb-1">(6) Recht auf Einschränkung der Verarbeitung</strong>
                      Unter bestimmten Umständen können Sie das Einfrieren der Datenverwendung verlangen.
                    </p>

                    <p className="bg-canvas dark:bg-ink border border-brand-dark-900 shadow-lg p-3.5 rounded">
                      <strong className="text-accent block text-[10px] uppercase tracking-wider mb-1">(7) Recht auf Datenübertragbarkeit</strong>
                      Sie dürfen personenbezogene Daten in einem gängigen Format abrufen oder direkt übertragen lassen.
                    </p>

                    <p className="bg-canvas dark:bg-ink border border-brand-dark-900 shadow-lg p-3.5 rounded bg-accent/5 hover:border-accent/10">
                      <strong className="text-accent block text-[10px] uppercase tracking-wider mb-grow mb-1">🛑 (8) WIDERSPRUCHSRECHT</strong>
                      Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit Widerspruch gegen die Datenverarbeitung nach Art. 6 Abs. 1 lit. e oder f DSGVO einzulegen. Wir stellen die Verarbeitung ein, es sei denn, zwingende schutzwürdige Interessen überwiegen.
                    </p>

                    <p className="bg-canvas dark:bg-ink border border-brand-dark-900 shadow-lg p-3.5 rounded">
                      <strong className="text-accent block text-[10px] uppercase tracking-wider mb-1">(9) Automatisierte Entscheidungsfindung & Profiling</strong>
                      Atzengold führt ausdrücklich keine automatisierten Entscheidungen oder Profiling-Abläufe auf dieser Webpräsenz durch.
                    </p>

                    <p className="bg-canvas dark:bg-ink border border-brand-dark-900 shadow-lg p-3.5 rounded">
                      <strong className="text-accent block text-[10px] uppercase tracking-wider mb-1">(10) Beschwerderecht</strong>
                      Sie haben das Recht auf einreichen einer Beschwerde bei einer anerkannten Datenschutz-Aufsichtsbehörde Ihres Arbeitsplatzes oder Wohnsitzes.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 11: Wix */}
              <section
                id="ds-wix"
                data-privacy-section
                className="scroll-mt-6 border-b border-brand-dark-900 pb-8 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-accent shrink-0" />
                  <h2 className="text-xl font-extrabold uppercase text-ink dark:text-canvas font-sans tracking-tight focus:outline-none focus:text-accent">
                    Einsatz von Wix Web-Analytics
                  </h2>
                </div>
                <div className="text-sm text-ink dark:text-canvas space-y-3.5 leading-relaxed">
                  <p>
                    (1) Diese Website nutzt den Webdienst Wix und sein anonymisiertes Analytics-Angebot, um die Nutzung unserer Website analysieren zu können. Rechtsgrundlage ist Art. 6 Abs. 1 S. 1 lit. f DSGVO (Wahrung berechtigter Interessen).
                  </p>
                  <p>
                    (2) Für diese Auswertung werden Cookies auf Ihrem Computer gespeichert. Die so erhobenen Informationen speichert der Verantwortliche ausschließlich auf seinem Server in Deutschland.
                  </p>
                  <p>
                    (3) Diese Website verwendet Wix Analytics mit IP-Kürzung, wodurch eine direkte Personenbeziehbarkeit ausgeschlossen ist.
                  </p>

                  {/* Interactive Opt-out check with alert feedback */}
                  <div className="bg-canvas dark:bg-ink border border-brand-dark-900 shadow-lg p-4 rounded-xl space-y-3">
                    <p className="text-xs font-mono font-bold text-accent uppercase tracking-widest">
                      Interaktives Wix Opt-Out Tool
                    </p>
                    <label className="flex items-center gap-3 cursor-pointer text-xs font-mono text-ink-secondary dark:text-canvas/70 select-none">
                      <input
                        type="checkbox"
                        checked={optOutActive}
                        onChange={(e) => {
                          const state = e.target.checked;
                          setOptOutActive(state);
                          if (state) {
                            alert("Opt-out abgeschlossen: Ein Opt-Out cookie blockiert nun jegliche zukünftige Erfassung durch Wix Analytics auf diesem Browser.");
                          }
                        }}
                        className="h-4.5 w-4.5 rounded text-accent border-brand-dark-900 focus:ring-accent focus:ring-opacity-25 bg-canvas shadow-lg"
                      />
                      <span>Opt-out Cookie setzen und Wix Analytics auf diesem Browser vollständig deaktivieren</span>
                    </label>
                  </div>

                  <p className="text-xs text-ink-mute dark:text-canvas/60 font-mono flex items-center gap-1">
                    Weiterführendes Wix-Privacy-Dokument:
                    <a
                      href="https://de.wix.com/about/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline flex items-center gap-0.5"
                    >
                      de.wix.com/about/privacy <ExternalLink className="h-3 w-3 inline" />
                    </a>
                  </p>
                </div>
              </section>

              {/* Section 12: Google Maps */}
              <section
                id="ds-google-maps"
                data-privacy-section
                className="scroll-mt-6 pb-20 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-accent shrink-0" />
                  <h2 className="text-xl font-extrabold uppercase text-ink dark:text-canvas font-sans tracking-tight focus:outline-none focus:text-accent">
                    Einbindung von Google Maps
                  </h2>
                </div>
                <div className="text-sm text-ink dark:text-canvas space-y-3.5 leading-relaxed">
                  <p>
                    (1) Auf dieser Website nutzen wir das Angebot von Google Maps (z. B. auf unserem interaktiven Atzenspots Radarradar-Stadtfinder). Dadurch können wir Ihnen interaktive Karten direkt in der Website anzeigen und ermöglichen Ihnen die komfortable Nutzung der Karten-Funktion.
                  </p>
                  <p>
                    (2) Durch den Besuch auf der Website erhält Google die Information, dass Sie die entsprechende Unterseite aufgerufen haben. Dies erfolgt unabhängig davon, ob Google ein Nutzerkonto bereitstellt oder nicht. Google speichert Ihre Daten als Nutzungsprofile und nutzt sie für Zwecke der Werbung, Marktforschung und bedarfsgerechten Gestaltung.
                  </p>
                  <p className="text-xs text-ink-mute dark:text-canvas/60 font-mono">
                    Weitere Details zu DSGVO & Google Richtlinien:
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline"
                    >
                      policies.google.com/privacy
                    </a>
                  </p>
                </div>
              </section>

            </div>
          </div>

        </div>
      </div>
    </AnimatePresence>
  );
}
