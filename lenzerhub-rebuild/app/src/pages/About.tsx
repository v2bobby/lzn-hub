import { Link } from "react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { site } from "@/lib/site";
import { CLAUSE_LIBRARY, SEVERITY_WEIGHTS } from "@contracts/clause-library";

export default function About() {
  useDocumentMeta(
    "About — LenzerHub",
    "Why LenzerHub exists, how the clause library is built, and what the product will and will not do.",
  );

  return (
    <div className="overflow-x-hidden bg-paper">
      <SiteHeader />

      <main id="main">
        <section className="shell pb-16 pt-[calc(var(--header-h)+5rem)]">
          <p className="eyebrow text-insert-deep">About</p>
          <h1 className="display mt-5 max-w-[15ch] text-display-lg text-ink">
            Most bad contracts are signed by people who never read them.
          </h1>
          <p className="mt-8 max-w-2xl font-read text-[1.1875rem] leading-relaxed text-graphite">
            Not out of carelessness. A forty-page master services agreement
            arrives on a Thursday, the renewal is Monday, and the person
            responsible has nine other jobs. LenzerHub exists for that Thursday.
          </p>
        </section>

        <section className="border-t border-paper-line">
          <div className="shell grid gap-y-10 py-20 lg:grid-cols-[minmax(15rem,20rem)_1fr] lg:gap-x-16 xl:gap-x-24">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
              <p className="eyebrow text-insert-deep">How it is built</p>
              <h2 className="display mt-4 text-display-md text-ink">
                A library, not a black box.
              </h2>
            </div>

            <div className="max-w-2xl space-y-6 font-read text-[1.0625rem] leading-relaxed text-graphite">
              <p>
                LenzerHub compares your agreement against a curated library of{" "}
                {CLAUSE_LIBRARY.length} clause positions. Each position records
                the language that commonly appears, why it disadvantages the
                buyer, and the replacement wording that counterparties routinely
                accept.
              </p>
              <p>
                Severity is not a vibe. Every position carries a fixed weight
                (critical {SEVERITY_WEIGHTS.critical}, high{" "}
                {SEVERITY_WEIGHTS.high}, medium {SEVERITY_WEIGHTS.medium}, low{" "}
                {SEVERITY_WEIGHTS.low}), and the risk score is the sum of those
                weights over the worst case for the clauses found. You can check
                the arithmetic yourself on the homepage.
              </p>
              <p>
                The library grows as we see more agreements. It is deliberately
                narrow: positions we can defend, with wording we have seen
                accepted, rather than a long list of things that sound alarming.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-ink-line bg-ink text-paper">
          <div className="shell grid gap-y-10 py-20 lg:grid-cols-[minmax(15rem,20rem)_1fr] lg:gap-x-16 xl:gap-x-24">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
              <p className="eyebrow text-insert">Boundaries</p>
              <h2 className="display mt-4 text-display-md text-paper">
                What this is not.
              </h2>
            </div>

            <dl className="max-w-2xl divide-y divide-ink-line">
              {[
                {
                  term: "Not legal advice",
                  detail:
                    "LenzerHub is not a law firm and no attorney-client relationship is created by using it. For novel or high-value agreements, take the findings to a lawyer. You will spend their hour better.",
                },
                {
                  term: "Not a signature tool",
                  detail:
                    "Nothing here executes, countersigns or stores your obligations of record. It reads, flags and drafts replacement language.",
                },
                {
                  term: "Not trained on your contracts",
                  detail:
                    "Your uploads are used to produce your analysis. They are not used to train models and are not shared with other customers.",
                },
              ].map((item) => (
                <div key={item.term} className="py-6 first:pt-0 last:pb-0">
                  <dt className="text-sm font-semibold text-paper">
                    {item.term}
                  </dt>
                  <dd className="mt-2 font-read text-[1.0625rem] leading-relaxed text-paper/60">
                    {item.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-t border-paper-line">
          <div className="shell grid gap-y-10 py-20 lg:grid-cols-[minmax(15rem,20rem)_1fr] lg:gap-x-16 xl:gap-x-24">
            <div>
              <p className="eyebrow text-insert-deep">Who</p>
              <h2 className="display mt-4 text-display-md text-ink">
                {site.founder.name}
              </h2>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-graphite-light">
                {site.founder.role}
              </p>
            </div>

            <div className="max-w-2xl">
              <p className="font-read text-[1.0625rem] leading-relaxed text-graphite">
                Former product lead at a legal-tech company, where the pattern
                became impossible to ignore: enterprise buyers had clause
                libraries, playbooks and lawyers on retainer, and everybody else
                had a PDF and a deadline. The asymmetry was not about who was
                right. It was about who had read the document.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-paper-line pt-6">
                <a
                  href={site.founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-graphite underline underline-offset-4 transition-colors hover:text-ink"
                >
                  LinkedIn
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="text-sm text-graphite underline underline-offset-4 transition-colors hover:text-ink"
                >
                  {site.email}
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link to="/login?intent=register" className="btn btn-primary">
                  Review a contract free
                </Link>
                <Link to="/contact" className="btn btn-outline">
                  Get in touch
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
