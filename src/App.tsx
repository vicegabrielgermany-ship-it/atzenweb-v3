import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Menu from 'lucide-react/dist/esm/icons/menu';
import AgeGate from './components/AgeGate';
import CookieBanner from './components/CookieBanner';
import StoryAndBrew from './components/StoryAndBrew';
import MerchShop from './components/MerchShop';
import Carousel from './components/Carousel';
import BrandHub from './components/BrandHub';
import Datenschutz from './components/Datenschutz';
import Impressum from './components/Impressum';
import CheckoutSuccess from './components/CheckoutSuccess';
import Widerrufsrecht from './components/Widerrufsrecht';
import AGB from './components/AGB';
import NotificationToast from './components/NotificationToast';
import InstagramFeed from './components/InstagramFeed';
import Testimonials from './components/Testimonials';
import Sidebar from './components/Sidebar';
import RootsSection from './components/RootsSection';
import Footer from './components/Footer';
import CheckoutCancelOverlay from './components/CheckoutCancelOverlay';
import { translations } from './constants/translations';
import { Language } from './types';

const ThreeDMap = lazy(() => import('./components/ThreeDMap'));
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const AdminVenues = lazy(() => import('./components/admin/AdminVenues'));
const AdminStory = lazy(() => import('./components/admin/AdminStory'));
const AdminMerch = lazy(() => import('./components/admin/AdminMerch'));
const AdminOrders = lazy(() => import('./components/admin/AdminOrders'));
const AdminTestimonials = lazy(() => import('./components/admin/AdminTestimonials'));
const AdminBeerProfile = lazy(() => import('./components/admin/AdminBeerProfile'));
const AdminBrandHub = lazy(() => import('./components/admin/AdminBrandHub'));
const AdminBrandGuidelines = lazy(() => import('./components/admin/AdminBrandGuidelines'));
const AdminSettings = lazy(() => import('./components/admin/AdminSettings'));
const AdminTranslations = lazy(() => import('./components/admin/AdminTranslations'));

function playNotificationChime() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime);
    osc2.frequency.setValueAtTime(880.00, audioCtx.currentTime);
    osc1.type = 'sine';
    osc2.type = 'sine';
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.65);
    osc1.start();
    osc2.start();
    osc1.stop(audioCtx.currentTime + 0.7);
    osc2.stop(audioCtx.currentTime + 0.7);
  } catch {
    // Graceful fallback if blocked by browser policy
  }
}

const ADMIN_FALLBACK = (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark-900/90">
    <div className="w-6 h-6 border-2 border-canvas/30 border-t-canvas rounded-full animate-spin" />
  </div>
);

export default function App() {
  const [lang, setLang] = useState<Language>('de');
  const [isVerified, setIsVerified] = useState(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showBrandHub, setShowBrandHub] = useState(false);
  const [showDatenschutz, setShowDatenschutz] = useState(false);
  const [showImpressum, setShowImpressum] = useState(false);
  const [showWiderrufsrecht, setShowWiderrufsrecht] = useState(false);
  const [showAGB, setShowAGB] = useState(false);
  const [checkoutOrderId, setCheckoutOrderId] = useState<string | null>(null);
  const [showCheckoutCancel, setShowCheckoutCancel] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminApiKey, setAdminApiKey] = useState<string | null>(null);
  const [adminSection, setAdminSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'shop'>(() => {
    if (window.location.hash === '#shop') {
      window.scrollTo(0, 0);
      return 'shop';
    }
    return 'home';
  });

  useEffect(() => {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const hash = window.location.hash;

    if (hash === '#shop') setCurrentPage('shop');

    if (hash === '#admin') {
      const stored = localStorage.getItem('ag_admin_key');
      if (stored) {
        setAdminApiKey(stored);
        setIsAdmin(true);
      }
    }

    if (hash.startsWith('#checkout/success')) {
      const params = new URLSearchParams(hash.split('?')[1] || '');
      const orderId = params.get('order');
      if (orderId) setCheckoutOrderId(orderId);
    }
    if (hash === '#checkout/cancel') {
      setShowCheckoutCancel(true);
    }

    const onHashChange = () => {
      const h = window.location.hash;
      if (h === '#shop') { setCurrentPage('shop'); window.scrollTo(0, 0); return; }
      setCurrentPage('home');
      if (h === '#admin') {
        const stored = localStorage.getItem('ag_admin_key');
        if (stored) {
          setAdminApiKey(stored);
          setIsAdmin(true);
        }
      }
      if (h.startsWith('#checkout/success')) {
        const params = new URLSearchParams(h.split('?')[1] || '');
        const orderId = params.get('order');
        if (orderId) setCheckoutOrderId(orderId);
      }
      if (h === '#checkout/cancel') {
        setShowCheckoutCancel(true);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Alt+A keyboard shortcut to toggle admin mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.code === 'KeyA' || e.key === 'a' || e.key === 'å' || e.key === 'Å')) {
        e.preventDefault();
        setIsAdmin(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const websiteId = import.meta.env.VITE_CRISP_WEBSITE_ID;
    if (!websiteId) return;
    (window as any).$crisp = [];
    (window as any).CRISP_WEBSITE_ID = websiteId;
    const d = document;
    const s = d.createElement('script');
    s.src = 'https://client.crisp.chat/l.js';
    s.async = true;
    d.getElementsByTagName('head')[0].appendChild(s);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('atzold_cookie_consent_v2');
    if (!stored) {
      const timer = setTimeout(() => setShowCookieBanner(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (activeNotification) {
      const timer = setTimeout(() => setActiveNotification(null), 7500);
      return () => clearTimeout(timer);
    }
  }, [activeNotification]);

  const handleTriggerNotification = useCallback((message: string) => {
    setActiveNotification(message);
    playNotificationChime();
  }, []);

  const handleLanguageSwitch = useCallback(() => {
    setLang(prev => (prev === 'de' ? 'en' : 'de'));
  }, []);

  const handleAdminLogin = useCallback((key: string) => {
    localStorage.setItem('ag_admin_key', key);
    setAdminApiKey(key);
    setIsAdmin(true);
  }, []);

  const handleCheckoutClose = useCallback(() => {
    setCheckoutOrderId(null);
    setShowCheckoutCancel(false);
    window.location.hash = '';
  }, []);

  const handleAdminLogout = useCallback(() => {
    localStorage.removeItem('ag_admin_key');
    setAdminApiKey(null);
    setIsAdmin(false);
    setAdminSection('dashboard');
  }, []);

  const handleVerified = useCallback(() => {
    setIsVerified(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => { if (mq.matches) setSidebarOpen(false); };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  if (isAdmin) {
    return (
      <Suspense fallback={ADMIN_FALLBACK}>
        {!adminApiKey ? (
          <AdminLogin onLogin={handleAdminLogin} />
        ) : (
          <AdminLayout activeSection={adminSection} onNavigate={setAdminSection} onLogout={handleAdminLogout}>
            {adminSection === 'dashboard' && <AdminDashboard onNavigate={setAdminSection} />}
            {adminSection === 'venues' && <AdminVenues apiKey={adminApiKey} />}
            {adminSection === 'story' && <AdminStory apiKey={adminApiKey} />}
            {adminSection === 'merch' && <AdminMerch apiKey={adminApiKey} />}
            {adminSection === 'orders' && <AdminOrders apiKey={adminApiKey} />}
            {adminSection === 'testimonials' && <AdminTestimonials apiKey={adminApiKey} />}
            {adminSection === 'beer-profile' && <AdminBeerProfile apiKey={adminApiKey} />}
            {adminSection === 'brandhub' && <AdminBrandHub apiKey={adminApiKey} />}
            {adminSection === 'brand-guidelines' && <AdminBrandGuidelines lang={lang} />}
            {adminSection === 'translations' && <AdminTranslations apiKey={adminApiKey} />}
            {adminSection === 'settings' && <AdminSettings apiKey={adminApiKey} />}
          </AdminLayout>
        )}
      </Suspense>
    );
  }

  if (currentPage === 'shop') {
    return (
      <div className="min-h-screen font-sans light">
        <div className="lg:hidden flex items-center justify-center pt-5 pb-3 bg-canvas relative z-20">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentPage('home'); window.location.hash = ''; }}
            aria-label="Atzengold"
          >
            <img src="/elemente/Logo.gif" alt="Atzengold" className="h-9 w-auto object-contain" />
          </a>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Menü öffnen"
          className="fixed top-4 right-4 z-30 p-2.5 bg-canvas border border-ink/15 shadow-md lg:hidden hover:bg-canvas-soft transition-colors"
        >
          <Menu className="w-5 h-5 text-ink" />
        </button>
        <div className="noise-overlay" />
        <BrandHub lang={lang} isOpen={showBrandHub} onClose={() => setShowBrandHub(false)} onTriggerNotification={handleTriggerNotification} />
        <Datenschutz lang={lang} isOpen={showDatenschutz} onClose={() => setShowDatenschutz(false)} />
        <Impressum lang={lang} isOpen={showImpressum} onClose={() => setShowImpressum(false)} />
        <Widerrufsrecht lang={lang} isOpen={showWiderrufsrecht} onClose={() => setShowWiderrufsrecht(false)} />
        <AGB lang={lang} isOpen={showAGB} onClose={() => setShowAGB(false)} />
        <CookieBanner lang={lang} isOpen={showCookieBanner} onClose={() => setShowCookieBanner(false)} onConsentSaved={() => {}} onTriggerNotification={handleTriggerNotification} onShowPrivacy={() => setShowDatenschutz(true)} onShowImpressum={() => setShowImpressum(true)} />
        {!isVerified && <AgeGate lang={lang} onVerified={handleVerified} />}
        <div className="flex justify-center">
          <Sidebar lang={lang} onLangChange={handleLanguageSwitch} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogoClick={() => { setCurrentPage('home'); window.location.hash = ''; }} />
          <div className="min-w-0">
            <MerchShop lang={lang} onAddCartFeedback={handleTriggerNotification} />
            {checkoutOrderId && <CheckoutSuccess lang={lang} orderId={checkoutOrderId} onClose={handleCheckoutClose} />}
            {showCheckoutCancel && <CheckoutCancelOverlay lang={lang} onClose={handleCheckoutClose} />}
            <AnimatePresence>
              {activeNotification && <NotificationToast message={activeNotification} lang={lang} onClose={() => setActiveNotification(null)} />}
            </AnimatePresence>
            <Footer lang={lang} onShowImpressum={() => setShowImpressum(true)} onShowDatenschutz={() => setShowDatenschutz(true)} onShowAGB={() => setShowAGB(true)} onShowWiderrufsrecht={() => setShowWiderrufsrecht(true)} onShowCookies={() => setShowCookieBanner(true)} onLangToggle={handleLanguageSwitch} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans scroll-smooth light">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 lg:focus:left-[220px] focus:z-[100] focus:bg-accent focus:text-ink focus:px-4 focus:py-2 focus:font-bold focus:text-sm focus:shadow-lg focus:outline-none"
      >
        {lang === 'en' ? 'Skip to main content' : 'Zum Hauptinhalt springen'}
      </a>

      {/* Mobile top bar with logo — visible only below lg */}
      <div className="lg:hidden flex items-center justify-center pt-5 pb-3 bg-canvas relative z-20">
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          aria-label="Atzengold"
        >
          <img src="/elemente/Logo.gif" alt="Atzengold" className="h-9 w-auto object-contain" />
        </a>
      </div>

      {/* Mobile hamburger — visible only below lg */}
      <button
        onClick={() => setSidebarOpen(true)}
        aria-label="Menü öffnen"
        className="fixed top-4 right-4 z-30 p-2.5 bg-canvas border border-ink/15 shadow-md lg:hidden hover:bg-canvas-soft transition-colors"
      >
        <Menu className="w-5 h-5 text-ink" />
      </button>

      <div className="noise-overlay" />

      <CookieBanner
        lang={lang}
        isOpen={showCookieBanner}
        onClose={() => setShowCookieBanner(false)}
        onConsentSaved={() => {}}
        onTriggerNotification={handleTriggerNotification}
        onShowPrivacy={() => setShowDatenschutz(true)}
        onShowImpressum={() => setShowImpressum(true)}
      />

      <BrandHub
        lang={lang}
        isOpen={showBrandHub}
        onClose={() => setShowBrandHub(false)}
        onTriggerNotification={handleTriggerNotification}
      />

      <Datenschutz
        lang={lang}
        isOpen={showDatenschutz}
        onClose={() => setShowDatenschutz(false)}
      />

      <Impressum
        lang={lang}
        isOpen={showImpressum}
        onClose={() => setShowImpressum(false)}
      />

      {!isVerified && (
        <AgeGate lang={lang} onVerified={handleVerified} />
      )}

      <div className="flex justify-center">
        <Sidebar lang={lang} onLangChange={handleLanguageSwitch} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="min-w-0">
          <main id="main-content">
            <h1 className="sr-only">Atzengold – Fränkisches Kellerbier</h1>
            <Carousel />
          </main>

          <RootsSection />

          <div className="px-6 bg-canvas">
            <div className="content-width">
              <img src="/elemente/Strich_01.png" alt="" aria-hidden="true" className="w-full" />
            </div>
          </div>

          <div id="story"><StoryAndBrew lang={lang} /></div>

          <div id="testimonials"><Testimonials lang={lang} /></div>

          <div id="shop"><MerchShop lang={lang} onAddCartFeedback={handleTriggerNotification} /></div>

          <div className="px-6 bg-canvas">
            <div className="content-width">
              <img src="/elemente/Strich_02.png" alt="" aria-hidden="true" className="w-full" />
            </div>
          </div>

          <InstagramFeed lang={lang} />

          <Suspense fallback={<div className="py-32 text-center text-ink/40">Loading map…</div>}>
            <ThreeDMap onOpenDatenschutz={() => setShowDatenschutz(true)} />
          </Suspense>

          {checkoutOrderId && (
            <CheckoutSuccess lang={lang} orderId={checkoutOrderId} onClose={handleCheckoutClose} />
          )}

          {showCheckoutCancel && (
            <CheckoutCancelOverlay lang={lang} onClose={handleCheckoutClose} />
          )}

          <Widerrufsrecht lang={lang} isOpen={showWiderrufsrecht} onClose={() => setShowWiderrufsrecht(false)} />

          <AGB lang={lang} isOpen={showAGB} onClose={() => setShowAGB(false)} />

          <AnimatePresence>
            {activeNotification && (
              <NotificationToast message={activeNotification} lang={lang} onClose={() => setActiveNotification(null)} />
            )}
          </AnimatePresence>

          <Footer
            lang={lang}
            onShowImpressum={() => setShowImpressum(true)}
            onShowDatenschutz={() => setShowDatenschutz(true)}
            onShowAGB={() => setShowAGB(true)}
            onShowWiderrufsrecht={() => setShowWiderrufsrecht(true)}
            onShowCookies={() => setShowCookieBanner(true)}
            onLangToggle={handleLanguageSwitch}
          />

          <div className="sr-only" aria-live="polite" role="status">
            {activeNotification || ''}
          </div>
        </div>
      </div>
    </div>
  );
}
