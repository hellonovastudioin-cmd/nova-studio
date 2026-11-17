import { MouseEvent } from 'react';
import { AppRoutePath, LEGAL_PAGES, LEGAL_ROUTES } from '../data/legalContent';
import { AnimatedButton } from './AnimatedButton';
import { Reveal } from './Reveal';

interface FooterProps {
  currentRoute?: string;
  onNavigate?: (path: AppRoutePath) => void;
}

export function Footer({ currentRoute = '/', onNavigate }: FooterProps) {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLegalClick = (
    event: MouseEvent<HTMLAnchorElement>,
    path: AppRoutePath
  ) => {
    if (!onNavigate || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    onNavigate(path);
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
          <div className="pt-6 border-t border-white/15 flex flex-col gap-4">
            <nav
              aria-label="Legal and policy navigation"
              className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[12px]"
            >
              {LEGAL_ROUTES.map((path) => {
                const isActive = currentRoute === path;
                return (
                  <a
                    key={path}
                    href={path}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(e) => handleLegalClick(e, path)}
                    className={`min-h-[44px] inline-flex items-center transition-colors ${
                      isActive
                        ? 'text-[#f7e7cc] underline decoration-[#d6b98c]/60 underline-offset-4'
                        : 'text-white/75 hover:text-[#f7e7cc]'
                    }`}
                  >
                    {LEGAL_PAGES[path].navLabel}
                  </a>
                );
              })}
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px] text-white/65">
              <span>© 2026 NOVA STUDIO. All rights reserved.</span>
              <span>
                Creative Production Agency · India ·{' '}
                <a
                  href="mailto:hello.novastudio.in@gmail.com"
                  className="text-white/80 hover:text-[#f7e7cc] underline decoration-white/25 underline-offset-4 transition-colors"
                >
                  hello.novastudio.in@gmail.com
                </a>
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
