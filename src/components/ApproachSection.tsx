import { useReveal } from '../hooks/useReveal';
import { Reveal } from './Reveal';

const APPROACH_STEPS = [
  {
    number: '01',
    title: 'Discover',
    explanation: 'Aligning on brand context, audience, and creative intent before form.',
  },
  {
    number: '02',
    title: 'Concept',
    explanation: 'Translating clarity into a distinct aesthetic language and treatment.',
  },
  {
    number: '03',
    title: 'Create',
    explanation: 'Directing film, imagery, and digital craft with tactile precision.',
  },
  {
    number: '04',
    title: 'Deliver',
    explanation: 'Finishing and mastering every visual asset cleanly for release.',
  },
];

const DESKTOP_STEP_DELAYS = ['delay-0', 'delay-100', 'delay-200', 'delay-300'];

function MobileApproachStep({ step }: { step: (typeof APPROACH_STEPS)[number] }) {
  const { ref, visible } = useReveal<HTMLDivElement>({
    threshold: 0.16,
    rootMargin: '0px 0px -40px 0px',
  });

  return (
    <div ref={ref} className="relative">
      <span
        aria-hidden="true"
        className={`absolute -left-[40.5px] top-1.5 inline-flex items-center justify-center w-6 h-6 rounded-full border border-[#f7e7cc]/60 bg-black/30 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#f7e7cc]" />
      </span>

      <div
        className={`font-[family-name:var(--font-display)] text-[32px] leading-none tabular-nums text-[#f7e7cc] mb-2 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {step.number}
      </div>

      <h3
        className={`font-[family-name:var(--font-display)] text-[28px] leading-tight font-normal text-white mb-2 transition-[opacity,transform] duration-700 delay-75 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        {step.title}
      </h3>

      <p
        className={`text-[14px] leading-[1.65] text-white/80 max-w-md transition-[opacity,transform] duration-700 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        {step.explanation}
      </p>
    </div>
  );
}

export function ApproachSection() {
  const { ref: timelineRef, visible: timelineVisible } = useReveal<HTMLDivElement>({
    threshold: 0.14,
    rootMargin: '0px 0px -48px 0px',
  });

  return (
    <section
      id="approach"
      aria-labelledby="approach-heading"
      className="relative w-full py-14 sm:py-20 lg:py-24 px-5 sm:px-8 md:px-10"
    >
      <div className="mx-auto max-w-[1160px]">
        <div className="max-w-2xl mb-10 sm:mb-16">
          <Reveal delay={0} distance="sm">
            <p className="text-[12px] tracking-[0.2em] uppercase text-[#f7e7cc] mb-4">
              04 · Our Approach
            </p>
          </Reveal>
          <Reveal delay={75} distance="md">
            <h2
              id="approach-heading"
              className="font-[family-name:var(--font-display)] text-[clamp(2.15rem,8vw,2.65rem)] sm:text-[48px] lg:text-[56px] leading-[1.05] sm:leading-[1.04] tracking-[-0.02em] font-normal text-white [text-wrap:balance]"
            >
              Four deliberate movements from <span className="italic text-[#f7e7cc]">insight</span>{' '}
              to release.
            </h2>
          </Reveal>
        </div>

        {/* Frosted glassmorphism timeline container */}
        <div
          ref={timelineRef}
          className={`rounded-3xl bg-white/[0.09] backdrop-blur-xl border border-white/25 shadow-[0_16px_44px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.28)] p-6 sm:p-10 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none ${
            timelineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Desktop horizontal timeline */}
          <div className="hidden lg:block relative">
            <div
              aria-hidden="true"
              className={`absolute top-[74px] left-0 right-0 h-[1px] bg-gradient-to-r from-[#f7e7cc]/60 via-white/30 to-[#f7e7cc]/60 origin-left transition-transform duration-1000 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none ${
                timelineVisible ? 'scale-x-100' : 'scale-x-0'
              }`}
            />

            <div className="grid grid-cols-4 gap-10">
              {APPROACH_STEPS.map((step, index) => (
                <div
                  key={step.number}
                  className={`relative transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none ${
                    DESKTOP_STEP_DELAYS[index] ?? 'delay-300'
                  } ${timelineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                >
                  <div className="font-[family-name:var(--font-display)] text-[44px] leading-none font-normal tabular-nums text-[#f7e7cc] mb-5">
                    {step.number}
                  </div>

                  <div className="relative flex items-center mb-8">
                    <span
                      aria-hidden="true"
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-[#f7e7cc]/60 bg-black/30 backdrop-blur-sm"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#f7e7cc]" />
                    </span>
                  </div>

                  <h3 className="font-[family-name:var(--font-display)] text-[32px] leading-tight font-normal tracking-[-0.01em] text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[14px] leading-[1.65] text-white/80 max-w-[23ch]">
                    {step.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile & Tablet vertical timeline */}
          <div className="lg:hidden relative ml-2 pl-7 border-l border-[#f7e7cc]/40 space-y-9">
            {APPROACH_STEPS.map((step) => (
              <MobileApproachStep key={step.number} step={step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
