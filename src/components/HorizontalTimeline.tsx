import { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { StoryNode } from '../types';

interface HorizontalTimelineProps {
  nodes: StoryNode[];
  lang: 'de' | 'en';
}

export default function HorizontalTimeline({ nodes, lang }: HorizontalTimelineProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      container?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 600;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative w-full bg-canvas">
      {/* Scroll Navigation */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-gradient-to-r from-canvas via-canvas to-transparent text-ink hover:text-primary transition-colors"
          aria-label="Scroll left"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-gradient-to-l from-canvas via-canvas to-transparent text-ink hover:text-primary transition-colors"
          aria-label="Scroll right"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Horizontal Timeline Container */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto scroll-smooth custom-scrollbar"
      >
        <div className="flex gap-16 px-6 py-12 min-w-min">
          {nodes.map((node, idx) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="flex-shrink-0 w-[600px] space-y-6"
            >
              {/* Header Badge */}
              <div className="inline-flex items-center bg-accent text-on-accent px-4 py-2 text-xs font-bold uppercase tracking-wider">
                DIE ATZENGOLD LEGENDE
              </div>

              {/* Tagline in green */}
              <p className="text-primary font-mono font-bold text-sm uppercase tracking-widest">
                {lang === 'en' ? node.taglineEn : node.tagline}
              </p>

              {/* Main Title - Large handwritten */}
              <h3 className="text-5xl font-handwritten font-bold text-ink normal-case leading-tight">
                {lang === 'en' ? node.titleEn : node.title}
              </h3>

              {/* Content Grid: Polaroid Left, Text Right */}
              <div className="grid grid-cols-2 gap-8 items-start pt-4">
                {/* Left: Polaroid Image */}
                <div className="flex justify-start">
                  {node.gifUrl && (
                    <div className="bg-blue-100 border-8 border-white shadow-xl rounded-sm transform -rotate-2 overflow-hidden w-48">
                      <img
                        src={node.gifUrl}
                        alt={node.title}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="bg-white px-3 py-4 text-center">
                        <p className="font-mono font-black text-lg text-ink">{node.year}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Description Text */}
                <div className="space-y-4 pt-6">
                  <p className="text-sm leading-relaxed text-ink font-mono">
                    {lang === 'en' ? node.textEn : node.text}
                  </p>

                  {/* Timeline indicator at bottom */}
                  <p className="text-xs font-mono font-bold text-ink-mute pt-4 tracking-widest">
                    2012 ..... 2019 ..... 2026 .... 2024
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
