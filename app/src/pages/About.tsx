import { Link } from "react-router";
import { PageShell, PageSection } from "@/components/PageShell";
import { CompanyDetails } from "@/components/CompanyDetails";
import { CLAUSE_LIBRARY, SEVERITY_WEIGHTS } from "@contracts/clause-library";
import { site } from "@/lib/site";

const BOUNDARIES = [
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
];

export default function About() {
  return (
    <PageShell path="/about">
      <PageSection title="A library, not a black box">
        <div className="max-w-2xl space-y-4 text-[1.0625rem] leading-relaxed text-graphite">
          <p>
            LenzerHub compares your agreement against a curated library of{" "}
            {CLAUSE_LIBRARY.length} clause positions. Each position records the
            language that commonly appears, why it disadvantages the buyer, and
            the replacement wording that counterparties routinely accept.
          </p>
          <p>
            Severity is not a vibe. Every position carries a fixed weight
            (critical {SEVERITY_WEIGHTS.critical}, high {SEVERITY_WEIGHTS.high},
            medium {SEVERITY_WEIGHTS.medium}, low {SEVERITY_WEIGHTS.low}), and
            the risk score is the sum of those weights over the worst case for
            the clauses found. You can check the arithmetic yourself on the{" "}
            <Link to="/scoring" className="link">
              scoring page
            </Link>
            .
          </p>
          <p>
            The library grows as we see more agreements. It is deliberately
            narrow: positions we can defend, with wording we have seen accepted,
            rather than a long list of things that sound alarming.
          </p>
        </div>
      </PageSection>

      <PageSection title="What this is not">
        <dl className="grid gap-5 md:grid-cols-3">
          {BOUNDARIES.map((item) => (
            <div key={item.term} className="panel p-6">
              <dt className="text-lg font-semibold text-ink">{item.term}</dt>
              <dd className="mt-2 text-[0.9375rem] leading-relaxed text-graphite">
                {item.detail}
              </dd>
            </div>
          ))}
        </dl>
      </PageSection>

      <PageSection
        title="Company details"
        intro={`LenzerHub is a service of ${site.company.legalName}, a company registered in Nigeria.`}
      >
        <CompanyDetails />
      </PageSection>

      <PageSection title="Who is behind it">
        <div className="max-w-2xl">
          <p className="text-[1.0625rem] leading-relaxed text-graphite">
            LenzerHub is built by{" "}
            {site.team.map((member, index) => (
              <span key={member.name}>
                {index > 0 ? " and " : ""}
                {member.name} ({member.role.toLowerCase()})
              </span>
            ))}
            , in {`${site.location.city}, ${site.location.country}`}.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/team" className="btn btn-outline">
              Meet the team
            </Link>
            <Link to="/login?intent=register" className="btn btn-primary">
              Review a contract free
            </Link>
          </div>
        </div>
      </PageSection>
    </PageShell>
  );
}
