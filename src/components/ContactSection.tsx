import { FormEvent, MouseEvent, useEffect, useState } from 'react';
import {
  AppRoutePath,
  ContactRequestCategory,
  OFFICIAL_SUPPORT_EMAIL,
} from '../data/legalContent';
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

const PRIVACY_REQUEST_TYPES = [
  'Personal Data Correction',
  'Personal Data Deletion',
  'Consent Withdrawal',
  'Privacy Complaint',
];

const REQUEST_CATEGORIES: Array<{
  id: ContactRequestCategory;
  label: string;
}> = [
  { id: 'enquiry', label: 'Customer Enquiry' },
  { id: 'complaint', label: 'Complaint' },
  { id: 'privacy', label: 'Privacy Request' },
];

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

interface ContactSectionProps {
  selectedOffering?: SelectedOffering | null;
  onClearOffering?: () => void;
  selectedRequestCategory?: ContactRequestCategory | null;
  onClearRequestCategory?: () => void;
  onNavigate?: (path: AppRoutePath) => void;
}

export function ContactSection({
  selectedOffering = null,
  onClearOffering,
  selectedRequestCategory = null,
  onClearRequestCategory,
  onNavigate,
}: ContactSectionProps) {
  const [requestCategory, setRequestCategory] = useState<ContactRequestCategory>('enquiry');
  const [privacyRequestType, setPrivacyRequestType] = useState(PRIVACY_REQUEST_TYPES[0]);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [description, setDescription] = useState('');
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [botcheck, setBotcheck] = useState(false);
  const [error, setError] = useState('');
  const [deliveryFallbackMailto, setDeliveryFallbackMailto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedConfirmation, setSubmittedConfirmation] = useState<{
    category: ContactRequestCategory;
    detail: string;
  } | null>(null);

  useEffect(() => {
    if (!selectedRequestCategory) return;
    setRequestCategory(selectedRequestCategory);
    setError('');
    setDeliveryFallbackMailto(null);
    setSubmittedConfirmation(null);
    onClearRequestCategory?.();
  }, [selectedRequestCategory, onClearRequestCategory]);

  useEffect(() => {
    if (!selectedOffering) return;
    const targetType =
      selectedOffering.category === 'Brand Launch Bundles'
        ? 'Multi-disciplinary Production'
        : 'Digital Content & Experiences';
    setRequestCategory('enquiry');
    setProjectType(targetType);
    setSubmittedConfirmation(null);
    setDeliveryFallbackMailto(null);
    setError('');
    setDescription((prev) => {
      if (!prev.trim() || prev.startsWith('Enquiry regarding ')) {
        return `Enquiry regarding ${selectedOffering.category} — ${selectedOffering.title}:\n`;
      }
      return prev;
    });
  }, [selectedOffering]);

  const buildMailtoHref = (
    category: ContactRequestCategory,
    subjectName: string,
    bodyText?: string
  ) => {
    const subject =
      category === 'privacy'
        ? 'Privacy Request – Nova Studio'
        : category === 'complaint'
          ? 'Customer Complaint – Nova Studio'
          : `Customer Enquiry – Nova Studio${subjectName ? ` (${subjectName})` : ''}`;

    const body = bodyText ? `\n${bodyText}` : '';
    return `mailto:${OFFICIAL_SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}${
      body ? `&body=${encodeURIComponent(body)}` : ''
    }`;
  };

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
      setSubmittedConfirmation(null);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      setSubmittedConfirmation(null);
      return;
    }

    const whatsappRequired = requestCategory === 'enquiry';
    if (whatsappRequired && !trimmedWhatsapp) {
      setError('Please enter your WhatsApp number.');
      setSubmittedConfirmation(null);
      return;
    }
    if (trimmedWhatsapp) {
      const whatsappDigits = trimmedWhatsapp.replace(/\D/g, '');
      if (
        !/^\+?[\d\s()-]+$/.test(trimmedWhatsapp) ||
        whatsappDigits.length < 7 ||
        whatsappDigits.length > 15
      ) {
        setError('Please enter a valid WhatsApp number (including country code if applicable).');
        setSubmittedConfirmation(null);
        return;
      }
    }

    if (!trimmedDescription) {
      setError(
        requestCategory === 'complaint'
          ? 'Please describe your complaint or issue.'
          : requestCategory === 'privacy'
            ? 'Please describe your privacy or data request.'
            : 'Please share a brief description of your project.'
      );
      setSubmittedConfirmation(null);
      return;
    }
    if (!consentPrivacy) {
      setError('Please accept the Privacy Policy before submitting.');
      setSubmittedConfirmation(null);
      return;
    }

    if (botcheck) {
      return;
    }

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setError(
        `Automated form delivery is not configured in this environment. Please send your ${
          requestCategory === 'privacy'
            ? 'privacy request'
            : requestCategory === 'complaint'
              ? 'complaint'
              : 'enquiry'
        } directly to ${OFFICIAL_SUPPORT_EMAIL}.`
      );
      setDeliveryFallbackMailto(
        buildMailtoHref(
          requestCategory,
          trimmedName,
          `Name: ${trimmedName}\nEmail: ${trimmedEmail}${
            requestCategory === 'privacy' ? `\nRequest Type: ${privacyRequestType}` : ''
          }\n\nDetails:\n${trimmedDescription}`
        )
      );
      setSubmittedConfirmation(null);
      return;
    }

    setError('');
    setDeliveryFallbackMailto(null);
    setSubmittedConfirmation(null);
    setIsSubmitting(true);

    const requestCategoryLabel =
      requestCategory === 'complaint'
        ? 'Customer Complaint'
        : requestCategory === 'privacy'
          ? `Privacy Request (${privacyRequestType})`
          : 'Customer Enquiry';

    const emailSubject =
      requestCategory === 'privacy'
        ? `Privacy Request – Nova Studio (${privacyRequestType})`
        : requestCategory === 'complaint'
          ? `Customer Complaint – Nova Studio (${trimmedName})`
          : `New NOVA STUDIO Enquiry — ${projectType}${trimmedBrand ? ` (${trimmedBrand})` : ''}`;

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: emailSubject,
          from_name: 'NOVA STUDIO Website',
          request_category: requestCategoryLabel,
          name: trimmedName,
          brand: trimmedBrand || 'Not specified',
          email: trimmedEmail,
          whatsapp: trimmedWhatsapp || 'Not provided',
          project_type: requestCategory === 'enquiry' ? projectType : requestCategoryLabel,
          privacy_request_type: requestCategory === 'privacy' ? privacyRequestType : 'N/A',
          selected_offering:
            requestCategory === 'enquiry' && selectedOffering
              ? `${selectedOffering.category} — ${selectedOffering.title}`
              : 'None',
          message: trimmedDescription,
          privacy_consent: 'Agreed',
          marketing_consent: consentMarketing ? 'Opted in (optional)' : 'Not opted in',
          botcheck: '',
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null;

      if (!response.ok || !result?.success) {
        setError(
          result?.message ||
            `Unable to send via the web form right now. You can email us directly at ${OFFICIAL_SUPPORT_EMAIL}.`
        );
        setDeliveryFallbackMailto(
          buildMailtoHref(
            requestCategory,
            trimmedName,
            `Name: ${trimmedName}\nEmail: ${trimmedEmail}\n\n${trimmedDescription}`
          )
        );
        return;
      }

      const confirmationDetail =
        requestCategory === 'privacy'
          ? privacyRequestType
          : requestCategory === 'complaint'
            ? 'Customer Complaint'
            : projectType;

      setName('');
      setBrand('');
      setEmail('');
      setWhatsapp('');
      setProjectType(PROJECT_TYPES[0]);
      setPrivacyRequestType(PRIVACY_REQUEST_TYPES[0]);
      setDescription('');
      setConsentPrivacy(false);
      setConsentMarketing(false);
      onClearOffering?.();
      setSubmittedConfirmation({
        category: requestCategory,
        detail: confirmationDetail,
      });
    } catch {
      setError(
        `Network error while sending your submission. Please try again or email ${OFFICIAL_SUPPORT_EMAIL} directly.`
      );
      setDeliveryFallbackMailto(
        buildMailtoHref(
          requestCategory,
          trimmedName,
          `Name: ${trimmedName}\nEmail: ${trimmedEmail}\n\n${trimmedDescription}`
        )
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
    setPrivacyRequestType(PRIVACY_REQUEST_TYPES[0]);
    setDescription('');
    setConsentPrivacy(false);
    setConsentMarketing(false);
    setBotcheck(false);
    setError('');
    setDeliveryFallbackMailto(null);
    setSubmittedConfirmation(null);
    onClearOffering?.();
  };

  const handlePolicyLinkClick = (
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
              Outline your creative goals, scope, and visual direction—or raise a support
              complaint or privacy request below.
            </p>
          </Reveal>

          <Reveal delay={200} distance="sm">
            <div className="border-t border-white/20 pt-5 space-y-2.5 text-[13px] leading-relaxed text-white/75 max-w-md">
              <p>
                <span className="text-[#f7e7cc] font-medium">Direct studio intake:</span> Enquiries
                are reviewed by Nova Studio (India)—expect a response within 1–2 business days.
              </p>
              <p>
                <span className="text-[#f7e7cc] font-medium">Official Email:</span>{' '}
                <a
                  href={`mailto:${OFFICIAL_SUPPORT_EMAIL}`}
                  className="text-white underline decoration-[#d6b98c]/55 underline-offset-4 hover:text-[#f7e7cc] transition-colors"
                >
                  {OFFICIAL_SUPPORT_EMAIL}
                </a>
              </p>
              <p className="text-white/65">
                For formal complaints or data requests, view our{' '}
                <a
                  href="/contact-legal"
                  onClick={(e) => handlePolicyLinkClick(e, '/contact-legal')}
                  className="text-[#f7e7cc] underline decoration-[#d6b98c]/55 underline-offset-4 hover:text-white transition-colors"
                >
                  Contact Us &amp; Grievance Redressal
                </a>{' '}
                page.
              </p>
            </div>
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

              {/* Request Category Selector */}
              <div>
                <p className="block text-[12px] tracking-[0.1em] uppercase text-white/80 mb-2.5">
                  Request Purpose
                </p>
                <div
                  role="group"
                  aria-label="Request purpose"
                  className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                >
                  {REQUEST_CATEGORIES.map((category) => {
                    const isSelected = requestCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        disabled={isSubmitting}
                        aria-pressed={isSelected}
                        onClick={() => {
                          setRequestCategory(category.id);
                          setError('');
                          setDeliveryFallbackMailto(null);
                          setSubmittedConfirmation(null);
                        }}
                        className={`min-h-[44px] rounded-xl border px-3.5 py-2 text-[13px] font-medium transition-colors cursor-pointer disabled:opacity-60 ${
                          isSelected
                            ? 'bg-[#f7e7cc] text-[#141417] border-[#f7e7cc]'
                            : 'bg-black/25 text-white/80 border-white/20 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        {category.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {requestCategory === 'enquiry' && selectedOffering && (
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
                      if (submittedConfirmation) setSubmittedConfirmation(null);
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
                    {requestCategory === 'enquiry'
                      ? 'Brand / Company'
                      : 'Brand / Reference (Optional)'}
                  </label>
                  <input
                    id="contact-brand"
                    name="brand"
                    type="text"
                    disabled={isSubmitting}
                    value={brand}
                    onChange={(e) => {
                      setBrand(e.target.value);
                      if (submittedConfirmation) setSubmittedConfirmation(null);
                    }}
                    placeholder={
                      requestCategory === 'enquiry'
                        ? 'Company or studio'
                        : 'Company, service, or context'
                    }
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
                      if (submittedConfirmation) setSubmittedConfirmation(null);
                    }}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-white/20 bg-black/25 px-4 py-3.5 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#f7e7cc] transition-colors disabled:opacity-60"
                  />
                </div>

                {requestCategory === 'privacy' ? (
                  <div>
                    <label
                      htmlFor="contact-privacy-type"
                      className="block text-[12px] tracking-[0.1em] uppercase text-white/80 mb-2.5"
                    >
                      Privacy Request Type
                    </label>
                    <select
                      id="contact-privacy-type"
                      name="privacy_request_type"
                      disabled={isSubmitting}
                      value={privacyRequestType}
                      onChange={(e) => {
                        setPrivacyRequestType(e.target.value);
                        if (submittedConfirmation) setSubmittedConfirmation(null);
                      }}
                      className="w-full rounded-xl border border-white/20 bg-black/35 px-4 py-3.5 text-[14px] text-white focus:outline-none focus:border-[#f7e7cc] transition-colors disabled:opacity-60"
                    >
                      {PRIVACY_REQUEST_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-[#141417] text-white">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : requestCategory === 'enquiry' ? (
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
                        if (submittedConfirmation) setSubmittedConfirmation(null);
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
                ) : (
                  <div>
                    <label
                      htmlFor="contact-whatsapp"
                      className="block text-[12px] tracking-[0.1em] uppercase text-white/80 mb-2.5"
                    >
                      WhatsApp / Phone (Optional)
                    </label>
                    <input
                      id="contact-whatsapp"
                      name="whatsapp"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      disabled={isSubmitting}
                      value={whatsapp}
                      onChange={(e) => {
                        setWhatsapp(e.target.value);
                        if (submittedConfirmation) setSubmittedConfirmation(null);
                      }}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-white/20 bg-black/25 px-4 py-3.5 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#f7e7cc] transition-colors disabled:opacity-60"
                    />
                  </div>
                )}
              </div>

              {requestCategory !== 'complaint' && (
                <div>
                  <label
                    htmlFor="contact-whatsapp"
                    className="block text-[12px] tracking-[0.1em] uppercase text-white/80 mb-2.5"
                  >
                    {requestCategory === 'enquiry'
                      ? 'WhatsApp Number'
                      : 'WhatsApp / Phone (Optional)'}
                  </label>
                  <input
                    id="contact-whatsapp"
                    name="whatsapp"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required={requestCategory === 'enquiry'}
                    disabled={isSubmitting}
                    value={whatsapp}
                    onChange={(e) => {
                      setWhatsapp(e.target.value);
                      if (submittedConfirmation) setSubmittedConfirmation(null);
                    }}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-white/20 bg-black/25 px-4 py-3.5 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#f7e7cc] transition-colors disabled:opacity-60"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="contact-description"
                  className="block text-[12px] tracking-[0.1em] uppercase text-white/80 mb-2.5"
                >
                  {requestCategory === 'complaint'
                    ? 'Complaint Details'
                    : requestCategory === 'privacy'
                      ? 'Privacy Request Details'
                      : 'Project description'}
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
                    if (submittedConfirmation) setSubmittedConfirmation(null);
                  }}
                  placeholder={
                    requestCategory === 'complaint'
                      ? 'Describe your concern or issue clearly so we can review and resolve it...'
                      : requestCategory === 'privacy'
                        ? 'Specify whether you are requesting data correction, deletion, consent withdrawal, or raising a privacy complaint...'
                        : 'Share your creative brief, deliverables, and timeline...'
                  }
                  className="w-full rounded-xl border border-white/20 bg-black/25 px-4 py-3.5 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#f7e7cc] transition-colors resize-none disabled:opacity-60"
                />
              </div>

              {/* Required Privacy Consent & Separate Optional Marketing Consent */}
              <div className="rounded-2xl border border-white/15 bg-black/20 p-4 sm:p-5 space-y-3.5">
                <div className="flex items-start gap-3 text-[13px] leading-[1.55] text-white/85">
                  <input
                    id="contact-privacy-consent"
                    name="privacy_consent"
                    type="checkbox"
                    required
                    disabled={isSubmitting}
                    checked={consentPrivacy}
                    onChange={(e) => {
                      setConsentPrivacy(e.target.checked);
                      if (error) setError('');
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/35 bg-black/40 accent-[#d6b98c] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7e7cc] disabled:opacity-60"
                  />
                  <div>
                    <label htmlFor="contact-privacy-consent" className="cursor-pointer">
                      I agree to the{' '}
                    </label>
                    <a
                      href="/privacy-policy"
                      onClick={(e) => handlePolicyLinkClick(e, '/privacy-policy')}
                      className="text-[#f7e7cc] underline decoration-[#d6b98c]/60 underline-offset-4 hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </a>
                    <label htmlFor="contact-privacy-consent" className="cursor-pointer">
                      {' '}
                      and consent to Nova Studio processing my submitted details solely to review
                      and respond to this{' '}
                      {requestCategory === 'complaint'
                        ? 'complaint'
                        : requestCategory === 'privacy'
                          ? 'privacy request'
                          : 'enquiry'}
                      . <span className="text-[#f7e7cc]">*</span>
                    </label>
                  </div>
                </div>

                {requestCategory === 'enquiry' && (
                  <label
                    htmlFor="contact-marketing-consent"
                    className="flex items-start gap-3 cursor-pointer text-[12.5px] leading-[1.55] text-white/70"
                  >
                    <input
                      id="contact-marketing-consent"
                      name="marketing_consent"
                      type="checkbox"
                      disabled={isSubmitting}
                      checked={consentMarketing}
                      onChange={(e) => setConsentMarketing(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/35 bg-black/40 accent-[#d6b98c] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7e7cc] disabled:opacity-60"
                    />
                    <span>
                      <span className="text-[#f7e7cc]">Optional:</span> I would also like to receive
                      occasional studio updates or service announcements from Nova Studio by email.
                      You may withdraw consent at any time.
                    </span>
                  </label>
                )}

                <p className="border-t border-white/10 pt-3 text-[11.5px] leading-[1.6] text-white/60">
                  Privacy notice: Submitted details are never displayed publicly and are sent over
                  HTTPS to handle your request. You may also email{' '}
                  <a
                    href={`mailto:${OFFICIAL_SUPPORT_EMAIL}`}
                    className="text-white/85 underline decoration-white/30 underline-offset-2 hover:text-[#f7e7cc] transition-colors"
                  >
                    {OFFICIAL_SUPPORT_EMAIL}
                  </a>{' '}
                  directly. See our{' '}
                  <a
                    href="/terms-and-conditions"
                    onClick={(e) => handlePolicyLinkClick(e, '/terms-and-conditions')}
                    className="text-white/80 underline decoration-white/30 underline-offset-2 hover:text-[#f7e7cc] transition-colors"
                  >
                    Terms &amp; Conditions
                  </a>{' '}
                  and{' '}
                  <a
                    href="/cookie-policy"
                    onClick={(e) => handlePolicyLinkClick(e, '/cookie-policy')}
                    className="text-white/80 underline decoration-white/30 underline-offset-2 hover:text-[#f7e7cc] transition-colors"
                  >
                    Cookie Policy
                  </a>
                  .
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-[#f7e7cc]/35 bg-black/35 p-3.5 text-[13px] text-[#f7e7cc] space-y-2"
                >
                  <p>{error}</p>
                  {deliveryFallbackMailto && (
                    <a
                      href={deliveryFallbackMailto}
                      className="inline-flex min-h-[36px] items-center rounded-full border border-[#f7e7cc]/45 px-4 py-1.5 text-[12.5px] font-medium text-white hover:bg-[#f7e7cc] hover:text-[#141417] transition-colors"
                    >
                      Open in Email App ({OFFICIAL_SUPPORT_EMAIL})
                    </a>
                  )}
                </div>
              )}

              {submittedConfirmation && (
                <div
                  role="status"
                  className="rounded-xl border border-[#f7e7cc]/40 bg-black/35 p-4 text-[13px] text-white/90 leading-relaxed"
                >
                  <p className="text-[#f7e7cc] font-medium mb-1">
                    {submittedConfirmation.category === 'complaint'
                      ? 'Complaint received — thank you'
                      : submittedConfirmation.category === 'privacy'
                        ? 'Privacy request received — thank you'
                        : 'Enquiry received — thank you'}
                  </p>
                  <p>
                    Your{' '}
                    <span className="text-white">{submittedConfirmation.detail}</span> submission
                    has been delivered to Nova Studio.{' '}
                    {submittedConfirmation.category === 'enquiry'
                      ? 'We will review your direction and follow up within 1–2 business days.'
                      : 'We aim to acknowledge within 2 business days and resolve within 30 calendar days.'}
                  </p>
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <span className="text-[12px] text-white/60">
                  {requestCategory === 'enquiry'
                    ? 'Direct enquiry · Typically replies within 1–2 business days'
                    : 'Acknowledged within 2 business days · Resolved within 30 calendar days'}
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {submittedConfirmation && (
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
