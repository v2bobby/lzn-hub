import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  CONTRACT_TYPE_LABEL,
  SEVERITY_LABEL,
  SEVERITY_WEIGHTS,
  clausesForType,
  riskBand,
  scoreClauses,
  type ContractType,
} from "@contracts/clause-library";
import { severityTone } from "@/lib/severity";

const TYPES = Object.keys(CONTRACT_TYPE_LABEL) as ContractType[];

/**
 * Runs `scoreClauses` — the same function the analysis endpoint calls — so the
 * number a visitor sees here is the number the product would return.
 */
export function RiskEstimator() {
  const [type, setType] = useState<ContractType>("saas");
  const candidates = useMemo(() => clausesForType(type), [type]);
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(clausesForType("saas").slice(0, 3).map((c) => c.id)),
  );

  const chosen = candidates.filter((clause) => selected.has(clause.id));
  const score = scoreClauses(chosen);
  const band = riskBand(score);
  const tone = severityTone(band.tone);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const changeType = (nextType: ContractType) => {
    setType(nextType);
    const nextCandidates = clausesForType(nextType);
    setSelected((prev) => {
      const kept = new Set(
        nextCandidates.filter((c) => prev.has(c.id)).map((c) => c.id),
      );
      return kept.size
        ? kept
        : new Set(nextCandidates.slice(0, 3).map((c) => c.id));
    });
  };

  const weightSum = chosen.reduce(
    (sum, clause) => sum + SEVERITY_WEIGHTS[clause.severity],
    0,
  );
  const maxSum = chosen.length * 4;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,19rem)] lg:gap-8">
      <div>
        <fieldset>
          <legend className="eyebrow mb-3 text-graphite">
            1. What are you signing?
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {TYPES.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => changeType(option)}
                aria-pressed={type === option}
                className={`rounded-sm border px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  type === option
                    ? "border-ink bg-ink text-paper"
                    : "border-paper-line bg-paper-raised text-graphite hover:border-ink/30 hover:text-ink"
                }`}
              >
                {CONTRACT_TYPE_LABEL[option]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-8">
          <legend className="eyebrow mb-3 text-graphite">
            2. Which of these are in it?
          </legend>
          <div className="divide-y divide-paper-line overflow-hidden rounded-lg border border-paper-line bg-paper-raised">
            {candidates.map((clause) => {
              const on = selected.has(clause.id);
              const clauseTone = severityTone(clause.severity);
              return (
                <label
                  key={clause.id}
                  className="flex cursor-pointer items-center gap-3.5 px-4 py-3.5 transition-colors duration-200 hover:bg-paper-sunk/60"
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(clause.id)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-xs border transition-colors duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-insert ${
                      on
                        ? "border-ink bg-ink text-paper"
                        : "border-paper-line bg-paper"
                    }`}
                  >
                    {on ? (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path
                          d="M1.5 5.2 3.9 7.5 8.5 2.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-ink">
                      {clause.clauseName}
                    </span>
                    <span className="block truncate text-xs text-graphite-light">
                      {clause.leverage}
                    </span>
                  </span>
                  <span
                    className="shrink-0 font-mono text-[0.6875rem] uppercase tracking-[0.12em]"
                    style={{ color: clauseTone.text }}
                  >
                    {SEVERITY_LABEL[clause.severity]}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* Result rail */}
      <aside className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
        <div className="overflow-hidden rounded-lg border border-paper-line bg-ink text-paper">
          <div className="p-6">
            <p className="eyebrow text-paper/40">Weighted risk score</p>
            <p
              className="display mt-3 text-[4.5rem] leading-[0.85] tabular-nums"
              aria-live="polite"
            >
              {score}
              <span className="text-[1.5rem] text-paper/35">/100</span>
            </p>
            <p
              className="mt-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em]"
              style={{ color: tone.text }}
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: tone.text }}
              />
              {band.label}
            </p>

            <div
              className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/10"
              role="img"
              aria-label={`Risk score ${score} out of 100`}
            >
              <div
                className="h-full rounded-full transition-[width] duration-500 ease-precise"
                style={{
                  width: `${score}%`,
                  backgroundColor: tone.text,
                }}
              />
            </div>
          </div>

          <hr className="rule-ink" />

          <div className="p-6">
            <p className="eyebrow mb-3 text-paper/40">The arithmetic</p>
            <p className="font-mono text-xs leading-relaxed text-paper/60">
              critical 4 · high 3 · medium 2 · low 1
            </p>
            <p className="mt-3 font-mono text-xs leading-relaxed text-paper/75">
              {chosen.length
                ? `(${weightSum} ÷ ${maxSum}) × 100 = ${score}`
                : "Select at least one clause"}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-paper/55">
              No black box. Severity weights are fixed, the denominator is the
              worst case for the clauses found, and the same function runs on
              your real uploads.
            </p>
          </div>
        </div>

        <Link
          to="/login?intent=register"
          className="btn btn-primary mt-4 w-full"
        >
          Score my actual contract
        </Link>
      </aside>
    </div>
  );
}
