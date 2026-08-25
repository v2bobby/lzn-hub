import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SeverityBadge } from "@/components/Severity";
import { severityTone } from "@/lib/severity";
import { ClauseDiff } from "@/components/Diff";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { trpc } from "@/providers/trpc-client";
import {
  CONTRACT_TYPE_LABEL,
  SEVERITY_LABEL,
  SEVERITY_ORDER,
  riskBand,
  type ContractType,
  type Severity,
} from "@contracts/clause-library";

export default function Analysis() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoading: authLoading } = useAuth({
    redirectOnUnauthenticated: true,
  });

  const numericId = Number(id);
  const valid = Number.isInteger(numericId) && numericId > 0;

  const query = trpc.contract.get.useQuery(
    { id: numericId },
    { enabled: valid && !authLoading, retry: false },
  );

  useDocumentMeta(
    query.data ? `${query.data.title} — LenzerHub` : "Analysis — LenzerHub",
    "Clause-by-clause findings with replacement language for your agreement.",
  );

  if (authLoading || query.isLoading) {
    return (
      <div className="min-h-screen bg-paper">
        <SiteHeader />
        <div className="shell pb-20 pt-[calc(var(--header-h)+3rem)]">
          <div className="h-4 w-40 animate-pulse rounded bg-paper-sunk" />
          <div className="mt-6 h-12 w-3/4 max-w-xl animate-pulse rounded-md bg-paper-sunk" />
          <div className="mt-10 h-40 animate-pulse rounded-lg border border-paper-line bg-paper-raised" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-lg border border-paper-line bg-paper-raised"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!valid || query.isError || !query.data) {
    return (
      <div className="min-h-screen bg-paper">
        <SiteHeader />
        <main
          id="main"
          className="shell flex min-h-[70vh] flex-col justify-center py-24"
        >
          <p className="eyebrow text-strike">Report unavailable</p>
          <h1 className="display mt-4 text-display-md text-ink">
            This report isn't in your workspace.
          </h1>
          <p className="mt-5 max-w-read font-read text-[1.0625rem] leading-relaxed text-graphite">
            The contract may have been deleted, or it belongs to another
            account. Your workspace has everything you have analysed.
          </p>
          <div className="mt-8">
            <Link to="/dashboard" className="btn btn-ink">
              Back to your workspace
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const contract = query.data;
  const findings = contract.findings ?? [];
  const score = contract.riskScore ?? 0;
  const band = riskBand(score);
  const bandTone = severityTone(band.tone);

  const counts = SEVERITY_ORDER.map((severity) => ({
    severity,
    count: findings.filter((f) => f.severity === severity).length,
  }));

  const exportReport = () => {
    const lines: string[] = [
      `${contract.title}`,
      `${CONTRACT_TYPE_LABEL[(contract.contractType ?? "other") as ContractType]}${
        contract.vendor ? ` · ${contract.vendor}` : ""
      }`,
      `Risk score: ${score}/100 (${band.label})`,
      "",
      contract.summary ?? "",
      "",
      "FINDINGS",
      "",
    ];

    findings.forEach((finding, index) => {
      lines.push(
        `${index + 1}. ${finding.clauseName} [${SEVERITY_LABEL[finding.severity as Severity]}]`,
        finding.category ? `Category: ${finding.category}` : "",
        finding.explanation ? `Why: ${finding.explanation}` : "",
        finding.originalText ? `As written: ${finding.originalText}` : "",
        finding.suggestedText ? `Send instead: ${finding.suggestedText}` : "",
        "",
      );
    });

    const blob = new Blob([lines.filter(Boolean).join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${contract.title.replace(/[^\w]+/g, "-").toLowerCase()}-findings.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    toast.success("Report downloaded", {
      description: "Paste the replacement language straight into your redline.",
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-paper">
      <SiteHeader />

      <main id="main" className="shell pb-24 pt-[calc(var(--header-h)+3rem)]">
        <nav aria-label="Breadcrumb" className="font-mono text-xs">
          <Link
            to="/dashboard"
            className="text-graphite underline underline-offset-4 transition-colors hover:text-ink"
          >
            Workspace
          </Link>
          <span className="mx-2 text-graphite-light">/</span>
          <span className="text-ink">Report</span>
        </nav>

        <header className="mt-6 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow text-graphite-light">
              {CONTRACT_TYPE_LABEL[
                (contract.contractType ?? "other") as ContractType
              ]}
              {contract.vendor ? ` · ${contract.vendor}` : ""}
            </p>
            <h1 className="display mt-3 max-w-[18ch] text-display-md text-ink">
              {contract.title}
            </h1>
            <p className="mt-3 font-mono text-xs text-graphite-light">
              Analysed{" "}
              {new Date(contract.updatedAt).toLocaleDateString(undefined, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="rounded-lg border border-paper-line bg-ink p-6 text-paper lg:min-w-[16rem]">
            <p className="eyebrow text-paper/40">Risk score</p>
            <p className="display mt-2 text-[3.5rem] leading-none tabular-nums">
              {score}
              <span className="text-[1.25rem] text-paper/35">/100</span>
            </p>
            <p
              className="mt-2 font-mono text-xs uppercase tracking-[0.14em]"
              style={{ color: bandTone.text }}
            >
              {band.label}
            </p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full"
                style={{ width: `${score}%`, backgroundColor: bandTone.text }}
              />
            </div>
          </div>
        </header>

        {contract.summary ? (
          <p className="mt-10 max-w-3xl border-l-2 border-insert pl-5 font-read text-[1.0625rem] leading-relaxed text-graphite">
            {contract.summary}
          </p>
        ) : null}

        {/* Severity tally as a compact data row, not four coloured cards. */}
        <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-y border-paper-line py-5">
          {counts.map(({ severity, count }) => {
            const tone = severityTone(severity);
            return (
              <div key={severity} className="flex items-baseline gap-2.5">
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-graphite">
                  {SEVERITY_LABEL[severity]}
                </dt>
                <dd
                  className="display text-[1.5rem] leading-none tabular-nums"
                  style={{ color: count ? tone.text : "#8A97A6" }}
                >
                  {count}
                </dd>
              </div>
            );
          })}
        </dl>

        <section aria-labelledby="findings-heading" className="mt-14">
          <h2
            id="findings-heading"
            className="display text-display-sm text-ink"
          >
            Findings
          </h2>

          {!findings.length ? (
            <p className="mt-6 rounded-lg border border-dashed border-paper-line p-8 text-center text-sm text-graphite">
              No findings recorded for this contract yet.
            </p>
          ) : (
            <ol className="mt-8 space-y-12">
              {findings.map((finding, index) => (
                <li key={finding.id} className="scroll-mt-24">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-graphite-light">
                        {String(index + 1).padStart(2, "0")}
                        {finding.category ? ` · ${finding.category}` : ""}
                      </p>
                      <h3 className="display mt-2 text-display-sm text-ink">
                        {finding.clauseName}
                      </h3>
                    </div>
                    <SeverityBadge severity={finding.severity as Severity} />
                  </div>

                  {finding.explanation ? (
                    <p className="mt-4 max-w-3xl font-read text-[1.0625rem] leading-relaxed text-graphite">
                      {finding.explanation}
                    </p>
                  ) : null}

                  <div className="mt-6">
                    <ClauseDiff
                      original={finding.originalText}
                      suggested={finding.suggestedText}
                    />
                  </div>

                  {finding.suggestedText ? (
                    <button
                      type="button"
                      onClick={() => {
                        void navigator.clipboard
                          .writeText(finding.suggestedText ?? "")
                          .then(() =>
                            toast.success("Replacement language copied"),
                          )
                          .catch(() =>
                            toast.error("Could not copy", {
                              description:
                                "Your browser blocked clipboard access. Select the text and copy it manually.",
                            }),
                          );
                      }}
                      className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-insert-deep underline underline-offset-4 transition-colors hover:text-ink"
                    >
                      Copy replacement language
                    </button>
                  ) : null}
                </li>
              ))}
            </ol>
          )}
        </section>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-paper-line pt-8">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="btn btn-outline"
          >
            Back to workspace
          </button>
          <button
            type="button"
            onClick={exportReport}
            className="btn btn-primary"
          >
            Download findings
          </button>
        </div>
      </main>
    </div>
  );
}
