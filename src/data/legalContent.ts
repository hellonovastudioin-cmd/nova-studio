export type LegalRoutePath =
  | '/privacy-policy'
  | '/terms-and-conditions'
  | '/disclaimer'
  | '/cookie-policy'
  | '/contact-legal';

export type AppRoutePath = '/' | LegalRoutePath;

export type ContactRequestCategory = 'enquiry' | 'complaint' | 'privacy';

export const OFFICIAL_SUPPORT_EMAIL = 'hello.novastudio.in@gmail.com';

export interface LegalTextSegment {
  text: string;
  placeholder?: boolean;
  href?: LegalRoutePath | '/#contact' | `mailto:${string}`;
  label?: string;
}

export interface LegalSection {
  id: string;
  index: string;
  heading: string;
  paragraphs: Array<string | LegalTextSegment[]>;
  bullets?: Array<string | LegalTextSegment[]>;
}

export interface LegalPageDefinition {
  path: LegalRoutePath;
  navLabel: string;
  eyebrow: string;
  title: string;
  italicAccent: string;
  documentTitle: string;
  summary: string;
  effectiveDate: string;
  jurisdiction: string;
  sections: LegalSection[];
}

export const LEGAL_ROUTES: LegalRoutePath[] = [
  '/privacy-policy',
  '/terms-and-conditions',
  '/disclaimer',
  '/cookie-policy',
  '/contact-legal',
];

export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  const cleaned = pathname.replace(/\/+$/, '');
  return cleaned || '/';
}

export function isLegalRoute(pathname: string): pathname is LegalRoutePath {
  return (LEGAL_ROUTES as string[]).includes(normalizePathname(pathname));
}

export const LEGAL_PAGES: Record<LegalRoutePath, LegalPageDefinition> = {
  '/privacy-policy': {
    path: '/privacy-policy',
    navLabel: 'Privacy Policy',
    eyebrow: 'Legal · 01',
    title: 'Privacy',
    italicAccent: 'Policy',
    documentTitle: 'Privacy Policy — NOVA STUDIO',
    summary:
      'How Nova Studio handles personal information submitted through this website, your rights under Indian data protection law, and how to contact us or submit a privacy grievance.',
    effectiveDate: '[Insert Effective Date]',
    jurisdiction: 'India',
    sections: [
      {
        id: 'overview-controller',
        index: '01',
        heading: 'Overview & Business Details',
        paragraphs: [
          'This Privacy Policy explains how Nova Studio—an independent, founder-led creative and digital agency operating in India—collects, uses, stores, and protects personal information submitted through this website.',
          'Nova Studio operates independently with a collaborative team of creative professionals and is not currently incorporated as a Private Limited Company or LLP, nor currently registered under GST.',
          'We aim to align our practices with applicable Indian privacy and data protection laws, including the Information Technology Act, 2000 (and rules thereunder) and the Digital Personal Data Protection Act, 2023 (DPDP Act), as applicable.',
        ],
      },
      {
        id: 'data-collected',
        index: '02',
        heading: 'Information We Currently Collect',
        paragraphs: [
          'At present, Nova Studio does not offer user accounts, logins, or online payments on this website. We collect personal information only when you choose to contact us:',
        ],
        bullets: [
          'Contact Form Submissions: Your name, brand or company name (if provided), email address, WhatsApp number (when provided for project enquiries), selected request type (customer enquiry, complaint, or privacy request), and message details.',
          'Consent Selections: Records confirming your agreement to this Privacy Policy for handling your submission, plus your separate optional preference for studio updates.',
          'Direct Email Correspondence: Your email address and message content when you write to hello.novastudio.in@gmail.com.',
          'Standard Hosting Metadata: When pages load, our hosting provider (Vercel) may temporarily process standard technical request data (such as IP address, browser type, and timestamp) to deliver the site securely.',
        ],
      },
      {
        id: 'how-we-use-data',
        index: '03',
        heading: 'How We Use Your Information',
        paragraphs: [
          'We process the personal information you provide only for clear, lawful purposes:',
        ],
        bullets: [
          'Responding to customer enquiries, creative briefs, and project requests.',
          'Investigating and resolving customer complaints and support queries.',
          'Processing data correction, data deletion, consent withdrawal, and privacy grievance requests.',
          'Sending occasional studio updates only if you explicitly ticked the separate optional marketing consent checkbox (you may withdraw consent at any time).',
          'Protecting our website and contact form against spam or abuse.',
        ],
      },
      {
        id: 'third-party-services',
        index: '04',
        heading: 'Internal Access, Collaborators & Third-Party Infrastructure',
        paragraphs: [
          'We do not sell, rent, or publish customer submissions or personal information. Customer data is never exposed publicly on this website. Within Nova Studio, enquiries and project briefs are reviewed by the founder and, strictly on a need-to-know basis, independent collaborators supporting a project.',
          'To operate reliably, the following third-party providers process requests:',
        ],
        bullets: [
          'Web3Forms (api.web3forms.com): Securely transmits contact form submissions over HTTPS to Nova Studio when form delivery is enabled.',
          'Vercel: Hosts and delivers the website over global edge infrastructure.',
          'Google Fonts: Serves the Cormorant Garamond and DM Sans web fonts when pages load.',
        ],
      },
      {
        id: 'analytics-cookies-status',
        index: '05',
        heading: 'Analytics & Non-Essential Tracking',
        paragraphs: [
          [
            {
              text: 'This website does not currently use Google Analytics, advertising pixels, or non-essential tracking cookies. For full details, see our ',
            },
            { text: 'Cookie Policy', href: '/cookie-policy', label: 'Cookie Policy' },
            { text: '.' },
          ],
        ],
      },
      {
        id: 'future-payments',
        index: '06',
        heading: 'Future Payment Processing (Not Currently Active)',
        paragraphs: [
          'No online payments, card details, UPI credentials, or financial transactions are collected or processed on this website at this time.',
          [
            {
              text: 'Online payments are planned for a future update. Before any payment functionality goes live, this Privacy Policy will be updated to disclose the authorized payment partner (',
            },
            { text: '[Future Payment Gateway Name]', placeholder: true },
            {
              text: '), billing recordkeeping practices, and applicable security terms.',
            },
          ],
        ],
      },
      {
        id: 'retention-security',
        index: '07',
        heading: 'Data Retention & Security',
        paragraphs: [
          [
            {
              text: 'We retain enquiry, support, and email records only as long as reasonably necessary to respond to you, resolve complaints, honour privacy requests, or meet Indian legal obligations (typically ',
            },
            { text: '[Insert Retention Period, e.g., 24 months]', placeholder: true },
            { text: ' unless an ongoing engagement or statutory obligation requires otherwise).' },
          ],
          'We apply reasonable administrative and technical safeguards to protect personal information submitted to us.',
        ],
      },
      {
        id: 'contact-grievance-redressal',
        index: '08',
        heading: 'Contact Us & Grievance Redressal',
        paragraphs: [
          'At Nova Studio (India), you have the right to request access to, correction of, or deletion of your personal information, to withdraw consent at any time, and to raise privacy complaints or grievances.',
          [
            { text: 'Official Privacy Contact Email: ' },
            {
              text: 'hello.novastudio.in@gmail.com',
              href: 'mailto:hello.novastudio.in@gmail.com?subject=Privacy%20Request%20%E2%80%93%20Nova%20Studio',
              label: 'hello.novastudio.in@gmail.com',
            },
            { text: ' · Contact Desk: Nova Studio Customer Support & Privacy Grievance Desk.' },
          ],
          'How to submit a privacy request or grievance:',
        ],
        bullets: [
          'Business Name: Nova Studio (Country: India)',
          [
            { text: 'Privacy Contact & Complaint Instructions: Send an email to ' },
            {
              text: 'hello.novastudio.in@gmail.com',
              href: 'mailto:hello.novastudio.in@gmail.com?subject=Privacy%20Request%20%E2%80%93%20Nova%20Studio',
              label: 'hello.novastudio.in@gmail.com',
            },
            {
              text: ' using the subject line "Privacy Request – Nova Studio", or select the Privacy Request option on our ',
            },
            { text: 'Contact Us', href: '/contact-legal', label: 'Contact Us' },
            { text: ' page.' },
          ],
          'Personal Data Correction Requests: Specify the inaccurate or outdated information you submitted and provide the corrected details so we can update our records.',
          'Personal Data Deletion Requests: Request deletion/erasure of personal data you shared with us (subject to records required to be kept under applicable Indian law).',
          'Consent Withdrawal Requests: Notify us that you wish to withdraw consent for marketing updates or ongoing processing; withdrawal applies prospectively without affecting earlier lawful processing.',
          'Grievance Submission Process: (1) Send your request or complaint to hello.novastudio.in@gmail.com; (2) include your name, contact email, and a clear description of your request or concern; (3) we review your submission and may ask for verification details if needed to protect your data; (4) we communicate the outcome or next steps to your provided email address.',
          'Response Timelines: We aim to acknowledge privacy requests and complaints within 2 business days and work towards resolving them within 30 calendar days, depending on the complexity of the matter. Where a shorter or specific statutory timeline applies under Indian law, we will follow the legal requirement.',
        ],
      },
    ],
  },

  '/terms-and-conditions': {
    path: '/terms-and-conditions',
    navLabel: 'Terms & Conditions',
    eyebrow: 'Legal · 02',
    title: 'Terms &',
    italicAccent: 'Conditions',
    documentTitle: 'Terms & Conditions — NOVA STUDIO',
    summary:
      'Terms governing your use of the Nova Studio website, customer support and complaint resolution, intellectual property, and future-ready billing structure.',
    effectiveDate: '[Insert Effective Date]',
    jurisdiction: 'India',
    sections: [
      {
        id: 'acceptance',
        index: '01',
        heading: 'Acceptance of Terms',
        paragraphs: [
          'By accessing or browsing this website operated by Nova Studio—an independent, founder-led creative and digital agency operating in India (not currently incorporated as a Private Limited Company or LLP)—you agree to comply with these Terms & Conditions and applicable laws.',
          'If you do not agree with any part of these terms, please discontinue using this website.',
        ],
      },
      {
        id: 'agency-scope',
        index: '02',
        heading: 'Agency Services & Non-Binding Enquiries',
        paragraphs: [
          'Descriptions of creative direction, film, photography, digital experiences, brand campaigns, packages, and retainer tiers on this website are provided for general information and scoping enquiries.',
          'Submitting an enquiry form or selecting an offering does not create a binding client-agency contract. Any project engagement becomes binding only when confirmed in a written Proposal, Statement of Work (SOW), or Service Agreement agreed by both parties.',
        ],
      },
      {
        id: 'intellectual-property',
        index: '03',
        heading: 'Intellectual Property',
        paragraphs: [
          'All visual treatments, 3D motion sequences, graphics, copy, layouts, brand marks, and website code displayed on this site belong to or are licensed to Nova Studio and are protected under Indian and international copyright and intellectual property laws.',
          'You may browse this website to evaluate our services, but you may not copy, scrape, redistribute, or commercially exploit site assets without prior written consent.',
        ],
      },
      {
        id: 'future-payments-billing',
        index: '04',
        heading: 'Future Payments, Pricing & Billing Terms (Currently Inactive)',
        paragraphs: [
          'Online payment collection, automated checkouts, and recurring card or UPI billing are not currently active on this website. Nothing on this site processes financial transactions today.',
          'Nova Studio is not currently registered under GST and does not collect GST on this website.',
          [
            {
              text: 'In preparation for future payment functionality, any future online payments enabled on this website will be governed by updated commercial clauses covering ',
            },
            { text: '[Future Payment Processor / Gateway]', placeholder: true },
            {
              text: ', milestone deposits, applicable Indian tax status at that time, currency terms (INR / ',
            },
            { text: '[Applicable Currencies]', placeholder: true },
            { text: '), and written cancellation/refund terms (' },
            { text: '[Insert Future Refund & Cancellation Terms]', placeholder: true },
            {
              text: '). Until online payments are formally activated, any agreed client fees are handled separately under written arrangements.',
            },
          ],
        ],
      },
      {
        id: 'acceptable-use',
        index: '05',
        heading: 'Acceptable Use',
        paragraphs: [
          'You agree not to misuse this website, submit automated spam or false enquiries, attempt unauthorized access to hosting infrastructure, or disrupt website availability.',
        ],
      },
      {
        id: 'liability',
        index: '06',
        heading: 'Limitation of Liability',
        paragraphs: [
          'To the maximum extent permitted under applicable Indian law (including without limiting statutory consumer rights), Nova Studio shall not be liable for indirect, incidental, special, or consequential damages arising from your use or inability to use this website.',
        ],
      },
      {
        id: 'customer-support-complaints',
        index: '07',
        heading: 'Customer Support & Complaints',
        paragraphs: [
          'Nova Studio is committed to clear communication and fair handling of website, service, and customer complaints in line with applicable Indian consumer protection standards.',
          [
            { text: 'Official Customer Support Email: ' },
            {
              text: 'hello.novastudio.in@gmail.com',
              href: 'mailto:hello.novastudio.in@gmail.com?subject=Customer%20Complaint%20%E2%80%93%20Nova%20Studio',
              label: 'hello.novastudio.in@gmail.com',
            },
            { text: ' (handled by the Nova Studio Customer Support & Privacy Grievance Desk).' },
          ],
        ],
        bullets: [
          [
            { text: 'How to Report Issues or Raise a Complaint: Email ' },
            {
              text: 'hello.novastudio.in@gmail.com',
              href: 'mailto:hello.novastudio.in@gmail.com?subject=Customer%20Complaint%20%E2%80%93%20Nova%20Studio',
              label: 'hello.novastudio.in@gmail.com',
            },
            { text: ' or use the Complaint submission option on our ' },
            { text: 'Contact Us', href: '/contact-legal', label: 'Contact Us' },
            { text: ' page.' },
          ],
          'What to Include: Your name, contact email address, the service or website page concerned, and a clear description of the issue or complaint.',
          'Review & Response Timeline: We aim to acknowledge complaints within 2 business days, request any clarifying information if needed, and work towards resolving concerns within 30 calendar days (or any shorter statutory timeline required under Indian consumer law).',
          'Statutory Rights Preserved: Nothing in these Terms & Conditions restricts any rights or remedies available to consumers under Indian law.',
        ],
      },
      {
        id: 'governing-law',
        index: '08',
        heading: 'Governing Law & Jurisdiction',
        paragraphs: [
          [
            {
              text: 'These Terms & Conditions are governed by the laws of India. Any disputes arising from or relating to this website shall be subject to the competent courts in ',
            },
            { text: '[City, State, India]', placeholder: true },
            { text: ', subject to applicable Indian consumer protection jurisdiction rules.' },
          ],
        ],
      },
    ],
  },

  '/disclaimer': {
    path: '/disclaimer',
    navLabel: 'Disclaimer',
    eyebrow: 'Legal · 03',
    title: 'Studio',
    italicAccent: 'Disclaimer',
    documentTitle: 'Disclaimer — NOVA STUDIO',
    summary:
      'Clarifications regarding illustrative style examples, indicative agency pricing, technical availability, and third-party infrastructure.',
    effectiveDate: '[Insert Effective Date]',
    jurisdiction: 'India',
    sections: [
      {
        id: 'general-information',
        index: '01',
        heading: 'General Informational Nature',
        paragraphs: [
          'All information, creative direction examples, and service descriptions on this website are provided in good faith for general showcase and informational purposes.',
          'Final deliverables, timelines, and commercial terms are confirmed only in written client proposals and agreements.',
        ],
      },
      {
        id: 'concept-studies',
        index: '02',
        heading: 'Illustrative Style Examples',
        paragraphs: [
          'Visual demonstrations displayed in Our Creative Perspective represent Nova Studio’s design methodology and style concepts, not commissioned client work, and do not imply endorsement by external entities.',
        ],
      },
      {
        id: 'pricing-outcomes',
        index: '03',
        heading: 'Indicative Scope & Project Results',
        paragraphs: [
          'Starting figures or scope outlines shown in Packages & Retainers are indicative references only. Final fees and deliverables depend on specific project briefs and signed agreements.',
          'Creative outcomes and audience response vary depending on external market factors beyond production alone, and specific commercial outcomes cannot be guaranteed.',
        ],
      },
      {
        id: 'no-professional-advice',
        index: '04',
        heading: 'No Legal, Tax, or Financial Advice',
        paragraphs: [
          'Information on this website—including policy pages—is published for transparency and operational clarity and does not constitute formal legal, regulatory, or tax advice.',
        ],
      },
      {
        id: 'third-party-availability',
        index: '05',
        heading: 'Third-Party Services & Availability',
        paragraphs: [
          'Website delivery (Vercel), typography loading (Google Fonts), and contact form routing (Web3Forms) rely on external infrastructure providers. Nova Studio is not responsible for temporary outages or policies of independent third-party platforms.',
        ],
      },
    ],
  },

  '/cookie-policy': {
    path: '/cookie-policy',
    navLabel: 'Cookie Policy',
    eyebrow: 'Legal · 04',
    title: 'Cookie',
    italicAccent: 'Policy',
    documentTitle: 'Cookie Policy — NOVA STUDIO',
    summary:
      'An accurate, plain-language statement of how cookies and browser storage are—and are not—used on the Nova Studio website today.',
    effectiveDate: '[Insert Effective Date]',
    jurisdiction: 'India',
    sections: [
      {
        id: 'current-cookie-status',
        index: '01',
        heading: 'Current Cookie & Tracking Status',
        paragraphs: [
          'Nova Studio does not currently set non-essential cookies, advertising cookies, or third-party analytics cookies (such as Google Analytics) on your browser, nor does this site store tracking identifiers in localStorage or sessionStorage.',
          'Because no non-essential cookies or tracking scripts are currently active, a cookie consent banner is intentionally not displayed.',
        ],
      },
      {
        id: 'technical-requests',
        index: '02',
        heading: 'Essential Delivery & Third-Party Requests',
        paragraphs: [
          'When you visit this website, standard browser-to-server network requests occur strictly to render pages and process actions you initiate:',
        ],
        bullets: [
          'Vercel Hosting: Delivers website files and processes transient request metadata strictly necessary for security, caching, and reliable delivery.',
          'Google Fonts: Serves web fonts (Cormorant Garamond and DM Sans) when pages load.',
          'Web3Forms: Called only when you actively submit the contact form.',
        ],
      },
      {
        id: 'browser-controls',
        index: '03',
        heading: 'Managing Cookies in Your Browser',
        paragraphs: [
          'You can inspect, block, or clear cookies and site data at any time through your browser settings (such as Chrome, Safari, Firefox, or Microsoft Edge).',
        ],
      },
      {
        id: 'future-updates',
        index: '04',
        heading: 'Future Analytics or Cookies',
        paragraphs: [
          'If Nova Studio introduces analytics or non-essential cookies in the future, we will update this Cookie Policy beforehand and implement an appropriate consent mechanism prior to activating any non-essential storage or tracking.',
        ],
      },
    ],
  },

  '/contact-legal': {
    path: '/contact-legal',
    navLabel: 'Contact Us',
    eyebrow: 'Legal · 05',
    title: 'Contact Us &',
    italicAccent: 'Grievance',
    documentTitle: 'Contact Us & Grievance Redressal — NOVA STUDIO',
    summary:
      'At Nova Studio, we value your privacy and are committed to addressing enquiries, customer complaints, and privacy-related requests promptly.',
    effectiveDate: '[Insert Effective Date]',
    jurisdiction: 'India',
    sections: [
      {
        id: 'business-identity',
        index: '01',
        heading: 'Business Information',
        paragraphs: [
          'If you have any questions about our services, website, privacy practices, or personal information handling, you can reach us using the verified details below.',
        ],
        bullets: [
          'Brand / Trading Name: Nova Studio',
          'Business Description: Independent, founder-led creative and digital agency.',
          'Country of Operation: India',
          'Operating Structure: Founder-led team with independent collaborators.',
          'Business Incorporation: Not currently incorporated as a Private Limited Company or LLP.',
          'GST Registration: Not currently registered under GST.',
          [
            { text: 'Customer Support Email: ' },
            {
              text: 'hello.novastudio.in@gmail.com',
              href: 'mailto:hello.novastudio.in@gmail.com',
              label: 'hello.novastudio.in@gmail.com',
            },
          ],
          [
            { text: 'Privacy Contact Email: ' },
            {
              text: 'hello.novastudio.in@gmail.com',
              href: 'mailto:hello.novastudio.in@gmail.com?subject=Privacy%20Request%20%E2%80%93%20Nova%20Studio',
              label: 'hello.novastudio.in@gmail.com',
            },
          ],
          [
            { text: 'Customer Complaints Email: ' },
            {
              text: 'hello.novastudio.in@gmail.com',
              href: 'mailto:hello.novastudio.in@gmail.com?subject=Customer%20Complaint%20%E2%80%93%20Nova%20Studio',
              label: 'hello.novastudio.in@gmail.com',
            },
          ],
        ],
      },
      {
        id: 'about-our-team',
        index: '02',
        heading: 'About Our Team',
        paragraphs: [
          'Nova Studio is a founder-led creative agency supported by a collaborative team of creative professionals.',
          'The founder oversees the business, while team members contribute to projects, creative work, and operational decisions. The team works collaboratively, with responsibilities and earnings handled according to the arrangements between the founder and individual collaborators.',
          'Nova Studio is currently operating independently and is not represented as an incorporated company or LLP.',
        ],
      },
      {
        id: 'customer-support',
        index: '03',
        heading: 'Customer Support',
        paragraphs: [
          'For business enquiries, customer support, technical issues, or complaints:',
        ],
        bullets: [
          [
            { text: 'Email: ' },
            {
              text: 'hello.novastudio.in@gmail.com',
              href: 'mailto:hello.novastudio.in@gmail.com?subject=Customer%20Enquiry%20%E2%80%93%20Nova%20Studio',
              label: 'hello.novastudio.in@gmail.com',
            },
          ],
          [
            { text: 'Or submit directly via the ' },
            { text: 'Contact Form', href: '/#contact', label: 'Contact Form' },
            { text: ' on our home page (select Customer Enquiry or Complaint).' },
          ],
        ],
      },
      {
        id: 'privacy-requests',
        index: '04',
        heading: 'Privacy Complaints & Data Requests',
        paragraphs: [
          'For matters relating to personal information—including requests for data access, correction, deletion, withdrawal of consent, or privacy complaints—please contact:',
          'Please use the subject line "Privacy Request – Nova Studio" when emailing so your request can be identified and handled appropriately.',
        ],
        bullets: [
          [
            { text: 'Privacy Contact Email: ' },
            {
              text: 'hello.novastudio.in@gmail.com',
              href: 'mailto:hello.novastudio.in@gmail.com?subject=Privacy%20Request%20%E2%80%93%20Nova%20Studio',
              label: 'hello.novastudio.in@gmail.com',
            },
          ],
        ],
      },
      {
        id: 'grievance-redressal-process',
        index: '05',
        heading: 'Grievance Redressal Process',
        paragraphs: [
          'We aim to acknowledge complaints and privacy requests within 2 business days and work towards resolving them within 30 calendar days, depending on the nature and complexity of the issue.',
          'Where a different statutory timeline applies under Indian law, we will follow the applicable legal requirement.',
        ],
        bullets: [
          [
            { text: '1. Send your complaint or privacy request to ' },
            {
              text: 'hello.novastudio.in@gmail.com',
              href: 'mailto:hello.novastudio.in@gmail.com',
              label: 'hello.novastudio.in@gmail.com',
            },
            { text: ' (or use the dedicated Complaint / Privacy Request options above).' },
          ],
          '2. Include your name, contact email, and a clear description of your concern or request.',
          '3. We will review your submission and may ask for reasonable verification or additional information if necessary.',
          '4. We will communicate the outcome or next steps using your provided email address.',
        ],
      },
      {
        id: 'grievance-contact',
        index: '06',
        heading: 'Grievance Contact',
        paragraphs: [
          'All customer complaints and privacy grievances are handled directly through Nova Studio’s dedicated desk:',
        ],
        bullets: [
          'Organisation: Nova Studio (Independent, founder-led creative and digital agency)',
          'Contact Point: Nova Studio Customer Support & Privacy Grievance Desk',
          [
            { text: 'Email: ' },
            {
              text: 'hello.novastudio.in@gmail.com',
              href: 'mailto:hello.novastudio.in@gmail.com',
              label: 'hello.novastudio.in@gmail.com',
            },
          ],
        ],
      },
      {
        id: 'additional-information',
        index: '07',
        heading: 'Additional Information & Payment Status',
        paragraphs: [
          'We encourage customers and visitors to contact us directly so that we have an opportunity to address concerns promptly.',
          'Nothing in this notice limits any statutory rights available to individuals under applicable Indian data protection (DPDP Act, 2023) or consumer protection laws.',
          'Website Scope & Payments: This website collects contact form submissions and direct email correspondence only. Online payments are planned for the future and are not currently active.',
        ],
      },
    ],
  },
};
