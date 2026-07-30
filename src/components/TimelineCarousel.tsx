import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import { Language } from '../types';

interface TimelineCarouselProps {
  lang: Language;
}

interface SlideData {
  year: string;
  headline: string;
  subtitle: string;
  body: string;
}

const SLIDES: SlideData[] = [
  {
    year: '2012',
    headline: 'Vom VICE-Büro nach Franken',
    subtitle: 'Wo Atze auf Tradition trifft',
    body: 'Nachdem er jahrelang für das VICE Magazine in Berlin arbeitete, verschlug es Gabriel, den Gründer von Atzengold 2012 in die Metropolregion. Dort jobbte Abends für Harry, der die HeyHey Bar in der Klaragasse betrieb und der aus Atzenhof stammt. "Atze" ist in Berlin ein wichtiges Wort in der Jugendsprache.',
  },
  {
    year: '2019',
    headline: 'Aus Langeweile wird Bier',
    subtitle: 'Aus Langeweile wird Bier',
    body: 'Gott, war das langweilig, aber dann fiel der Groschen: Wir finden das leckerste Bier in ganz Franken und bringen es zu unseren Atzen nach Berlin. Und der Name? Atzengold.',
  },
  {
    year: '2022',
    headline: 'Sorte, Rezept, Etiketten etc.',
    subtitle: 'Sorte, Rezept, Etiketten etc.',
    body: 'Pils und Helles gibt es in Berlin schon genug. Was es noch nicht gibt, ist die urfränkische Variante des Kellerbiers. Aber damit die Berliner nicht aus allen Wolken fallen, wollen wir am liebsten ein möglichst "leichtes" Kellerbier, d.h. mit wenig Schwebstoffen, aber trotzdem einem neuen Geschmack.',
  },
  {
    year: '2023',
    headline: 'Die Geburtsstunde',
    subtitle: 'Die Geburtsstunde',
    body: 'Die Idee ward geboren und so entstand ein süffiges unfiltriertes Helles um dass sich immer mehr Atzen (das beinhaltet natürlich auch ausdrücklich Atz:innen, auch wenn das Wort geschlechtslos ist) scharen. Wir werden der beste Markteinstieg einer neuen Marke in der Biothek Fürth seit 2016 und gehen auf Instagram viral.',
  },
  {
    year: 'Heute',
    headline: 'Franken statt Berlin',
    subtitle: 'Franken statt Berlin',
    body: 'Eigentlich war der Plan, zuerst das Bier in Berliner Spätis zu verkaufen. Prophet im eigenen Land und so. Doch unser Atzengold ist so süffig, dass die Franken selbst den Großteil austrinken! Und als Nächstes machen wir Berlin glücklich ✌️',
  },
];

const TIMELINE_NAV_ITEMS = [
  { year: '2012', yearImg: '/elemente/timeline-pagination/2012.png' },
  { dots: '/elemente/timeline-pagination/dots-1.png' },
  { year: '2019', yearImg: '/elemente/timeline-pagination/2015.png' },
  { dots: '/elemente/timeline-pagination/dots-2.png' },
  { year: '2022', yearImg: '/elemente/timeline-pagination/2020.png' },
  { dots: '/elemente/timeline-pagination/dots-3.png' },
  { year: '2023', yearImg: '/elemente/timeline-pagination/2023.png' },
  { dots: '/elemente/timeline-pagination/dots-1.png' },
  { year: 'Heute', yearImg: '/elemente/timeline-pagination/2024.png' },
] as const;

const TIMELINE_HEADINGS = [
  '/elemente/1-berlin-thrifft-atzenhof.webp',
  '/elemente/2-covid-hits.webp',
  '/elemente/3-wir-bauen-eine-firma.webp',
  '/elemente/4-launch.webp',
  '/elemente/5-franconian-thirst.webp',
];

const TIMELINE_HEADINGS_ALT = [
  'Berlin trifft Atzenhof',
  'COVID trifft',
  'Wir bauen eine Firma',
  'Launch',
  'Franconian Thirst',
];

function PolaroidCard({ rotation }: { rotation: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, rotate: rotation - 4 }}
      animate={{ opacity: 1, scale: 1, rotate: rotation }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="relative"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="relative max-w-full max-w-[320px]">
        <img
          src="/elemente/Polaroid_PLATZHALTER.png"
          alt=""
          className="w-full h-auto block"
        />
      </div>
    </motion.div>
  );
}

function TimelineNav({
  activeIndex,
  onYearClick,
}: {
  activeIndex: number;
  onYearClick: (index: number) => void;
}) {
  const navRef = useRef<HTMLDivElement>(null);
  const yearRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const underlineRef = useRef<HTMLImageElement>(null);

  const yearIndices = TIMELINE_NAV_ITEMS.reduce<number[]>((acc, item, i) => {
    if ('year' in item) acc.push(i);
    return acc;
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    const underline = underlineRef.current;
    if (!nav || !underline) return;

    const targetIdx = yearIndices[activeIndex];
    const btn = yearRefs.current[targetIdx];
    if (!btn) return;

    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const x = btnRect.left - navRect.left + (btnRect.width - underline.offsetWidth) / 2;

    underline.style.transform = `translateX(${x}px)`;
  }, [activeIndex, yearIndices]);

  let yearCounter = 0;

  return (
    <div ref={navRef} className="relative flex items-center w-full">
      <img
        ref={underlineRef}
        src="/elemente/timeline-pagination/timeline-underline.png"
        alt=""
        aria-hidden="true"
        className="absolute -bottom-1 left-0 h-3 w-auto pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] mix-blend-multiply"
      />
      {TIMELINE_NAV_ITEMS.map((item, i) => {
        if ('dots' in item) {
          return (
            <img
              key={`dots-${i}`}
              src={item.dots}
              alt=""
              aria-hidden="true"
              className="h-2 w-auto flex-1 opacity-60 object-contain mix-blend-multiply"
            />
          );
        }

        const slideIdx = yearCounter;
        yearCounter++;
        const isActive = slideIdx === activeIndex;

        return (
          <button
            key={item.year}
            ref={(el) => { yearRefs.current[i] = el; }}
            onClick={() => onYearClick(slideIdx)}
            className={`cursor-pointer bg-transparent border-none p-0 transition-opacity duration-300 mix-blend-multiply ${
              isActive ? 'opacity-100' : 'opacity-40 hover:opacity-70'
            }`}
          >
            <img
              src={item.yearImg}
              alt={item.year}
              className="h-5 w-auto mix-blend-multiply"
            />
          </button>
        );
      })}
    </div>
  );
}

export default function TimelineCarousel({ lang }: TimelineCarouselProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToSlide = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    if (!slide) return;
    track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
  }, []);

  // Track active slide index from scroll position
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleScroll = () => {
      const scrollLeft = track.scrollLeft;
      let idx = 0;
      for (let i = 0; i < track.children.length; i++) {
        const child = track.children[i] as HTMLElement;
        if (child.offsetLeft <= scrollLeft + child.offsetWidth / 2) {
          idx = i;
        }
      }
      if (idx !== activeIndex && idx >= 0 && idx < SLIDES.length) {
        setActiveIndex(idx);
      }
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    return () => track.removeEventListener('scroll', handleScroll);
  }, [activeIndex]);

  const handleYearClick = (index: number) => {
    scrollToSlide(index);
  };

  // Keyboard arrow navigation for the carousel
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = Math.min(SLIDES.length - 1, activeIndex + 1);
        scrollToSlide(nextIndex);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = Math.max(0, activeIndex - 1);
        scrollToSlide(prevIndex);
      }
    };

    outer.addEventListener('keydown', handleKeyDown);
    return () => outer.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, scrollToSlide]);

  const rotations = [-6, 4, -3, 5, -4];

  return (
    <div ref={outerRef} className="timeline-carousel-outer relative" tabIndex={0} role="region" aria-label="Timeline carousel, use arrow keys to navigate">
      {/* Left Arrow */}
      <button
        onClick={() => { const prev = Math.max(0, activeIndex - 1); scrollToSlide(prev); }}
        className="timeline-nav-btn left-2 md:left-4"
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => { const next = Math.min(SLIDES.length - 1, activeIndex + 1); scrollToSlide(next); }}
        className="timeline-nav-btn right-2 md:right-4"
        aria-label="Next slide"
      >
        <ChevronRight size={28} />
      </button>

      {/* Horizontal scroll track */}
      <div ref={trackRef} className="timeline-carousel-track">
        {SLIDES.map((slide, idx) => (
          <div key={slide.year} className="timeline-carousel-slide pr-6 md:pr-12 lg:pr-20 pl-4 md:pl-8 lg:pl-2 py-4 md:py-0">
            <div className="w-full content-width ml-0 mr-auto grid grid-cols-1 lg:grid-cols-[minmax(280px,35%)_1fr] gap-4 lg:gap-6 items-center">
              {/* Left: Storytime graphic (slide 1) + Polaroid Photo Card */}
              <div className="flex flex-col items-center lg:items-start lg:sticky lg:top-20 lg:self-start gap-4">
                {idx === 0 && (
                  <img
                    src="/elemente/HEADLINE1_Storytime.png"
                    alt="Story Time!"
                    className="max-w-full max-w-[200px] md:max-w-xs h-auto"
                    style={{ transform: 'rotate(-1.5deg)' }}
                  />
                )}
                {idx === 2 ? (
                  <img
                    src="/atzengold-logo.webp"
                    alt="Atzengold Logo"
                    className="max-w-full max-w-[280px] w-full h-auto"
                    style={{ transform: 'rotate(-1.5deg)' }}
                  />
                ) : idx === 1 ? (
                  <video
                    src="/videos/atzengold-logo-evolve.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="max-w-full max-w-[320px] w-full aspect-square object-cover rounded-lg shadow-lg"
                    style={{ transform: 'rotate(2deg)' }}
                  />
                ) : idx === 3 ? (
                  <img
                    src="/images/richtig.gif"
                    alt="Richtig!"
                    className="max-w-full max-w-[320px] w-full h-auto rounded-lg shadow-lg"
                    style={{ transform: 'rotate(-2deg)' }}
                  />
                ) : idx === 4 ? (
                  <video
                    src="/videos/atzengold_thirst.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="max-w-full max-w-[320px] w-full h-auto rounded-lg shadow-lg"
                    style={{ transform: 'rotate(-1deg)' }}
                  />
                ) : (
                  <PolaroidCard rotation={rotations[idx % rotations.length]} />
                )}
              </div>

              {/* Right: Content Stack */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6 min-w-0"
              >
                {/* Timeline heading image */}
                <div>
                  <img
                    src={TIMELINE_HEADINGS[idx]}
                    alt={TIMELINE_HEADINGS_ALT[idx]}
                    className="block max-w-full max-w-[min(100%,min(28rem,calc(100vw-3rem)))] h-auto mix-blend-multiply"
                    style={{ transform: 'rotate(-1.5deg)' }}
                  />
                </div>

                {/* Sub-headline */}
                <p className="font-mono text-lg font-bold uppercase tracking-[0.25em] text-[#1A1A1A] break-words">
                  {slide.headline}
                </p>

                {/* Body text */}
                <div className="max-w-lg">
                  <p className="font-mono text-sm leading-relaxed text-[#1A1A1A] break-words">
                    {slide.body}
                  </p>
                </div>

                {/* Timeline Navigation Bar */}
                <div className="pt-6">
                  <TimelineNav activeIndex={activeIndex} onYearClick={handleYearClick} />
                </div>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
