import { useState } from "react";
import { Link } from "react-router";
import ContractField from "@/components/ContractField";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Split } from "@/components/Split";
import { ClauseInspector } from "@/components/ClauseInspector";
import { RiskEstimator } from "@/components/RiskEstimator";
import { PlanSizer } from "@/components/PlanSizer";
import { severityTone } from "@/lib/severity";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { site } from "@/lib/site";
import {
  CLAUSE_LIBRARY,
  SEVERITY_LABEL,
  SEVERITY_ORDER,
  type Severity,
} from "@contracts/clause-library";

const COVERAGE = [
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

export default function Home() {
  useDocumentMeta(
    "LenzerHub — know what you are signing before you sign it",
    site.description,
  );

  const { isAuthenticated } = useAuth();
  const [focus, setFocus] = useState<Severity | "all">("all");

  const criticalCount = CLAUSE_LIBRARY.filter(
    (c) => c.severity === "critical",
  ).length;

  return (
    <div className="overflow-x-hidden">
      <SiteHeader overHero />

      <main id="main">
        {/* ── Hero: full viewport, 3D contract field ───────────────── */}
        <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink">
          <ContractField
            focus={focus}
            className="absolute inset-0 h-full w-full"
          />

          {/* Legibility floor for the type. Solid gradient, no glassmorphism. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, #0E1620 4%, rgba(14,22,32,0.86) 34%, rgba(14,22,32,0.30) 70%, rgba(14,22,32,0.55) 100%)",
            }}
          />

          <div className="shell relative z-10 pb-14 pt-[calc(var(--header-h)+3rem)] md:pb-20">
            <p className="eyebrow animate-rise-in text-insert">
              Contract review for small and mid-sized companies
            </p>

            <h1 className="display mt-6 max-w-[16ch] text-display-xl text-paper">
              Know what you're signing.
            </h1>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] lg:items-end">
              <p className="font-read text-[1.0625rem] leading-relaxed text-paper/70 md:text-[1.1875rem]">
                Upload an agreement. LenzerHub marks every clause that costs you
                money, explains why in plain English, and gives you the
                replacement language to send back.
              </p>

              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn btn-primary">
                    Open your workspace
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login?intent=register"
                      className="btn btn-primary"
                    >
                      Review your first contract free
                    </Link>
                    <a href="#clauses" className="btn btn-onink">
                      See what it catches
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* The severity legend is also the filter driving the 3D field. */}
            <div className="mt-12 border-t border-ink-line pt-6">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <span className="eyebrow text-paper/35">
                  {CLAUSE_LIBRARY.length} clause positions · {criticalCount}{" "}
                  critical
                </span>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFocus("all")}
                    aria-pressed={focus === "all"}
                    className={`rounded-sm border px-2.5 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] transition-colors duration-200 ${
                      focus === "all"
                        ? "border-paper/60 bg-paper/10 text-paper"
                        : "border-white/15 text-paper/50 hover:border-white/35 hover:text-paper"
                    }`}
                  >
                    All
                  </button>
                  {SEVERITY_ORDER.map((severity) => {
                    const active = focus === severity;
                    const tone = severityTone(severity);
                    return (
                      <button
                        key={severity}
                        type="button"
                        onClick={() => setFocus(active ? "all" : severity)}
                        aria-pressed={active}
                        className={`inline-flex items-center gap-2 rounded-sm border px-2.5 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] transition-colors duration-200 ${
                          active
                            ? "border-paper/60 bg-paper/10 text-paper"
                            : "border-white/15 text-paper/50 hover:border-white/35 hover:text-paper"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: tone.text }}
                        />
                        {SEVERITY_LABEL[severity]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── What it catches ──────────────────────────────────────── */}
        <Split
          id="clauses"
          eyebrow="What it catches"
          title="The eight clauses that decide the deal."
          lede="Every finding comes with the original text, the reason it costs you, and language you can paste straight into a counter-proposal. Pick one and read it."
          rail={
            <dl>
              <dt className="eyebrow text-graphite-light">Source</dt>
              <dd className="mt-1.5 font-read text-[0.9375rem] leading-relaxed text-graphite">
                This is the live clause library. The analysis endpoint reads the
                same file, so nothing here is a mock-up.
              </dd>
            </dl>
          }
        >
          <ClauseInspector filter={focus} onFilterChange={setFocus} />
        </Split>

        {/* ── Scoring ──────────────────────────────────────────────── */}
        <Split
          id="scoring"
          eyebrow="How scoring works"
          title="One number, and the arithmetic behind it."
          lede="Severity weights are fixed and published. Build a contract from the clauses on the left and watch the score move."
          tone="sunk"
        >
          <RiskEstimator />
        </Split>

        {/* ── Coverage ─────────────────────────────────────────────── */}
        <CoverageSection />

        {/* ── Pricing ──────────────────────────────────────────────── */}
        <Split
          id="pricing"
          eyebrow="Pricing"
          title="Priced on how much you sign."
          lede="One variable moves the cost: how many agreements cross your desk in a year. Move the slider to the honest number."
          tone="sunk"
        >
          <PlanSizer />
        </Split>

        {/* ── Founder ──────────────────────────────────────────────── */}
        <Split
          eyebrow="Who is behind it"
          title="Built by someone who watched it go wrong."
        >
          <div className="max-w-2xl">
            <p className="font-read text-[1.125rem] leading-relaxed text-graphite">
              {site.founder.name} led product at a legal-tech company and spent
              years watching small businesses lose negotiations they did not
              know they were in. Not because the terms were outrageous, but
              because nobody on their side had time to read forty pages before a
              renewal date.
            </p>
            <p className="mt-5 font-read text-[1.125rem] leading-relaxed text-graphite">
              LenzerHub closes that gap: the clause knowledge a corporate legal
              team has, available to a company that does not have one.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-paper-line pt-6">
              <div>
                <p className="text-sm font-semibold text-ink">
                  {site.founder.name}
                </p>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-graphite-light">
                  {site.founder.role}
                </p>
              </div>
              <a
                href={site.founder.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-graphite underline underline-offset-4 transition-colors hover:text-ink"
              >
                LinkedIn
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 9L9 3M9 3H4M9 3v5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                href={`mailto:${site.email}`}
                className="text-sm text-graphite underline underline-offset-4 transition-colors hover:text-ink"
              >
                {site.email}
              </a>
            </div>
          </div>
        </Split>

        <ClosingBand isAuthenticated={isAuthenticated} />
      </main>

      <SiteFooter />
    </div>
  );
}

function CoverageSection() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section
      id="coverage"
      ref={ref}
      className="reveal scroll-mt-24 border-t border-ink-line bg-ink text-paper"
    >
      <div className="shell py-20 md:py-28">
        <div className="grid gap-y-8 lg:grid-cols-[minmax(15rem,20rem)_1fr] lg:gap-x-16 xl:gap-x-24">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
            <p className="eyebrow text-insert">Coverage</p>
            <h2 className="display mt-4 text-display-md text-paper">
              Read across, not down.
            </h2>
            <p className="mt-5 max-w-read font-read text-[1.0625rem] leading-relaxed text-paper/60">
              Eight categories, what gets inspected in each, and what actually
              lands in your report.
            </p>
          </div>

          {/* Scrolls inside its own container so the page never moves sideways. */}
          <div className="-mx-[clamp(1.25rem,4vw,3.5rem)] overflow-x-auto px-[clamp(1.25rem,4vw,3.5rem)] lg:mx-0 lg:px-0">
            <table className="w-full min-w-[38rem] border-collapse text-left">
              <caption className="sr-only">
                Clause categories LenzerHub inspects and what each produces
              </caption>
              <thead>
                <tr className="border-b border-ink-line">
                  <th scope="col" className="eyebrow py-3 pr-6 text-paper/40">
                    Category
                  </th>
                  <th scope="col" className="eyebrow py-3 pr-6 text-paper/40">
                    What gets inspected
                  </th>
                  <th scope="col" className="eyebrow py-3 text-paper/40">
                    What you get back
                  </th>
                </tr>
              </thead>
              <tbody>
                {COVERAGE.map((row) => (
                  <tr
                    key={row.area}
                    className="border-b border-ink-line transition-colors duration-200 hover:bg-white/[0.03]"
                  >
                    <th
                      scope="row"
                      className="py-4 pr-6 align-top text-sm font-semibold text-paper"
                    >
                      {row.area}
                    </th>
                    <td className="py-4 pr-6 align-top text-sm leading-relaxed text-paper/55">
                      {row.checks}
                    </td>
                    <td className="py-4 align-top text-sm leading-relaxed text-paper/75">
                      {row.output}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClosingBand({ isAuthenticated }: { isAuthenticated: boolean }) {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className="reveal border-t border-paper-line bg-paper">
      <div className="shell py-24 md:py-32">
        <h2 className="display max-w-[14ch] text-display-lg text-ink">
          Your next renewal is already dated.
        </h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] lg:items-end">
          <p className="font-read text-[1.125rem] leading-relaxed text-graphite">
            Find out what is in the agreement before the notice window closes.
            The first review is free and takes about three minutes.
          </p>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary">
                Open your workspace
              </Link>
            ) : (
              <>
                <Link to="/login?intent=register" className="btn btn-primary">
                  Review a contract free
                </Link>
                <Link to="/contact" className="btn btn-outline">
                  Ask a question first
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
