import { FormEvent, useEffect, useState } from 'react';
import { AnimatedButton } from './AnimatedButton';
import { SelectedOffering } from './OfferingsSection';
import { Reveal } from './Reveal';

const PROJECT_TYPES = [
  'Creative Direction',
  'Film & Video Production',
  'Photography',
  'Digital Content & Experiences',
  'Brand Campaigns',
  'Visual Storytelling',
  'Multi-disciplinary Production',
];

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

interface ContactSectionProps {
  selectedOffering?: SelectedOffering | null;
  onClearOffering?: () => void;
}

export function ContactSection({
  selectedOffering = null,
  onClearOffering,
}: ContactSectionProps) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [description, setDescription] = useState('');
  const [botcheck, setBotcheck] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedType, setSubmittedType] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedOffering) return;
    const targetType =
      selectedOffering.category === 'Brand Launch Bundles'
        ? 'Multi-disciplinary Production'
        : 'Digital Content & Experiences';
    setProjectType(targetType);
    setSubmittedType(null);
    setError('');
    setDescription((prev) => {
      if (!prev.trim() || prev.startsWith('Enquiry regarding ')) {
        return `Enquiry regarding ${selectedOffering.category} — ${selectedOffering.title}:\n`;
      }
      return prev;
    });
  }, [selectedOffering]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmedName = name.trim();
    const trimmedBrand = brand.trim();
    const trimmedEmail = email.trim();
    const trimmedWhatsapp = whatsapp.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError('Please enter your name.');
      setSubmittedType(null);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      setSubmittedType(null);
      return;
    }
    if (!trimmedWhatsapp) {
      setError('Please enter your WhatsApp number.');
      setSubmittedType(null);
      return;
    }
    const whatsappDigits = trimmedWhatsapp.replace(/\D/g, '');
    if (
      !/^\+?[\d\s()-]+$/.test(trimmedWhatsapp) ||
      whatsappDigits.length < 7 ||
      whatsappDigits.length > 15
    ) {
      setError('Please enter a valid WhatsApp number (including country code if applicable).');
      setSubmittedType(null);
      return;
    }
    if (!trimmedDescription) {
      setError('Please share a brief description of your project.');
      setSubmittedType(null);
      return;
    }

    if (botcheck) {
      return;
    }

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setError('Form delivery is not configured yet. Please try again later.');
      setSubmittedType(null);
      return;
    }

    setError('');
    setSubmittedType(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `New NOVA STUDIO Enquiry — ${projectType}${trimmedBrand ? ` (${trimmedBrand})` : ''}`,
          from_name: 'NOVA STUDIO Website',
          name: trimmedName,
          brand: trimmedBrand || 'Not specified',
          email: trimmedEmail,
          whatsapp: trimmedWhatsapp,
          project_type: projectType,
          selected_offering: selectedOffering
            ? `${selectedOffering.category} — ${selectedOffering.title}`
            : 'None',
          message: trimmedDescription,
          botcheck: '',
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null;

      if (!response.ok || !result?.success) {
        setError(
          result?.message ||
            'Unable to send your enquiry right now. Please try again in a moment.'
        );
        return;
      }

      const deliveredProjectType = projectType;
      setName('');
      setBrand('');
      setEmail('');
      setWhatsapp('');
      setProjectType(PROJECT_TYPES[0]);
      setDescription('');
      onClearOffering?.();
      setSubmittedType(deliveredProjectType);
    } catch {
      setError(
        'Network error while sending your enquiry. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setBrand('');
    setEmail('');
    setWhatsapp('');
    setProjectType(PROJECT_TYPES[0]);
    setDescription('');
    setBotcheck(false);
    setError('');
    setSubmittedType(null);
    onClearOffering?.();
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative w-full py-14 sm:py-20 lg:py-24 px-5 sm:px-8 md:px-10"
    >
      <div className="mx-auto max-w-[1160px] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left heading & direct intake note */}
        <div className="lg:col-span-5">
          <Reveal delay={0} distance="sm">
            <p className="text-[12px] tracking-[0.2em] uppercase text-[#f7e7cc] mb-4 sm:mb-5">
              06 · Contact
            </p>
          </Reveal>

          <Reveal delay={75} distance="md">
            <h2
              id="contact-heading"
              className="font-[family-name:var(--font-display)] text-[clamp(2.2rem,8.5vw,2.75rem)] sm:text-[50px] lg:text-[56px] leading-[1.04] sm:leading-[1.03] tracking-[-0.02em] font-normal text-white mb-5 sm:mb-6 [text-wrap:balance]"
            >
              Have a vision?{' '}
              <span className="italic text-[#f7e7cc]">Let&apos;s bring it to life.</span>
            </h2>
          </Reveal>

          <Reveal delay={150} distance="md">
            <p className="text-[15px] leading-[1.7] text-white/80 max-w-md mb-6 sm:mb-8">
              Outline your creative goals, scope, and visual direction below.
            </p>
          </Reveal>

          <Reveal delay={200} distance="sm">
            <p className="border-t border-white/20 pt-5 text-[13px] leading-relaxed text-white/75 max-w-md">
              <span className="text-[#f7e7cc] font-medium">Direct studio intake:</span> Enquiries
              are delivered straight to the NOVA STUDIO team—expect a response within 1–2 business
              days.
            </p>
          </Reveal>
        </div>

        {/* Right frosted glass form */}
        <div className="lg:col-span-7">
          <Reveal delay={150} distance="md">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-3xl bg-white/[0.10] backdrop-blur-xl border border-white/25 shadow-[0_16px_44px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.28)] p-5 sm:p-9 space-y-5 sm:space-y-6"
            >
              {/* Hidden honeypot field for Web3Forms spam protection */}
              <input
                type="checkbox"
                name="botcheck"
                checked={botcheck}
                onChange={(e) => setBotcheck(e.target.checked)}
                tabIndex={-1}
                aria-hidden="true"
                className="hidden"
              />

              {selectedOffering && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-[#f7e7cc]/35 bg-black/25 px-4 py-2 text-[12.5px]">
                  <span className="text-white/85">
                    Selected:{' '}
                    <span className="text-[#f7e7cc] font-medium">{selectedOffering.title}</span>{' '}
                    <span className="text-white/55">({selectedOffering.category})</span>
                  </span>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      onClearOffering?.();
                      setDescription((prev) =>
                        prev.startsWith('Enquiry regarding ') ? '' : prev
                      );
                    }}
                    className="min-h-[44px] sm:min-h-[36px] inline-flex items-center px-2.5 -mr-1.5 text-[11px] tracking-[0.08em] uppercase text-white/70 hover:text-white transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    Clear
                  </button>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-[12px] tracking-[0.1em] uppercase text-white/80 mb-2.5"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (submittedType) setSubmittedType(null);
                    }}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-white/20 bg-black/25 px-4 py-3.5 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#f7e7cc] transition-colors disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-brand"
                    className="block text-[12px] tracking-[0.1em] uppercase text-white/80 mb-2.5"
                  >
                    Brand / Company
                  </label>
                  <input
                    id="contact-brand"
                    name="brand"
                    type="text"
                    disabled={isSubmitting}
                    value={brand}
                    onChange={(e) => {
                      setBrand(e.target.value);
                      if (submittedType) setSubmittedType(null);
                    }}
                    placeholder="Company or studio"
                    className="w-full rounded-xl border border-white/20 bg-black/25 px-4 py-3.5 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#f7e7cc] transition-colors disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-[12px] tracking-[0.1em] uppercase text-white/80 mb-2.5"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    disabled={isSubmitting}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (submittedType) setSubmittedType(null);
                    }}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-white/20 bg-black/25 px-4 py-3.5 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#f7e7cc] transition-colors disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-type"
                    className="block text-[12px] tracking-[0.1em] uppercase text-white/80 mb-2.5"
                  >
                    Project type
                  </label>
                  <select
                    id="contact-type"
                    name="project_type"
                    disabled={isSubmitting}
                    value={projectType}
                    onChange={(e) => {
                      setProjectType(e.target.value);
                      if (submittedType) setSubmittedType(null);
                    }}
                    className="w-full rounded-xl border border-white/20 bg-black/35 px-4 py-3.5 text-[14px] text-white focus:outline-none focus:border-[#f7e7cc] transition-colors disabled:opacity-60"
                  >
                    {PROJECT_TYPES.map((type) => (
                      <option key={type} value={type} className="bg-[#141417] text-white">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-whatsapp"
                  className="block text-[12px] tracking-[0.1em] uppercase text-white/80 mb-2.5"
                >
                  WhatsApp Number
                </label>
                <input
                  id="contact-whatsapp"
                  name="whatsapp"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  disabled={isSubmitting}
                  value={whatsapp}
                  onChange={(e) => {
                    setWhatsapp(e.target.value);
                    if (submittedType) setSubmittedType(null);
                  }}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-white/20 bg-black/25 px-4 py-3.5 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#f7e7cc] transition-colors disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-description"
                  className="block text-[12px] tracking-[0.1em] uppercase text-white/80 mb-2.5"
                >
                  Project description
                </label>
                <textarea
                  id="contact-description"
                  name="message"
                  rows={4}
                  required
                  disabled={isSubmitting}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (submittedType) setSubmittedType(null);
                  }}
                  placeholder="Share your creative brief, deliverables, and timeline..."
                  className="w-full rounded-xl border border-white/20 bg-black/25 px-4 py-3.5 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#f7e7cc] transition-colors resize-none disabled:opacity-60"
                />
              </div>

              {error && (
                <p role="alert" className="text-[13px] text-[#f7e7cc]">
                  {error}
                </p>
              )}

              {submittedType && (
                <div
                  role="status"
                  className="rounded-xl border border-[#f7e7cc]/40 bg-black/35 p-4 text-[13px] text-white/90 leading-relaxed"
                >
                  <p className="text-[#f7e7cc] font-medium mb-1">
                    Enquiry received — thank you
                  </p>
                  <p>
                    Your brief for <span className="text-white">{submittedType}</span> has been
                    delivered to NOVA STUDIO. We will review your direction and follow up within
                    1–2 business days.
                  </p>
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <span className="text-[12px] text-white/60">
                  Direct enquiry · Typically replies within 1–2 business days
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {submittedType && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="min-h-[44px] inline-flex items-center justify-center rounded-full border border-white/25 px-5 py-2.5 text-[13px] font-medium text-white/85 hover:text-white hover:border-white/45 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Clear
                    </button>
                  )}
                  <AnimatedButton
                    type="submit"
                    disabled={isSubmitting}
                    label={isSubmitting ? 'Sending...' : 'Submit'}
                    hoverLabel={isSubmitting ? 'Sending...' : 'Submit'}
                    variant="light"
                    className="w-full sm:w-auto"
                  />
                </div>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
