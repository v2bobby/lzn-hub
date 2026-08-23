/**
 * Single source of truth for the clause library and risk scoring.
 *
 * Both the tRPC analysis endpoint (server/contract-router.ts) and the public
 * marketing pages read from this file, so what a visitor sees on the homepage
 * is the same data the product actually returns.
 */

export type Severity = "critical" | "high" | "medium" | "low";

export type ContractType =
  | "saas"
  | "vendor"
  | "sow"
  | "freelancer"
  | "lease"
  | "other";

export type Clause = {
  id: string;
  clauseName: string;
  severity: Severity;
  category: string;
  /** Contract types this clause is commonly found in. */
  appliesTo: ContractType[];
  originalText: string;
  suggestedText: string;
  explanation: string;
  /** What negotiating this clause is typically worth, in plain terms. */
  leverage: string;
};

export const SEVERITY_WEIGHTS: Record<Severity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export const SEVERITY_ORDER: Severity[] = ["critical", "high", "medium", "low"];

export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const CONTRACT_TYPE_LABEL: Record<ContractType, string> = {
  saas: "SaaS agreement",
  vendor: "Vendor agreement",
  sow: "Statement of work",
  freelancer: "Freelancer contract",
  lease: "Office lease",
  other: "Other",
};

export const CLAUSE_LIBRARY: Clause[] = [
  {
    id: "auto-renewal",
    clauseName: "Auto-renewal window",
    severity: "critical",
    category: "Renewal terms",
    appliesTo: ["saas", "vendor", "lease", "other"],
    originalText:
      "This Agreement shall automatically renew for successive one-year terms unless either party provides written notice of termination at least 10 days prior to the end of the then-current term.",
    suggestedText:
      "This Agreement shall automatically renew for successive one-year terms unless either party provides written notice of termination at least 60 days prior to the end of the then-current term.",
    explanation:
      "A 10-day notice window is extremely restrictive. Most vendors accept 30 to 90 days. Miss it and you are locked into another full year before you can evaluate alternatives.",
    leverage: "Buys back a full renewal cycle of pricing leverage.",
  },
  {
    id: "liability-cap",
    clauseName: "Liability cap",
    severity: "critical",
    category: "Liability",
    appliesTo: ["saas", "vendor", "sow", "other"],
    originalText:
      "Vendor's total liability shall not exceed the total amount paid by Customer under this Agreement in the twelve months preceding the claim.",
    suggestedText:
      "Vendor's total liability shall not exceed the greater of (a) $500,000 or (b) the total amount paid by Customer under this Agreement in the twelve months preceding the claim.",
    explanation:
      "Capping liability at fees paid leaves you with no meaningful recourse if the vendor's negligence causes real damage. A floor is standard for small and mid-sized buyers.",
    leverage: "Sets a recovery floor independent of what you happen to spend.",
  },
  {
    id: "indemnification",
    clauseName: "Indemnification scope",
    severity: "high",
    category: "Indemnification",
    appliesTo: ["saas", "vendor", "sow", "freelancer", "other"],
    originalText:
      "Customer shall indemnify and hold harmless Vendor from any claims arising from Customer's use of the Services.",
    suggestedText:
      "Each party shall indemnify the other from third-party claims arising from the indemnifying party's negligence, willful misconduct, or breach of this Agreement.",
    explanation:
      "This is one-sided. As written you agree to protect the vendor from every claim, including ones caused by their own negligence. Mutual indemnification is the market norm.",
    leverage: "Moves you from carrying all the risk to carrying your share.",
  },
  {
    id: "data-ownership",
    clauseName: "Data ownership and reuse",
    severity: "high",
    category: "Data rights",
    appliesTo: ["saas", "vendor", "other"],
    originalText:
      "Vendor may use Customer Data to improve its services and for any other business purpose.",
    suggestedText:
      "Vendor may use aggregated, de-identified Customer Data solely to improve its services. Vendor shall not sell, license, or otherwise transfer Customer Data to third parties.",
    explanation:
      "\"Any other business purpose\" is broad enough to cover reselling insights derived from your data. Narrow the grant to service improvement on de-identified data.",
    leverage: "Keeps your operating data out of someone else's product.",
  },
  {
    id: "termination",
    clauseName: "Termination for convenience",
    severity: "medium",
    category: "Termination",
    appliesTo: ["saas", "vendor", "sow", "freelancer", "lease", "other"],
    originalText:
      "This Agreement may be terminated by either party for any reason upon 30 days written notice.",
    suggestedText:
      "This Agreement may be terminated by Customer for any reason upon 30 days written notice. Vendor may terminate only for material breach by Customer after a 60 day cure period.",
    explanation:
      "Symmetry sounds fair but is not. You are building a process on this vendor; they are not building anything on you. You should be able to leave faster than they can drop you.",
    leverage: "Protects continuity of anything you build on the vendor.",
  },
  {
    id: "sla",
    clauseName: "Service level commitment",
    severity: "medium",
    category: "Performance",
    appliesTo: ["saas", "vendor", "other"],
    originalText:
      "Vendor shall use commercially reasonable efforts to ensure the Services are available 99% of the time.",
    suggestedText:
      "Vendor shall ensure the Services are available 99.9% of the time, measured monthly. Downtime exceeding 4 hours in a month entitles Customer to a 10% monthly credit.",
    explanation:
      "99% permits more than seven hours of downtime a month with no remedy. 99.9% with service credits is the standard ask, and \"commercially reasonable efforts\" is not a commitment.",
    leverage: "Turns an aspiration into a measurable obligation.",
  },
  {
    id: "price-increase",
    clauseName: "Price increase cap",
    severity: "medium",
    category: "Pricing",
    appliesTo: ["saas", "vendor", "lease", "other"],
    originalText:
      "Vendor may increase pricing by up to 15% annually upon 30 days written notice.",
    suggestedText:
      "Vendor may increase pricing by up to 5% annually upon 90 days written notice. Increases exceeding 5% require Customer's written consent.",
    explanation:
      "15% a year compounds fast, and 30 days is not enough time to budget for it or run a replacement search. Cap the increase and extend the notice.",
    leverage: "Makes multi-year cost predictable enough to plan around.",
  },
  {
    id: "ip-feedback",
    clauseName: "Feedback and IP assignment",
    severity: "low",
    category: "Intellectual property",
    appliesTo: ["saas", "vendor", "sow", "freelancer", "other"],
    originalText:
      "Any suggestions or feedback provided by Customer may be used by Vendor without restriction.",
    suggestedText:
      "Any suggestions or feedback provided by Customer may be used by Vendor without restriction, provided Vendor does not disclose Customer's identity without consent.",
    explanation:
      "Common and usually acceptable. Worth adding an anonymity carve-out so your roadmap input is not publicly attributed to your company.",
    leverage: "Keeps your name off someone else's case study.",
  },
];

export function clausesForType(type: ContractType): Clause[] {
  const matches = CLAUSE_LIBRARY.filter((c) => c.appliesTo.includes(type));
  return matches.length ? matches : CLAUSE_LIBRARY;
}

/**
 * Weighted severity score, 0-100. Identical math on server and client.
 */
export function scoreClauses(clauses: Pick<Clause, "severity">[]): number {
  if (!clauses.length) return 0;
  const total = clauses.reduce((sum, c) => sum + SEVERITY_WEIGHTS[c.severity], 0);
  return Math.round((total / (clauses.length * 4)) * 100);
}

export function riskBand(score: number): {
  label: string;
  tone: "critical" | "high" | "medium" | "low";
} {
  if (score >= 75) return { label: "High risk", tone: "critical" };
  if (score >= 55) return { label: "Elevated risk", tone: "high" };
  if (score >= 35) return { label: "Moderate risk", tone: "medium" };
  return { label: "Low risk", tone: "low" };
}
