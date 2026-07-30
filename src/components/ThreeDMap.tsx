import React, { useState, useMemo, useEffect, useRef } from 'react';
import { fetchVenues } from '../lib/public-api';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import Navigation from 'lucide-react/dist/esm/icons/navigation';
import FilterIcon from 'lucide-react/dist/esm/icons/filter';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Star from 'lucide-react/dist/esm/icons/star';
import Utensils from 'lucide-react/dist/esm/icons/utensils';
import PawPrint from 'lucide-react/dist/esm/icons/paw-print';
import Clock from 'lucide-react/dist/esm/icons/clock';
import Search from 'lucide-react/dist/esm/icons/search';
import X from 'lucide-react/dist/esm/icons/x';
import List from 'lucide-react/dist/esm/icons/list';
import Locate from 'lucide-react/dist/esm/icons/locate';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Minus from 'lucide-react/dist/esm/icons/minus';
import Compass from 'lucide-react/dist/esm/icons/compass';
import Layers from 'lucide-react/dist/esm/icons/layers';
import Map, { Marker } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import useSupercluster from 'use-supercluster';
import NewsletterSignup from './NewsletterSignup';
import { IllustratedHeading } from './IllustratedHeading';

interface Venue {
  id: string;
  name: string;
  type: string;
  isGastronomy: boolean; // true = Gastronomy, false = Retail
  address: string;
  distance: number; // in km
  rating: string;
  isOpen: boolean;
  openingHours: string;
  hasFood: boolean;
  dogFriendly: boolean;
  longitude: number;
  latitude: number;
}

const FALLBACK_VENUES: Venue[] = [
  {
    id: 'v1',
    name: 'Maisch Marika',
    type: 'Lebensmittel',
    isGastronomy: false,
    address: 'Hirschenstr. 46, 90762 Fürth',
    distance: 0,
    rating: '',
    isOpen: true,
    openingHours: 'Reguläre Geschäftszeiten',
    hasFood: false,
    dogFriendly: false,
    longitude: 10.9845882,
    latitude: 49.4728532
  },
  {
    id: 'v2',
    name: 'REWE Michael Maier oHG',
    type: 'Supermarkt',
    isGastronomy: false,
    address: 'Münchener Str. 35, 91567 Herrieden',
    distance: 0,
    rating: '',
    isOpen: true,
    openingHours: 'Reguläre Geschäftszeiten',
    hasFood: false,
    dogFriendly: false,
    longitude: 10.5021927,
    latitude: 49.2352004
  },
  {
    id: 'v3',
    name: 'REWE Fröhlich oHG',
    type: 'Supermarkt',
    isGastronomy: false,
    address: 'Strawinskystr. 27A, 90455 Nürnberg',
    distance: 0,
    rating: '',
    isOpen: true,
    openingHours: 'Reguläre Geschäftszeiten',
    hasFood: false,
    dogFriendly: false,
    longitude: 11.0637311,
    latitude: 49.3475173
  },
  {
    id: 'v4',
    name: 'REWE Pascal Kneuer oHG',
    type: 'Supermarkt',
    isGastronomy: false,
    address: 'Karl-Zucker-Str. 10, 91052 Erlangen',
    distance: 0,
    rating: '',
    isOpen: true,
    openingHours: 'Reguläre Geschäftszeiten',
    hasFood: false,
    dogFriendly: false,
    longitude: 11.0048406,
    latitude: 49.5833453
  },
  {
    id: 'v5',
    name: 'Bisloher Getränkeland GmbH',
    type: 'Getränkemarkt',
    isGastronomy: false,
    address: 'Industriestr. 2, 90765 Fürth',
    distance: 0,
    rating: '',
    isOpen: true,
    openingHours: 'Reguläre Geschäftszeiten',
    hasFood: false,
    dogFriendly: false,
    longitude: 11.0056912,
    latitude: 49.5107603
  },
  {
    id: 'v6',
    name: 'Landauer GmbH',
    type: 'Lebensmittel & Getränke',
    isGastronomy: false,
    address: 'Fürther Str. 27 b, 90587 Siegelsdorf',
    distance: 0,
    rating: '',
    isOpen: true,
    openingHours: 'Reguläre Geschäftszeiten',
    hasFood: false,
    dogFriendly: false,
    longitude: 10.8860934,
    latitude: 49.5068444
  },
  {
    id: 'v7',
    name: 'Trunk GmbH & Co. KG',
    type: 'Getränke-Großhandel',
    isGastronomy: false,
    address: 'Heigern 4 - 8, 97286 Winterhausen',
    distance: 0,
    rating: '',
    isOpen: true,
    openingHours: 'Reguläre Geschäftszeiten',
    hasFood: false,
    dogFriendly: false,
    longitude: 10.0131726,
    latitude: 49.7063725
  },
  {
    id: 'v8',
    name: 'E-Center Schätz',
    type: 'Supermarkt',
    isGastronomy: false,
    address: 'Würzburger Str. 140, 90766 Fürth',
    distance: 0,
    rating: '',
    isOpen: true,
    openingHours: 'Reguläre Geschäftszeiten',
    hasFood: false,
    dogFriendly: false,
    longitude: 10.9639846,
    latitude: 49.4837335
  },
  {
    id: 'v10',
    name: 'Bierhimmel Gastro Betriebs GmbH',
    type: 'Gastronomie',
    isGastronomy: true,
    address: 'Friedrich-Ebert-Str. 100, 90766 Fürth',
    distance: 0,
    rating: '',
    isOpen: true,
    openingHours: 'Reguläre Öffnungszeiten',
    hasFood: true,
    dogFriendly: false,
    longitude: 10.9738711,
    latitude: 49.4863731
  },
  {
    id: 'v11',
    name: 'Die Getränkeritter',
    type: 'Getränkemarkt',
    isGastronomy: false,
    address: 'Richtweg 60, 90530 Wendelstein',
    distance: 0,
    rating: '',
    isOpen: true,
    openingHours: 'Reguläre Geschäftszeiten',
    hasFood: false,
    dogFriendly: false,
    longitude: 11.1624629,
    latitude: 49.3522364
  },
  {
    id: 'v12',
    name: 'Kulinarikwelten Stengel',
    type: 'Feinkost',
    isGastronomy: false,
    address: 'Waldstr. 105, 90763 Fürth',
    distance: 0,
    rating: '',
    isOpen: true,
    openingHours: 'Reguläre Geschäftszeiten',
    hasFood: true,
    dogFriendly: false,
    longitude: 11.0087916,
    latitude: 49.4585024
  },
  {
    id: 'v13',
    name: 'Edeka Schätz',
    type: 'Supermarkt',
    isGastronomy: false,
    address: 'Kurt-Triest-Str. 5, 90441 Nürnberg',
    distance: 0,
    rating: '',
    isOpen: true,
    openingHours: 'Reguläre Geschäftszeiten',
    hasFood: false,
    dogFriendly: false,
    longitude: 11.044144,
    latitude: 49.4317593
  },
  {
    id: 'v14',
    name: 'Sagasser Fachmarkt',
    type: 'Getränkefachmarkt',
    isGastronomy: false,
    address: 'Sandäcker 1, 91301 Forchheim',
    distance: 0,
    rating: '',
    isOpen: true,
    openingHours: 'Reguläre Geschäftszeiten',
    hasFood: false,
    dogFriendly: false,
    longitude: 11.0723711,
    latitude: 49.695244
  },
  {
    id: 'v15',
    name: 'Heizhaus',
    type: 'Kulturzentrum',
    isGastronomy: true,
    address: 'Wandererstr. 98c, 90431 Nürnberg',
    distance: 0,
    rating: '',
    isOpen: true,
    openingHours: 'Veranstaltungsabhängig',
    hasFood: false,
    dogFriendly: false,
    longitude: 11.0300497,
    latitude: 49.4575983
  },
  {
    id: 'v16',
    name: 'Desi Club Nürnberg',
    type: 'Club',
    isGastronomy: true,
    address: 'Brückenstraße 23, 90419 Nürnberg',
    distance: 0,
    rating: '',
    isOpen: true,
    openingHours: 'Veranstaltungsabhängig',
    hasFood: false,
    dogFriendly: false,
    longitude: 11.0596351,
    latitude: 49.4581542
  }
];

// Haversine formula to calculate dynamic distances
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return parseFloat((R * c).toFixed(2));
}

interface ThreeDMapProps {
  onOpenDatenschutz?: () => void;
}

export default function ThreeDMap({ onOpenDatenschutz }: ThreeDMapProps = {}) {
  const [viewport, setViewport] = useState({
    longitude: 11.0182, // Heizhaus Nürnberg
    latitude: 49.4566,
    zoom: 14.5,
    pitch: 50,
    bearing: -15
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [radius, setRadius] = useState(2);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const [filters, setFilters] = useState({
    food: false,
    dogFriendly: false,
    openNow: false,
    gastronomy: false, // On-Premise
    retail: false,      // Off-Premise
  });

  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [announcement, setAnnouncement] = useState('');

  const mapRef = useRef<MapRef>(null);
  const [highContrast, setHighContrast] = useState(false);
  const mapStyle = highContrast
    ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

  const [bounds, setBounds] = useState<[number, number, number, number] | null>(null);
  const [venues, setVenues] = useState<Venue[]>(FALLBACK_VENUES);

  useEffect(() => {
    fetchVenues().then(data => { if (data) setVenues(data); });
  }, []);

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculate dynamic distances based on viewport center (or user location if preferred)
  const venuesWithDynamicDistance = useMemo(() => {
    return venues.map(venue => {
      const dist = getDistance(
        viewport.latitude,
        viewport.longitude,
        venue.latitude,
        venue.longitude
      );
      return { ...venue, distance: dist };
    });
  }, [viewport.latitude, viewport.longitude]);

  // Filter and sort the results
  const filteredVenues = useMemo(() => {
    return venuesWithDynamicDistance
      .filter(venue => {
        if (venue.distance > radius) return false;
        if (filters.openNow && !venue.isOpen) return false;
        if (filters.food && !venue.hasFood) return false;
        if (filters.dogFriendly && !venue.dogFriendly) return false;
        if (filters.gastronomy && !venue.isGastronomy) return false;
        if (filters.retail && venue.isGastronomy) return false;
        return true;
      })
      .sort((a, b) => a.distance - b.distance);
  }, [venuesWithDynamicDistance, radius, filters]);

  const points = useMemo(() => {
    return filteredVenues.map(venue => ({
      type: "Feature" as const,
      properties: { cluster: false, venueId: venue.id, venue },
      geometry: { type: "Point" as const, coordinates: [venue.longitude, venue.latitude] }
    }));
  }, [filteredVenues]);

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom: viewport.zoom,
    options: { radius: 75, maxZoom: 20 }
  });

  const handleZoomIn = () => { setViewport(v => ({ ...v, zoom: Math.min(v.zoom + 1, 20) })); setAnnouncement("Karte vergrößert."); };
  const handleZoomOut = () => { setViewport(v => ({ ...v, zoom: Math.max(v.zoom - 1, 0) })); setAnnouncement("Karte verkleinert."); };
  const handleResetNorth = () => { setViewport(v => ({ ...v, bearing: 0, pitch: 0 })); setAnnouncement("Kartenansicht auf Norden zurückgesetzt."); };
  const handleToggleContrast = () => {
    setHighContrast(prev => {
      const next = !prev;
      setAnnouncement(`Hoher Kontrast ${next ? 'aktiviert' : 'deaktiviert'}.`);
      return next;
    });
  };

  const updateBounds = () => {
    if (mapRef.current) {
      const b = mapRef.current.getMap().getBounds().toArray().flat() as [number, number, number, number];
      setBounds(b);
    }
  };

  // Dynamic screen reader announcements
  useEffect(() => {
    const filterDesc = [];
    if (filters.gastronomy) filterDesc.push("Gastronomie");
    if (filters.retail) filterDesc.push("Einzelhandel");
    if (filters.openNow) filterDesc.push("Geöffnet");
    const filterText = filterDesc.length > 0 ? ` (${filterDesc.join(', ')})` : '';
    setAnnouncement(`${filteredVenues.length} Standorte gefunden im Umkreis von ${radius} km${filterText}.`);
  }, [filteredVenues.length, radius, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase();
    let newCenter = { latitude: 49.4566, longitude: 11.0182 }; // Default Nürnberg
    let name = "Nürnberg";

    if (query.includes('fürth')) {
      newCenter = { latitude: 49.455, longitude: 11.018 };
      name = "Fürth";
    }

    setViewport(prev => ({
      ...prev,
      latitude: newCenter.latitude,
      longitude: newCenter.longitude,
      zoom: 14.5,
      pitch: 50,
      bearing: -15
    }));

    setAnnouncement(`Suche nach "${searchQuery}" erfolgreich. Karte zentriert auf ${name}.`);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setAnnouncement("Geolocation wird nicht von diesem Browser unterstützt.");
      return;
    }

    setAnnouncement("Standortsuche gestartet...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setViewport(prev => ({
          ...prev,
          latitude,
          longitude,
          zoom: 15,
          pitch: 50,
          bearing: -15
        }));
        setAnnouncement("Standort erfolgreich ermittelt. Karte zentriert auf Ihre Position.");
      },
      () => {
        setAnnouncement("Standort konnte nicht ermittelt werden.");
      }
    );
  };

  const handleSelectVenue = (venue: Venue) => {
    setSelectedVenue(venue);
    setViewport(prev => ({
      ...prev,
      latitude: venue.latitude,
      longitude: venue.longitude,
      zoom: 15.5,
      pitch: 50,
      bearing: -15
    }));
    setAnnouncement(`Ausgewählt: ${venue.name}. Details geladen.`);
  };

  return (
    <section id="map-finder" className="relative content-width px-6 md:px-12 py-16 bg-canvas-soft dark:bg-primary-deep overflow-hidden">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundImage: 'url(/elemente/Backgroundelement_PLACEHOLDER.webp)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(1.55) saturate(0.85)' }}
        aria-hidden="true"
      />
      {/* ARIA Live Region for accessibility announcements */}
      <div className="sr-only" aria-live="polite" role="status">
        {announcement}
      </div>

      {/* Section Heading */}
      <div className="relative z-10 mb-6">
        <IllustratedHeading
          text="Wo gibt es Atzengold?"
          src="/elemente/HEADLINE5_WoGibtEsAtzengold.png"
          className="max-w-[540px]"
        />
        <p className="text-sm md:text-base mt-2 max-w-2xl font-bold" style={{ color: '#edcea7' }}>Hier werden alle unsere Bezugsquellen gelistet — von der gemütlichen Kneipe über den Späti bis zur Gastronomie. Täglich frisch geliefert, solange der Vorrat reicht.</p>
      </div>

      <div className="relative z-10 flex flex-col overflow-hidden shadow-2xl border border-brand-dark-900/10 dark:border-canvas/10 bg-canvas dark:bg-brand-dark-900">

        {/* Mobile View Toggles */}
        <div className="flex lg:hidden bg-canvas-soft dark:bg-brand-dark-900 border-b border-ink/10 dark:border-canvas/10 p-2 justify-center gap-2">
          <button
            onClick={() => setMobileView('list')}
            className={`flex-1 py-2.5 px-4 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${mobileView === 'list' ? 'bg-primary text-canvas' : 'bg-canvas dark:bg-primary-deep text-ink-secondary dark:text-canvas hover:bg-canvas-soft dark:hover:bg-brand-dark-900 border dark:border-canvas/15'}`}
            aria-label="Ergebnisse als Liste anzeigen"
          >
            <List className="w-4 h-4" /> Liste
          </button>
          <button
            onClick={() => setMobileView('map')}
            className={`flex-1 py-2.5 px-4 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${mobileView === 'map' ? 'bg-primary text-canvas' : 'bg-canvas dark:bg-primary-deep text-ink-secondary dark:text-canvas hover:bg-canvas-soft dark:hover:bg-brand-dark-900 border dark:border-canvas/15'}`}
            aria-label="Ergebnisse auf Karte anzeigen"
          >
            <MapPin className="w-4 h-4" /> Karte
          </button>
        </div>

        <div className="h-[min(750px,80vh)] min-h-[400px] flex flex-row relative">
          {/* Left Panel: Beer Finder UI & Results */}
          <div className={`w-full lg:w-[450px] bg-canvas dark:bg-brand-dark-900 h-full overflow-y-auto border-r border-brand-dark-900/10 dark:border-canvas/10 z-10 flex flex-col custom-scrollbar ${mobileView === 'list' ? 'block' : 'hidden lg:flex'}`}>

            <div className="p-6 space-y-6">

              {/* Card 1: Geolocation & Search */}
              <div className="bg-canvas dark:bg-primary-deep border border-ink/10 dark:border-canvas/10 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-ink dark:text-canvas">Standort bestimmen</h3>
                  <CheckCircle2 className="w-5 h-5 text-primary" fill="currentColor" stroke="oklch(0.85 0.04 75.0)" />
                </div>

                <button
                  onClick={handleGeolocation}
                  className="w-full bg-primary hover:bg-primary/90 text-canvas font-medium py-3 px-4 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                  aria-label="Aktuellen GPS-Standort verwenden"
                >
                  <Locate className="w-4 h-4" />
                  Mein GPS-Standort
                </button>

                <div className="mt-5 pt-4 border-t border-ink/10 dark:border-canvas/10">
                  <form onSubmit={handleSearch} className="space-y-2">
                    <label htmlFor="address-search" className="text-sm font-medium text-ink-secondary dark:text-canvas/80 block">
                      Oder Adresse eingeben:
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="address-search"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="z.B. Nürnberg, Fürth"
                        className="flex-1 border-2 border-primary px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-ink dark:text-canvas bg-white dark:bg-brand-dark-900"
                      />
                      <button
                        type="submit"
                        className="bg-primary text-canvas px-4 py-2 text-sm font-medium transition-transform active:scale-[0.98] hover:opacity-90 flex items-center gap-1"
                        aria-label="Ort suchen"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Card 2: Filter Options */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-ink dark:text-canvas">Suchoptionen</h3>
                  <p className="text-sm text-ink-mute dark:text-canvas/60">Filter werden automatisch angewendet</p>
                </div>

                {/* Radius Slider */}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-3">
                    <label htmlFor="radius-slider" className="text-sm font-medium text-ink dark:text-canvas">Suchradius</label>
                    <span className="text-sm text-ink-secondary dark:text-canvas/80 font-mono font-bold">{radius} km</span>
                  </div>
                  <input
                    id="radius-slider"
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={radius}
                    onChange={(e) => setRadius(parseFloat(e.target.value))}
                    className="w-full h-2 bg-ink/10 dark:bg-canvas/10 text-ink/10 dark:text-canvas/10 appearance-none cursor-pointer accent-primary"
                    style={{ background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${(radius - 0.5) / 9.5 * 100}%, currentColor ${(radius - 0.5) / 9.5 * 100}%, currentColor 100%)` }}
                  />
                </div>

                {/* High-Contrast Toggle Badges */}
                <div className="pt-2 border-t border-ink/10 dark:border-canvas/10 space-y-3">
                  <div>
                    <label className="text-xs font-bold text-ink-mute dark:text-canvas/50 uppercase tracking-widest block mb-2">Zusatzfilter</label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => toggleFilter('openNow')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border transition-colors ${filters.openNow ? 'bg-primary text-canvas border-primary' : 'bg-canvas dark:bg-brand-dark-900 text-ink-secondary dark:text-canvas/80 border-ink/10 dark:border-canvas/10 hover:bg-canvas-soft dark:hover:bg-primary-deep'}`}
                        aria-pressed={filters.openNow}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        Jetzt geöffnet
                      </button>
                      <button
                        onClick={() => toggleFilter('food')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border transition-colors ${filters.food ? 'bg-primary text-canvas border-primary' : 'bg-canvas dark:bg-brand-dark-900 text-ink-secondary dark:text-canvas/80 border-ink/10 dark:border-canvas/10 hover:bg-canvas-soft dark:hover:bg-primary-deep'}`}
                        aria-pressed={filters.food}
                      >
                        <Utensils className="w-3.5 h-3.5" />
                        Speisen
                      </button>
                      <button
                        onClick={() => toggleFilter('dogFriendly')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border transition-colors ${filters.dogFriendly ? 'bg-primary text-canvas border-primary' : 'bg-canvas dark:bg-brand-dark-900 text-ink-secondary dark:text-canvas/80 border-ink/10 dark:border-canvas/10 hover:bg-canvas-soft dark:hover:bg-primary-deep'}`}
                        aria-pressed={filters.dogFriendly}
                      >
                        <PawPrint className="w-3.5 h-3.5" />
                        Hundefreundlich
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-2 w-full bg-canvas-soft dark:bg-brand-dark-900 border-y border-ink/10 dark:border-canvas/10" />

            {/* Ordered List View (WCAG Savior) */}
            <div className="p-6 flex-1 bg-canvas dark:bg-brand-dark-900">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 ribbon bg-ink px-4 py-1.5 text-xs font-mono font-bold text-canvas uppercase tracking-widest mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  Bezugsquellen
                </div>
                <h2 className="text-xl font-bold text-ink dark:text-canvas mb-2">Atzengold Verkaufsstellen</h2>
                <p className="text-sm text-ink-mute dark:text-canvas/60 mb-3">Hier findest du alle Orte, an denen du Atzengold bekommst — von der gemütlichen Kneipe über den Späti bis zur Gastronomie. Täglich frisch geliefert, solange der Vorrat reicht.</p>
                <div className="inline-block bg-primary text-canvas text-xs font-bold px-3 py-1">
                  {filteredVenues.length} Partner gefunden
                </div>
              </div>

              <ol id="venue-list-start" tabIndex={-1} className="space-y-4 pb-20 focus:outline-none">
                {filteredVenues.length === 0 ? (
                  <p className="text-ink-mute dark:text-canvas/60 text-sm py-4">Keine Verkaufsstellen im ausgewählten Umkreis gefunden.</p>
                ) : (
                  filteredVenues.map((venue, idx) => (
                    <li
                      key={venue.id}
                      onClick={() => handleSelectVenue(venue)}
                      className={`border p-4 transition-all cursor-pointer shadow-sm focus-within:ring-2 focus-within:ring-primary ${selectedVenue?.id === venue.id ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-ink/10 dark:border-canvas/10 hover:border-ink/20 dark:hover:border-canvas/20 bg-canvas dark:bg-primary-deep'}`}
                    >
                      <button
                        className="w-full text-left focus:outline-none"
                        aria-label={`${idx + 1}. ${venue.name}, ${venue.type}, Entfernung: ${venue.distance} Kilometer. Klicken für Details.`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-lg text-ink dark:text-canvas leading-tight">{venue.name}</h4>
                          <span className={`text-xs font-bold px-2 py-0.5 ${venue.isOpen ? 'bg-primary text-canvas' : 'bg-ink/10 dark:bg-brand-dark-900 text-ink-secondary dark:text-canvas/70'}`}>
                            {venue.isOpen ? 'Geöffnet' : 'Geschlossen'}
                          </span>
                        </div>

                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-1 text-sm text-ink-secondary dark:text-canvas/70 font-bold">
                            <MapPin className="w-4 h-4 text-ink-mute dark:text-canvas/40" />
                            {venue.distance} km
                          </div>
                          <div className="flex items-center gap-1 text-sm text-ink-secondary dark:text-canvas/70 font-bold">
                            <Clock className="w-4 h-4 text-ink-mute dark:text-canvas/40" />
                            {venue.openingHours}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-ink dark:text-canvas px-2.5 py-1 border border-ink/10 dark:border-canvas/10 bg-canvas-soft dark:bg-brand-dark-900">
                              {venue.type}
                            </span>
                            {venue.hasFood && (
                              <div className="bg-accent/10 dark:bg-accent/20 text-accent dark:text-accent p-1.5" title="Speisenangebot">
                                <Utensils className="w-3.5 h-3.5" />
                              </div>
                            )}
                            {venue.dogFriendly && (
                              <div className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary p-1.5" title="Hundefreundlich">
                                <PawPrint className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>
                          {venue.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-accent" fill="currentColor" />
                              <span className="text-sm font-bold text-ink dark:text-canvas">{venue.rating}</span>
                            </div>
                          )}
                        </div>
                      </button>
                    </li>
                  ))
                )}
              </ol>
            </div>
          </div>

          {/* Right Panel: MapLibre Map */}
          <div className={`flex-1 relative h-full bg-canvas-soft ${mobileView === 'map' ? 'block' : 'hidden lg:block'}`}>
              <a href="#venue-list-start" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-canvas focus:text-primary focus:p-4 focus:font-bold focus:shadow-xl top-4 left-4 outline-none border-2 border-primary">
              Zur Liste überspringen (Skip Map)
            </a>

            <Map
              {...viewport}
              ref={mapRef}
              onLoad={updateBounds}
              onMove={evt => {
                setViewport(evt.viewState);
                updateBounds();
              }}
              mapStyle={mapStyle}
              attributionControl={false}
            >
              {/* On-Map Accessibility Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 pointer-events-auto">
                <div className="bg-canvas dark:bg-brand-dark-900 shadow-xl border border-ink/10 dark:border-canvas/10 overflow-hidden flex flex-col">
                  <button onClick={handleZoomIn} aria-label="Hineinzoomen" title="Hineinzoomen" className="w-[44px] h-[44px] flex items-center justify-center text-ink-secondary dark:text-canvas hover:bg-canvas-soft dark:hover:bg-primary-deep hover:text-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary border-b border-ink/10 dark:border-canvas/10">
                    <Plus strokeWidth={3} className="w-5 h-5" />
                  </button>
                  <button onClick={handleZoomOut} aria-label="Herauszoomen" title="Herauszoomen" className="w-[44px] h-[44px] flex items-center justify-center text-ink-secondary dark:text-canvas hover:bg-canvas-soft dark:hover:bg-primary-deep hover:text-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                    <Minus strokeWidth={3} className="w-5 h-5" />
                  </button>
                </div>

                {(viewport.bearing !== 0 || viewport.pitch !== 0) && (
                  <button onClick={handleResetNorth} aria-label="Nach Norden ausrichten" title="Nach Norden ausrichten" className="w-[44px] h-[44px] bg-canvas dark:bg-brand-dark-900 shadow-xl border border-ink/10 dark:border-canvas/10 flex items-center justify-center text-ink-secondary dark:text-canvas hover:bg-canvas-soft dark:hover:bg-primary-deep hover:text-accent focus:outline-none focus:ring-2 focus:ring-primary">
                    <Compass className="w-5 h-5" style={{ transform: `rotate(${-viewport.bearing}deg)` }} />
                  </button>
                )}

                <button onClick={handleGeolocation} aria-label="Eigenen Standort auf der Karte finden" title="Eigenen Standort auf der Karte finden" className="w-[44px] h-[44px] bg-canvas dark:bg-brand-dark-900 shadow-xl border border-ink/10 dark:border-canvas/10 flex items-center justify-center text-ink-secondary dark:text-canvas hover:bg-canvas-soft dark:hover:bg-primary-deep hover:text-accent focus:outline-none focus:ring-2 focus:ring-primary">
                  <Locate className="w-5 h-5" />
                </button>

                <button onClick={handleToggleContrast} aria-label={highContrast ? "Standard-Kontrast aktivieren" : "Hohen Kontrast aktivieren"} title="Karten-Kontrast umschalten" className="w-[44px] h-[44px] bg-canvas dark:bg-brand-dark-900 shadow-xl border border-ink/10 dark:border-canvas/10 flex items-center justify-center text-ink-secondary dark:text-canvas hover:bg-canvas-soft dark:hover:bg-primary-deep hover:text-accent focus:outline-none focus:ring-2 focus:ring-primary">
                  <Layers className="w-5 h-5" />
                </button>
              </div>

              {/* User Location Marker */}
              {userLocation && (
                <Marker longitude={userLocation.longitude} latitude={userLocation.latitude} anchor="center">
                  <div className="w-6 h-6 bg-accent rounded-full border-2 border-canvas shadow-xl animate-pulse" />
                </Marker>
              )}

              {/* Clusters and Venues */}
              {clusters.map(cluster => {
                const [longitude, latitude] = cluster.geometry.coordinates;
                const { cluster: isCluster, point_count: pointCount } = cluster.properties;

                if (isCluster) {
                  return (
                    <Marker key={`cluster-${cluster.id}`} longitude={longitude} latitude={latitude} anchor="center">
                      <button
                        className="w-[44px] h-[44px] bg-ink text-canvas font-bold rounded-full shadow-2xl border-4 border-canvas flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-primary/50 transform transition-transform hover:scale-110 cursor-pointer pointer-events-auto"
                        aria-label={`${pointCount} Standorte in diesem Bereich. Klicken zum Vergrößern.`}
                        onClick={() => {
                          const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20);
                          setViewport(prev => ({ ...prev, latitude, longitude, zoom: expansionZoom, pitch: 50, bearing: -15 }));
                        }}
                      >
                        {pointCount}
                      </button>
                    </Marker>
                  );
                }

                const venue = cluster.properties.venue;
                const isSelected = selectedVenue?.id === venue.id;
                return (
                  <Marker
                    key={venue.id}
                    longitude={longitude}
                    latitude={latitude}
                    anchor="bottom"
                  >
                    <button
                      onClick={() => handleSelectVenue(venue)}
                      className={`relative group cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-full w-[44px] h-[44px] flex items-center justify-center pointer-events-auto transition-all duration-300 ${isSelected ? 'scale-125 z-30' : 'z-10'}`}
                      aria-label={`Markierung für ${venue.name} anzeigen`}
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-canvas shadow-xl border-2 border-canvas transform transition-transform group-hover:scale-110 ${isSelected ? 'bg-accent ring-4 ring-accent/30' : (venue.isGastronomy ? 'bg-primary' : 'bg-ink')}`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 absolute bottom-0 left-1/2 -translate-x-1/2 ${isSelected ? 'border-t-accent' : (venue.isGastronomy ? 'border-t-primary' : 'border-t-ink')}`} />
                    </button>
                  </Marker>
                );
              })}
            </Map>

            {/* Custom high-contrast Location Detail Card overlay */}
            {selectedVenue && (
              <div
                className="absolute bottom-4 left-4 right-4 bg-canvas dark:bg-brand-dark-900 border border-ink/10 dark:border-canvas/10 p-5 shadow-2xl z-40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all"
                role="dialog"
                aria-label={`Details zu ${selectedVenue.name}`}
              >
                <button
                  onClick={() => setSelectedVenue(null)}
                   className="absolute top-3 right-3 p-1.5 text-ink-mute hover:text-ink-secondary focus:outline-none focus:ring-2 focus:ring-primary bg-canvas-soft dark:bg-primary-deep border border-ink/10 dark:border-canvas/10"
                  aria-label="Schließen"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-1 pr-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold font-mono uppercase tracking-widest text-primary bg-primary/10 dark:bg-primary/20 px-2 py-0.5">
                      {selectedVenue.type}
                    </span>
                    <span className="text-xs font-bold text-ink-mute dark:text-canvas/50 font-mono">
                      Nur als Flasche verfügbar (0,5l)
                    </span>
                  </div>
                  <h4 className="font-display text-xl text-ink dark:text-canvas font-bold leading-tight mt-1">{selectedVenue.name}</h4>
                  <p className="text-sm text-ink-secondary dark:text-canvas/80">{selectedVenue.address}</p>
                  <div className="flex flex-wrap gap-x-4 text-xs font-bold text-ink-secondary dark:text-canvas/60 mt-2 font-mono">
                    <span>Entfernung: {selectedVenue.distance} km</span>
                    <span>•</span>
                    <span>Öffnungszeiten: {selectedVenue.openingHours}</span>
                  </div>
                </div>

                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2 self-stretch md:self-auto items-stretch md:items-center">
                  <a
                    href={`https://maps.google.com/?q=${selectedVenue.latitude},${selectedVenue.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-initial bg-primary hover:bg-primary/90 text-canvas font-bold py-3.5 px-6 text-center shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-5 h-5" /> Wegbeschreibung
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-10">
        <NewsletterSignup lang="de" onOpenDatenschutz={onOpenDatenschutz} />
      </div>
    </section>
  );
}
