import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { ActionSheet } from './components/ActionSheet';
import { AnimatedButton } from './components/AnimatedButton';
import { ApproachSection } from './components/ApproachSection';
import { ContactSection } from './components/ContactSection';
import {
  CreativePerspectiveSection,
  CreativeStudy,
} from './components/CreativePerspectiveSection';
import { DisciplinesSection } from './components/DisciplinesSection';
import { Footer } from './components/Footer';
import { LegalPage } from './components/LegalPage';
import { Navbar } from './components/Navbar';
import { OfferingsSection, SelectedOffering } from './components/OfferingsSection';
import { PageLoader } from './components/PageLoader';
import { ScrubVideo } from './components/ScrubVideo';
import {
  AppRoutePath,
  ContactRequestCategory,
  isLegalRoute,
  LEGAL_PAGES,
  normalizePathname,
} from './data/legalContent';

const DEFAULT_DOCUMENT_TITLE = 'NOVA STUDIO — Creative Studio';

export default function App() {
  const [route, setRoute] = useState<string>(() =>
    typeof window !== 'undefined' ? normalizePathname(window.location.pathname) : '/'
  );
  const [pendingSection, setPendingSection] = useState<string | null>(null);
  const [selectedStudy, setSelectedStudy] = useState<CreativeStudy | null>(null);
  const [selectedOffering, setSelectedOffering] = useState<SelectedOffering | null>(null);
  const [requestedContactCategory, setRequestedContactCategory] =
    useState<ContactRequestCategory | null>(null);
  const [textVisible, setTextVisible] = useState(false);

  const isHomeRoute = route === '/';
  const legalRouteActive = isLegalRoute(route);

  useEffect(() => {
    const handlePopState = () => {
      const nextPath = normalizePathname(window.location.pathname);
      setRoute(nextPath);
      const hashTarget =
        nextPath === '/' && window.location.hash ? window.location.hash.slice(1) : null;
      setPendingSection(hashTarget);
      if (!hashTarget) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (route === '/') {
      document.title = DEFAULT_DOCUMENT_TITLE;
    } else if (isLegalRoute(route)) {
      document.title = LEGAL_PAGES[route].documentTitle;
    } else {
      document.title = 'Page Not Found — NOVA STUDIO';
    }
  }, [route]);

  useEffect(() => {
    if (!isHomeRoute || !pendingSection) return;
    const rafId = window.requestAnimationFrame(() => {
      if (pendingSection === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        document
          .getElementById(pendingSection)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setPendingSection(null);
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [isHomeRoute, pendingSection]);

  const navigateTo = useCallback(
    (path: AppRoutePath, sectionId?: string) => {
      const targetPath = normalizePathname(path);
      const nextUrl = sectionId && targetPath === '/' ? `/#${sectionId}` : targetPath;

      if (route !== targetPath) {
        window.history.pushState({}, '', nextUrl);
        setRoute(targetPath);
        setSelectedStudy(null);
      }

      if (targetPath === '/' && sectionId) {
        setPendingSection(sectionId);
        return;
      }

      setPendingSection(null);
      window.scrollTo({ top: 0, behavior: 'auto' });
    },
    [route]
  );

  const handleNavigateHomeSection = useCallback(
    (sectionId: string) => {
      navigateTo('/', sectionId);
    },
    [navigateTo]
  );

  const handleOpenContactRequest = useCallback(
    (category: ContactRequestCategory) => {
      setRequestedContactCategory(category);
      navigateTo('/', 'contact');
    },
    [navigateTo]
  );

  const handleLoaderReveal = () => {
    window.requestAnimationFrame(() => {
      setTextVisible(true);
    });
  };

  const handleSelectOffering = (offering: SelectedOffering) => {
    setSelectedOffering(offering);
    const contact = document.getElementById('contact');
    if (contact) {
      contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleExploreClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const target = document.getElementById('perspective');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDiscoverClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const target = document.getElementById('about');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-clip bg-[#c8040e] text-[#f5f3ee]">
      <PageLoader onRevealStart={handleLoaderReveal} />

      {/* Preserved fixed 3D character canvas on home route */}
      {isHomeRoute && <ScrubVideo />}

      {/* 1. Navigation */}
      <Navbar currentRoute={route} onNavigateHomeSection={handleNavigateHomeSection} />

      {isHomeRoute ? (
        <>
          {/* 2. Overview / Hero */}
          <main
            id="hero"
            className="relative z-[1] min-h-[100svh] sm:min-h-[680px] sm:h-screen max-h-[960px] flex flex-col justify-between gap-8 pt-20 sm:pt-24 pb-8 sm:pb-10 px-5 sm:px-8 md:px-10 overflow-hidden"
          >
            <div className="mx-auto w-full max-w-[1160px] my-auto">
              <div className="max-w-2xl">
                <p
                  className={`text-[11px] sm:text-[12px] tracking-[0.26em] uppercase text-[#d6b98c] mb-5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none ${
                    textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  NOVA STUDIO
                </p>

                <h1
                  className={`font-[family-name:var(--font-display)] text-white text-[clamp(2.85rem,12vw,3.75rem)] sm:text-[74px] lg:text-[90px] leading-[0.94] sm:leading-[0.92] tracking-[-0.025em] font-normal mb-5 sm:mb-6 transition-all duration-700 delay-75 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none [text-wrap:balance] [text-shadow:0_2px_18px_rgba(0,0,0,0.2)] lg:[text-shadow:none] ${
                    textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                  }`}
                >
                  Ideas made
                  <br />
                  <span className="italic text-[#f7e7cc] pl-0 sm:pl-6">visible.</span>
                </h1>

                <p
                  className={`text-white/90 text-[15px] sm:text-[17px] leading-[1.65] max-w-md mb-8 sm:mb-9 transition-all duration-700 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none [text-shadow:0_1px_12px_rgba(0,0,0,0.22)] lg:[text-shadow:none] ${
                    textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                  }`}
                >
                  A creative production studio shaping film, photography, digital experiences, and
                  visual worlds with quiet precision.
                </p>

                <div
                  className={`transition-all duration-700 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none ${
                    textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                  }`}
                >
                  <AnimatedButton
                    href="#perspective"
                    onClick={handleExploreClick}
                    label="Explore Our Work"
                    variant="dark"
                  />
                </div>
              </div>
            </div>

            {/* Animated editorial scroll cue bridging Hero into About */}
            <div
              className={`mx-auto w-full max-w-[1160px] transition-[opacity,transform] duration-700 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none ${
                textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <a
                href="#about"
                onClick={handleDiscoverClick}
                className="group inline-flex min-h-[44px] items-center gap-3.5 text-[11px] tracking-[0.2em] uppercase text-white/75 hover:text-[#f7e7cc] transition-colors duration-200 cursor-pointer"
              >
                {/* Animated frosted scroll capsule */}
                <span
                  aria-hidden="true"
                  className="relative inline-flex justify-center w-[20px] h-[32px] rounded-full border border-white/35 bg-white/[0.08] backdrop-blur-sm pt-[6px] group-hover:border-[#f7e7cc]/75 transition-colors duration-200 shrink-0"
                >
                  <span className="animate-scroll-cue w-[2px] h-[6px] rounded-full bg-[#f7e7cc] animate-[scrollCueTrack_1.9s_cubic-bezier(0.45,0,0.55,1)_infinite]" />
                </span>

                {/* Sweeping hairline rule */}
                <span
                  aria-hidden="true"
                  className="relative inline-block w-8 h-[1px] bg-white/25 overflow-hidden shrink-0"
                >
                  <span className="animate-scroll-cue absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-transparent via-[#f7e7cc] to-transparent animate-[scrollCueSweep_2.2s_ease-in-out_infinite]" />
                </span>

                <span>Scroll to discover</span>

                {/* Gentle downward arrow nudge */}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="animate-scroll-cue text-[#f7e7cc] animate-[scrollCueArrow_1.9s_ease-in-out_infinite] shrink-0"
                >
                  <path
                    d="M8 3.5v9M4.5 9.5 8 13l3.5-3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </main>

          {/* 3. About (Dedicated left column over open red backdrop) */}
          <AboutSection />

          {/* 4. Disciplines (Dedicated left column over open red backdrop) */}
          <DisciplinesSection />

          {/* Seamless frosted backdrop preserving exact #c8040e primary red continuity */}
          <div className="relative z-[2]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 backdrop-blur-md [mask-image:linear-gradient(to_bottom,transparent_0%,black_160px)]"
            />
            <div className="relative z-[1]">
              {/* 5. Our Creative Perspective */}
              <CreativePerspectiveSection onSelectStudy={setSelectedStudy} />

              {/* 6. Our Approach */}
              <ApproachSection />

              {/* 7. Packages & Retainers */}
              <OfferingsSection onSelectOffering={handleSelectOffering} />

              {/* 8. Contact */}
              <ContactSection
                selectedOffering={selectedOffering}
                onClearOffering={() => setSelectedOffering(null)}
                selectedRequestCategory={requestedContactCategory}
                onClearRequestCategory={() => setRequestedContactCategory(null)}
                onNavigate={navigateTo}
              />

              {/* 9. Footer */}
              <Footer currentRoute={route} onNavigate={navigateTo} />
            </div>
          </div>

          <ActionSheet study={selectedStudy} onClose={() => setSelectedStudy(null)} />
        </>
      ) : legalRouteActive ? (
        <div className="relative z-[2] min-h-screen flex flex-col justify-between bg-[radial-gradient(circle_at_top_right,rgba(20,20,23,0.45),rgba(12,12,14,0.68)_65%)]">
          <LegalPage
            route={route}
            onNavigate={navigateTo}
            onOpenContactRequest={handleOpenContactRequest}
          />
          <Footer currentRoute={route} onNavigate={navigateTo} />
        </div>
      ) : (
        <div className="relative z-[2] min-h-screen flex flex-col justify-between bg-[radial-gradient(circle_at_top_right,rgba(20,20,23,0.45),rgba(12,12,14,0.68)_65%)]">
          <main className="mx-auto w-full max-w-[1160px] pt-32 pb-16 px-5 sm:px-8 md:px-10 my-auto">
            <div className="max-w-xl rounded-3xl border border-white/20 bg-black/35 backdrop-blur-xl p-7 sm:p-10">
              <p className="text-[12px] tracking-[0.2em] uppercase text-[#f7e7cc] mb-4">
                404 · Not Found
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-[42px] sm:text-[54px] leading-[1.02] font-normal text-white mb-4">
                Page not <span className="italic text-[#f7e7cc]">found.</span>
              </h1>
              <p className="text-[15px] leading-[1.7] text-white/80 mb-7">
                The page you requested could not be found. Return to the NOVA STUDIO home page or
                browse our legal pages below.
              </p>
              <AnimatedButton
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/');
                }}
                label="Return Home"
                variant="light"
              />
            </div>
          </main>
          <Footer currentRoute={route} onNavigate={navigateTo} />
        </div>
      )}
    </div>
  );
}
