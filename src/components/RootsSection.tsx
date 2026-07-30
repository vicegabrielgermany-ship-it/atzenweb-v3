import { useRef, useState, useEffect, useCallback } from 'react';
import Pause from 'lucide-react/dist/esm/icons/pause';
import Play from 'lucide-react/dist/esm/icons/play';
import Volume2 from 'lucide-react/dist/esm/icons/volume-2';
import VolumeX from 'lucide-react/dist/esm/icons/volume-x';
import Maximize from 'lucide-react/dist/esm/icons/maximize';

const VIDEO_SRCS = {
  mp4: '/videos/atzenmaus-optimised.mp4',
} as const;

export default function RootsSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggleVideoPlayPause = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsVideoPlaying(true);
    } else {
      v.pause();
      setIsVideoPlaying(false);
    }
  }, []);

  const toggleVideoMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsVideoMuted(prev => !prev);
  }, []);

  const toggleVideoFullscreen = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      v.requestFullscreen().catch(() => {});
    }
  }, []);

  return (
    <section ref={sectionRef} id="roots" aria-label="Unsere Wurzeln" className="py-12 px-6 bg-canvas">
      <div className="content-width grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left column: Text, headline, crests */}
        <div className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-4 font-mono text-sm leading-relaxed text-black">
            <h2 className="font-bold mb-6">IN FRANKEN GEBOREN, AUF DER STRASSE DAHEIM</h2>
            <div className="space-y-4">
              <p>Wo Atze auf Tradition trifft<br />Die Wiege unseres lecker Bierchens liegt in Atzenhof, einem beschaulichen Vorort von Fürth.</p>
              <p>Schon 1313 (geschätzt) urkundlich erwähnt, wurde die damalige Siedlung Ritter Rapoto von Kühlsheim zugesprochen und gelangte folglich in das Einflussgebiet der Fränkischen Schweiz, die noch heute die höchste Brauereidichte der Welt aufweist.</p>
              <p>So verdankt das Atzengold auf traditionelle Art seine goldene Farbe und seine süffige Vollmundigkeit den Zutaten: Wasser, Gerstenmalz, Hopfen, Hefe.</p>
              <p>Prost, Atzel!</p>
            </div>
          </div>

          <div className="flex justify-center">
            <img src="/elemente/roots-headline.png" alt="Roots" className="h-16 w-auto object-contain mix-blend-multiply" />
          </div>

          <div className="grid grid-cols-4 gap-6 md:gap-8">
            {[
              { src: '/elemente/bayern-crest.png', alt: 'Bayern' },
              { src: '/elemente/franken-crest.png', alt: 'Franken' },
              { src: '/elemente/furth-crest.png', alt: 'Fürth' },
              { src: '/elemente/berlin-crest.png', alt: 'Berlin' },
            ].map(crest => (
              <div key={crest.alt} className="flex flex-col items-center gap-3">
                <img src={crest.src} alt={crest.alt} className="h-32 w-auto object-contain mix-blend-multiply" />
                <span className="sr-only">{crest.alt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Video */}
        <div className="flex justify-center h-fit">
          <div className="relative w-full">
            {shouldLoadVideo ? (
              <video
                ref={videoRef}
                src={VIDEO_SRCS.mp4}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto rounded-sm"
              />
            ) : (
              <div className="w-full aspect-video bg-ink/5 rounded-sm animate-pulse" />
            )}
            <div className="absolute top-3 left-3 flex gap-2">
              <button
                onClick={toggleVideoPlayPause}
                className="p-2 text-white hover:text-white/80 transition-colors"
                aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
              >
                {isVideoPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                onClick={toggleVideoMute}
                className="p-2 text-white hover:text-white/80 transition-colors"
                aria-label={isVideoMuted ? 'Unmute video' : 'Mute video'}
              >
                {isVideoMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <button
                onClick={toggleVideoFullscreen}
                className="p-2 text-white hover:text-white/80 transition-colors"
                aria-label="Toggle fullscreen"
              >
                <Maximize size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
