import { useId, useRef, useState } from "react";
import { Link } from "react-router";
import {
  CLAUSE_LIBRARY,
  SEVERITY_ORDER,
  SEVERITY_LABEL,
  type Severity,
} from "@contracts/clause-library";
import { SeverityBadge } from "@/components/Severity";
import { severityTone } from "@/lib/severity";
import { ClauseDiff } from "@/components/Diff";

/**
 * Reads the same clause library the analysis endpoint uses, so this is the
 * actual product output rather than a mocked-up screenshot of one.
 */
export function ClauseInspector({
  filter,
  onFilterChange,
}: {
  filter: Severity | "all";
  onFilterChange: (next: Severity | "all") => void;
}) {
  const visible =
    filter === "all"
      ? CLAUSE_LIBRARY
      : CLAUSE_LIBRARY.filter((clause) => clause.severity === filter);

  const [activeId, setActiveId] = useState(CLAUSE_LIBRARY[0].id);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const baseId = useId();

  const active =
    visible.find((clause) => clause.id === activeId) ?? visible[0] ?? null;

  // Roving focus so the clause list behaves like a real tablist.
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!visible.length) return;
    const currentIndex = visible.findIndex((c) => c.id === active?.id);
    let nextIndex: number | null = null;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % visible.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + visible.length) % visible.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = visible.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    const next = visible[nextIndex];
    setActiveId(next.id);
    tabsRef.current
      ?.querySelector<HTMLButtonElement>(`#${CSS.escape(`${baseId}-${next.id}`)}`)
      ?.focus();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-8">
      <div>
        <div
          role="group"
          aria-label="Filter clauses by severity"
          className="mb-4 flex flex-wrap gap-1.5"
        >
          <FilterChip
            active={filter === "all"}
            onClick={() => onFilterChange("all")}
            label="All"
            count={CLAUSE_LIBRARY.length}
          />
          {SEVERITY_ORDER.map((severity) => {
            const count = CLAUSE_LIBRARY.filter(
              (c) => c.severity === severity,
            ).length;
            if (!count) return null;
            return (
              <FilterChip
                key={severity}
                active={filter === severity}
                onClick={() => onFilterChange(severity)}
                label={SEVERITY_LABEL[severity]}
                count={count}
                color={severityTone(severity).text}
              />
            );
          })}
        </div>

        <div
          ref={tabsRef}
          role="tablist"
          aria-orientation="vertical"
          aria-label="Clauses"
          onKeyDown={onKeyDown}
          className="divide-y divide-paper-line overflow-hidden rounded-lg border border-paper-line bg-paper-raised"
        >
          {visible.map((clause) => {
            const selected = clause.id === active?.id;
            return (
              <button
                key={clause.id}
                id={`${baseId}-${clause.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveId(clause.id)}
                className={`relative flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-200 ease-precise ${
                  selected ? "bg-paper-sunk" : "hover:bg-paper-sunk/60"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor: severityTone(clause.severity).text,
                  }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink">
                    {clause.clauseName}
                  </span>
                  <span className="block truncate font-mono text-[0.6875rem] tracking-wide text-graphite-light">
                    {clause.category}
                  </span>
                </span>
              </button>
            );
          })}

          {!visible.length ? (
            <p className="px-4 py-8 text-center text-sm text-graphite">
              Nothing at this severity. Pick another level.
            </p>
          ) : null}
        </div>
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-live="polite"
        className="min-w-0"
      >
        {active ? (
          <article key={active.id} className="animate-rise-in">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="eyebrow text-graphite-light">{active.category}</p>
                <h3 className="display mt-2 text-display-sm text-ink">
                  {active.clauseName}
                </h3>
              </div>
              <SeverityBadge severity={active.severity} />
            </div>

            <p className="mt-5 max-w-2xl font-read text-[1.0625rem] leading-relaxed text-graphite">
              {active.explanation}
            </p>

            <div className="mt-7">
              <ClauseDiff
                original={active.originalText}
                suggested={active.suggestedText}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-md border border-paper-line bg-paper-raised px-4 py-3.5">
              <p className="text-sm text-graphite">
                <span className="font-semibold text-ink">Why it matters: </span>
                {active.leverage}
              </p>
              <Link
                to="/login?intent=register"
                className="shrink-0 font-mono text-xs uppercase tracking-[0.14em] text-insert-deep underline underline-offset-4 transition-colors hover:text-ink"
              >
                Check my contract
              </Link>
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-sm border px-2.5 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] transition-colors duration-200 ${
        active
          ? "border-ink bg-ink text-paper"
          : "border-paper-line bg-paper-raised text-graphite hover:border-ink/30 hover:text-ink"
      }`}
    >
      {color && !active ? (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      ) : null}
      {label}
      <span className={active ? "text-paper/50" : "text-graphite-light"}>
        {count}
      </span>
    </button>
  );
}
