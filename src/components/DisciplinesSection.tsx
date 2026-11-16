import { ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';
import { Reveal } from './Reveal';

interface DisciplineItem {
  number: string;
  title: string;
  description: string;
  graphic: ReactNode;
}

const DISCIPLINES: DisciplineItem[] = [
  {
    number: '01',
    title: 'Creative Direction',
    description:
      'Establishing the visual language, tone, and artistic cohesion that anchor every production.',
    graphic: (
      <svg viewBox="0 0 120 44" className="w-24 h-9 text-[#f7e7cc]" fill="none" aria-hidden="true">
        <circle cx="24" cy="22" r="13" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1" />
        <circle cx="40" cy="22" r="13" stroke="white" strokeOpacity="0.35" strokeWidth="1" />
        <line x1="54" y1="22" x2="110" y2="22" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Film & Video Production',
    description:
      'Directing narrative motion, brand films, and tactile moving imagery crafted for cinema and screen.',
    graphic: (
      <svg viewBox="0 0 120 44" className="w-24 h-9 text-[#f7e7cc]" fill="none" aria-hidden="true">
        <line x1="10" y1="10" x2="110" y2="10" stroke="white" strokeOpacity="0.35" strokeWidth="1" />
        <rect x="22" y="16" width="52" height="12" stroke="currentColor" strokeOpacity="0.75" strokeWidth="1" />
        <line x1="10" y1="34" x2="110" y2="34" stroke="white" strokeOpacity="0.35" strokeWidth="1" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Photography',
    description:
      'Editorial portraiture, campaign stills, and architectural studies guided by light and composition.',
    graphic: (
      <svg viewBox="0 0 120 44" className="w-24 h-9 text-[#f7e7cc]" fill="none" aria-hidden="true">
        <circle cx="60" cy="22" r="15" stroke="white" strokeOpacity="0.35" strokeWidth="1" />
        <circle cx="60" cy="22" r="7.5" stroke="currentColor" strokeOpacity="0.8" strokeWidth="1" />
        <line x1="20" y1="22" x2="100" y2="22" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Digital Content & Experiences',
    description:
      'Interactive environments, spatial motion, and responsive digital canvases built for immersion.',
    graphic: (
      <svg viewBox="0 0 120 44" className="w-24 h-9 text-[#f7e7cc]" fill="none" aria-hidden="true">
        <rect x="18" y="8" width="50" height="22" rx="2" stroke="white" strokeOpacity="0.35" strokeWidth="1" />
        <rect x="44" y="14" width="56" height="22" rx="2" stroke="currentColor" strokeOpacity="0.75" strokeWidth="1" />
      </svg>
    ),
  },
  {
    number: '05',
    title: 'Brand Campaigns',
    description:
      'Cohesive launch visual systems built to translate seamlessly across film, print, and digital media.',
    graphic: (
      <svg viewBox="0 0 120 44" className="w-24 h-9 text-[#f7e7cc]" fill="none" aria-hidden="true">
        <line x1="30" y1="36" x2="30" y2="14" stroke="white" strokeOpacity="0.4" strokeWidth="1.2" />
        <line x1="58" y1="36" x2="58" y2="6" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.4" />
        <line x1="86" y1="36" x2="86" y2="18" stroke="white" strokeOpacity="0.4" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    number: '06',
    title: 'Visual Storytelling',
    description:
      'Structuring atmosphere, pacing, and narrative cadence so every frame carries emotional weight.',
    graphic: (
      <svg viewBox="0 0 120 44" className="w-24 h-9 text-[#f7e7cc]" fill="none" aria-hidden="true">
        <path
          d="M12 32 C34 32, 42 12, 62 22 C82 32, 92 12, 110 14"
          stroke="currentColor"
          strokeOpacity="0.75"
          strokeWidth="1.1"
        />
        <circle cx="62" cy="22" r="2.5" fill="currentColor" />
      </svg>
    ),
  },
];

function DisciplineRow({ item }: { item: DisciplineItem }) {
  const { ref, visible } = useReveal<HTMLElement>({
    threshold: 0.14,
    rootMargin: '0px 0px -48px 0px',
  });

  return (
    <article ref={ref} className="group py-6 sm:py-8 border-b border-white/20">
      <div
        className={`flex items-center justify-between gap-4 mb-2.5 sm:mb-3 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <span className="text-[12px] tabular-nums tracking-[0.16em] text-[#f7e7cc]">
          {item.number}
        </span>
        <div className="opacity-85 group-hover:opacity-100 transition-opacity duration-300 shrink-0">
          {item.graphic}
        </div>
      </div>

      <h3
        className={`font-[family-name:var(--font-display)] text-[26px] sm:text-[32px] lg:text-[34px] leading-[1.1] sm:leading-[1.08] font-normal tracking-[-0.015em] text-white group-hover:text-[#f7e7cc] transition-[opacity,transform,color] duration-700 delay-75 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none mb-2 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        {item.title}
      </h3>

      <p
        className={`text-[14px] sm:text-[15px] leading-[1.65] text-white/85 max-w-md transition-[opacity,transform] duration-700 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        {item.description}
      </p>
    </article>
  );
}

export function DisciplinesSection() {
  return (
    <section
      id="disciplines"
      aria-labelledby="disciplines-heading"
      className="relative z-[2] w-full py-14 sm:py-20 lg:py-24 px-5 sm:px-8 md:px-10 bg-transparent"
    >
      <div className="mx-auto max-w-[1160px]">
        {/* Dedicated left column keeping the right-side 3D character completely unobstructed */}
        <div className="max-w-[560px] [text-shadow:0_1px_12px_rgba(0,0,0,0.22)] lg:[text-shadow:none]">
          <div className="mb-10 sm:mb-12">
            <Reveal delay={0} distance="sm">
              <p className="text-[12px] tracking-[0.2em] uppercase text-[#f7e7cc] mb-4">
                02 · Disciplines
              </p>
            </Reveal>
            <Reveal delay={75} distance="md">
              <h2
                id="disciplines-heading"
                className="font-[family-name:var(--font-display)] text-[clamp(2.15rem,8vw,2.65rem)] sm:text-[48px] lg:text-[54px] leading-[1.05] sm:leading-[1.04] tracking-[-0.02em] font-normal text-white mb-4 [text-wrap:balance]"
              >
                Six disciplines, one <span className="italic text-[#f7e7cc]">unified</span> craft.
              </h2>
            </Reveal>
            <Reveal delay={150} distance="md">
              <p className="text-[14px] sm:text-[15px] text-white/85 max-w-md leading-relaxed">
                Focused creative capabilities spanning concept, moving image, stills, and digital
                form.
              </p>
            </Reveal>
          </div>

          <div className="border-t border-white/25">
            {DISCIPLINES.map((item) => (
              <DisciplineRow key={item.number} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
