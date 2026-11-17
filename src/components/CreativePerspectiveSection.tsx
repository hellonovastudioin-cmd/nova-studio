import { ReactNode } from 'react';
import { Reveal } from './Reveal';

export interface CreativeStudy {
  id: string;
  index: string;
  title: string;
  lens: string;
  summary: string;
  notes: string;
}

export const CREATIVE_STUDIES: CreativeStudy[] = [];

interface PerspectiveCardProps {
  number: string;
  title: string;
  sentence: string;
  visual: ReactNode;
  caption: string;
  staggerDelay?: 0 | 100;
}

function PerspectiveCard({
  number,
  title,
  sentence,
  visual,
  caption,
  staggerDelay = 0,
}: PerspectiveCardProps) {
  return (
    <Reveal delay={staggerDelay} distance="md" className="h-full">
      <article className="group h-full flex flex-col justify-between rounded-3xl bg-white/[0.10] backdrop-blur-xl border border-white/25 shadow-[0_16px_44px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.28)] p-5 sm:p-8 transition-[transform,background-color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:bg-white/[0.14] hover:border-white/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
        <div>
          <div className="mb-5 sm:mb-6">
            <span className="inline-block text-[12px] tracking-[0.18em] uppercase text-[#f7e7cc] mb-2">
              {number}
            </span>
            <h3 className="font-[family-name:var(--font-display)] text-[28px] sm:text-[32px] leading-[1.1] tracking-[-0.015em] font-normal text-white group-hover:text-[#f7e7cc] transition-colors mb-2.5">
              {title}
            </h3>
            <p className="text-[16px] leading-[1.6] text-white/90">{sentence}</p>
          </div>

          <div className="border-t border-b border-white/20 py-5 mb-4">
            {visual}
          </div>

          <p className="text-[16px] leading-[1.5] text-[#f7e7cc] font-medium">{caption}</p>
        </div>

        <p className="mt-4 pt-3 border-t border-white/15 text-[12px] tracking-[0.06em] text-white/65">
          Example style, not client work
        </p>
      </article>
    </Reveal>
  );
}

interface CoffeeCupSvgProps {
  variant: 'flat' | 'cinematic';
}

function CoffeeCupSvg({ variant }: CoffeeCupSvgProps) {
  const isFlat = variant === 'flat';
  const uid = isFlat ? 'flat' : 'cinematic';

  return (
    <svg
      viewBox="0 0 120 100"
      className="w-24 h-20 sm:w-28 sm:h-24"
      role="img"
      aria-label={
        isFlat ? 'Coffee cup in bright flat grey tones' : 'Coffee cup with dark warm cinematic glow'
      }
    >
      <defs>
        <radialGradient id={`cup-glow-${uid}`} cx="62%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#f7e7cc" stopOpacity="0.42" />
          <stop offset="55%" stopColor="#c8040e" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0c0c0e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`cup-body-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          {isFlat ? (
            <>
              <stop offset="0%" stopColor="#b8b8be" />
              <stop offset="100%" stopColor="#9d9da4" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#f7e7cc" />
              <stop offset="48%" stopColor="#8a6c46" />
              <stop offset="100%" stopColor="#1b1512" />
            </>
          )}
        </linearGradient>
      </defs>

      {!isFlat && <circle cx="66" cy="44" r="44" fill={`url(#cup-glow-${uid})`} />}

      {/* Saucer */}
      <ellipse
        cx="58"
        cy="80"
        rx="32"
        ry="6.5"
        fill={isFlat ? '#9e9ea6' : '#211815'}
        stroke={isFlat ? '#7d7d85' : '#d6b98c'}
        strokeOpacity={isFlat ? 0.55 : 0.45}
        strokeWidth="1.2"
      />

      {/* Cup handle */}
      <path
        d="M80 46 C92 46, 94 64, 78 66"
        fill="none"
        stroke={isFlat ? '#9d9da4' : '#c9ab7e'}
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Cup body */}
      <path
        d="M34 38 L82 38 L76 74 C75 78, 41 78, 40 74 Z"
        fill={`url(#cup-body-${uid})`}
        stroke={isFlat ? '#82828a' : '#f7e7cc'}
        strokeOpacity={isFlat ? 0.5 : 0.4}
        strokeWidth="1.2"
      />

      {/* Coffee surface */}
      <ellipse
        cx="58"
        cy="38"
        rx="24"
        ry="5.5"
        fill={isFlat ? '#7e7e86' : '#2a1810'}
        stroke={isFlat ? '#b8b8be' : '#f7e7cc'}
        strokeOpacity={isFlat ? 0.6 : 0.65}
        strokeWidth="1"
      />

      {/* Subtle steam for cinematic mood */}
      {!isFlat && (
        <g fill="none" stroke="#f7e7cc" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round">
          <path d="M51 28 C48 22, 54 18, 51 12" />
          <path d="M62 27 C65 21, 59 17, 62 11" />
        </g>
      )}
    </svg>
  );
}

interface CreativePerspectiveSectionProps {
  onSelectStudy?: (study: CreativeStudy) => void;
}

export function CreativePerspectiveSection(_props: CreativePerspectiveSectionProps) {
  return (
    <section
      id="perspective"
      aria-labelledby="perspective-heading"
      className="relative w-full py-14 sm:py-20 lg:py-24 px-5 sm:px-8 md:px-10"
    >
      <div className="mx-auto max-w-[1160px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
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
                How We Think About <span className="italic text-[#f7e7cc]">Your Brand</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={150} distance="md">
            <p className="text-[16px] text-white/85 max-w-sm leading-relaxed">
              Four things we focus on to make your brand look and feel right.
            </p>
          </Reveal>
        </div>

        {/* 2x2 Grid on desktop, 1 column on mobile — preserving exact frosted glass card style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* 01 */}
          <PerspectiveCard
            number="01"
            title="Lighting sets the mood."
            sentence="Light decides if a video feels calm, exciting, or serious."
            caption="Same product. Different feeling."
            staggerDelay={0}
            visual={
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="rounded-2xl bg-[#e4e4e7] border border-white/40 p-3 flex flex-col items-center justify-between min-h-[138px]">
                  <CoffeeCupSvg variant="flat" />
                  <span className="mt-1 text-[13px] font-medium text-[#27272a]">Flat</span>
                </div>
                <div className="rounded-2xl bg-[#110c0b] bg-[radial-gradient(circle_at_70%_28%,rgba(247,231,204,0.24),rgba(200,4,14,0.16)_52%,transparent_80%)] border border-[#d6b98c]/35 p-3 flex flex-col items-center justify-between min-h-[138px]">
                  <CoffeeCupSvg variant="cinematic" />
                  <span className="mt-1 text-[13px] font-medium text-[#f7e7cc]">Cinematic</span>
                </div>
              </div>
            }
          />

          {/* 02 */}
          <PerspectiveCard
            number="02"
            title="Words should be easy to read."
            sentence="Elegant headlines with clean body text make a brand look trusted."
            caption="Big headline, simple text."
            staggerDelay={100}
            visual={
              <div className="min-h-[138px] flex flex-col justify-center">
                <p className="font-[family-name:var(--font-display)] text-[26px] sm:text-[31px] leading-[1.12] text-white mb-2.5">
                  Restraint gives weight to every <span className="italic text-[#f7e7cc]">word.</span>
                </p>
                <p className="text-[16px] leading-[1.55] text-white/85">
                  A bold serif headline draws people in, while clean body copy lets them read your
                  story effortlessly.
                </p>
              </div>
            }
          />

          {/* 03 */}
          <PerspectiveCard
            number="03"
            title="Layers guide the eye."
            sentence="Soft shadows and stacked panels show people what to read first."
            caption="Top layer = read this first."
            staggerDelay={0}
            visual={
              <div className="min-h-[138px] flex flex-col justify-center">
                <div className="mx-auto w-full max-w-[310px]">
                  <div className="ml-6 rounded-xl border border-white/20 bg-white/[0.06] px-4 py-2 text-right shadow-[0_6px_18px_rgba(0,0,0,0.18)]">
                    <span className="text-[13px] text-white/70">Background</span>
                  </div>
                  <div className="-mt-2 ml-3 mr-3 rounded-xl border border-white/30 bg-white/[0.12] backdrop-blur-sm px-4 py-2.5 text-right shadow-[0_10px_24px_rgba(0,0,0,0.22)]">
                    <span className="text-[14px] text-white/90">Supporting details</span>
                  </div>
                  <div className="-mt-2 mr-5 rounded-xl border border-[#f7e7cc]/55 bg-white/[0.18] backdrop-blur-md px-4 py-3 shadow-[0_14px_30px_rgba(0,0,0,0.28)]">
                    <span className="text-[16px] font-medium text-white">Your main message</span>
                  </div>
                </div>
              </div>
            }
          />

          {/* 04 */}
          <PerspectiveCard
            number="04"
            title="Few colours, used on purpose."
            sentence="We use 3 to 4 colours everywhere, so your brand is recognised instantly."
            caption="Same colours on every page, video, and post."
            staggerDelay={100}
            visual={
              <div className="min-h-[138px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="rounded-xl bg-[#0c0c0e]/75 border border-white/20 p-3.5 flex-1 shadow-[0_10px_24px_rgba(0,0,0,0.25)]">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-[#d6b98c] mb-1">
                    Studio Poster
                  </div>
                  <div className="font-[family-name:var(--font-display)] text-[21px] leading-tight text-[#f7e7cc] mb-2.5">
                    Your Brand Story
                  </div>
                  <div className="inline-flex items-center rounded-full bg-[#c8040e] px-3.5 py-1 text-[13px] font-medium text-white">
                    Get in Touch
                  </div>
                </div>

                <ul className="space-y-2 shrink-0">
                  <li className="flex items-center gap-2.5 text-[14px] text-white/90">
                    <span
                      aria-hidden="true"
                      className="h-3.5 w-3.5 rounded-full bg-[#0c0c0e] border border-white/45 shrink-0"
                    />
                    <span>Main background</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[14px] text-white/90">
                    <span
                      aria-hidden="true"
                      className="h-3.5 w-3.5 rounded-full bg-[#f7e7cc] border border-white/30 shrink-0"
                    />
                    <span>Text</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[14px] text-white/90">
                    <span
                      aria-hidden="true"
                      className="h-3.5 w-3.5 rounded-full bg-[#d6b98c] border border-white/30 shrink-0"
                    />
                    <span>Highlight</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[14px] text-white/90">
                    <span
                      aria-hidden="true"
                      className="h-3.5 w-3.5 rounded-full bg-[#c8040e] border border-white/35 shrink-0"
                    />
                    <span>Button</span>
                  </li>
                </ul>
              </div>
            }
          />
        </div>

        <Reveal delay={150} distance="sm">
          <p className="mt-8 sm:mt-10 text-center text-[16px] text-[#f7e7cc]">
            The examples above show our style. Real project work coming soon.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

