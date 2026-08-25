import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { severityTone } from "@/lib/severity";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { trpc } from "@/providers/trpc-client";
import {
  CONTRACT_TYPE_LABEL,
  riskBand,
  type ContractType,
} from "@contracts/clause-library";

type Stage = "idle" | "creating" | "analyzing" | "done";

export default function Dashboard() {
  useDocumentMeta(
    "Your workspace — LenzerHub",
    "Upload an agreement, review findings, and track every contract you have analysed.",
  );

  const { user, isLoading: authLoading } = useAuth({
    redirectOnUnauthenticated: true,
  });
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const [stage, setStage] = useState<Stage>("idle");
  const [resultId, setResultId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    vendor: "",
    contractType: "saas" as ContractType,
  });

  const statsQuery = trpc.contract.stats.useQuery(undefined, {
    enabled: !!user,
  });
  const listQuery = trpc.contract.list.useQuery(undefined, { enabled: !!user });

  const analyzeMutation = trpc.contract.analyze.useMutation({
    onSuccess: (data) => {
      setStage("done");
      setResultId(data.contractId);
      void utils.contract.list.invalidate();
      void utils.contract.stats.invalidate();
      toast.success("Analysis complete", {
        description: `${data.findingsCount} findings, risk score ${data.riskScore}/100.`,
        action: {
          label: "Open report",
          onClick: () => navigate(`/analysis/${data.contractId}`),
        },
      });
    },
    onError: (error) => {
      setStage("idle");
      setFormError(
        error.message || "The analysis could not finish. Try running it again.",
      );
      toast.error("Analysis failed", { description: error.message });
      void utils.contract.list.invalidate();
    },
  });

  const createMutation = trpc.contract.create.useMutation({
    onSuccess: (data) => {
      setStage("analyzing");
      analyzeMutation.mutate({ contractId: data.id });
    },
    onError: (error) => {
      setStage("idle");
      setFormError(
        error.message || "The contract could not be saved. Try again.",
      );
      toast.error("Upload failed", { description: error.message });
    },
  });

  const deleteMutation = trpc.contract.delete.useMutation({
    onSuccess: () => {
      void utils.contract.list.invalidate();
      void utils.contract.stats.invalidate();
      toast.success("Contract deleted");
    },
    onError: (error) => {
      toast.error("Delete failed", { description: error.message });
    },
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!form.title.trim()) {
      setTitleError("Give the contract a name so you can find it later.");
      return;
    }

    setTitleError(null);
    setStage("creating");
    createMutation.mutate({
      title: form.title.trim(),
      vendor: form.vendor.trim() || undefined,
      contractType: form.contractType,
      fileName: `${form.title.trim()}.pdf`,
    });
  };

  const reset = () => {
    setStage("idle");
    setResultId(null);
    setFormError(null);
    setTitleError(null);
    setForm({ title: "", vendor: "", contractType: "saas" });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-paper">
        <SiteHeader />
        <div className="shell pb-20 pt-[calc(var(--header-h)+3rem)]">
          <div className="h-9 w-56 animate-pulse rounded-md bg-paper-sunk" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-lg border border-paper-line bg-paper-raised"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = statsQuery.data;
  const contracts = listQuery.data ?? [];
  const busy = stage === "creating" || stage === "analyzing";

  return (
    <div className="min-h-screen overflow-x-hidden bg-paper">
      <SiteHeader />

      <main id="main" className="shell pb-24 pt-[calc(var(--header-h)+3rem)]">
        <header>
          <p className="eyebrow text-insert-deep">Workspace</p>
          <h1 className="display mt-3 text-display-md text-ink">
            {user?.name ? `Welcome back, ${user.name.split(" ")[0]}.` : "Welcome back."}
          </h1>
          <p className="mt-4 max-w-read font-read text-[1.0625rem] leading-relaxed text-graphite">
            Add an agreement to run it through the clause library, or reopen a
            report you have already generated.
          </p>
        </header>

        {/* Stats */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsQuery.isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-lg border border-paper-line bg-paper-raised"
                />
              ))
            : (
                [
                  { label: "Contracts", value: stats?.totalContracts ?? 0 },
                  { label: "Analysed", value: stats?.analyzedContracts ?? 0 },
                  {
                    label: "Average risk",
                    value: stats?.avgRiskScore ? `${stats.avgRiskScore}/100` : "—",
                  },
                  {
                    label: "Critical findings",
                    value: stats?.criticalFindings ?? 0,
                    tone: "#B3311C",
                  },
                ] as const
              ).map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-paper-line bg-paper-raised p-5"
                >
                  <p className="eyebrow text-graphite-light">{stat.label}</p>
                  <p
                    className="display mt-3 text-[2.25rem] leading-none tabular-nums"
                    style={{ color: "tone" in stat ? stat.tone : "#0E1620" }}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
        </div>

        {statsQuery.isError ? (
          <p
            role="alert"
            className="mt-4 rounded-md border border-strike/30 bg-strike-wash px-4 py-3 text-sm text-strike"
          >
            Could not load your totals.{" "}
            <button
              type="button"
              onClick={() => void statsQuery.refetch()}
              className="underline underline-offset-4"
            >
              Retry
            </button>
          </p>
        ) : null}

        {/* Split: upload rail + contract list */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <div className="rounded-lg border border-paper-line bg-paper-raised p-6">
              <h2 className="display text-display-sm text-ink">Add a contract</h2>

              {stage === "idle" ? (
                <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
                  {formError ? (
                    <p
                      role="alert"
                      className="rounded-md border border-strike/30 bg-strike-wash px-3.5 py-3 text-sm text-strike"
                    >
                      {formError}
                    </p>
                  ) : null}

                  <div>
                    <label htmlFor="title" className="field-label">
                      Contract name
                    </label>
                    <input
                      id="title"
                      className="field"
                      value={form.title}
                      onChange={(e) => {
                        setForm({ ...form, title: e.target.value });
                        if (titleError) setTitleError(null);
                      }}
                      placeholder="Salesforce MSA 2026"
                      aria-invalid={!!titleError}
                      aria-describedby={titleError ? "title-error" : undefined}
                    />
                    {titleError ? (
                      <p
                        id="title-error"
                        role="alert"
                        className="mt-1.5 text-xs text-strike"
                      >
                        {titleError}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label htmlFor="vendor" className="field-label">
                      Counterparty <span className="normal-case">(optional)</span>
                    </label>
                    <input
                      id="vendor"
                      className="field"
                      value={form.vendor}
                      onChange={(e) =>
                        setForm({ ...form, vendor: e.target.value })
                      }
                      placeholder="Salesforce"
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="field-label">
                      Agreement type
                    </label>
                    <select
                      id="type"
                      className="field"
                      value={form.contractType}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          contractType: e.target.value as ContractType,
                        })
                      }
                    >
                      {(
                        Object.keys(CONTRACT_TYPE_LABEL) as ContractType[]
                      ).map((key) => (
                        <option key={key} value={key}>
                          {CONTRACT_TYPE_LABEL[key]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="rounded-md border border-dashed border-paper-line px-3.5 py-3 text-xs leading-relaxed text-graphite-light">
                    Document upload is in build. Name the agreement and its type
                    and LenzerHub will run the clause library against that
                    profile now.
                  </p>

                  <button type="submit" className="btn btn-primary w-full">
                    Run the analysis
                  </button>
                </form>
              ) : null}

              {busy ? (
                <div className="mt-6" aria-live="polite">
                  <p className="text-sm font-semibold text-ink">
                    {stage === "creating"
                      ? "Saving the contract"
                      : "Reading the clauses"}
                  </p>
                  <p className="mt-1 text-xs text-graphite">
                    {stage === "creating"
                      ? "Adding it to your workspace."
                      : "Comparing against every position in the library."}
                  </p>
                  <div className="mt-4 space-y-2.5">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="relative h-3 overflow-hidden rounded-xs bg-paper-sunk"
                        style={{ width: `${100 - i * 12}%` }}
                      >
                        <span
                          className="absolute inset-y-0 w-1/3 animate-sweep bg-insert/25"
                          style={{ animationDelay: `${i * 0.12}s` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {stage === "done" && resultId ? (
                <div className="mt-6" aria-live="polite">
                  <p className="rounded-md border border-insert/30 bg-insert-wash px-3.5 py-3 text-sm text-insert-deep">
                    Analysis complete. The report is ready.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate(`/analysis/${resultId}`)}
                    className="btn btn-primary mt-4 w-full"
                  >
                    Open the report
                  </button>
                  <button
                    type="button"
                    onClick={reset}
                    className="btn btn-outline mt-2 w-full"
                  >
                    Add another
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {/* List */}
          <section aria-labelledby="contracts-heading" className="min-w-0">
            <h2
              id="contracts-heading"
              className="display text-display-sm text-ink"
            >
              Your contracts
            </h2>

            {listQuery.isLoading ? (
              <div className="mt-6 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 animate-pulse rounded-lg border border-paper-line bg-paper-raised"
                  />
                ))}
              </div>
            ) : listQuery.isError ? (
              <div className="mt-6 rounded-lg border border-strike/30 bg-strike-wash p-8 text-center">
                <p className="text-sm text-strike">
                  Your contracts did not load.
                </p>
                <button
                  type="button"
                  onClick={() => void listQuery.refetch()}
                  className="btn btn-outline mt-4"
                >
                  Try again
                </button>
              </div>
            ) : !contracts.length ? (
              <div className="mt-6 rounded-lg border border-dashed border-paper-line bg-paper-raised p-10 text-center">
                <p className="display text-display-sm text-ink">
                  Nothing here yet.
                </p>
                <p className="mx-auto mt-3 max-w-sm font-read text-[0.9375rem] leading-relaxed text-graphite">
                  Start with the agreement whose renewal date is closest. That is
                  usually where the money is.
                </p>
              </div>
            ) : (
              <ul className="mt-6 divide-y divide-paper-line overflow-hidden rounded-lg border border-paper-line bg-paper-raised">
                {contracts.map((contract) => {
                  const score = contract.riskScore;
                  const band =
                    typeof score === "number" ? riskBand(score) : null;
                  const tone = band ? severityTone(band.tone) : null;

                  return (
                    <li
                      key={contract.id}
                      className="flex flex-wrap items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-paper-sunk/50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">
                          {contract.title}
                        </p>
                        <p className="mt-1 truncate font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-graphite-light">
                          {contract.vendor ? `${contract.vendor} · ` : ""}
                          {
                            CONTRACT_TYPE_LABEL[
                              (contract.contractType ?? "other") as ContractType
                            ]
                          }{" "}
                          ·{" "}
                          {new Date(contract.createdAt).toLocaleDateString(
                            undefined,
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </p>
                      </div>

                      {typeof score === "number" && tone ? (
                        <span
                          className="font-mono text-sm tabular-nums"
                          style={{ color: tone.text }}
                        >
                          {score}/100
                        </span>
                      ) : contract.status === "analyzing" ? (
                        <span className="font-mono text-xs uppercase tracking-[0.12em] text-graphite">
                          Analysing
                        </span>
                      ) : contract.status === "failed" ? (
                        <span className="font-mono text-xs uppercase tracking-[0.12em] text-strike">
                          Failed
                        </span>
                      ) : (
                        <span className="font-mono text-xs uppercase tracking-[0.12em] text-graphite-light">
                          Not analysed
                        </span>
                      )}

                      <div className="flex shrink-0 items-center gap-2">
                        {contract.status === "completed" ? (
                          <Link
                            to={`/analysis/${contract.id}`}
                            className="btn btn-outline px-3.5 py-2"
                          >
                            Open
                          </Link>
                        ) : contract.status === "failed" ? (
                          <button
                            type="button"
                            onClick={() =>
                              analyzeMutation.mutate({
                                contractId: contract.id,
                              })
                            }
                            className="btn btn-outline px-3.5 py-2"
                          >
                            Retry
                          </button>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => {
                            toast("Delete this contract?", {
                              description: `"${contract.title}" and its findings will be removed.`,
                              action: {
                                label: "Delete",
                                onClick: () =>
                                  deleteMutation.mutate({ id: contract.id }),
                              },
                              cancel: { label: "Keep", onClick: () => {} },
                            });
                          }}
                          aria-label={`Delete ${contract.title}`}
                          className="rounded-md p-2 text-graphite-light transition-colors hover:bg-strike-wash hover:text-strike"
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 16 16"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M2.5 4h11M6 4V2.8c0-.4.3-.8.8-.8h2.4c.5 0 .8.4.8.8V4m2 0v9.2c0 .4-.3.8-.8.8H4.8a.8.8 0 0 1-.8-.8V4"
                              stroke="currentColor"
                              strokeWidth="1.3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
