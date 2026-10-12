import { useState } from "react";
import { Link } from "react-router";
import ContractField from "@/components/ContractField";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ClauseDiff } from "@/components/Diff";
import { SeverityBadge } from "@/components/Severity";
import { severityTone } from "@/lib/severity";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { DIRECTORY_PAGES, getPage } from "@/lib/pages";
import {
  CLAUSE_LIBRARY,
  SEVERITY_LABEL,
  SEVERITY_ORDER,
  SEVERITY_WEIGHTS,
  type Severity,
} from "@contracts/clause-library";

export default function Home() {
  const page = getPage("/");
  useDocumentMeta(page.title, page.description, page.path);

  const { isAuthenticated } = useAuth();
  const [focus, setFocus] = useState<Severity | "all">("all");

  const criticalCount = CLAUSE_LIBRARY.filter(
    (c) => c.severity === "critical",
  ).length;
  const example = CLAUSE_LIBRARY[0];

  const chip = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors duration-150 ${
      active
        ? "border-white/70 bg-white/10 text-white"
        : "border-white/20 text-white/70 hover:border-white/45 hover:text-white"
    }`;

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-paper">
      <SiteHeader overHero />

      <main id="main" className="flex-1">
        {/* Hero, with the contract field behind it */}
        <section className="relative flex min-h-[min(100svh,52rem)] flex-col justify-end overflow-hidden bg-ink">
          <ContractField focus={focus} className="absolute inset-0 h-full w-full" />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, #0E1620 8%, rgba(14,22,32,0.88) 40%, rgba(14,22,32,0.45) 75%, rgba(14,22,32,0.6) 100%)",
            }}
          />

          <div className="shell relative z-10 pb-12 pt-[calc(var(--header-h)+4rem)] md:pb-16">
            <p className="text-[0.9375rem] text-white/70">
              Contract review for small and mid-sized companies
            </p>
            <h1 className="display mt-3 max-w-3xl text-display-xl text-white">
              {page.heading}
            </h1>
            <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-white/75 md:text-lg">
              {page.intro}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary">
                  Open your workspace
                </Link>
              ) : (
                <>
                  <Link to="/login?intent=register" className="btn btn-primary">
                    Review your first contract free
                  </Link>
                  <Link to="/clauses" className="btn btn-onink">
                    See what it catches
                  </Link>
                </>
              )}
            </div>

            {/* The severity legend filters the contract field behind the text. */}
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-5">
              <span className="text-sm text-white/60">
                {CLAUSE_LIBRARY.length} clause positions, {criticalCount} critical
              </span>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Highlight by severity">
                <button
                  type="button"
                  onClick={() => setFocus("all")}
                  aria-pressed={focus === "all"}
                  className={chip(focus === "all")}
                >
                  All
                </button>
                {SEVERITY_ORDER.map((severity) => {
                  const active = focus === severity;
                  return (
                    <button
                      key={severity}
                      type="button"
                      onClick={() => setFocus(active ? "all" : severity)}
                      aria-pressed={active}
                      className={chip(active)}
                    >
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: severityTone(severity).text }}
                      />
                      {SEVERITY_LABEL[severity]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Directory of every page */}
        <section aria-labelledby="explore-heading" className="shell py-14 md:py-16">
          <h2 id="explore-heading" className="display text-display-md text-ink">
            Explore LenzerHub
          </h2>
          <ul className="mt-6 divide-y divide-paper-line overflow-hidden rounded-lg border border-paper-line bg-paper-raised">
            {DIRECTORY_PAGES.map((entry) => (
              <li key={entry.path}>
                <Link
                  to={entry.path}
                  className="group flex flex-col gap-1 px-5 py-4 transition-colors hover:bg-paper sm:flex-row sm:items-center sm:gap-6"
                >
                  <span className="text-[1.0625rem] font-semibold text-ink sm:w-48 sm:shrink-0">
                    {entry.label}
                  </span>
                  <span className="flex-1 text-[0.9375rem] text-graphite">
                    {entry.oneLiner}
                  </span>
                  <span aria-hidden="true" className="hidden text-graphite group-hover:text-ink sm:inline">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Summary: one finding, as it arrives */}
        <section aria-labelledby="example-heading" className="border-t border-paper-line bg-paper-raised">
          <div className="shell grid gap-8 py-14 md:py-16 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-12">
            <div>
              <h2 id="example-heading" className="display text-display-md text-ink">
                A finding, as you receive it
              </h2>
              <p className="lede mt-3">
                The original wording, why it costs you, and the wording to send
                back. This is one of the {CLAUSE_LIBRARY.length} positions in the
                library.
              </p>
              <Link to="/clauses" className="link mt-5 inline-block text-[0.9375rem]">
                See all {CLAUSE_LIBRARY.length} clauses
              </Link>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-ink">{example.clauseName}</h3>
                <SeverityBadge severity={example.severity} />
              </div>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-graphite">
                {example.explanation}
              </p>
              <div className="mt-5">
                <ClauseDiff
                  original={example.originalText}
                  suggested={example.suggestedText}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Summary: scoring */}
        <section aria-labelledby="score-heading" className="border-t border-paper-line">
          <div className="shell grid gap-8 py-14 md:py-16 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-12">
            <div>
              <h2 id="score-heading" className="display text-display-md text-ink">
                One score, with the working shown
              </h2>
              <p className="lede mt-3">
                Each clause found carries a fixed weight. The score is their sum
                over the worst case for that many clauses, from 0 to 100.
              </p>
              <Link to="/scoring" className="link mt-5 inline-block text-[0.9375rem]">
                Try the score estimator
              </Link>
            </div>
            <dl className="grid grid-cols-2 gap-3 self-start sm:grid-cols-4">
              {SEVERITY_ORDER.map((severity) => (
                <div key={severity} className="panel p-4">
                  <dt className="flex items-center gap-2 text-sm text-graphite">
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: severityTone(severity).text }}
                    />
                    {SEVERITY_LABEL[severity]}
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums text-ink">
                    {SEVERITY_WEIGHTS[severity]}
                    <span className="ml-1 text-sm font-normal text-graphite">
                      {SEVERITY_WEIGHTS[severity] === 1 ? "point" : "points"}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Closing */}
        <section className="border-t border-paper-line bg-paper-raised">
          <div className="shell flex flex-col gap-6 py-14 md:flex-row md:items-end md:justify-between md:py-16">
            <div className="max-w-xl">
              <h2 className="display text-display-md text-ink">
                Your next renewal is already dated
              </h2>
              <p className="lede mt-3">
                Find out what is in the agreement before the notice window
                closes. The first review is free and takes about three minutes.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
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
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
