"use client";
import React from "react";
import { motion } from "motion/react";

export interface TestimonialType {
  text: string;
  image: string;
  name: string;
  role: string;
  location?: 'nurnberg' | 'furth' | 'berlin' | 'erlangen';
  untappdUrl?: string;
}

const CREST_URLS = {
  nurnberg: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Wappen_von_N%C3%BCrnberg.svg",
  furth: "https://upload.wikimedia.org/wikipedia/commons/9/92/Wappen_F%C3%BCrth.svg",
  berlin: "https://upload.wikimedia.org/wikipedia/commons/8/8c/DEU_Berlin_COA.svg",
  erlangen: "https://upload.wikimedia.org/wikipedia/commons/e/ec/DEU_Erlangen_COA.svg"
};

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: TestimonialType[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 15,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-8 pb-8 bg-transparent"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role, location, untappdUrl }, i) => {
                // Generate deterministic but varied rotations between -2deg and 2deg
                const rotations = ['rotate-1', '-rotate-2', 'rotate-2', '-rotate-1', 'rotate-0'];
                const rotationClass = rotations[i % rotations.length];

                const crestSrc = location ? CREST_URLS[location] : '/favicon.png';

                return (
                  <motion.div
                    className={`p-8 pt-4 bg-canvas dark:bg-brand-dark-900 text-ink dark:text-canvas shadow-lg hover:shadow-2xl transition-all duration-300 max-w-xs w-full relative group transform ${rotationClass} hover:rotate-0 hover:scale-105 hover:z-20`}
                    key={i}
                  >
                    {/* Paper texture overlay */}
                    <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/rice-paper-2.png")' }} />

                    {/* Decorative corner with sunburst/clover feel and centered favicon art */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full transition-transform group-hover:scale-[2] duration-700 ease-out flex items-center justify-center z-0">
                      <img
                        src="/favicon.png"
                        alt="Atzengold Logo"
                        className="w-[75%] h-[75%] object-contain opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                      />
                    </div>

                    <div className="text-body-md font-medium leading-relaxed text-ink-secondary dark:text-canvas/80 relative z-10">{text}</div>
                    <div className="flex items-center gap-4 mt-8 relative z-10">
                      <div className="relative">
                        {/* Misregistration image effect on hover */}
                        <div className="absolute inset-0 bg-accent rounded-full opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 group-hover:translate-y-1.5 transition-all duration-300 ease-out" />
                        <div className="absolute inset-0 bg-primary rounded-full opacity-0 group-hover:opacity-100 group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 transition-all duration-300 ease-out" />
                        <img
                           width={48}
                           height={48}
                           src={image}
                           alt={name}
                           className="h-12 w-12 rounded-full object-cover border-2 border-canvas dark:border-brand-dark-900 relative z-10 filter grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:border-transparent"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="font-bold text-sm tracking-tight text-ink dark:text-canvas leading-tight uppercase">{name}</div>
                        <div className="text-caption text-ink-mute dark:text-canvas/50 mt-0.5">{role}</div>
                        {untappdUrl && (
                          <a
                            href={untappdUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-caption text-accent hover:underline mt-1 inline-block relative z-20"
                          >
                            via Untappd ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
