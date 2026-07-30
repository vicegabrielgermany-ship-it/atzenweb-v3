import { useState, useEffect } from 'react';
import Palette from 'lucide-react/dist/esm/icons/palette';
import Type from 'lucide-react/dist/esm/icons/type';
import Volume2 from 'lucide-react/dist/esm/icons/volume-2';
import Briefcase from 'lucide-react/dist/esm/icons/briefcase';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import Copy from 'lucide-react/dist/esm/icons/copy';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import Layout from 'lucide-react/dist/esm/icons/layout';
import Instagram from 'lucide-react/dist/esm/icons/instagram';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Tv from 'lucide-react/dist/esm/icons/tv';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import X from 'lucide-react/dist/esm/icons/x';
import Check from 'lucide-react/dist/esm/icons/check';
import Layers from 'lucide-react/dist/esm/icons/layers';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';
import GoldBarsSVG from './GoldBarsSVG';
import { fetchBrandHub } from '../lib/public-api';

interface BrandColor {
  name: string;
  role: string;
  hex: string;
  rgb: string;
  cmyk: string;
  usage: string;
  textColor: string;
  bgColor: string;
}

interface BrandValue {
  title: string;
  description: string;
}

const FALLBACK_COLORS: BrandColor[] = [
  {
    name: 'Atzen Gold',
    role: 'Primary Brand Accent & Warmth',
    hex: 'oklch(0.817 0.168 78.0)',
    rgb: 'oklch(0.817 0.168 78.0)',
    cmyk: 'oklch(0.817 0.168 78.0)',
    usage: 'Logos, main CTA highlights, primary packaging typography, borders.',
    textColor: 'text-accent',
    bgColor: 'bg-accent'
  },
  {
    name: 'Kuckuck Green',
    role: 'Heritage Brewing & Unfiltered Nature',
    hex: 'oklch(0.485 0.134 165.0)',
    rgb: 'oklch(0.485 0.134 165.0)',
    cmyk: 'oklch(0.485 0.134 165.0)',
    usage: 'Core brand label backdrop, foliage illustrations, secondary accents.',
    textColor: 'text-[oklch(0.485_0.134_165.0)]',
    bgColor: 'bg-[oklch(0.485_0.134_165.0)]'
  },
  {
    name: 'Pavement Cream',
    role: 'Vintage Parchment background',
    hex: 'oklch(0.978 0.008 78.0)',
    rgb: 'oklch(0.978 0.008 78.0)',
    cmyk: 'oklch(0.978 0.008 78.0)',
    usage: 'Rustic paper textures, cards background, off-white high-contrast text backing.',
    textColor: 'text-canvas',
    bgColor: 'bg-canvas'
  },
  {
    name: 'Berlin Charcoal',
    role: 'Underground Asphalt Canvas',
    hex: 'oklch(0.15 0.05 165.0)',
    rgb: 'oklch(0.15 0.05 165.0)',
    cmyk: 'oklch(0.15 0.05 165.0)',
    usage: 'Core digital backdrop, high contrast surface, dark-mode body canvas.',
    textColor: 'text-brand-dark-900',
    bgColor: 'bg-brand-dark-900'
  },
  {
    name: 'Purity White',
    role: 'Alpine Spark & Clean Copying',
    hex: 'oklch(0.85 0.04 75.0)',
    rgb: 'oklch(0.85 0.04 75.0)',
    cmyk: 'oklch(0.85 0.04 75.0)',
    usage: 'Primary layout text, clear spacing background, light-mode body backing.',
    textColor: 'text-brand-dark-900',
    bgColor: 'bg-canvas'
  }
];

const FALLBACK_VALUES: BrandValue[] = [
  {
    title: 'Mission & Dream',
    description: 'Our mission is to build the gold standard of organic street beer. We democratize pure, unfiltered regional cellar brewing expertise and introduce honest, slow-brewed craftsmanship into the modern cityscape—bridging Franconian family-history and raw Berlin nightlife without the pretentious premium price tags of modern corporate craft beer conglomerates.'
  },
  {
    title: 'Brand Personality',
    description: 'Atzengold is highly professional about beer quality but thoroughly unpretentious about everything else. The personality is rugged, confident, dry-witted, extremely transparent, and fiercely independent. We speak to our community at eye level. We do not use flashy marketing slogans, and we never apologize for being unfiltered.'
  },
  {
    title: 'The Target Audience',
    description: 'Our primary crowd consists of "Premium Urban Atzen" (Ages 18-38): creative professionals, skaters, musicians, club lovers, and raw-design enthusiasts who value cultural authenticity, hand-crafted detail, and local community. They are immune to generic commercial corporate advertisements, seeking brands with deep roots and street-wise swagger.'
  }
];

const FALLBACK_CORE_VALUES: BrandValue[] = [
  {
    title: 'Heritage Honesty (Bodenständigkeit)',
    description: 'We never hide our origins. Our labels display \'Atzenhof Franken\' with pride because our beer is made using ancient Franconian methods by true local brewers. We celebrate the legacy, techniques, and families behind the liquid, refusing all short-cuts like high-gravity brewing or artificial filtration.'
  },
  {
    title: 'Cultural Autonomy',
    description: 'Our brand belongs on the street corners, at community record fairs, skateboarding spots, and creative late-night studios—not in pristine boardrooms. We invest our resources directly into sponsoring local street art, independent DJs, and grassroots underground initiatives instead of generic agencies.'
  },
  {
    title: 'Radical Transparency (No filter)',
    description: 'This value applies equally to our Kellerbier and our corporate dealings. We show our real partners on mashing decks, publish local contract volumes, explain our cuckoo model explicitly, admit failures with dry humor, and keep our digital cookies restricted to essential storage—keeping the experience as real as possible.'
  }
];

interface BrandHubProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onTriggerNotification?: (message: string) => void;
  variant?: 'overlay' | 'embedded';
}

export default function BrandHub({ lang, isOpen, onClose, onTriggerNotification, variant = 'overlay' }: BrandHubProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'visuals' | 'voice' | 'applications'>('overview');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Interactive Typography Tester State
  const [customText, setCustomText] = useState('Naturtrüb. Ehrlich. Fränkisch.');
  const [fontSize, setFontSize] = useState<number>(36);

  // Interactive Tone Changer State
  const [activeToneContext, setActiveToneContext] = useState<'marketing' | 'support' | 'error' | 'social'>('marketing');

  const [brandHubData, setBrandHubData] = useState<{
    colors: BrandColor[];
    values: BrandValue[];
    coreValues: BrandValue[];
  }>({ colors: FALLBACK_COLORS, values: FALLBACK_VALUES, coreValues: FALLBACK_CORE_VALUES });

  useEffect(() => {
    fetchBrandHub().then(data => {
      if (data && data.colors) setBrandHubData(data);
    });
  }, []);

  const { colors, values: brandValues, coreValues } = brandHubData;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    if (onTriggerNotification) {
      onTriggerNotification(`📋 Copied to clipboard: ${label}`);
    }
    setTimeout(() => setCopiedText(null), 2000);
  };

  if (variant === 'overlay' && !isOpen) return null;

  return (
    <div className={variant === 'embedded' ? 'min-h-screen bg-canvas' : 'fixed inset-0 bg-canvas z-50 overflow-y-auto block backdrop-blur-md'} id="brand-guidelines-hub">
      {/* Top Banner Header of Brand Portal */}
      <div className={`${variant === 'embedded' ? '' : 'sticky top-0'} bg-canvas-soft border border-brand-dark-900/10 rounded-xl shadow-lg/90 border-b border-brand-dark-900 z-50`}>
        <div className="content-width px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 border border-accent/20 rounded bg-accent/10 text-accent font-mono text-xs font-bold">
              SYSTEM v1.0
            </span>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-brand-dark-900 uppercase font-sans">
                ATZENGOLD // DESIGN HUB
              </h1>
              <p className="text-[10px] font-mono text-ink-secondary tracking-wider uppercase">
                Official Brand Guidelines & Core Visual Identity Blueprint
              </p>
            </div>
          </div>

          {variant === 'overlay' && (
            <button
              onClick={onClose}
              className="rounded-lg p-2 bg-canvas border border-brand-dark-900 text-ink-secondary hover:text-brand-dark-900 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Exit Design Portal"
            >
              <X className="h-4 w-4" />
              <span className="text-xs font-mono font-bold uppercase hidden sm:inline">Close Hub</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Hub Container */}
      <div className="content-width px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Intro Executive Summary Frame */}
        <div className="relative rounded-3xl border border-brand-dark-900 bg-ink p-8 md:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 bottom-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            <div className="lg:col-span-8 space-y-6">
              <span className="text-[10px] font-mono bg-canvas-soft border border-brand-dark-900/10 rounded-xl shadow-lg border border-brand-dark-900 text-ink-secondary font-bold px-3 py-1 rounded">
                DESIGN MEMO RE-BRAND STUDY
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-canvas uppercase tracking-tight leading-none">
                CRAFTING STAGE GOLD FOR THE PAVEMENT.
              </h2>
              <p className="text-sm sm:text-base text-canvas leading-relaxed max-w-3xl">
                This document serves as the absolute authority and single source of truth for the <strong className="text-accent underline">Atzengold</strong> identity. It specifies how our traditional Franconian beer heritage and unfiltered street-wise attitude must be unified across digital storefronts, physical print collateral, environmental retail spaces, and social media canvases.
              </p>

              <div className="flex flex-wrap gap-4 text-xs font-mono font-bold text-canvas/60">
                <span>PROJECT TYPE: Beer & Street Merch</span>
                <span>•</span>
                <span>AUDIENCE: Premium Urban Subculture</span>
                <span>•</span>
                <span>LAST UPDATED: June 2026</span>
              </div>
            </div>

            {/* Quick Summary Specs Badge */}
            <div className="lg:col-span-4 rounded-2xl bg-canvas-soft border border-brand-dark-900/10 rounded-xl shadow-lg p-6 space-y-4">
              <span className="text-[10px] font-mono text-accent uppercase font-bold tracking-widest block">Executive Summary Specs</span>
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between border-b border-brand-dark-900 pb-2">
                  <span className="text-ink-secondary">Primary Crest:</span>
                  <span className="text-brand-dark-900 font-mono font-bold">Circular Bavarian Brewer</span>
                </div>
                <div className="flex justify-between border-b border-brand-dark-900 pb-2">
                  <span className="text-ink-secondary">Type treatment:</span>
                  <span className="text-brand-dark-900 font-mono font-bold">Blackletter Gothic contour</span>
                </div>
                <div className="flex justify-between border-b border-brand-dark-900 pb-2">
                  <span className="text-ink-secondary">Primary Core Font:</span>
                  <span className="text-brand-dark-900 font-mono font-bold">Inter / Plus Jakarta Sans</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Brand Vibe:</span>
                  <span className="text-accent font-mono font-bold">Rustic-Edgy, Unfiltered</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection Navigation Bar */}
        <div className={`flex border-b border-ink/10 overflow-x-auto scrollbar-none ${variant === 'embedded' ? '' : 'sticky top-20'} bg-canvas-soft border border-brand-dark-900/10 rounded-xl shadow-lg z-40 py-2`}>
          <div className="flex gap-2">
            {[
              { id: 'overview', label: '1. Brand Overview', icon: Briefcase },
              { id: 'visuals', label: '2. Visual Identity', icon: Palette },
              { id: 'voice', label: '3. Voice & Tone Guidelines', icon: Volume2 },
              { id: 'applications', label: '4. Application Blueprints', icon: Layout },
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-accent text-on-accent shadow'
                      : 'bg-canvas hover:bg-ink/10 border border-brand-dark-900 text-ink-secondary hover:text-brand-dark-900'
                  }`}
                >
                  <IconComponent className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Tab Panel Body */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-12"
            >

              {/* TAB 1: BRAND OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-10">
                  {/* Brand Pillars Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {brandValues.map((v, i) => {
                      const badgeColors = [
                        'bg-[oklch(0.817_0.168_78.0)]/10 border-[oklch(0.817_0.168_78.0)]/20 text-[oklch(0.817_0.168_78.0)]',
                        'bg-[oklch(0.485_0.134_165.0)]/10 border-[oklch(0.485_0.134_165.0)]/20 text-[oklch(0.485_0.134_165.0)]',
                        'bg-[oklch(0.978_0.008_78.0)]/10 border-[oklch(0.978_0.008_78.0)]/20 text-accent',
                      ];
                      return (
                        <div key={i} className="rounded-2xl border border-ink/10 bg-canvas p-6 space-y-4">
                          <div className={`h-10 w-10 rounded-lg ${badgeColors[i] || badgeColors[0]} flex items-center justify-center font-bold font-mono`}>
                            {String(i + 1).padStart(2, '0')}
                          </div>
                          <h3 className="text-lg font-extrabold text-brand-dark-900 uppercase tracking-tight">{v.title}</h3>
                          <p className="text-xs text-ink-secondary leading-relaxed font-sans">{v.description}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Core Brand Values Accordion Style */}
                  <div className="rounded-2xl border border-brand-dark-900 bg-canvas-soft border border-brand-dark-900/10 rounded-xl shadow-lg p-6 md:p-8 space-y-6">
                    <h3 className="text-xl font-extrabold uppercase text-brand-dark-900 flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-accent" />
                      Our 3 Non-Negotiable Core Brand Values
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-brand-dark-900">
                      {coreValues.map((cv, i) => (
                        <div key={i} className="space-y-2">
                          <span className="text-[10px] font-mono text-accent font-bold block">VALUE {String(i + 1).padStart(2, '0')} //</span>
                          <h4 className="text-sm font-black text-brand-dark-900 uppercase">{cv.title}</h4>
                          <p className="text-xs text-ink-secondary leading-relaxed font-sans">{cv.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Competitive Positioning Matrix */}
                  <div className="rounded-2xl border border-brand-dark-900 bg-ink p-6 md:p-8 space-y-6">
                    <div>
                      <h3 className="text-xl font-extrabold uppercase text-canvas tracking-tight">Competitive Positioning Matrix</h3>
                      <p className="text-xs text-canvas/60 mt-1 font-mono">How Atzengold stands out in the crowded global beverage market.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-t border-canvas/10 pt-6">

                      {/* Left: Interactive comparison quadrant mock */}
                      <div className="md:col-span-7 bg-canvas-soft border border-brand-dark-900/10 rounded-xl shadow-lg rounded-xl p-4 border border-brand-dark-900 relative aspect-video flex flex-col justify-between overflow-hidden select-none font-mono text-[9px]">
                        {/* Centered Axis lines */}
                        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-ink/20" />
                        <div className="absolute inset-y-0 left-1/2 w-[1px] bg-ink/20" />

                        {/* Axis labels */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase text-ink-secondary">Traditional Heritage</div>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase text-ink-secondary">Corporate Sterile</div>
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 r text-[8px] font-bold uppercase text-ink-secondary rotate-90 origin-left">Slick & Academic</div>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-bold uppercase text-ink-secondary -rotate-90 origin-right">Raw & Street-Smart</div>

                        {/* Quad corners labels */}
                        <div className="text-ink-mute self-start p-1 bg-canvas-soft border border-brand-dark-900/10 rounded-xl shadow-lg">Classic Bavarian (Späten / Tegernseer)</div>
                        <div className="text-accent font-bold self-end p-2 bg-accent/10 border border-accent/20 rounded z-10 scale-110">👑 ATZENGOLD HELLESSEN</div>
                        <div className="text-ink-mute self-start p-1 bg-canvas-soft border border-brand-dark-900/10 rounded-xl shadow-lg rounded">Over-Designed IPAs (Sterni / Oetinger)</div>
                        <div className="text-ink-mute self-end p-1 bg-canvas-soft border border-brand-dark-900/10 rounded-xl shadow-lg rounded">Premium Industrial (Craft-Hipster lines)</div>
                      </div>

                      {/* Right Matrix Analysis Text */}
                      <div className="md:col-span-5 space-y-4">
                        <h4 className="text-sm font-extrabold uppercase text-accent">The Sweet Spot: High Heritage x Raw Energy</h4>
                        <p className="text-xs text-canvas/80 leading-relaxed font-sans">
                          Most traditional brands feel overly conservative, rustic, and disconnected from modern metropolitan nightlife. Meanwhile, hip hop or micro-brewery craft lines feel overly sterile, complicated, and hyper-designed. We represent the absolute fusion: <strong>Elite centuries-old liquid standards packaged with immediate, raw streetwear credibility.</strong>
                        </p>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: VISUAL IDENTITY */}
              {activeTab === 'visuals' && (
                <div className="space-y-10">

                  {/* TWO CORE BRAND LOGOS DETAILS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Logo Variant 1: Circular Crest */}
                    <div className="rounded-2xl border border-brand-dark-900 bg-canvas-soft border border-brand-dark-900/10 rounded-xl shadow-lg p-6 md:p-8 space-y-5">
                      <span className="text-[10px] font-mono bg-[oklch(0.485_0.134_165.0)]/10 border border-[oklch(0.485_0.134_165.0)]/20 text-[oklch(0.485_0.134_165.0)] font-bold px-3 py-1 rounded">
                        VARIANT A // BRAND SHIELD CREST
                      </span>

                      <div className="h-48 rounded-xl bg-canvas flex items-center justify-center p-6 border border-ink/10 relative group overflow-hidden">
                        {/* Fake circular logo approximation using beautiful CSS illustration with identical typography and color schema */}
                        <div className="relative h-32 w-32 rounded-full border-4 border-accent bg-canvas-soft border border-brand-dark-900/10 rounded-xl shadow-lg flex flex-col items-center justify-center text-center p-2 shadow-inner select-none">
                          <div className="absolute inset-0.5 border border-accent/20 rounded-full" />
                          <span className="text-[5px] text-[oklch(0.485_0.134_165.0)] font-mono tracking-widest font-black uppercase">ATZENHOF</span>
                          <span className="text-xs font-black text-brand-dark-900 italic tracking-tighter uppercase my-0.5">ATZENGOLD</span>
                          <span className="text-[6px] font-bold text-accent font-mono tracking-wide">★ HELL ★</span>
                          <div className="mt-1 flex items-center justify-center text-[oklch(0.485_0.134_165.0)] gap-0.5">
                            <span className="text-[5px]">☘</span>
                            <span className="text-[5px] font-mono font-bold">FRANKEN</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-black text-brand-dark-900 uppercase">Primary Circular Crest Rules</h4>
                        <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                          Our circular emblem captures the historical roots of the Bavarian brewer. It must be used as the absolute stamp of packaging (cans, bottles, coaster cardboard and labels) and circular merchandise assets such as custom wooden beer steins and circular cap badges.
                        </p>
                        <p className="text-[11px] font-mono text-ink-secondary">
                          Clear space constraint: 0.15 × Diameter padding. Minimum size limit on screen: 120px wide (must remain fully legible).
                        </p>
                      </div>
                    </div>

                    {/* Logo Variant 2: Blackletter Gothic Contour */}
                    <div className="rounded-2xl border border-brand-dark-900 bg-canvas-soft border border-brand-dark-900/10 rounded-xl shadow-lg p-6 md:p-8 space-y-5">
                      <span className="text-[10px] font-mono bg-accent/10 border border-accent/20 text-accent font-bold px-3 py-1 rounded">
                        VARIANT B // BLACKLETTER HEADER LOGOTYPE & SIGN
                      </span>

                      <div className="h-48 rounded-xl bg-canvas flex items-center justify-center p-6 border border-ink/10 relative overflow-hidden group">
                        {/* Animated authentic logotype gif asset with gold bar motifs on both sides */}
                        <div className="flex items-center gap-4">
                          {/* Left Pile Motif */}
                          <GoldBarsSVG
                            className="w-12 h-9 shrink-0 select-none opacity-80 group-hover:opacity-100 transition-all filter"
                            style={{ filter: 'drop-shadow(0 0 4px oklch(0.817 0.168 78.0 / 0.15))' }}
                          />

                          <div className="relative h-28 w-28 sm:h-32 sm:w-32 flex items-center justify-center overflow-hidden">
                            <img
                              src="https://static.wixstatic.com/media/f8d233_2bc00a5305a64a5da3d407506a80df3c~mv2.gif"
                              alt="Atzengold Logotype"
                              className="w-full h-full object-contain filter transition-transform duration-300 group-hover:scale-105"
                              style={{ filter: 'drop-shadow(0 0 15px oklch(0.817 0.168 78.0 / 0.3))' }}
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Right Pile Motif */}
                          <GoldBarsSVG
                            mirrored={true}
                            className="w-12 h-9 shrink-0 select-none opacity-80 group-hover:opacity-100 transition-all filter"
                            style={{ filter: 'drop-shadow(0 0 4px oklch(0.817 0.168 78.0 / 0.15))' }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-black text-brand-dark-900 uppercase">Gothic Logotype Rules</h4>
                        <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                          Representing our rebellious urban street-spirit. This logotype is primary for apparel chest pieces, digital header navigation banners, large-scale outdoor wheatpaste posters, and widescreen website landing displays.
                        </p>
                        <p className="text-[11px] font-mono text-ink-secondary">
                          Clear space constraint: 30px top/bottom, 50px sides. Minimum digital size limit: 80px width.
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* ACTIVE INTERACTIVE PALETTE BOARD */}
                  <div className="rounded-2xl border border-brand-dark-900 bg-canvas-soft border border-brand-dark-900/10 rounded-xl shadow-lg p-6 md:p-8 space-y-6">
                    <div>
                      <h3 className="text-xl font-extrabold uppercase text-brand-dark-900 flex items-center gap-2">
                        <Palette className="h-5 w-5 text-accent" />
                        Interactive Color Swatch board
                      </h3>
                      <p className="text-xs text-ink-secondary mt-1 font-mono">
                        Our strict brand palette reflecting brick buildings, copper kettles, green forests, and dark street paving. Click any swatch value to copy codes instantly to your clipboard!
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-brand-dark-900">
                      {colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-canvas/10 bg-ink p-3 flex flex-col justify-between group hover:border-accent/30 transition-all duration-150 relative"
                        >
                          <div className={`h-24 w-full rounded-lg ${color.bgColor} shadow-inner mb-3 border border-canvas/20 relative flex items-end justify-end p-2`}>
                            {copiedText === color.hex && (
                              <span className="absolute top-2 right-2 bg-primary text-canvas text-[8px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                <Check className="h-2 w-2 stroke-[4]" /> COPIED
                              </span>
                            )}
                            <button
                              onClick={() => handleCopy(color.hex, `${color.name} HEX`)}
                              className="bg-canvas-soft border border-brand-dark-900/10 rounded-xl shadow-lg/80 hover:bg-canvas-soft border border-brand-dark-900/10 rounded-xl shadow-lg text-brand-dark-900 rounded p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs"
                              title="Copy Hex Color Code"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <span className="text-[10px] uppercase font-bold text-canvas tracking-tight">{color.name}</span>
                            <span className="text-[9px] text-canvas/50 italic block leading-tight">{color.role}</span>

                            <div className="pt-2 border-t border-canvas/10 space-y-1 font-mono text-[9px]">
                              {/* Copy triggers */}
                              <button
                                onClick={() => handleCopy(color.hex, color.name)}
                                className="w-full text-left flex justify-between text-canvas/70 hover:text-canvas transition-colors py-0.5 group/line cursor-pointer"
                              >
                                <span>Hex:</span>
                                <span className="font-bold underline text-accent/80 group-hover/line:text-accent">{color.hex}</span>
                              </button>
                              <button
                                onClick={() => handleCopy(color.rgb, `${color.name} RGB`)}
                                className="w-full text-left flex justify-between text-canvas/70 hover:text-canvas transition-colors py-0.5 group/line cursor-pointer"
                              >
                                <span>Rgb:</span>
                                <span>{color.rgb}</span>
                              </button>
                              <button
                                onClick={() => handleCopy(color.cmyk, `${color.name} CMYK`)}
                                className="w-full text-left flex justify-between text-canvas/70 hover:text-canvas transition-colors py-0.5 group/line cursor-pointer"
                              >
                                <span>Cmyk:</span>
                                <span>{color.cmyk}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ACTIVE TYPOGRAPHY SCALE TESTER */}
                  <div className="rounded-2xl border border-ink/10 bg-canvas-soft border border-brand-dark-900/10 rounded-xl shadow-lg p-6 md:p-8 space-y-6">
                    <div>
                      <h3 className="text-xl font-extrabold uppercase text-brand-dark-900 flex items-center gap-2">
                        <Type className="h-5 w-5 text-accent" />
                        Hierarchy & Typography Live Tester
                      </h3>
                      <p className="text-xs text-ink-secondary mt-1 font-mono">
                        Type any custom headline, and view the live rendered preview in heading scaled and body font guidelines below.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-brand-dark-900">

                      {/* Left side input controllers */}
                      <div className="lg:col-span-4 bg-canvas p-5 rounded-xl border border-ink/10 space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-ink-secondary uppercase font-bold">Try custom brand copy text:</label>
                          <input
                            type="text"
                            value={customText}
                            onChange={(e) => setCustomText(e.target.value)}
                            placeholder="e.g., Atzengold Naturtrüb"
                            className="w-full bg-canvas-soft border border-brand-dark-900/10 rounded-xl shadow-lg text-brand-dark-900 border border-brand-dark-900 rounded px-3 py-2 text-xs focus:outline-none focus:border-accent font-sans"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-ink-secondary uppercase font-bold">Heading Size Scaling:</span>
                            <span className="text-accent font-bold">{fontSize}px</span>
                          </div>
                          <input
                            type="range"
                            min="20"
                            max="72"
                            value={fontSize}
                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                            className="w-full accent-accent cursor-pointer"
                          />
                        </div>

                        {/* Font specifications sheet */}
                        <div className="pt-4 border-t border-ink/10 space-y-2.5 text-[10px] font-mono text-ink-secondary">
                          <p className="text-ink-secondary font-bold uppercase tracking-wider">Font Specifications sheet</p>
                          <p>✓ H1–H4: <span className="text-brand-dark-900">Plus Jakarta Sans Gothic</span> (Classic German blackletter type, uppercase/lowercase)</p>
                          <p>✓ Body text: <span className="text-brand-dark-900">Inter Regular</span> (leading-relaxed, tracking-tight, text-brand-dark-900)</p>
                          <p>✓ Tech / Status labels: <span className="text-brand-dark-900">JetBrains Mono</span> (tracking-widest, uppercase)</p>
                        </div>
                      </div>

                      {/* Right side live rendering output cards */}
                      <div className="lg:col-span-8 space-y-6">

                        {/* H1 Display Card */}
                        <div className="p-5 rounded-xl bg-ink p-6 border border-canvas/10 space-y-2">
                          <div className="flex justify-between items-center text-[8px] font-mono text-canvas/50 border-b border-canvas/10 pb-1.5 mb-2 select-none">
                            <span>PRIMARY DISPLAY HEADING (HERO SCALE)</span>
                            <span>FONT: UNIFRAKTURMAGUNTIA GOTHIC // TRADITIONAL BLACKLETTER</span>
                          </div>
                          <h1
                            className="font-black uppercase tracking-tighter text-canvas leading-none break-words"
                            style={{ fontSize: `${fontSize}px` }}
                          >
                            {customText || 'ATZENGOLD HELL'}
                          </h1>
                        </div>

                        {/* Body Text copy Card */}
                        <div className="p-5 rounded-xl bg-ink p-6 border border-canvas/10 space-y-2">
                          <div className="flex justify-between items-center text-[8px] font-mono text-canvas/50 border-b border-canvas/10 pb-1.5 mb-2 select-none">
                            <span>BODY COPY (DEFAULT READING SIZE)</span>
                            <span>FONT: INTER // SIZE 14PX // LINE-HEIGHT LEVEL 1.625</span>
                          </div>
                          <p className="text-sm text-canvas leading-relaxed font-sans max-w-2xl">
                            {customText ? `${customText} — Crafted side-by-side with genuine Bavarian master brewers in Upper Franconia.` : ''} In compliance with historic German purity standards of 1516, we brew all natural Kellerbiers unfiltered, cold lagering, ensuring every glass remains wonderfully cloudy and rich in nutrient minerals. Drink real beer.
                          </p>
                        </div>

                        {/* Mono Code Label Card */}
                        <div className="p-5 rounded-xl bg-ink p-6 border border-canvas/10 space-y-2">
                          <div className="flex justify-between items-center text-[8px] font-mono text-canvas/50 border-b border-canvas/10 pb-1.5 mb-2 select-none">
                            <span>STATUS INDICATORS & CORE SPECS LABELS</span>
                            <span>FONT: JETBRAINS MONO // LEVERAGING 0.15EM TRACKING</span>
                          </div>
                          <p className="text-xs font-mono text-accent uppercase tracking-widest font-bold">
                            📦 Restocking Alert: {customText || 'ATZENGOLD HELLER BATCH'} // CODE: AG-ST-998
                          </p>
                        </div>

                      </div>

                    </div>
                  </div>

                  {/* LOGO USAGE CHECKLIST & INCORRECT USES INSPECTOR */}
                  <div className="rounded-2xl border border-brand-dark-900 bg-canvas-soft border border-brand-dark-900/10 rounded-xl shadow-lg p-6 md:p-8 space-y-6">
                    <div>
                      <h3 className="text-xl font-extrabold uppercase text-brand-dark-900 tracking-tight">Logo Integrity Enforcement</h3>
                      <p className="text-xs text-ink-secondary mt-1 font-mono">Ensuring brand representation remains razor sharp and pristine. Read this to avoid critical designer errors.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-brand-dark-900 pt-6">

                      {/* Positive Rules (Do's) */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-mono text-primary uppercase font-bold tracking-wider flex items-center gap-1.5 select-none">
                          <CheckCircle2 className="h-4.5 w-4.5" />
                          The Do's (Approved Usage Rules)
                        </h4>

                        <ul className="space-y-3 font-sans text-xs text-brand-dark-900 leading-relaxed">
                          <li className="flex items-start gap-2.5">
                            <span className="text-primary font-bold text-sm leading-none">✓</span>
                            <span>Always utilize high contrast cream backgrounds (Variant A) or asphalt dark charcoal backgrounds (using White variant text).</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-primary font-bold text-sm leading-none">✓</span>
                            <span>Preserve circular clearance margins equal to at least 15% of total shield crest width from adjacent logos or margins.</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-primary font-bold text-sm leading-none">✓</span>
                            <span>Implement correct OKLCH gold `oklch(0.77 0.155 81.1)` and forester green `oklch(0.54 0.107 170.1)` values strictly. Always export SVG formats for physical merchandise embroidery.</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-primary font-bold text-sm leading-none">✓</span>
                            <span>Pair larger display sizes of the Gothic Logotype exclusively with clean modern san-serif (Inter) or monospaced parameters.</span>
                          </li>
                        </ul>
                      </div>

                      {/* Negative Warnings (Don'ts) with live interactive warnings overlay */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-mono text-ink uppercase font-bold tracking-wider flex items-center gap-1.5 select-none">
                          <AlertTriangle className="h-4.5 w-4.5" />
                          The Dont\'s (Incorrect Usage Pitfalls)
                        </h4>

                        <div className="grid grid-cols-3 gap-3">

                          {/* 1. Stretched / Distorted */}
                          <div className="bg-canvas border border-brand-dark-900 rounded-lg p-2 flex flex-col justify-between aspect-square items-center text-center relative overflow-hidden group select-none">
                            <div className="text-3xl font-black italic text-accent/50 scale-x-150 py-4">AG</div>
                            <span className="text-[8px] font-mono text-ink-secondary mt-1 uppercase line-through leading-none">Do Not Distort</span>
                            <div className="absolute inset-0 bg-ink/85 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-[8px] font-mono text-canvas font-bold">
                              ❌ NO STRETCHING
                            </div>
                          </div>

                          {/* 2. Rotated or Off angle */}
                          <div className="bg-canvas border border-brand-dark-900 rounded-lg p-2 flex flex-col justify-between aspect-square items-center text-center relative overflow-hidden group select-none">
                            <div className="text-3xl font-black italic text-accent/50 rotate-45 py-4">AG</div>
                            <span className="text-[8px] font-mono text-ink-secondary mt-1 uppercase line-through leading-none">Do Not Pivot</span>
                            <div className="absolute inset-0 bg-ink/85 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-[8px] font-mono text-canvas font-bold">
                              ❌ NO ROTATION
                            </div>
                          </div>

                          {/* 3. Bad contrasting background colors */}
                          <div className="border border-brand-dark-900 rounded-lg p-2 flex flex-col justify-between aspect-square items-center text-center relative overflow-hidden group select-none" style={{ backgroundColor: 'oklch(0.887 0.147 83.0)' }}>
                            <div className="text-3xl font-black italic py-4" style={{ color: 'oklch(0.77 0.155 81.1 / 0.4)' }}>AG</div>
                            <span className="text-[8px] font-mono text-zinc-700 mt-1 uppercase line-through leading-none">Avoid Clashing</span>
                            <div className="absolute inset-0 bg-ink/85 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-[8px] font-mono text-canvas font-bold">
                              ❌ NO LOW CONTRAST
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>

                  {/* PHOTOGRAPHY & ICONOGRAPHY STYLE SPECIFICATION */}
                  <div className="rounded-2xl border border-brand-dark-900 p-6 lg:p-8 space-y-6" style={{ backgroundColor: 'var(--color-ink)' }}>
                    <h3 className="text-xl font-extrabold uppercase text-canvas tracking-tight">Photography & Iconography Art Direction</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-brand-dark-900 pt-6">

                      {/* Photo specs */}
                      <div className="space-y-4">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest block" style={{ color: 'var(--color-accent)' }}>A. Photography Guidelines</span>
                        <h4 className="text-base font-extrabold text-canvas uppercase leading-tight">Flash-focused, analog grain & high warmth</h4>
                        <p className="text-xs text-canvas/80 leading-relaxed font-sans">
                          All photography must feel authentic, raw, and unposed. High grain, cinematic depth of field, warm candlelight, or strong night flash photography. We focus on real textures—coarse wood, steaming wort, moisture-packed glass, and honest human interaction on beer benches.
                        </p>
                        <div className="rounded-xl border border-brand-dark-900 h-24 bg-canvas/10 overflow-hidden flex items-center justify-center text-canvas/40 font-mono text-[10px] uppercase select-none">
                          📸 Warm color grade // Grain index: 45 // Depth level: F/2.0
                        </div>
                      </div>

                      {/* Icon specs */}
                      <div className="space-y-4">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest block" style={{ color: 'var(--color-accent)' }}>B. Iconography Guidelines</span>
                        <h4 className="text-base font-extrabold text-canvas uppercase leading-tight">Rustic line-weight, clean industrial borders</h4>
                        <p className="text-xs text-canvas/80 leading-relaxed font-sans">
                          Use double-lined contours or heavy geometric structures matching Lucide stroke thickness (1.2px). Highlight active status lines or interactive tags with the glowing brand color `oklch(0.77 0.155 81.1)`. Avoid standard colorful emoji icons or thin abstract pastel vector collections.
                        </p>
                        <div className="flex gap-4 p-4 rounded-xl bg-canvas/10 border border-brand-dark-900 justify-center">
                          <Palette className="h-8 w-8 text-accent" strokeWidth={1.2} />
                          <Type className="h-8 w-8 text-accent" strokeWidth={1.2} />
                          <Volume2 className="h-8 w-8 text-accent" strokeWidth={1.2} />
                          <ShieldCheck className="h-8 w-8 text-accent" strokeWidth={1.2} />
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: VOICE AND TONE */}
              {activeTab === 'voice' && (
                <div className="space-y-10">

                  {/* Writing style parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <div className="rounded-2xl border border-brand-dark-900 p-6 space-y-4" style={{ backgroundColor: 'var(--color-ink)' }}>
                      <span className="text-[10px] font-mono font-bold uppercase" style={{ color: 'var(--color-accent)' }}>Writing Style Matrix</span>
                      <h3 className="text-lg font-black text-canvas uppercase">Casual, Direct & Decidedly Professional</h3>
                      <p className="text-xs text-canvas leading-relaxed font-sans">
                        Atzengold is casual but never childish. We speak at eye level. We do not use fake marketing buzzwords, passive voice, or hyper-inflated claims like "the ultimate synergy of hydration and luxury." Our vocabulary is direct, proud of the quality, and dry-humored. On Bavarian language paths, we integrate authentic local vernacular organically without sounding theatrical.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-brand-dark-900 p-6 space-y-4" style={{ backgroundColor: 'var(--color-ink)' }}>
                      <span className="text-[10px] font-mono font-bold uppercase text-canvas">The Linguistic Wordlist</span>
                      <h3 className="text-lg font-black text-canvas uppercase">Words to embrace vs. Words to ban</h3>

                      <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-2 border-t border-canvas/10 select-none">
                        <div>
                          <p className="text-primary font-bold pb-2 uppercase tracking-tight">✓ Approved Vocab:</p>
                          <ul className="space-y-1.5 text-canvas/70 text-[10px]">
                            <li>● Atze (Friend / Local)</li>
                            <li>● Naturtrüb (Cloudy)</li>
                            <li>● Kellerbier (Cellar Beer)</li>
                            <li>● Lohnbrauer (Contract Brewing)</li>
                            <li>● Sudkessel (Copper Kettle)</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-canvas/60 font-bold pb-2 uppercase tracking-tight">❌ Avoid / Bannable:</p>
                          <ul className="space-y-1.5 text-canvas/50 text-[10px] line-through">
                            <li>● Premium lifestyle-drink</li>
                            <li>● Wellness beer blend</li>
                            <li>● Synergy / Leverage</li>
                            <li>● Target demographic</li>
                            <li>● High-voltage optimized</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* INTERACTIVE CONTEXT TONE CHANGER DEMO COMPONENT */}
                  <div className="rounded-2xl border border-brand-dark-900 bg-canvas-soft border border-brand-dark-900/10 rounded-xl shadow-lg p-6 md:p-8 space-y-6">
                    <div>
                      <h3 className="text-xl font-extrabold uppercase text-brand-dark-900 tracking-tight flex items-center gap-2">
                        <Volume2 className="h-5 w-5 text-accent" />
                        Interactive Contextual Tone Explorer
                      </h3>
                      <p className="text-xs text-ink-secondary mt-1 font-mono">
                        Select a digital or physical context to view side-by-side examples of On-Brand versus Off-Brand copy to guide writing.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-brand-dark-900 pt-6">

                      {/* Left: Button selectors */}
                      <div className="lg:col-span-4 flex flex-col gap-2 bg-canvas p-4 rounded-xl border border-ink/10">
                        <span className="text-[9px] font-mono text-ink-secondary uppercase font-bold tracking-wider mb-2">Select Context:</span>
                        {[
                          { id: 'marketing', label: '📢 Product Marketing', desc: 'Social ads & shop descriptions' },
                          { id: 'support', label: '🤝 Customer Support', desc: 'Email inquiries & B2B requests' },
                          { id: 'error', label: '⚠️ Site Errors', desc: '404 pages & missing stocks' },
                          { id: 'social', label: '📸 Social Captioning', desc: 'Instagram post formats' }
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setActiveToneContext(item.id as any)}
                            className={`w-full text-left p-3 rounded-lg flex flex-col gap-1 transition-all border cursor-pointer ${
                              activeToneContext === item.id
                                ? 'bg-accent border-accent text-on-accent font-bold'
                                : 'bg-canvas-soft border border-brand-dark-900/10 rounded-xl shadow-lg hover:bg-canvas border-ink/10 text-ink-secondary hover:text-brand-dark-900'
                            }`}
                          >
                            <span className="text-xs font-mono font-bold uppercase">{item.label}</span>
                            <span className={`text-[10px] font-sans ${activeToneContext === item.id ? 'text-on-accent/70' : 'text-ink-secondary'}`}>{item.desc}</span>
                          </button>
                        ))}
                      </div>

                      {/* Right: Side by side analysis details */}
                      <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* 1. OFF-BRAND CARD */}
                        <div className="rounded-xl border border-ink/10 bg-ink/5 p-5 space-y-4 relative overflow-hidden">
                          <span className="absolute top-0 right-0 bg-ink text-canvas text-[8px] font-mono font-bold px-2.5 py-1 rounded-bl uppercase">
                            ❌ Bad (Corporate / Sterile)
                          </span>

                          <h4 className="text-xs font-mono text-ink-secondary uppercase font-bold pt-1">Wrong tone sample:</h4>

                          <p className="text-xs text-ink-secondary leading-relaxed font-sans italic border-l-2 border-brand-dark-900 pl-3">
                            {activeToneContext === 'marketing' && '"Introducing our optimized gluten-friendly synergistic craft lager, carefully formulated to synergize with youth nightlife demographics."'}
                            {activeToneContext === 'support' && '"We have registered your ticket and forwarded it to our logistics partner to streamline delivery timelines. Have a beautiful day!"'}
                            {activeToneContext === 'error' && '"Error 404: The requested system resource could not be loaded into the buffer. Please contact system administrator."'}
                            {activeToneContext === 'social' && '"Double tap if you are ready for the weekend! 🎉 Our brand uses the best assets to create great experiences."'}
                          </p>

                          <div className="pt-2 border-t border-brand-dark-900 text-[10px] text-ink-secondary leading-normal font-sans">
                            <strong>Why this fails:</strong> Uninspired, utilizes sterile bureaucratic filler phrases, feels overly clinical, and acts like a faceless conglomerate instead of close-knit brewery creators.
                          </div>
                        </div>

                        {/* 2. ON-BRAND CARD */}
                        <div className="rounded-xl p-5 space-y-4 relative overflow-hidden" style={{ border: '1px solid oklch(0.77 0.155 81.1 / 0.4)', backgroundColor: 'oklch(0.77 0.155 81.1 / 0.05)' }}>
                          <span className="absolute top-0 right-0 bg-primary text-canvas text-[8px] font-mono font-bold px-2.5 py-1 rounded-bl uppercase">
                            ✓ On-brand (Golden standard)
                          </span>

                          <h4 className="text-xs font-mono text-primary uppercase font-bold pt-1">Correct tone sample:</h4>

                          <p className="text-xs text-brand-dark-900 leading-relaxed font-sans font-medium border-l-2 border-accent pl-3">
                            {activeToneContext === 'marketing' && '"Atzengold is Kellerbier as it used to be. Unfiltered, cloudy, and brewed under double-decoction standards in Upper Franconia. Packaged for late-night pavement talks. Absolute liquid quality, nothing more."'}
                            {activeToneContext === 'support' && '"Servus! Heard you. Hans is wrapping up your dispatch right inside the brewery as we speak. We are double-checking with DHL GoGreen to clear tracking."'}
                            {activeToneContext === 'error' && '"Sacklzement! Our draft keg foaming got ahead of us. We could not find this page route. Grab a cold one and walk back to the brewery deck."'}
                            {activeToneContext === 'social' && '"Late spring pavement sessions with the crew. Clean gold inside warm glass, unfiltered. Straight from Franconian family cellars to Berlin pavement corner. 📍"' }
                          </p>

                          <div className="pt-2 border-t border-brand-dark-900 text-[10px] text-ink-secondary leading-normal font-sans">
                            <strong>Why this succeeds:</strong> Warm but assertive, refers to physical location objects and traditional processes, keeps sentence structures brief, and establishes direct accountability.
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: APPLICATION BLUEPRINTS */}
              {activeTab === 'applications' && (
                <div className="space-y-10">

                  {/* Digital & print output templates overview */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* IG layout style blueprint */}
                    <div className="rounded-2xl border border-brand-dark-900 p-6 space-y-4 flex flex-col justify-between" style={{ backgroundColor: 'var(--color-ink)' }}>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2" style={{ color: 'var(--color-accent)' }}>
                          <Instagram className="h-5 w-5" />
                          <h4 className="text-xs font-mono uppercase font-bold tracking-widest">A. Social Media Framework</h4>
                         </div>
                        <h3 className="text-base font-black text-canvas uppercase leading-tight">Grit Letterbox & Gold Framed Squares</h3>
                        <p className="text-xs text-canvas/80 leading-relaxed font-sans">
                          Maintain square 1:1 post ratios featuring high grain imagery. Add thin gold `oklch(0.77 0.155 81.1)` contour frames with the 'Franken x Berlin' tag aligned as absolute watermarks in white monospaced letters on the margins. Do not place large colorful graphic elements or marketing text over imagery.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-brand-dark-900">
                        <button
                          onClick={() => handleCopy('Atzengold Instagram Spec: 1080x1080px, Adobe Lightroom Profile Atzen-Warm, Grain Index 45, Typography Plus Jakarta Sans absolute tag.', 'Instagram Spec')}
                          className="w-full cursor-pointer bg-canvas hover:bg-ink/10 text-brand-dark-900 rounded-lg p-2 flex items-center justify-center gap-2 text-xs font-mono font-bold"
                        >
                          <Copy className="h-3.5 w-3.5" /> Copy Specs Template
                        </button>
                      </div>
                    </div>

                    {/* Email styling blueprint */}
                    <div className="rounded-2xl border border-brand-dark-900 p-6 space-y-4 flex flex-col justify-between" style={{ backgroundColor: 'var(--color-ink)' }}>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
                          <Mail className="h-5 w-5" />
                          <h4 className="text-xs font-mono uppercase font-bold tracking-widest">B. Customer Email Layout</h4>
                        </div>
                        <h3 className="text-base font-black text-canvas uppercase leading-tight">Minimalist, Stark Text & Cream Banners</h3>
                        <p className="text-xs text-canvas/80 leading-relaxed font-sans">
                          Keep all marketing dispatches stark and primarily plain-text driven. Utilize rich cream background `oklch(0.907 0.039 80)` only for top header strips or primary CTA banners. Heading layout must utilize Plus Jakarta Sans. Bullet points should use the classic square character '▪' for visual weight.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-brand-dark-900">
                        <button
                          onClick={() => handleCopy('Atzengold Stark Email HTML Blueprint:\n- Background: oklch(0.192 0.004 286)\n- Text color: oklch(0.985 0.001 78.0)\n- Base Accent color: oklch(0.77 0.155 81.1)\n- Typography: Plus Jakarta Sans & Inter font fallback.', 'Email Blueprint')}
                          className="w-full cursor-pointer bg-canvas hover:bg-ink/10 text-brand-dark-900 rounded-lg p-2 flex items-center justify-center gap-2 text-xs font-mono font-bold"
                        >
                          <Copy className="h-3.5 w-3.5" /> Copy Email CSS Setup
                        </button>
                      </div>
                    </div>

                    {/* Presentation decks branding blueprint */}
                    <div className="rounded-2xl border border-brand-dark-900 p-6 space-y-4 flex flex-col justify-between" style={{ backgroundColor: 'var(--color-ink)' }}>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-accent">
                          <Tv className="h-5 w-5" />
                          <h4 className="text-xs font-mono uppercase font-bold tracking-widest">C. Pitch Slide structure</h4>
                        </div>
                        <h3 className="text-base font-black text-canvas uppercase leading-tight">Dual Grid layout & Contrast Fullbleed</h3>
                        <p className="text-xs text-canvas/80 leading-relaxed font-sans">
                          Every slide should follow a strict grid layout: either extreme full-bleed, high warmth photography with giant overlaid gold headings, or stark monospaced summaries framed inside thick borders. Do not overcrowd slide real estate with bullet lists.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-brand-dark-900">
                        <button
                          onClick={() => handleCopy('Atzengold Presentation Pitch Layout Structure: Slide ratio 16:9, Dark asphalt background, H1 Gold Plus Jakarta Sans, Left-anchored summary lines, right column full scale grain image block.', 'Presentation Master Specs')}
                          className="w-full cursor-pointer bg-canvas hover:bg-ink/10 text-brand-dark-900 rounded-lg p-2 flex items-center justify-center gap-2 text-xs font-mono font-bold"
                        >
                          <Copy className="h-3.5 w-3.5" /> Copy Master Decks Guide
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* HIGH-FIDELITY LIVE PREVIEW: THE ATZENGOLD MERCH PITCH SLIDE */}
                  <div className="rounded-2xl border border-brand-dark-900 bg-canvas-soft border border-brand-dark-900/10 rounded-xl shadow-lg p-6 md:p-8 space-y-6">
                    <div>
                      <h3 className="text-xl font-extrabold uppercase text-brand-dark-900 tracking-tight">On-Brand Live Presentation Slide Sandbox</h3>
                      <p className="text-xs text-ink-secondary mt-1 font-mono">
                        A real interactive simulation of an on-brand 16:9 Pitch Slide matching our guidelines exactly.
                      </p>
                    </div>

                    <div className="border border-ink/10 rounded-2xl bg-canvas shadow-xl overflow-hidden aspect-video relative max-w-4xl mx-auto flex flex-col justify-between p-6 sm:p-10 select-none">
                      {/* Grid background decoration */}
                      <div
                        className="absolute inset-0 bg-[size:24px_24px] opacity-20"
                        style={{
                          backgroundImage: 'linear-gradient(to right, var(--color-ink) 1px, transparent 1px), linear-gradient(to bottom, var(--color-ink) 1px, transparent 1px)'
                        }}
                      />
                      <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-2xl pointer-events-none" style={{ backgroundColor: 'oklch(0.42 0.13 165.0 / 0.1)' }} />

                      {/* Top Header line of deck */}
                      <div className="relative flex justify-between items-center border-b border-brand-dark-900 pb-3">
                        <span className="text-[9px] font-mono font-bold tracking-widest uppercase" style={{ color: 'var(--color-accent)' }}>Slide 04 // B2B Retail Pitch Deck</span>
                        <span className="text-[8px] font-mono text-ink-secondary uppercase">CLASSIFICATION: COOPERATIVE SOURCING</span>
                      </div>

                      {/* Content Area (Split Left 7 Cols, Right 5 Cols) */}
                      <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-6">

                        <div className="md:col-span-7 space-y-4">
                          <span className="text-[8px] font-mono bg-accent/10 border border-accent/20 text-accent font-bold px-2 py-0.5 rounded">
                            UNFILTERED GROWTH OPPORTUNITY
                          </span>
                          <h3 className="text-xl sm:text-2xl lg:text-3.5xl font-black text-brand-dark-900 uppercase tracking-tight leading-none">
                            FRANCONIAN INTEGRITY <br />FOR MODERN CORNERS.
                          </h3>
                          <p className="text-[11px] text-ink-secondary leading-relaxed font-sans max-w-lg">
                            We ship our Kellerbier unfiltered directly from deep Oberfranken barrel vault cellars. No corporate pasteurization delay, ensuring absolute freshness. By partnering with Atzengold, your venue introduces instant subterranean brand cultural affinity and traditional quality standards to a highly loyal community.
                          </p>
                        </div>

                        {/* Photo Box simulating visual photograph guideline */}
                        <div className="md:col-span-5 rounded-lg border border-brand-dark-900 p-2 bg-canvas-soft border border-brand-dark-900/10 rounded-xl shadow-lg relative overflow-hidden group">
                          <div className="relative h-28 bg-canvas rounded overflow-hidden flex items-center justify-center p-2 text-center">
                            {/* Realistic placeholder representing old brick mashing house */}
                            <div className="space-y-1.5 grayscale group-hover:grayscale-0 transition-all duration-300">
                              <span className="text-2xl">🧱</span>
                              <p className="text-[8px] font-mono text-accent uppercase tracking-widest font-bold">BUTTENHEIM BRICK BREWERY</p>
                              <p className="text-[6px] text-ink-secondary italic font-sans leading-none">Hans monitoring double-decoction mashing loops</p>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Footer specs of the slides */}
                      <div className="relative pt-3 border-t border-ink/10 flex items-center justify-between font-mono text-[8px] text-ink-mute">
                        <span>ATZENGOLD GbR. ALL RIGHTS RESERVED. GERMANY DE.</span>
                        <span className="text-accent font-bold">[ PROST! ]</span>
                        <span>CONFIDENTIAL // INTERNAL BRAND GUIDELINE DECK</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Brand System Legal & Copying Footer Panel */}
        <div className="border-t border-brand-dark-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-secondary font-mono gap-4 select-none">
          <p>
            Developed by Atzengold Design Consultancies © 2026. Approved for digital deployment.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => handleCopy('Atzengold Full Design System Guideline Suite, OKLCH Rules:\nAccent: oklch(0.77 0.155 81.1)\nForest: oklch(0.54 0.107 170.1)\nCream: oklch(0.907 0.039 80)\nAsphalt: oklch(0.192 0.004 286)\nFonts: Inter & Plus Jakarta Sans.', 'Complete Guideline Suite')}
              className="hover:underline flex items-center gap-1 cursor-pointer font-bold"
              style={{ color: 'var(--color-accent)' }}
            >
              Export Custom Assets Spec <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
