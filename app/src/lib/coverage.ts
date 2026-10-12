/**
 * Coverage reference data: the clause categories LenzerHub inspects, what it
 * looks for in each, and what the report gives back. Rendered on /coverage and
 * published as /data/coverage.json.
 */
export type CoverageRow = { area: string; checks: string; output: string };

export const COVERAGE: CoverageRow[] = [
  {
    area: "Renewal terms",
    checks: "Notice windows, evergreen terms, renewal price locks",
    output: "The exact date you must send notice by",
  },
  {
    area: "Liability",
    checks: "Caps, carve-outs, consequential damage exclusions",
    output: "A recovery floor written in dollars, not fees paid",
  },
  {
    area: "Indemnification",
    checks: "One-way obligations, defence control, uncapped exposure",
    output: "Mutual language your counterparty will recognise",
  },
  {
    area: "Data rights",
    checks: "Reuse grants, sub-processor transfers, deletion on exit",
    output: "A narrowed grant limited to de-identified data",
  },
  {
    area: "Termination",
    checks: "Convenience rights, cure periods, wind-down obligations",
    output: "Exit terms weighted toward you, not the vendor",
  },
  {
    area: "Pricing",
    checks: "Uplift caps, notice periods, true-up and overage triggers",
    output: "A ceiling you can put in next year's budget",
  },
  {
    area: "Performance",
    checks: "Uptime commitments, measurement windows, service credits",
    output: "A remedy that costs the vendor something",
  },
  {
    area: "Intellectual property",
    checks: "Feedback assignment, work product ownership, publicity rights",
    output: "Your name kept off their marketing",
  },
];
