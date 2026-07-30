import TimelineCarousel from './TimelineCarousel';

interface StoryAndBrewProps {
  lang: 'de' | 'en';
}

export default function StoryAndBrew({ lang }: StoryAndBrewProps) {
  return (
    <section id="story-narrative" className="relative bg-canvas dark:bg-primary-deep pt-8 pb-8 md:pb-24 px-6 md:px-12 bg-texture-paper">

      <div className="relative content-width">

        {/* Horizontal Timeline */}
        <div className="mb-8 md:mb-24">
          <TimelineCarousel lang={lang} />
        </div>

      </div>
    </section>
  );
}
