/**
 * Plan catalogue. The pricing sizer picks one of these from the yearly
 * contract volume; the pricing page also lists all of them, and they are
 * published as /data/plans.json.
 */
export type Plan = {
  id: "solo" | "team" | "volume";
  name: string;
  price: string;
  cadence: string;
  /** Monthly cost in USD, or null when quoted. */
  monthlyCost: number | null;
  /** Price per extra contract on the free plan, in USD. */
  perContract?: number;
  covers: string;
  /** Highest yearly contract count the plan is sized for, or null for no cap. */
  maxContractsPerYear: number | null;
  includes: string[];
  cta: { label: string; to: string };
};

export const PLANS: Plan[] = [
  {
    id: "solo",
    name: "Single review",
    price: "Free",
    cadence: "first contract, then $39 each",
    monthlyCost: 0,
    perContract: 39,
    covers: "Up to 3 contracts a year",
    maxContractsPerYear: 3,
    includes: [
      "Full clause scan and severity scoring",
      "Replacement language for every finding",
      "Shareable analysis report",
    ],
    cta: { label: "Start with one contract", to: "/login?intent=register" },
  },
  {
    id: "team",
    name: "Team",
    price: "$89",
    cadence: "per month, billed annually",
    monthlyCost: 89,
    covers: "Up to 48 contracts a year",
    maxContractsPerYear: 48,
    includes: [
      "Everything in Single review",
      "Renewal alerts 60 days before every auto-renewal date",
      "Shared workspace for the whole contract history",
      "Benchmarks showing what similar companies negotiated",
    ],
    cta: { label: "Start a Team trial", to: "/login?intent=register" },
  },
  {
    id: "volume",
    name: "Volume",
    price: "Let's talk",
    cadence: "priced on your renewal calendar",
    monthlyCost: null,
    covers: "Unlimited contracts",
    maxContractsPerYear: null,
    includes: [
      "Everything in Team",
      "Bulk import of your existing agreement library",
      "Custom clause positions your counsel already approved",
      "Named contact for negotiation questions",
    ],
    cta: { label: "Talk to us", to: "/contact" },
  },
];

export function planFor(volume: number): Plan {
  return (
    PLANS.find(
      (plan) =>
        plan.maxContractsPerYear !== null && volume <= plan.maxContractsPerYear,
    ) ?? PLANS[PLANS.length - 1]
  );
}

/** Comparison baseline used on the pricing page. */
export const COUNSEL_HOURLY = 350;
export const COUNSEL_HOURS_PER_CONTRACT = 1.5;
