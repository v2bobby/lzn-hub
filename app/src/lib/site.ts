/**
 * Single place for brand facts and contact details.
 *
 * Contact details here are the only ones the site may show. Do not add phone
 * numbers, addresses, emails or social profiles anywhere else.
 */

/** Production origin. Every canonical URL and absolute share link uses it. */
export const SITE_URL = "https://www.lenzerhub.com";

export type TeamMember = {
  name: string;
  role: string;
  /** Paragraphs. Replace placeholder bios with real ones when available. */
  bio: string[];
  /** Where to reach this person. */
  contact: { label: string; href: string };
  /** True when the bio is a neutral placeholder rather than supplied copy. */
  placeholderBio?: boolean;
};

const EMAIL = "davidemeh@lenzerhub.com";

export const site = {
  name: "LenzerHub",
  tagline: "Know what you're signing before you sign it.",
  description:
    "LenzerHub reads your vendor contracts, flags the clauses that cost you money, and hands you replacement language you can send back the same day.",
  /** One sentence used in the footer brand column and in structured data. */
  summary:
    "Contract review for small and mid-sized companies that sign agreements without in-house counsel.",
  disclaimer:
    "LenzerHub is not a law firm and does not provide legal advice.",
  email: EMAIL,
  /** E.164, rendered as a tel: link everywhere it appears. */
  phone: "+2348107365207",
  location: { city: "Enugu", country: "Nigeria", countryCode: "NG" },
  /** No public social profiles yet. Add URLs here and they appear everywhere. */
  social: [] as { label: string; href: string }[],
  team: [
    {
      name: "Emeh David",
      role: "Founder",
      bio: [
        "Emeh David led product at a legal-tech company and spent years watching small businesses lose negotiations they did not know they were in. Not because the terms were outrageous, but because nobody on their side had time to read forty pages before a renewal date.",
        "He founded LenzerHub to close that gap: the clause knowledge a corporate legal team has, available to a company that does not have one.",
      ],
      contact: { label: EMAIL, href: `mailto:${EMAIL}` },
    },
    {
      name: "Rex George",
      role: "Co-founder",
      bio: ["Rex George is a co-founder of LenzerHub."],
      contact: {
        label: `Via ${EMAIL}`,
        href: `mailto:${EMAIL}?subject=${encodeURIComponent("For Rex George")}`,
      },
      placeholderBio: true,
    },
  ] satisfies TeamMember[],
} as const;

/** Formats an E.164 number for display without touching the tel: href. */
export function formatPhone(e164: string): string {
  const digits = e164.replace(/[^\d]/g, "");
  // Nigerian mobile: +234 810 736 5207
  if (digits.startsWith("234") && digits.length === 13) {
    return `+234 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return e164;
}

export function mailto(subject: string): string {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
}

/** "Work with us" topics. Each opens an email with the subject filled in. */
export const workWithUs = [
  { label: "Volume pricing", subject: "Volume pricing enquiry" },
  { label: "Partnerships", subject: "Partnership enquiry" },
  { label: "Press and media", subject: "Press enquiry" },
  { label: "Report a problem", subject: "Problem report" },
];
