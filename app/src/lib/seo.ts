/**
 * Search, social and AI-crawler metadata, built from the page registry.
 *
 * Runs at build time (scripts/prerender.mjs, through the SSR bundle) to write
 * each page's <head>, its JSON-LD, the /data JSON files, sitemap.xml and
 * llms.txt. Nothing here touches the DOM.
 */
import {
  CLAUSE_LIBRARY,
  CONTRACT_TYPE_LABEL,
  SEVERITY_LABEL,
  SEVERITY_ORDER,
  SEVERITY_WEIGHTS,
  riskBand,
} from "@contracts/clause-library";
import { COVERAGE } from "./coverage";
import { PAGES, getPage, type PageDef } from "./pages";
import { COUNSEL_HOURLY, COUNSEL_HOURS_PER_CONTRACT, PLANS } from "./plans";
import {
  SITE_URL,
  companyLine,
  formatPhone,
  registeredAddress,
  registrationDate,
  site,
} from "./site";

export const SHARE_IMAGE = {
  url: `${SITE_URL}/og-image.png`,
  width: 1200,
  height: 630,
  alt: "LenzerHub: know what you're signing before you sign it.",
};

export const LOGO_URL = `${SITE_URL}/logo.png`;

/** Public data files, linked from their pages and listed in llms.txt. */
export const DATA_FILES = {
  clauses: {
    path: "/data/clause-library.json",
    title: "LenzerHub clause library",
    description:
      "Every clause position LenzerHub checks: severity, category, the wording that commonly appears, why it costs the buyer, and the replacement wording.",
    page: "/clauses",
  },
  coverage: {
    path: "/data/coverage.json",
    title: "LenzerHub coverage by category",
    description:
      "The eight clause categories LenzerHub inspects, what it looks for in each, and what the report returns.",
    page: "/coverage",
  },
  plans: {
    path: "/data/plans.json",
    title: "LenzerHub plans and pricing",
    description:
      "LenzerHub plans with prices in US dollars, what each covers, and the outside-counsel cost baseline used for comparison.",
    page: "/pricing",
  },
} as const;

export function absoluteUrl(path: string): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeText(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** JSON safe to place inside a <script> element. */
function scriptJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

/* ── Structured data ────────────────────────────────────────────────── */

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

function personId(name: string): string {
  return `${SITE_URL}/team#${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function personNodes() {
  return site.team.map((member) => ({
    "@type": "Person",
    "@id": personId(member.name),
    name: member.name,
    jobTitle: member.role,
    worksFor: { "@id": ORG_ID },
    url: absoluteUrl("/team"),
  }));
}

function organizationNode() {
  const node: Record<string, unknown> = {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    legalName: site.company.legalName,
    foundingDate: site.company.registeredOn,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "CAC registration number (Nigeria)",
      value: site.company.registrationNumber,
    },
    url: `${SITE_URL}/`,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
      width: 512,
      height: 512,
    },
    image: SHARE_IMAGE.url,
    description: site.summary,
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.company.address.street,
      addressLocality: site.company.address.locality,
      addressRegion: site.company.address.region,
      addressCountry: site.company.address.countryCode,
    },
    founder: site.team.map((member) => ({ "@id": personId(member.name) })),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: site.email,
      telephone: site.phone,
      availableLanguage: ["English"],
    },
  };
  if (site.social.length) {
    node.sameAs = site.social.map((profile) => profile.href);
  }
  return node;
}

function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: site.name,
    description: site.description,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

function breadcrumbNode(page: PageDef) {
  const items = [{ name: "Home", path: "/" }];
  if (page.path !== "/") items.push({ name: page.label, path: page.path });
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(page.path)}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function pageNode(page: PageDef) {
  const type =
    page.kind === "about" || page.kind === "team"
      ? "AboutPage"
      : page.kind === "contact"
        ? "ContactPage"
        : "WebPage";
  return {
    "@type": type,
    "@id": `${absoluteUrl(page.path)}#webpage`,
    url: absoluteUrl(page.path),
    name: page.title,
    description: page.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    breadcrumb: { "@id": `${absoluteUrl(page.path)}#breadcrumb` },
    primaryImageOfPage: { "@type": "ImageObject", url: SHARE_IMAGE.url },
    inLanguage: "en",
  };
}

function offerNodes() {
  return PLANS.map((plan) => {
    const offer: Record<string, unknown> = {
      "@type": "Offer",
      name: plan.name,
      description: `${plan.covers}. ${plan.includes.join(". ")}.`,
      url: absoluteUrl("/pricing"),
      priceCurrency: "USD",
    };
    if (plan.monthlyCost === 0) {
      offer.price = 0;
    } else if (plan.monthlyCost !== null) {
      offer.price = plan.monthlyCost;
      offer.priceSpecification = {
        "@type": "UnitPriceSpecification",
        price: plan.monthlyCost,
        priceCurrency: "USD",
        unitText: "MONTH",
        billingDuration: "P1Y",
      };
    }
    return offer;
  });
}

function softwareNode() {
  return {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#software`,
    name: site.name,
    url: `${SITE_URL}/`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web browser",
    description: site.description,
    publisher: { "@id": ORG_ID },
    offers: offerNodes(),
  };
}

function datasetNode(file: (typeof DATA_FILES)[keyof typeof DATA_FILES]) {
  return {
    "@type": "Dataset",
    "@id": `${absoluteUrl(file.path)}#dataset`,
    name: file.title,
    description: file.description,
    url: absoluteUrl(file.page),
    creator: { "@id": ORG_ID },
    isAccessibleForFree: true,
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "application/json",
      contentUrl: absoluteUrl(file.path),
    },
  };
}

function extraNodes(page: PageDef): Record<string, unknown>[] {
  switch (page.kind) {
    case "home":
      return [websiteNode(), softwareNode()];
    case "clauses":
      return [
        {
          "@type": "ItemList",
          name: "Clause positions LenzerHub checks",
          numberOfItems: CLAUSE_LIBRARY.length,
          itemListElement: CLAUSE_LIBRARY.map((clause, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: clause.clauseName,
            description: `${SEVERITY_LABEL[clause.severity]} severity. ${clause.explanation}`,
          })),
        },
        datasetNode(DATA_FILES.clauses),
      ];
    case "coverage":
      return [
        {
          "@type": "ItemList",
          name: "Clause categories LenzerHub inspects",
          numberOfItems: COVERAGE.length,
          itemListElement: COVERAGE.map((row, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: row.area,
            description: `Inspects: ${row.checks}. Returns: ${row.output}.`,
          })),
        },
        datasetNode(DATA_FILES.coverage),
      ];
    case "pricing":
      return [softwareNode(), datasetNode(DATA_FILES.plans)];
    case "team":
      return [
        {
          "@type": "ItemList",
          name: "LenzerHub team",
          itemListElement: site.team.map((member, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: { "@id": personId(member.name) },
          })),
        },
      ];
    default:
      return [];
  }
}

export function buildJsonLd(path: string): Record<string, unknown> {
  const page = getPage(path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(),
      ...personNodes(),
      pageNode(page),
      breadcrumbNode(page),
      ...extraNodes(page),
    ],
  };
}

/* ── <head> ─────────────────────────────────────────────────────────── */

function alternateDataLinks(page: PageDef): string[] {
  return Object.values(DATA_FILES)
    .filter((file) => file.page === page.path)
    .map(
      (file) =>
        `<link rel="alternate" type="application/json" href="${file.path}" title="${escapeAttr(file.title)}" />`,
    );
}

/** Every head tag that differs per page. */
export function buildHead(path: string): string {
  const page = getPage(path);
  const url = absoluteUrl(page.path);
  const title = escapeAttr(page.title);
  const description = escapeAttr(page.description);

  return [
    `<title>${escapeText(page.title)}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeAttr(site.name)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SHARE_IMAGE.url}" />`,
    `<meta property="og:image:width" content="${SHARE_IMAGE.width}" />`,
    `<meta property="og:image:height" content="${SHARE_IMAGE.height}" />`,
    `<meta property="og:image:alt" content="${escapeAttr(SHARE_IMAGE.alt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${SHARE_IMAGE.url}" />`,
    `<meta name="twitter:image:alt" content="${escapeAttr(SHARE_IMAGE.alt)}" />`,
    ...alternateDataLinks(page),
    `<script type="application/ld+json">${scriptJson(buildJsonLd(path))}</script>`,
  ].join("\n    ");
}

/**
 * Head for the client-only app shell (sign-in, workspace, reports, unknown
 * URLs). Those pages are private or duplicate the shell, so they are
 * kept out of search results.
 */
export function buildShellHead(): string {
  return [
    `<title>${escapeText(site.name)}</title>`,
    `<meta name="description" content="${escapeAttr(site.description)}" />`,
    `<meta name="robots" content="noindex, follow" />`,
    `<meta property="og:site_name" content="${escapeAttr(site.name)}" />`,
    `<meta property="og:image" content="${SHARE_IMAGE.url}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join("\n    ");
}

/* ── Public data files ──────────────────────────────────────────────── */

function riskBands() {
  const bands: { from: number; to: number; label: string }[] = [];
  for (let score = 0; score <= 100; score++) {
    const { label } = riskBand(score);
    const last = bands[bands.length - 1];
    if (last && last.label === label) last.to = score;
    else bands.push({ from: score, to: score, label });
  }
  return bands;
}

export function buildDataFiles(generated: string): Record<string, unknown> {
  const publisher = {
    name: site.name,
    legalName: site.company.legalName,
    registrationNumber: site.company.registrationNumber,
    url: `${SITE_URL}/`,
    email: site.email,
  };

  return {
    [DATA_FILES.clauses.path]: {
      name: DATA_FILES.clauses.title,
      description: DATA_FILES.clauses.description,
      url: absoluteUrl(DATA_FILES.clauses.page),
      publisher,
      generated,
      severityLevels: SEVERITY_ORDER.map((severity) => ({
        id: severity,
        label: SEVERITY_LABEL[severity],
        weight: SEVERITY_WEIGHTS[severity],
      })),
      contractTypes: Object.entries(CONTRACT_TYPE_LABEL).map(([id, label]) => ({
        id,
        label,
      })),
      scoring: {
        formula:
          "round(sum of severity weights of the clauses found / (number of clauses found x 4) x 100)",
        scale: { min: 0, max: 100 },
        bands: riskBands(),
      },
      clauses: CLAUSE_LIBRARY,
    },
    [DATA_FILES.coverage.path]: {
      name: DATA_FILES.coverage.title,
      description: DATA_FILES.coverage.description,
      url: absoluteUrl(DATA_FILES.coverage.page),
      publisher,
      generated,
      categories: COVERAGE,
    },
    [DATA_FILES.plans.path]: {
      name: DATA_FILES.plans.title,
      description: DATA_FILES.plans.description,
      url: absoluteUrl(DATA_FILES.plans.page),
      publisher,
      generated,
      currency: "USD",
      comparisonBaseline: {
        description: "Outside counsel reviewing and marking up one agreement",
        hourlyRate: COUNSEL_HOURLY,
        hoursPerContract: COUNSEL_HOURS_PER_CONTRACT,
      },
      plans: PLANS.map((plan) => ({
        ...plan,
        cta: { label: plan.cta.label, url: absoluteUrl(plan.cta.to) },
      })),
    },
  };
}

/* ── sitemap.xml and llms.txt ───────────────────────────────────────── */

export function buildSitemap(lastmod: string): string {
  const urls = PAGES.map(
    (page) => `  <url>
    <loc>${absoluteUrl(page.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`,
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function buildLlmsTxt(): string {
  const link = (page: PageDef) =>
    `- [${page.label}](${absoluteUrl(page.path)}): ${page.oneLiner}`;
  const main = PAGES.filter((p) => p.kind !== "legal");
  const legal = PAGES.filter((p) => p.kind === "legal");
  const data = Object.values(DATA_FILES).map(
    (file) => `- [${file.title} (JSON)](${absoluteUrl(file.path)}): ${file.description}`,
  );

  return `# ${site.name}

> ${site.name} is a contract review service for small and mid-sized companies that sign vendor, SaaS and lease agreements without in-house counsel. It compares an agreement against a curated library of ${CLAUSE_LIBRARY.length} clause positions, flags the clauses that cost the buyer money, explains each in plain English, gives a 0 to 100 risk score from published severity weights, and supplies replacement wording the buyer can send back.

Key facts:
- Clause library: ${CLAUSE_LIBRARY.length} positions across renewal, liability, indemnification, data rights, termination, pricing, performance and intellectual property.
- Risk score: fixed severity weights (critical ${SEVERITY_WEIGHTS.critical}, high ${SEVERITY_WEIGHTS.high}, medium ${SEVERITY_WEIGHTS.medium}, low ${SEVERITY_WEIGHTS.low}); the score is the sum of the weights found divided by the worst case for that many clauses.
- Pricing: first review free, then $39 per contract; Team plan $89 a month billed annually for up to 48 contracts a year; Volume pricing quoted.
- Team: ${site.team.map((m) => `${m.name} (${m.role})`).join(", ")}.
- Company: ${companyLine()}, registered on ${registrationDate()} under the ${site.company.act}. Registered office: ${registeredAddress()}.
- Contact: ${site.email}, ${formatPhone(site.phone)}.

Caveats:
- ${site.disclaimer} No attorney-client relationship is created by using it.
- Document upload is in development. Today the analysis matches the clause library against the agreement type the user selects, rather than parsing an uploaded file.
- Uploaded agreements are used to produce the user's analysis and are not used to train models.

## Pages

${main.map(link).join("\n")}

## Data

${data.join("\n")}

## Legal

${legal.map(link).join("\n")}
`;
}
