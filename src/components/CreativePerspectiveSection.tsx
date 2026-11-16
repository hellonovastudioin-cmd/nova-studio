import { ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';
import { Reveal } from './Reveal';

export interface CreativeStudy {
  id: string;
  index: string;
  title: string;
  lens: string;
  summary: string;
  notes: string;
}

export const CREATIVE_STUDIES: CreativeStudy[] = [
  {
    id: 'study-chiaroscuro',
    index: 'Study I',
    title: 'Chiaroscuro & Pacing',
    lens: 'Light · Motion Grammar',
    summary:
      'An exploration of shadow ratios, warm specular falloff, and restrained temporal cadence in moving image.',
    notes:
      'Built around calibrated contrast curves, atmospheric darkness, and deliberate negative space so motion holds weight without clutter.',
  },
  {
    id: 'study-typography',
    index: 'Study II',
    title: 'Typographic Architecture',
    lens: 'Editorial Form · Hierarchy',
    summary:
      'Balancing classical serif cadence with stark neo-grotesque discipline to let language carry visual authority.',
    notes:
      'Pairs Cormorant Garamond editorial rhythm with precision tabular spacing and hairline rules to frame complex ideas cleanly.',
  },
  {
    id: 'study-depth',
    index: 'Study III',
    title: 'Spatial Depth & Glass',
    lens: 'Surface · Refraction',
    summary:
      'Translucent frosted planes suspended over warm light sources to create tactile separation in digital space.',
    notes:
      'Uses subtle blur, crisp hairline edges, and quiet layering so interactive surfaces feel dimensional without distracting from content.',
  },
  {
    id: 'study-chromatic',
    index: 'Study IV',
    title: 'Chromatic Restraint',
    lens: 'Color System · Tone',
    summary:
      'A disciplined tonal spectrum moving from deep obsidian through warm champagne to embers of studio crimson.',
    notes:
      'Demonstrates how a narrow, intentional palette unifies film, stills, and digital interfaces into one unmistakable atmosphere.',
  },
];

interface ExhibitCardProps {
  study: CreativeStudy;
  spanClass: string;
  staggerDelay?: 0 | 100;
  metaLabel: string;
  visual: ReactNode;
  onSelect: (study: CreativeStudy) => void;
}

function ExhibitCard({
  study,
  spanClass,
  staggerDelay = 0,
  metaLabel,
  visual,
  onSelect,
}: ExhibitCardProps) {
  const { ref, visible } = useReveal<HTMLDivElement>({
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px',
  });

  const delayClass = staggerDelay === 100 ? 'lg:delay-100' : 'delay-0';

  return (
    <div
      ref={ref}
      className={`${spanClass} transition-[opacity,transform] duration-700 ${delayClass} ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform] motion-reduce:transition-none motion-reduce:transform-none ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(study)}
        className="group text-left w-full rounded-3xl bg-white/[0.10] backdrop-blur-xl border border-white/25 shadow-[0_16px_44px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.28)] p-5 sm:p-8 cursor-pointer transition-colors duration-200 hover:bg-white/[0.14] hover:border-white/40"
      >
        {visual}

        <div
          className={`flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 transition-[opacity,transform] duration-700 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h3 className="text-[19px] sm:text-[20px] font-medium text-white group-hover:text-[#f7e7cc] transition-colors">
            {study.title}
          </h3>
          <span className="text-[11px] sm:text-[12px] tracking-[0.12em] uppercase text-[#f7e7cc]/90 shrink-0">
            {metaLabel}
          </span>
        </div>

        <p
          className={`mt-2 text-[14px] text-white/78 leading-relaxed max-w-xl transition-[opacity,transform] duration-700 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {study.summary}
        </p>
      </button>
    </div>
  );
}

interface CreativePerspectiveSectionProps {
  onSelectStudy: (study: CreativeStudy) => void;
}

export function CreativePerspectiveSection({
  onSelectStudy,
}: CreativePerspectiveSectionProps) {
  return (
    <section
      id="creative-perspective"
      aria-labelledby="perspective-heading"
      className="relative w-full py-14 sm:py-20 lg:py-24 px-5 sm:px-8 md:px-10"
    >
      <div className="mx-auto max-w-[1160px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-16">
          <div>
            <Reveal delay={0} distance="sm">
              <p className="text-[12px] tracking-[0.2em] uppercase text-[#f7e7cc] mb-4">
                03 · Our Creative Perspective
              </p>
            </Reveal>
            <Reveal delay={75} distance="md">
              <h2
                id="perspective-heading"
                className="font-[family-name:var(--font-display)] text-[clamp(2.15rem,8vw,2.65rem)] sm:text-[48px] lg:text-[56px] leading-[1.05] sm:leading-[1.04] tracking-[-0.02em] font-normal text-white [text-wrap:balance]"
              >
                An exhibition of <span className="italic text-[#f7e7cc]">atmosphere</span>,
                type, and form.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={150} distance="md">
            <p className="text-[14px] sm:text-[15px] text-white/80 max-w-sm leading-relaxed">
              Internal visual experiments and typographic treatments expressing how NOVA STUDIO
              thinks about light and composition.
            </p>
          </Reveal>
        </div>

        {/* Frosted glassmorphism exhibition panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-9 items-start">
          <ExhibitCard
            study={CREATIVE_STUDIES[0]}
            spanClass="lg:col-span-8"
            metaLabel={CREATIVE_STUDIES[0].lens}
            onSelect={onSelectStudy}
            visual={
              <div className="relative h-52 sm:h-72 w-full overflow-hidden border-t border-b border-white/20 bg-[radial-gradient(ellipse_at_72%_38%,rgba(247,231,204,0.24)_0%,rgba(200,4,14,0.14)_45%,transparent_78%)] flex flex-col justify-between py-5 sm:py-6 px-2 sm:px-4 mb-5 sm:mb-6">
                <div className="pointer-events-none absolute inset-y-0 left-[22%] w-[1px] bg-white/15" />
                <div className="pointer-events-none absolute inset-y-0 right-[22%] w-[1px] bg-white/15" />
                <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#f7e7cc]/40 to-transparent" />

                <div className="relative z-10 flex items-center justify-between gap-2 text-[10px] sm:text-[11px] tracking-[0.16em] uppercase text-white/70">
                  <span className="text-[#f7e7cc]">Exhibit 01 · Chiaroscuro</span>
                  <span className="shrink-0">2.39 : 1 Frame</span>
                </div>

                <div className="relative z-10 my-auto">
                  <p className="font-[family-name:var(--font-display)] text-[36px] sm:text-[56px] lg:text-[62px] leading-[0.98] sm:leading-[0.96] tracking-[-0.02em] text-white group-hover:text-[#f7e7cc] transition-colors">
                    Light as <span className="italic text-[#f7e7cc]">narrative.</span>
                  </p>
                </div>

                <div className="relative z-10 flex items-center gap-4">
                  <span className="h-[1px] w-14 bg-[#f7e7cc]" />
                  <span className="text-[11px] tracking-[0.16em] uppercase text-white/60">
                    Motion &amp; Specular Study
                  </span>
                </div>
              </div>
            }
          />

          <ExhibitCard
            study={CREATIVE_STUDIES[1]}
            spanClass="lg:col-span-4 lg:mt-14"
            staggerDelay={100}
            metaLabel={CREATIVE_STUDIES[1].index}
            onSelect={onSelectStudy}
            visual={
              <div className="relative h-56 sm:h-64 w-full overflow-hidden border-t border-b border-white/20 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:100%_24px] py-5 px-2 mb-6 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] tracking-[0.18em] uppercase text-white/65">
                  <span className="text-[#f7e7cc]">Exhibit 02</span>
                  <span>Specimen</span>
                </div>

                <div className="my-auto flex items-baseline gap-3 sm:gap-4">
                  <span className="font-[family-name:var(--font-display)] text-[62px] sm:text-[78px] leading-none text-white group-hover:text-[#f7e7cc] transition-colors shrink-0">
                    Aa
                  </span>
                  <span className="font-[family-name:var(--font-display)] italic text-[17px] sm:text-[19px] text-white/85 leading-snug">
                    Restraint gives weight to every frame.
                  </span>
                </div>

                <div className="text-[11px] tracking-[0.18em] uppercase text-white/60">
                  Editorial Hierarchy
                </div>
              </div>
            }
          />

          <ExhibitCard
            study={CREATIVE_STUDIES[2]}
            spanClass="lg:col-span-5"
            metaLabel={CREATIVE_STUDIES[2].lens}
            onSelect={onSelectStudy}
            visual={
              <div className="relative h-48 sm:h-52 w-full overflow-hidden border-t border-b border-white/20 mb-5 sm:mb-6 flex items-center justify-center">
                <div className="pointer-events-none absolute w-44 h-44 rounded-full bg-[radial-gradient(circle,rgba(247,231,204,0.25),transparent_68%)] transition-transform duration-500 group-hover:scale-110" />
                <div className="relative flex items-center justify-center">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-white/25" />
                  <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[#f7e7cc]/65" />
                  <div className="absolute w-24 h-14 sm:w-28 sm:h-16 rounded-full border border-white/35 bg-white/[0.08] backdrop-blur-sm rotate-[-14deg]" />
                </div>
              </div>
            }
          />

          <ExhibitCard
            study={CREATIVE_STUDIES[3]}
            spanClass="lg:col-span-7"
            staggerDelay={100}
            metaLabel={CREATIVE_STUDIES[3].lens}
            onSelect={onSelectStudy}
            visual={
              <div className="relative min-h-[13rem] w-full overflow-hidden border-t border-b border-white/20 mb-5 sm:mb-6 py-5 flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between gap-2 text-[10px] sm:text-[11px] tracking-[0.16em] uppercase text-white/65">
                  <span className="text-[#f7e7cc]">Exhibit 04 · Tonal Spectrum</span>
                  <span className="shrink-0">Inspect study →</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 h-32 sm:h-24 w-full overflow-hidden rounded-lg border border-white/20">
                  <div className="bg-gradient-to-b from-[#1a1a1f]/90 to-[#0c0c0e]/95 flex items-end p-2.5 sm:p-3">
                    <span className="text-[10px] tracking-[0.14em] uppercase text-white/70">
                      Obsidian
                    </span>
                  </div>
                  <div className="bg-gradient-to-b from-[#2b2927]/85 to-[#141417]/95 border-l border-white/15 flex items-end p-2.5 sm:p-3">
                    <span className="text-[10px] tracking-[0.14em] uppercase text-white/80">
                      Charcoal
                    </span>
                  </div>
                  <div className="bg-gradient-to-b from-[#d6b98c]/75 to-[#4f422f]/65 border-t sm:border-t-0 sm:border-l border-white/15 flex items-end p-2.5 sm:p-3">
                    <span className="text-[10px] tracking-[0.14em] uppercase text-white">
                      Champagne
                    </span>
                  </div>
                  <div className="bg-gradient-to-b from-[#c8040e]/75 to-[#360509]/80 border-t sm:border-t-0 border-l border-white/15 flex items-end p-2.5 sm:p-3">
                    <span className="text-[10px] tracking-[0.14em] uppercase text-white/90">
                      Crimson
                    </span>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}
