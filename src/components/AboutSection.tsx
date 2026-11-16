import { Reveal } from './Reveal';

export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative z-[2] w-full py-14 sm:py-20 lg:py-24 px-5 sm:px-8 md:px-10 bg-transparent"
    >
      <div className="mx-auto max-w-[1160px]">
        {/* Dedicated left column keeping the right-side 3D character unobstructed */}
        <div className="max-w-[540px] [text-shadow:0_1px_12px_rgba(0,0,0,0.22)] lg:[text-shadow:none]">
          <Reveal delay={0} distance="sm">
            <p className="text-[12px] tracking-[0.2em] uppercase text-[#f7e7cc] mb-4 sm:mb-5">
              01 · About
            </p>
          </Reveal>

          <Reveal delay={75} distance="md">
            <h2
              id="about-heading"
              className="font-[family-name:var(--font-display)] text-[clamp(2.25rem,8.5vw,2.75rem)] sm:text-[52px] lg:text-[58px] leading-[1.04] sm:leading-[1.03] tracking-[-0.02em] font-normal text-white mb-6 sm:mb-7 [text-wrap:balance]"
            >
              Shaped by <span className="italic text-[#f7e7cc]">light</span>, pacing, and quiet
              conviction.
            </h2>
          </Reveal>

          <Reveal delay={150} distance="md">
            <p className="text-[16px] sm:text-[18px] leading-[1.65] text-white/95 mb-5 font-light">
              NOVA STUDIO is an independent creative production studio working across film,
              photography, digital experiences, and brand campaigns.
            </p>
          </Reveal>

          <Reveal delay={200} distance="md">
            <p className="text-[15px] sm:text-[16px] leading-[1.7] text-white/85 mb-8">
              Guided by restraint, we partner with brands from early creative direction through
              final production—stripping away noise until every frame carries intention.
            </p>
          </Reveal>

          <Reveal delay={240} distance="sm">
            <div className="pt-6 border-t border-white/25 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[13px] text-white/75">
              <span className="font-[family-name:var(--font-display)] italic text-[19px] sm:text-[22px] text-[#f7e7cc]">
                Form follows meaning.
              </span>
              <span className="tracking-[0.16em] uppercase text-[11px] text-white/70">
                NOVA STUDIO
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
