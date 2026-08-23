/**
 * Single place for brand facts, navigation and contact details.
 * Anything that appears in more than one component lives here.
 */

export const site = {
  name: "LenzerHub",
  tagline: "Know what you are signing before you sign it.",
  description:
    "LenzerHub reads your vendor contracts, flags the clauses that cost you money, and hands you replacement language you can send back the same day.",
  email: "contactus@lenzerhub.com",
  /**
   * No public phone line yet. Set this to an E.164 string (e.g. "+14155550123")
   * and every contact surface will render it as a working tel: link.
   */
  phone: null as string | null,
  linkedin: "https://www.linkedin.com/in/david-emeh-956534309",
  founder: {
    name: "David Emeh",
    role: "Founder",
    linkedin: "https://www.linkedin.com/in/david-emeh-956534309",
  },
} as const;

/** Formats an E.164 number for display without touching the tel: href. */
export function formatPhone(e164: string): string {
  const digits = e164.replace(/[^\d]/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return e164;
}

export type NavItem = { label: string; to: string; kind: "route" | "anchor" };

/** Marketing navigation. Every entry resolves to a real destination. */
export const primaryNav: NavItem[] = [
  { label: "What it catches", to: "/#clauses", kind: "anchor" },
  { label: "Scoring", to: "/#scoring", kind: "anchor" },
  { label: "Coverage", to: "/#coverage", kind: "anchor" },
  { label: "Pricing", to: "/#pricing", kind: "anchor" },
  { label: "About", to: "/about", kind: "route" },
];

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Product",
    items: [
      { label: "What it catches", to: "/#clauses", kind: "anchor" },
      { label: "How scoring works", to: "/#scoring", kind: "anchor" },
      { label: "Coverage", to: "/#coverage", kind: "anchor" },
      { label: "Pricing", to: "/#pricing", kind: "anchor" },
      { label: "Your workspace", to: "/dashboard", kind: "route" },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "About", to: "/about", kind: "route" },
      { label: "Contact", to: "/contact", kind: "route" },
    ],
  },
  {
    heading: "Legal",
    items: [
      { label: "Terms of service", to: "/terms", kind: "route" },
      { label: "Privacy policy", to: "/privacy", kind: "route" },
    ],
  },
];
