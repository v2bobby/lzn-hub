/**
 * Page registry. The single source of truth for every public page:
 * navigation, the homepage directory, page headings and intros, "Next" links,
 * <title>/meta tags, structured data, sitemap.xml and llms.txt are all
 * generated from this list, so they cannot drift apart.
 */

export type PageKind =
  | "home"
  | "clauses"
  | "scoring"
  | "coverage"
  | "pricing"
  | "about"
  | "team"
  | "contact"
  | "legal";

export type PageDef = {
  path: string;
  kind: PageKind;
  /** Label in the main navigation and breadcrumbs. */
  label: string;
  /** Unique <title>. */
  title: string;
  /** Unique meta description, 120-160 characters. */
  description: string;
  /** One line used in the homepage directory, footer and llms.txt. */
  oneLiner: string;
  /** Visible page heading (h1) and the paragraph under it. */
  heading: string;
  intro: string;
  /** Shown in the main navigation. */
  inNav: boolean;
  /** Path of the page the "Next" link points to. */
  next?: string;
  /** Sitemap priority. */
  priority: number;
};

export const PAGES: PageDef[] = [
  {
    path: "/",
    kind: "home",
    label: "Home",
    title: "LenzerHub: contract review for companies without in-house counsel",
    description:
      "LenzerHub reads your vendor contracts, flags the clauses that cost you money, and hands you replacement language you can send back the same day.",
    oneLiner: "Contract review that flags costly clauses and drafts the replacement.",
    heading: "Know what you're signing.",
    intro:
      "Upload an agreement. LenzerHub marks every clause that costs you money, explains why in plain English, and gives you the replacement language to send back.",
    inNav: false,
    priority: 1,
  },
  {
    path: "/clauses",
    kind: "clauses",
    label: "What it catches",
    title: "What LenzerHub catches: eight contract clauses and their fixes",
    description:
      "The eight clause positions LenzerHub checks, from auto-renewal windows to liability caps, with the original wording, why it costs you, and what to send back.",
    oneLiner:
      "The eight clause positions in the library, each with replacement wording.",
    heading: "The eight clauses that decide the deal",
    intro:
      "Every finding comes with the original text, the reason it costs you, and language you can paste straight into a counter-proposal. Pick one and read it.",
    inNav: true,
    next: "/scoring",
    priority: 0.9,
  },
  {
    path: "/scoring",
    kind: "scoring",
    label: "Scoring",
    title: "How LenzerHub scores contract risk: weights and arithmetic",
    description:
      "How the LenzerHub risk score is calculated: fixed severity weights, a published formula, and an estimator you can try on the clauses in your own contract.",
    oneLiner: "How the 0 to 100 risk score is calculated, with a live estimator.",
    heading: "One number, and the arithmetic behind it",
    intro:
      "Severity weights are fixed and published. Choose a contract type, tick the clauses it contains, and watch the score move.",
    inNav: true,
    next: "/coverage",
    priority: 0.8,
  },
  {
    path: "/coverage",
    kind: "coverage",
    label: "Coverage",
    title: "Contract review coverage: eight categories LenzerHub inspects",
    description:
      "The eight clause categories LenzerHub inspects in vendor, SaaS and lease agreements, what it looks for in each, and what lands in your report.",
    oneLiner: "What gets inspected in each category, and what you get back.",
    heading: "Read across, not down",
    intro:
      "Eight categories, what gets inspected in each, and what actually lands in your report.",
    inNav: true,
    next: "/pricing",
    priority: 0.8,
  },
  {
    path: "/pricing",
    kind: "pricing",
    label: "Pricing",
    title: "LenzerHub pricing: free first review, Team and Volume plans",
    description:
      "LenzerHub pricing is based on how many contracts you sign a year: a free first review, a Team plan at $89 a month, and Volume pricing for larger libraries.",
    oneLiner: "Plans sized to how many agreements you sign a year.",
    heading: "Priced on how much you sign",
    intro:
      "One variable moves the cost: how many agreements cross your desk in a year. Move the slider to the honest number.",
    inNav: true,
    next: "/about",
    priority: 0.8,
  },
  {
    path: "/about",
    kind: "about",
    label: "About",
    title: "About LenzerHub: why it exists and how the clause library works",
    description:
      "Why LenzerHub exists, how its clause library and risk scoring are built, and what the product will and will not do for companies without a legal team.",
    oneLiner: "Why LenzerHub exists, how it is built, and what it is not.",
    heading: "Most bad contracts are signed by people who never read them",
    intro:
      "Not out of carelessness. A forty-page master services agreement arrives on a Thursday, the renewal is Monday, and the person responsible has nine other jobs. LenzerHub exists for that Thursday.",
    inNav: true,
    next: "/team",
    priority: 0.7,
  },
  {
    path: "/team",
    kind: "team",
    label: "Team",
    title: "LenzerHub team: Emeh David and Rex George",
    description:
      "Meet the people building LenzerHub, the contract review service for small and mid-sized companies: Emeh David, founder, and Rex George, co-founder.",
    oneLiner: "The founders building LenzerHub, and how to reach them.",
    heading: "The people building LenzerHub",
    intro:
      "LenzerHub is a small team based in Enugu, Nigeria. Here is who we are and how to reach us.",
    inNav: true,
    next: "/contact",
    priority: 0.6,
  },
  {
    path: "/contact",
    kind: "contact",
    label: "Contact",
    title: "Contact LenzerHub: email, phone and enquiries",
    description:
      "Contact LenzerHub about a contract question, volume pricing, partnerships or a problem with the product. Email, phone, and a message form.",
    oneLiner: "Email, phone and a message form for questions before you sign.",
    heading: "Ask before you sign",
    intro:
      "Questions about a specific clause, volume pricing, or something that is not working. Replies usually arrive within one business day.",
    inNav: true,
    next: "/",
    priority: 0.6,
  },
  {
    path: "/terms",
    kind: "legal",
    label: "Terms of service",
    title: "Terms of service | LenzerHub",
    description:
      "The terms that govern your use of LenzerHub, including what the service does, your account, acceptable use, fees, your content and liability.",
    oneLiner: "The terms that govern use of LenzerHub.",
    heading: "Terms of service",
    intro:
      "These terms govern your use of LenzerHub. They are written to be read, not to be survived. If something here is unclear, write to us and we will explain it in plain terms.",
    inNav: false,
    next: "/privacy",
    priority: 0.3,
  },
  {
    path: "/privacy",
    kind: "legal",
    label: "Privacy policy",
    title: "Privacy policy | LenzerHub",
    description:
      "What LenzerHub collects, why it is processed, how long it is kept, and the rights you have over your account data and the contracts you upload.",
    oneLiner: "What LenzerHub collects and the rights you have over it.",
    heading: "Privacy policy",
    intro:
      "This policy explains what we collect, why we collect it, and what you can ask us to do with it. Contracts are sensitive documents, so the short version is: we process them to produce your analysis and for nothing else.",
    inNav: false,
    next: "/contact",
    priority: 0.3,
  },
];

export const NAV_PAGES = PAGES.filter((page) => page.inNav);

export function getPage(path: string): PageDef {
  const page = PAGES.find((p) => p.path === path);
  if (!page) throw new Error(`No page registered for ${path}`);
  return page;
}

/** The pages listed in the homepage directory: everything in the nav. */
export const DIRECTORY_PAGES = NAV_PAGES;

/** Product pages and company pages, for the footer columns. */
export const PRODUCT_PAGES = PAGES.filter((p) =>
  ["clauses", "scoring", "coverage", "pricing"].includes(p.kind),
);
export const COMPANY_PAGES = PAGES.filter((p) =>
  ["about", "team", "contact"].includes(p.kind),
);
