import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { id: 'about', label: 'About', href: '#about' },
  { id: 'disciplines', label: 'Disciplines', href: '#disciplines' },
  {
    id: 'perspective',
    label: 'Our Creative Perspective',
    href: '#perspective',
  },
  { id: 'approach', label: 'Approach', href: '#approach' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

interface NavbarProps {
  currentRoute?: string;
  onNavigateHomeSection?: (sectionId: string) => void;
}

export function Navbar({ currentRoute = '/', onNavigateHomeSection }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('hero');

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (currentRoute !== '/') {
      setActiveId('');
      return;
    }

    const sectionIds = ['hero', ...NAV_LINKS.map((l) => l.id)];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveId(visibleEntry.target.id);
        }
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0.1, 0.35, 0.6] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [currentRoute]);

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setMenuOpen(false);

    if (currentRoute !== '/' && onNavigateHomeSection) {
      onNavigateHomeSection(targetId);
      return;
    }

    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (targetId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePointerSpotlight = (event: React.PointerEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const xPct = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100));
    event.currentTarget.style.setProperty('--spot-x', `${xPct.toFixed(1)}%`);
    event.currentTarget.style.setProperty('--spot-y', `${yPct.toFixed(1)}%`);
  };

  return (
    <>
      <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-20 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] max-w-[1000px] rounded-full bg-white/[0.12] backdrop-blur-md border border-white/25 px-4 sm:px-7 py-1.5 md:py-1 flex items-center justify-between gap-4 sm:gap-6 shadow-[0_8px_24px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.28)]">
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, 'hero')}
          onPointerEnter={handlePointerSpotlight}
          onPointerMove={handlePointerSpotlight}
          className="group relative min-h-[44px] inline-flex items-center text-[14px] sm:text-[15px] font-medium tracking-[0.14em] text-white uppercase whitespace-nowrap shrink-0 transition-transform duration-200 active:scale-[0.97] motion-reduce:transition-none"
        >
          <span className="relative inline-grid py-[2px] leading-[1.2]">
            <span className="col-start-1 row-start-1 text-white transition-opacity duration-250 ease-out group-hover:opacity-0 group-focus-visible:opacity-0 motion-reduce:transition-none motion-reduce:group-hover:opacity-100">
              NOVA STUDIO
            </span>
            <span
              aria-hidden="true"
              className="col-start-1 row-start-1 nav-hover-prism opacity-0 transition-opacity duration-250 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:hidden"
            >
              NOVA STUDIO
            </span>
          </span>
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-5 lg:gap-7 text-[13px] font-normal text-[#f5f3ee]/80"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.id)}
                onPointerEnter={handlePointerSpotlight}
                onPointerMove={handlePointerSpotlight}
                className={`group relative min-h-[44px] inline-flex items-center whitespace-nowrap shrink-0 transition-[color,transform] duration-200 active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100 ${
                  isActive
                    ? 'text-[#d6b98c]'
                    : 'text-[#f5f3ee]/90 hover:text-[#f7e7cc]'
                }`}
              >
                <span className="relative inline-flex items-center py-1">
                  {/* Frosted glass & cursor-reactive spotlight pill */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -inset-x-2.5 -inset-y-1 rounded-full border transition-[transform,opacity,background-color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                      isActive
                        ? 'scale-100 opacity-100 bg-[#d6b98c]/[0.16] border-[#d6b98c]/35 shadow-[inset_0_1px_0_rgba(247,231,204,0.22)] nav-pill-spotlight'
                        : 'scale-95 opacity-0 nav-pill-spotlight border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100'
                    }`}
                  />

                  {/* Cursor-reactive color-shifting text overlay */}
                  <span className="relative z-10 inline-grid py-[2px] leading-[1.2]">
                    <span className="col-start-1 row-start-1 transition-opacity duration-250 ease-out group-hover:opacity-0 group-focus-visible:opacity-0 motion-reduce:transition-none motion-reduce:group-hover:opacity-100">
                      {link.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="col-start-1 row-start-1 nav-hover-prism opacity-0 transition-opacity duration-250 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:hidden"
                    >
                      {link.label}
                    </span>
                  </span>

                  {/* Champagne hairline sweep underline */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute left-0 right-0 -bottom-0.5 h-[1px] bg-gradient-to-r from-[#d6b98c] via-[#fff1c4] to-[#ff7d73] origin-left transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                      isActive
                        ? 'scale-x-100 opacity-100'
                        : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-90 group-focus-visible:scale-x-100 group-focus-visible:opacity-90'
                    }`}
                  />
                </span>
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-overlay"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-11 h-11 -mr-1.5 cursor-pointer shrink-0 rounded-full"
        >
          <span
            className={`block w-5 h-[1.5px] bg-[#f5f3ee] transition-transform duration-200 ${
              menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-[#f5f3ee] transition-opacity duration-200 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-[#f5f3ee] transition-transform duration-200 ${
              menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''
            }`}
          />
        </button>
      </header>

      <div
        id="mobile-nav-overlay"
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-[19] bg-[#0c0c0e]/95 backdrop-blur-md flex flex-col justify-center items-start px-6 sm:px-8 py-24 overflow-y-auto md:hidden transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav aria-label="Mobile navigation" className="flex flex-col items-start gap-3 w-full">
          {NAV_LINKS.map((link, index) => (
            <a
              key={link.id}
              href={link.href}
              tabIndex={menuOpen ? 0 : -1}
              onClick={(e) => handleNavClick(e, link.id)}
              className="group flex items-baseline gap-4 min-h-[48px] py-2 w-full text-[22px] sm:text-[28px] font-light text-[#f5f3ee] hover:text-[#d6b98c] transition-colors"
            >
              <span className="text-[13px] tabular-nums text-[#d6b98c]/80">
                0{index + 1}
              </span>
              <span>{link.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
