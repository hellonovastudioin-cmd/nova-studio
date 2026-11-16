import { AnimatedButton } from './AnimatedButton';
import { Reveal } from './Reveal';

export function Footer() {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full py-12 sm:py-16 px-5 sm:px-8 md:px-10">
      <div className="mx-auto max-w-[1160px] flex flex-col gap-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <Reveal delay={0} distance="sm" threshold={0.02} rootMargin="0px">
            <div className="max-w-md">
              <div className="text-[14px] tracking-[0.16em] uppercase text-[#f7e7cc] font-medium mb-3">
                NOVA STUDIO
              </div>
              <p className="font-[family-name:var(--font-display)] text-[24px] sm:text-[28px] leading-[1.2] text-white font-normal">
                We build visual worlds for brands with something meaningful to say.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100} distance="sm" threshold={0.02} rootMargin="0px">
            <AnimatedButton
              onClick={handleBackToTop}
              label="Back to top"
              variant="glass"
              iconDirection="up"
              className="self-start md:self-auto"
            />
          </Reveal>
        </div>

        <Reveal delay={160} distance="sm" threshold={0.02} rootMargin="0px">
          <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px] text-white/65">
            <span>© 2026 NOVA STUDIO. All rights reserved.</span>
            <span>Email &amp; social channels will appear once supplied.</span>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
