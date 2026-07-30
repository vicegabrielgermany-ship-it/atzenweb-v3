import React from 'react';
import { motion } from 'motion/react';
import { Language } from '../types';

interface HeritageCrestsProps {
  lang: Language;
}

interface Crest {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  extra?: string;
  svg: React.ReactNode;
}

export default function HeritageCrests({ lang }: HeritageCrestsProps) {
  const crests: Crest[] = [
    {
      id: 'bayern',
      name: lang === 'en' ? 'Bavaria' : 'Bayern',
      subtitle: lang === 'en' ? 'Free State' : 'Freistaat',
      description: lang === 'en' ? 'The state of brewing excellence' : 'Staatliche Brautradition',
      extra: lang === 'en' ? 'Bavarian Purity Law' : 'bayerisches Reinheitsgebot',
      svg: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/d/d2/Bayern_Wappen.svg"
          alt="Bavaria Crest"
          className="w-16 h-20 object-contain drop-shadow-md select-none mix-blend-multiply grayscale"
        />
      )
    },
    {
      id: 'franken',
      name: lang === 'en' ? 'Franconia' : 'Franken',
      subtitle: lang === 'en' ? 'Origin' : 'Heimat',
      description: lang === 'en' ? 'Land of the Kellerbier' : 'Wiege des Kellerbiers',
      svg: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Frankenrechen.svg"
          alt="Franken Crest"
          className="w-16 h-20 object-contain drop-shadow-md select-none mix-blend-multiply grayscale"
        />
      )
    },
    {
      id: 'furth',
      name: 'Fürth',
      subtitle: lang === 'en' ? 'Brewery' : 'Brauort',
      description: lang === 'en' ? 'Where Atzengold is born' : 'Fürth-Atzenhof',
      svg: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/92/Wappen_F%C3%BCrth.svg"
          alt="Fürth Crest"
          className="w-16 h-20 object-contain drop-shadow-md select-none mix-blend-multiply grayscale"
        />
      )
    },
    {
      id: 'berlin',
      name: 'Berlin',
      subtitle: lang === 'en' ? 'Corner Kiez' : 'Kiez & Pflaster',
      description: lang === 'en' ? 'Where the beer meets concrete' : 'Zu Hause auf dem Bordstein',
      svg: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/8c/DEU_Berlin_COA.svg"
          alt="Berlin Crest"
          className="w-16 h-20 object-contain drop-shadow-md select-none mix-blend-multiply grayscale"
        />
      )
    }
  ];

  return (
    <div className="w-full py-12 border-t border-b border-ink/5 dark:border-canvas/5 my-8">
      <div className="content-width px-4">
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono tracking-widest uppercase opacity-50 block mb-1">
            // {lang === 'en' ? 'GEOGRAPHIC HERITAGE' : 'GEOGRAFISCHES ERBGUT'}
          </span>
          <h4 className="text-[56px] leading-[59px] font-handwritten font-bold normal-case text-ink dark:text-canvas">
            {lang === 'en' ? 'Our Regional Roots' : 'Unsere regionalen Wurzeln'}
          </h4>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {crests.map((crest, index) => (
            <motion.div
              key={crest.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center text-center p-4 rounded-xl border border-transparent hover:border-ink/10 dark:hover:border-canvas/10 hover:bg-canvas-soft/50 dark:hover:bg-primary-deep/40 transition-all"
            >
              <div className="mb-4">
                {crest.svg}
              </div>
              <span className="text-sm font-bold text-ink dark:text-canvas">{crest.name}</span>
              <span className="text-[10px] font-mono font-bold tracking-wider text-accent uppercase mt-1">{crest.subtitle}</span>
              <span className="text-[10px] text-ink-mute dark:text-canvas/50 leading-tight mt-1.5 max-w-[120px] font-sans">
                {crest.description}
              </span>
              {crest.extra && (
                <span className="text-[10px] text-ink-mute dark:text-canvas/50 leading-tight mt-1 max-w-[120px] font-sans italic">
                  {crest.extra}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Narrative Context Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-12 border-t border-ink/10 dark:border-canvas/10">
          {/* Card 1: The Style */}
          <div className="bg-canvas-soft dark:bg-brand-dark-900/40 border border-ink/10 dark:border-canvas/10 p-6 rounded-md shadow-sm relative group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 w-2 h-full bg-accent rounded-l-md" />
            <span className="text-[10px] font-mono tracking-widest text-accent uppercase font-bold block mb-2">// 01. {lang === 'en' ? 'THE STYLE' : 'DER BIERSTIL'}</span>
            <h5 className="text-2xl font-handwritten font-black text-ink dark:text-canvas uppercase mb-3">Kellerbier</h5>
            <p className="text-xs leading-relaxed text-ink-secondary dark:text-canvas/80 font-medium font-sans">
              {lang === 'en'
                ? 'Kellerbier is an unfiltered, naturally cloudy bottom-fermented lager native to northern Bavaria (Franconia/Franken), which boasts the highest density of traditional breweries in the world.'
                : 'Kellerbier ist ein unfiltriertes, naturtrübes untergäriges Lagerbier aus Nordbayern (Franken) – einer Region mit der höchsten Dichte an traditionellen Brauereien weltweit.'}
            </p>
          </div>

          {/* Card 2: The Model */}
          <div className="bg-canvas-soft dark:bg-brand-dark-900/40 border border-ink/10 dark:border-canvas/10 p-6 rounded-md shadow-sm relative group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 w-2 h-full bg-ink/20 rounded-l-md" />
            <span className="text-[10px] font-mono tracking-widest text-primary uppercase font-bold block mb-2">// 02. {lang === 'en' ? 'BREWERY MODEL' : 'BRAUVERFAHREN'}</span>
            <h5 className="text-2xl font-handwritten font-black text-ink dark:text-canvas uppercase mb-3">{lang === 'en' ? 'Contract Brewing' : 'Lohnbrauen'}</h5>
            <p className="text-xs leading-relaxed text-ink-secondary dark:text-canvas/80 font-medium font-sans">
              {lang === 'en'
                ? 'Atzengold is brewed under license by renting tank capacities from generational, family-owned craft breweries located in Upper Franconia (specifically in Buttenheim, near Bamberg).'
                : 'Atzengold wird in Lizenz gebraut, indem freie Tankkapazitäten von traditionsreichen, familiengeführten Handwerksbrauereien in Oberfranken (speziell in Buttenheim bei Bamberg) gemietet werden.'}
            </p>
          </div>

          {/* Card 3: The Connection */}
          <div className="bg-canvas-soft dark:bg-brand-dark-900/40 border border-ink/10 dark:border-canvas/10 p-6 rounded-md shadow-sm relative group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 w-2 h-full bg-ink dark:bg-canvas rounded-l-md" />
            <span className="text-[10px] font-mono tracking-widest text-ink dark:text-canvas uppercase font-bold block mb-2">// 03. {lang === 'en' ? 'THE BRIDGE' : 'DIE VERBINDUNG'}</span>
            <h5 className="text-2xl font-handwritten font-black text-ink dark:text-canvas uppercase mb-3">{lang === 'en' ? 'Berlin ✕ Franken' : 'Berlin ✕ Franken'}</h5>
            <p className="text-xs leading-relaxed text-ink-secondary dark:text-canvas/80 font-medium font-sans">
              {lang === 'en'
                ? 'The brand serves as a bridge between Berlin (the urban late-night Späti street culture where the founders got their inspiration) and Franken (where Gabriel moved for love and found the world-class brewing craft to make his dream recipe a reality).'
                : 'Die Marke schlägt eine Brücke zwischen Berlin (der urbanen Späti-Kultur, die als Inspiration diente) und Franken (wo Gabriel der Liebe wegen hinzog und die weltklasse Braukunst fand, um das Rezept zu verwirklichen).'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
