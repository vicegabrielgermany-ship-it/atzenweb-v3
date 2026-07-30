import React from 'react';
import Instagram from 'lucide-react/dist/esm/icons/instagram';
import { IllustratedHeading } from './IllustratedHeading';

interface InstagramFeedProps {
  lang: 'de' | 'en';
}

const HEADLINE: Record<'de' | 'en', string> = {
  de: 'Unsere täglichen Abenteuer eine etwas andere Biermarke aufzubauen',
  en: 'Our daily adventures building a slightly different beer brand',
};

const FOLLOW_LABEL: Record<'de' | 'en', string> = {
  de: 'Uns auf Instagram folgen',
  en: 'Follow Us on Instagram',
};

const POSTS = [
  { url: 'https://www.instagram.com/p/DZXlxx-NY0B/', image: '/elemente/insta-1.webp', alt: 'Atzengold Instagram Post 1' },
  { url: 'https://www.instagram.com/p/DTdYCYcjR7A/', image: '/elemente/insta-2.webp', alt: 'Atzengold Instagram Post 2' },
  { url: 'https://www.instagram.com/atzengold/', image: '/images/instagram-feed.gif', alt: '@atzengold auf Instagram' },
  { url: 'https://www.instagram.com/p/C-xYEQxtNcI/', image: '/elemente/insta-4.webp', alt: 'Atzengold Instagram Post 4' },
  { url: 'https://www.instagram.com/p/DW4H5ljjYqe/', image: '/elemente/insta-5.webp', alt: 'Atzengold Instagram Post 5' },
];

export default function InstagramFeed({ lang }: InstagramFeedProps) {
  return (
    <section id="instagram-feed" className="py-32 bg-texture-paper text-ink relative overflow-hidden transition-all duration-300">
      <div className="content-width relative z-10 flex flex-col items-start gap-10">

        <IllustratedHeading
          text={HEADLINE[lang]}
          src="/elemente/HEADLINE4_InstagramCrap.png"
          className="max-w-[360px]"
        />
        <p className="font-mono text-sm" style={{ color: '#1A1A1A' }}>
          {lang === 'en' ? 'Expand your doomscrolling depression!' : 'Erweitere hier deine Doomscrolling Depression!'}
        </p>

        {/* 5-post grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
          {POSTS.map((post, i) => (
            <a
              key={i}
              href={post.url}
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square overflow-hidden border border-ink/15 dark:border-canvas/15 shadow-xl bg-ink/5 dark:bg-canvas/5 flex items-center justify-center"
            >
              <img
                src={post.image}
                alt={post.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold font-mono drop-shadow-lg">
                  {FOLLOW_LABEL[lang]}
                </span>
              </div>
            </a>
          ))}
        </div>

        <a
          href="https://www.instagram.com/atzengold/"
          target="_blank"
          rel="noreferrer"
          className="self-center inline-flex items-center gap-2 text-xs sm:text-sm font-sans font-black tracking-wider uppercase transition-all duration-200 hover:underline" style={{ color: '#1A1A1A' }}
        >
          <Instagram className="h-5 w-5 shrink-0" />
          <span>{FOLLOW_LABEL[lang]}</span>
        </a>

      </div>
    </section>
  );
}
