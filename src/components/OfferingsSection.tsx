import { useState } from 'react';
import { AnimatedButton } from './AnimatedButton';
import { Reveal } from './Reveal';

export interface SelectedOffering {
  category: 'Brand Launch Bundles' | 'Standalone Retainers';
  title: string;
}

interface PricingTier {
  id: string;
  eyebrow: string;
  title: string;
  price: string;
  cadence?: string;
  priceSubtext?: string;
  badge?: string;
  highlighted?: boolean;
  summary: string;
  deliverables: string[];
  footnote: string;
}

const BUNDLE_TIERS: PricingTier[] = [
  {
    id: 'digital-launch-kit',
    eyebrow: 'Tier 01 · Essential',
    title: 'Digital Launch Kit',
    price: '₹44,999',
    priceSubtext: 'One-Time Setup Fee',
    summary:
      'A refined creative foundation crafted for emerging brands preparing an intentional digital debut.',
    deliverables: [
      'Core creative direction & visual mood system',
      'Hero still photography & key campaign frames',
      'Editorial typography & palette calibration',
      'Launch-ready web imagery & art direction',
    ],
    footnote: 'Typical timeline · 2–3 weeks',
  },
  {
    id: 'growth-storefront',
    eyebrow: 'Tier 02 · Studio Flagship',
    title: 'Growth Storefront',
    price: '₹59,999',
    cadence: '/ month · Month 1',
    priceSubtext: '₹35,000 / month from Month 2+',
    badge: 'Primary Choice',
    highlighted: true,
    summary:
      'An integrated production suite pairing tactile product photography, brand film, and storefront storytelling.',
    deliverables: [
      'Full creative direction & storefront narrative',
      'Curated product & editorial photography suite',
      'Short-form brand film & hero motion loops',
      'Conversion-ready digital campaign visual kit',
    ],
    footnote: 'Ongoing growth cadence from Month 2+',
  },
  {
    id: 'brand-domination',
    eyebrow: 'Tier 03 · Complete World',
    title: 'Brand Domination',
    price: '₹74,999',
    cadence: '/ month · Month 1',
    priceSubtext: '₹45,000 / month from Month 2+',
    summary:
      'Full-scale flagship launch production uniting cinema-grade film, stills, and immersive digital direction.',
    deliverables: [
      'End-to-end multi-channel creative direction',
      'Flagship commercial film + modular cutdowns',
      'Complete editorial & architectural photo library',
      'Bespoke digital experience & launch mastering',
    ],
    footnote: 'Comprehensive brand partnership from Month 2+',
  },
];

const RETAINER_TIERS: PricingTier[] = [
  {
    id: 'reels-editing-engine',
    eyebrow: 'Plan A · Short-Form Motion',
    title: 'Reels Editing Engine',
    price: '₹29,999',
    cadence: '/ month',
    summary:
      'Consistent short-form video post-production, pacing, and motion polish crafted from your ongoing footage.',
    deliverables: [
      'Monthly short-form reels & vertical cutdowns',
      'Color grading, sound rhythm & visual polish',
      'Hook pacing & editorial title treatments',
      'Consistent monthly delivery for web & social',
    ],
    footnote: 'Dedicated monthly motion editing cadence',
  },
  {
    id: 'creator-brand-growth',
    eyebrow: 'Plan B · Film & Growth',
    title: 'Creator & Brand Growth',
    price: '₹44,999',
    cadence: '/ month',
    summary:
      'Ongoing monthly campaign direction, motion storytelling, and editorial photography built to scale active brand websites.',
    deliverables: [
      'Monthly campaign film, reels & hero motion loops',
      'Art-directed photography & editorial stills',
      'Landing-page visual storytelling & launch drops',
      'Priority production scheduling & direction',
    ],
    footnote: 'Comprehensive monthly growth production',
  },
  {
    id: 'social-presence-care',
    eyebrow: 'Plan C · Ongoing Curation',
    title: 'Social Presence Care',
    price: '₹21,999',
    cadence: '/ month',
    summary:
      'Steady monthly visual curation, photography refreshes, and brand upkeep keeping your existing presence cohesive.',
    deliverables: [
      'Monthly curated imagery & visual refresh batch',
      'Consistent visual identity & tonal continuity',
      'Seasonal lookbook & digital storefront updates',
      'Monthly creative alignment & asset handoff',
    ],
    footnote: 'Flexible monthly care · Existing websites',
  },
];

interface OfferingsSectionProps {
  onSelectOffering: (offering: SelectedOffering) => void;
}

export function OfferingsSection({ onSelectOffering }: OfferingsSectionProps) {
  const [activeTab, setActiveTab] = useState<'bundles' | 'retainers'>('bundles');

  const isBundles = activeTab === 'bundles';
  const tiers = isBundles ? BUNDLE_TIERS : RETAINER_TIERS;
  const categoryLabel: SelectedOffering['category'] = isBundles
    ? 'Brand Launch Bundles'
    : 'Standalone Retainers';

  return (
    <section
      id="offerings"
      aria-labelledby="offerings-heading"
      className="relative w-full py-14 sm:py-20 lg:py-24 px-5 sm:px-8 md:px-10"
    >
      <div className="mx-auto max-w-[1160px]">
        {/* Header & Apple-inspired segmented tab switcher */}
        <div className="flex flex-col items-stretch lg:flex-row lg:items-end justify-between gap-7 sm:gap-8 mb-10 sm:mb-16">
          <div className="max-w-2xl">
            <Reveal delay={0} distance="sm">
              <p className="text-[12px] tracking-[0.2em] uppercase text-[#f7e7cc] mb-4">
                05 · Packages &amp; Retainers
              </p>
            </Reveal>
            <Reveal delay={75} distance="md">
              <h2
                id="offerings-heading"
                className="font-[family-name:var(--font-display)] text-[clamp(2.15rem,8vw,2.75rem)] sm:text-[50px] lg:text-[58px] leading-[1.05] sm:leading-[1.03] tracking-[-0.02em] font-normal text-white [text-wrap:balance]"
              >
                Transparent tiers for <span className="italic text-[#f7e7cc]">launch</span> or
                continuous craft.
              </h2>
            </Reveal>
          </div>

          <Reveal delay={150} distance="sm" className="w-full sm:w-auto">
            <div
              role="tablist"
              aria-label="Pricing categories"
              className="grid grid-cols-2 sm:inline-flex items-stretch gap-1 rounded-2xl sm:rounded-full bg-black/20 backdrop-blur-2xl border border-white/25 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.24)]"
            >
              <button
                type="button"
                role="tab"
                id="tab-bundles"
                aria-selected={isBundles}
                aria-controls="panel-offerings"
                onClick={() => setActiveTab('bundles')}
                className={`h-full min-h-[44px] inline-flex items-center justify-center rounded-xl sm:rounded-full px-3 sm:px-6 py-2.5 text-[12px] sm:text-[13px] font-medium tracking-[0.01em] text-center leading-tight transition-all duration-200 cursor-pointer shrink-0 ${
                  isBundles
                    ? 'bg-white text-[#141417] shadow-[0_4px_14px_rgba(0,0,0,0.18)]'
                    : 'text-white/85 hover:text-white'
                }`}
              >
                Brand Launch Bundles
              </button>
              <button
                type="button"
                role="tab"
                id="tab-retainers"
                aria-selected={!isBundles}
                aria-controls="panel-offerings"
                onClick={() => setActiveTab('retainers')}
                className={`h-full min-h-[44px] inline-flex items-center justify-center rounded-xl sm:rounded-full px-3 sm:px-6 py-2.5 text-[12px] sm:text-[13px] font-medium tracking-[0.01em] text-center leading-tight transition-all duration-200 cursor-pointer shrink-0 ${
                  !isBundles
                    ? 'bg-white text-[#141417] shadow-[0_4px_14px_rgba(0,0,0,0.18)]'
                    : 'text-white/85 hover:text-white'
                }`}
              >
                Standalone Retainers
              </button>
            </div>
          </Reveal>
        </div>

        {/* Subtitle bar */}
        <Reveal delay={160} distance="sm">
          <div className="mb-9 sm:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/20 pb-5 sm:pb-6">
            <p className="text-[14px] sm:text-[15px] text-white/88 max-w-2xl leading-relaxed">
              {isBundles
                ? 'End-to-end production bundles built to establish your brand from first concept through launch release.'
                : 'Monthly creative retainers tailored for existing websites seeking steady editorial photography, film, and campaign updates.'}
            </p>
            <span className="text-[11px] tracking-[0.18em] uppercase text-[#f7e7cc] whitespace-nowrap shrink-0">
              {isBundles ? 'Primary Offering · Launch Bundles' : 'Monthly Retainers · Existing Sites'}
            </span>
          </div>
        </Reveal>

        {/* Three Apple-inspired frosted glass pricing cards */}
        <div
          id="panel-offerings"
          role="tabpanel"
          aria-labelledby={isBundles ? 'tab-bundles' : 'tab-retainers'}
          className="grid grid-cols-1 lg:grid-cols-3 gap-7 lg:gap-8 items-stretch pt-2"
        >
          {tiers.map((tier, index) => {
            const delayPreset = index === 0 ? 0 : index === 1 ? 100 : 200;
            const isPrimaryChoice = Boolean(tier.highlighted);

            return (
              <Reveal
                key={`${activeTab}-${tier.id}`}
                delay={delayPreset}
                distance="md"
                className="h-full"
              >
                <article
                  className={`h-full flex flex-col justify-between rounded-[24px] sm:rounded-[28px] backdrop-blur-2xl p-6 sm:p-8 lg:p-10 transition-all duration-300 ${
                    isPrimaryChoice
                      ? 'lg:-translate-y-3 bg-white/[0.18] border border-white/50 shadow-[0_28px_64px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.5)] hover:bg-white/[0.21] hover:border-white/65'
                      : 'bg-white/[0.10] border border-white/25 shadow-[0_18px_46px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] hover:bg-white/[0.14] hover:border-white/40'
                  }`}
                >
                  <div>
                    {/* Eyebrow & optional Primary Choice label */}
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 mb-4 sm:mb-5">
                      <span className="text-[11px] tracking-[0.16em] uppercase text-[#f7e7cc]">
                        {tier.eyebrow}
                      </span>
                      {tier.badge && (
                        <span className="text-[11px] tracking-[0.16em] uppercase font-medium text-white">
                          {tier.badge}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-[family-name:var(--font-display)] text-[30px] sm:text-[34px] lg:text-[36px] leading-[1.06] tracking-[-0.015em] font-normal text-white mb-4 sm:mb-5">
                      {tier.title}
                    </h3>

                    {/* Clean Apple-inspired tabular pricing */}
                    <div className="pb-6 mb-6 border-b border-white/20">
                      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                        <span className="text-[38px] sm:text-[42px] leading-none font-normal tracking-[-0.03em] tabular-nums text-white">
                          {tier.price}
                        </span>
                        {tier.cadence && (
                          <span className="text-[13px] text-white/78 tracking-[0.01em] whitespace-nowrap">
                            {tier.cadence}
                          </span>
                        )}
                      </div>
                      {tier.priceSubtext && (
                        <p className="mt-2 text-[13px] text-[#f7e7cc]/95 tracking-[0.01em] tabular-nums">
                          {tier.priceSubtext}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-[14.5px] leading-[1.65] text-white/88 mb-7">
                      {tier.summary}
                    </p>

                    {/* Deliverables */}
                    <ul className="space-y-3 mb-8">
                      {tier.deliverables.map((line) => (
                        <li
                          key={line}
                          className="flex items-start gap-3 text-[13.5px] leading-[1.55] text-white/90"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 16 16"
                            fill="none"
                            aria-hidden="true"
                            className="mt-[4px] shrink-0 text-[#f7e7cc]"
                          >
                            <path
                              d="M3.5 8.5 6.5 11.5 12.5 4.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Footer & CTA */}
                  <div className="pt-6 border-t border-white/20 flex flex-col gap-5">
                    <p className="text-[12px] tracking-[0.02em] text-white/70">{tier.footnote}</p>

                    <AnimatedButton
                      onClick={() =>
                        onSelectOffering({
                          category: categoryLabel,
                          title: tier.title,
                        })
                      }
                      label={isBundles ? `Choose ${tier.title}` : `Select ${tier.title}`}
                      variant={isPrimaryChoice ? 'light' : 'glass'}
                      fullWidth
                    />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
