import { MouseEvent } from 'react';
import {
  AppRoutePath,
  ContactRequestCategory,
  LEGAL_PAGES,
  LEGAL_ROUTES,
  LegalRoutePath,
  LegalTextSegment,
  OFFICIAL_SUPPORT_EMAIL,
} from '../data/legalContent';
import { AnimatedButton } from './AnimatedButton';

interface LegalPageProps {
  route: LegalRoutePath;
  onNavigate: (path: AppRoutePath, sectionId?: string) => void;
  onOpenContactRequest?: (category: ContactRequestCategory) => void;
}

function renderSegments(
  entry: string | LegalTextSegment[],
  onNavigate: (path: AppRoutePath, sectionId?: string) => void
) {
  if (typeof entry === 'string') {
    return entry;
  }

  return entry.map((seg, idx) => {
    if (seg.href) {
      const isMailto = seg.href.startsWith('mailto:');
      const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
        if (isMailto) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        if (seg.href === '/#contact') {
          onNavigate('/', 'contact');
        } else if (
          seg.href === '/privacy-policy' ||
          seg.href === '/terms-and-conditions' ||
          seg.href === '/disclaimer' ||
          seg.href === '/cookie-policy' ||
          seg.href === '/contact-legal'
        ) {
          onNavigate(seg.href);
        }
      };

      return (
        <a
          key={idx}
          href={seg.href}
          onClick={handleLinkClick}
          className="text-[#f7e7cc] underline decoration-[#d6b98c]/55 underline-offset-4 hover:text-white hover:decoration-white transition-colors"
        >
          {seg.label || seg.text}
        </a>
      );
    }

    if (seg.placeholder) {
      return (
        <span
          key={idx}
          className="inline-block rounded-md border border-[#d6b98c]/40 bg-[#d6b98c]/12 px-1.5 py-0.5 text-[13px] font-medium text-[#f7e7cc] align-baseline"
        >
          {seg.text}
        </span>
      );
    }

    return <span key={idx}>{seg.text}</span>;
  });
}

export function LegalPage({ route, onNavigate, onOpenContactRequest }: LegalPageProps) {
  const page = LEGAL_PAGES[route];

  const handleRouteClick = (
    event: MouseEvent<HTMLAnchorElement>,
    path: AppRoutePath,
    sectionId?: string
  ) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onNavigate(path, sectionId);
  };

  const handleContactOption = (
    event: MouseEvent<HTMLAnchorElement>,
    category: ContactRequestCategory
  ) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (onOpenContactRequest) {
      onOpenContactRequest(category);
    } else {
      onNavigate('/', 'contact');
    }
  };

  return (
    <main className="relative z-[2] pt-24 sm:pt-28 pb-10 sm:pb-14 px-5 sm:px-8 md:px-10">
      <div className="mx-auto max-w-[1160px]">
        {/* Top back navigation */}
        <div className="mb-8 sm:mb-10 flex flex-wrap items-center justify-between gap-4">
          <a
            href="/"
            onClick={(e) => handleRouteClick(e, '/')}
            className="inline-flex min-h-[44px] items-center gap-2.5 text-[12px] tracking-[0.16em] uppercase text-[#f7e7cc] hover:text-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M12.5 8h-9M7 4.5 3.5 8 7 11.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Back to NOVA STUDIO</span>
          </a>

          <span className="text-[11px] tracking-[0.2em] uppercase text-white/65">
            Agency Governance · India
          </span>
        </div>

        {/* Document Header */}
        <header className="mb-10 sm:mb-14 max-w-3xl">
          <p className="text-[12px] tracking-[0.2em] uppercase text-[#f7e7cc] mb-4">
            {page.eyebrow}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.4rem,8.5vw,3.5rem)] sm:text-[56px] lg:text-[64px] leading-[0.98] tracking-[-0.02em] font-normal text-white mb-5 [text-wrap:balance]">
            {page.title} <span className="italic text-[#f7e7cc]">{page.italicAccent}</span>
          </h1>
          <p className="text-[15px] sm:text-[17px] leading-[1.7] text-white/85 max-w-2xl mb-6">
            {page.summary}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/20 pt-4 text-[12.5px] text-white/75">
            <span>
              <span className="text-white/50 uppercase tracking-[0.12em] text-[11px] mr-2">
                Operator
              </span>
              NOVA STUDIO (Agency)
            </span>
            <span>
              <span className="text-white/50 uppercase tracking-[0.12em] text-[11px] mr-2">
                Country
              </span>
              {page.jurisdiction}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="text-white/50 uppercase tracking-[0.12em] text-[11px]">
                Effective Date
              </span>
              <span className="inline-block rounded border border-[#d6b98c]/35 bg-[#d6b98c]/10 px-1.5 py-0.5 text-[12px] text-[#f7e7cc]">
                {page.effectiveDate}
              </span>
            </span>
          </div>
        </header>

        {/* Mobile / Tablet Policy Switcher */}
        <nav
          aria-label="Legal documents navigation"
          className="lg:hidden mb-8 rounded-2xl border border-white/20 bg-black/25 backdrop-blur-xl p-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {LEGAL_ROUTES.map((itemPath) => {
              const item = LEGAL_PAGES[itemPath];
              const isCurrent = itemPath === route;
              return (
                <a
                  key={itemPath}
                  href={itemPath}
                  aria-current={isCurrent ? 'page' : undefined}
                  onClick={(e) => handleRouteClick(e, itemPath)}
                  className={`min-h-[44px] inline-flex items-center justify-between rounded-xl px-4 py-2 text-[13px] transition-colors ${
                    isCurrent
                      ? 'bg-[#f7e7cc] text-[#141417] font-medium'
                      : 'text-white/85 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  <span>{item.navLabel}</span>
                  <span
                    className={`text-[11px] tabular-nums ${
                      isCurrent ? 'text-[#141417]/70' : 'text-[#d6b98c]/80'
                    }`}
                  >
                    {item.eyebrow.replace('Legal · ', '')}
                  </span>
                </a>
              );
            })}
          </div>
        </nav>

        {/* Desktop 12-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Sticky Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-6">
            <nav
              aria-label="Legal documents"
              className="rounded-2xl border border-white/20 bg-black/30 backdrop-blur-xl p-4 shadow-[0_12px_36px_rgba(0,0,0,0.2)]"
            >
              <p className="px-3 pb-3 mb-2 border-b border-white/15 text-[11px] tracking-[0.18em] uppercase text-[#d6b98c]">
                Legal &amp; Privacy Pages
              </p>
              <ul className="space-y-1">
                {LEGAL_ROUTES.map((itemPath) => {
                  const item = LEGAL_PAGES[itemPath];
                  const isCurrent = itemPath === route;
                  return (
                    <li key={itemPath}>
                      <a
                        href={itemPath}
                        aria-current={isCurrent ? 'page' : undefined}
                        onClick={(e) => handleRouteClick(e, itemPath)}
                        className={`min-h-[44px] flex items-center justify-between rounded-xl px-3.5 py-2 text-[13.5px] transition-colors ${
                          isCurrent
                            ? 'bg-[#f7e7cc] text-[#141417] font-medium'
                            : 'text-white/80 hover:bg-white/[0.08] hover:text-white'
                        }`}
                      >
                        <span>{item.navLabel}</span>
                        <span
                          className={`text-[11px] tabular-nums ${
                            isCurrent ? 'text-[#141417]/75' : 'text-[#d6b98c]/75'
                          }`}
                        >
                          {item.eyebrow.replace('Legal · ', '')}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="rounded-2xl border border-white/15 bg-black/25 backdrop-blur-xl p-5">
              <p className="text-[11px] tracking-[0.16em] uppercase text-[#d6b98c] mb-2">
                On this page
              </p>
              <ul className="space-y-1">
                {page.sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .getElementById(section.id)
                          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="min-h-[36px] flex items-baseline gap-2.5 py-1 text-[13px] text-white/75 hover:text-[#f7e7cc] transition-colors"
                    >
                      <span className="text-[11px] tabular-nums text-[#d6b98c]/75 shrink-0">
                        {section.index}
                      </span>
                      <span>{section.heading}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Policy Sections */}
          <div className="lg:col-span-8 space-y-5 sm:space-y-6">
            {route === '/contact-legal' && (
              <section
                aria-labelledby="direct-contact-channels-heading"
                className="rounded-3xl border border-[#f7e7cc]/30 bg-black/45 backdrop-blur-xl p-6 sm:p-8 shadow-[0_16px_44px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(247,231,204,0.2)]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/15">
                  <div>
                    <p className="text-[11px] tracking-[0.18em] uppercase text-[#d6b98c] mb-1.5">
                      Official Contact Desk · India
                    </p>
                    <h2
                      id="direct-contact-channels-heading"
                      className="font-[family-name:var(--font-display)] text-[28px] sm:text-[34px] leading-tight font-normal text-white"
                    >
                      Nova Studio
                    </h2>
                  </div>

                  <a
                    href={`mailto:${OFFICIAL_SUPPORT_EMAIL}`}
                    className="min-h-[44px] inline-flex items-center gap-2.5 self-start sm:self-auto rounded-full border border-[#d6b98c]/45 bg-white/[0.08] px-5 py-2.5 text-[14px] text-[#f7e7cc] hover:bg-[#f7e7cc] hover:text-[#141417] transition-colors"
                  >
                    <span>{OFFICIAL_SUPPORT_EMAIL}</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-5 flex flex-col justify-between gap-4">
                    <div>
                      <p className="text-[11px] tracking-[0.16em] uppercase text-[#d6b98c] mb-1.5">
                        Option 01
                      </p>
                      <h3 className="text-[17px] font-medium text-white mb-1.5">
                        Customer Enquiry
                      </h3>
                      <p className="text-[13.5px] leading-relaxed text-white/75">
                        General questions, project briefs, or service support.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                      <a
                        href="/#contact"
                        onClick={(e) => handleContactOption(e, 'enquiry')}
                        className="min-h-[44px] inline-flex items-center justify-center rounded-full bg-[#f7e7cc] text-[#141417] px-4 py-2 text-[13px] font-medium hover:bg-white transition-colors"
                      >
                        Open Enquiry Form
                      </a>
                      <a
                        href={`mailto:${OFFICIAL_SUPPORT_EMAIL}?subject=${encodeURIComponent(
                          'Customer Enquiry – Nova Studio'
                        )}`}
                        className="min-h-[38px] inline-flex items-center justify-center text-[12.5px] text-[#f7e7cc]/85 hover:text-white underline decoration-[#d6b98c]/50 underline-offset-4 transition-colors"
                      >
                        Email Support Instead
                      </a>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-5 flex flex-col justify-between gap-4">
                    <div>
                      <p className="text-[11px] tracking-[0.16em] uppercase text-[#d6b98c] mb-1.5">
                        Option 02
                      </p>
                      <h3 className="text-[17px] font-medium text-white mb-1.5">
                        Complaint Submission
                      </h3>
                      <p className="text-[13.5px] leading-relaxed text-white/75">
                        Report service issues or submit a formal grievance.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                      <a
                        href="/#contact"
                        onClick={(e) => handleContactOption(e, 'complaint')}
                        className="min-h-[44px] inline-flex items-center justify-center rounded-full border border-white/30 bg-white/[0.08] text-white px-4 py-2 text-[13px] font-medium hover:bg-white hover:text-[#141417] transition-colors"
                      >
                        Submit Complaint
                      </a>
                      <a
                        href={`mailto:${OFFICIAL_SUPPORT_EMAIL}?subject=${encodeURIComponent(
                          'Customer Complaint – Nova Studio'
                        )}`}
                        className="min-h-[38px] inline-flex items-center justify-center text-[12.5px] text-[#f7e7cc]/85 hover:text-white underline decoration-[#d6b98c]/50 underline-offset-4 transition-colors"
                      >
                        Email Complaint
                      </a>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-5 flex flex-col justify-between gap-4">
                    <div>
                      <p className="text-[11px] tracking-[0.16em] uppercase text-[#d6b98c] mb-1.5">
                        Option 03
                      </p>
                      <h3 className="text-[17px] font-medium text-white mb-1.5">
                        Privacy Request
                      </h3>
                      <p className="text-[13.5px] leading-relaxed text-white/75">
                        Data correction, deletion, consent withdrawal, or privacy notice.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                      <a
                        href="/#contact"
                        onClick={(e) => handleContactOption(e, 'privacy')}
                        className="min-h-[44px] inline-flex items-center justify-center rounded-full border border-[#d6b98c]/45 bg-[#d6b98c]/15 text-[#f7e7cc] px-4 py-2 text-[13px] font-medium hover:bg-[#d6b98c] hover:text-[#141417] transition-colors"
                      >
                        Submit Privacy Request
                      </a>
                      <a
                        href={`mailto:${OFFICIAL_SUPPORT_EMAIL}?subject=${encodeURIComponent(
                          'Privacy Request – Nova Studio'
                        )}`}
                        className="min-h-[38px] inline-flex items-center justify-center text-[12.5px] text-[#f7e7cc]/85 hover:text-white underline decoration-[#d6b98c]/50 underline-offset-4 transition-colors"
                      >
                        Email Privacy Desk
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {page.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-heading`}
                className="scroll-mt-24 rounded-3xl border border-white/20 bg-black/35 backdrop-blur-xl p-6 sm:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.16)]"
              >
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-[12px] tabular-nums tracking-[0.16em] uppercase text-[#d6b98c] shrink-0">
                    {section.index}
                  </span>
                  <h2
                    id={`${section.id}-heading`}
                    className="font-[family-name:var(--font-display)] text-[26px] sm:text-[31px] leading-[1.12] tracking-[-0.015em] font-normal text-white"
                  >
                    {section.heading}
                  </h2>
                </div>

                <div className="space-y-3.5 text-[15px] leading-[1.75] text-white/85">
                  {section.paragraphs.map((para, pIdx) => (
                    <p key={pIdx}>{renderSegments(para, onNavigate)}</p>
                  ))}

                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="space-y-2.5 pt-1">
                      {section.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-[10px] w-1.5 h-1.5 rounded-full bg-[#d6b98c] shrink-0"
                          />
                          <span>{renderSegments(bullet, onNavigate)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}

            {/* Bottom Callout Back to Contact / Home */}
            <div className="rounded-3xl border border-white/20 bg-[#141417]/85 backdrop-blur-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p className="text-[11px] tracking-[0.18em] uppercase text-[#d6b98c] mb-1.5">
                  Questions or Enquiry
                </p>
                <p className="text-[15px] text-white/85 leading-relaxed max-w-md">
                  Need clarification on our policies or ready to discuss a project brief with NOVA
                  STUDIO?
                </p>
              </div>
              <AnimatedButton
                href="/#contact"
                onClick={(e) => handleRouteClick(e, '/', 'contact')}
                label="Go to Contact"
                variant="light"
                className="self-start sm:self-auto shrink-0"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
