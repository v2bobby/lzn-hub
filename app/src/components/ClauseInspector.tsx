import { useId, useRef, useState } from "react";
import { Link } from "react-router";
import {
  CLAUSE_LIBRARY,
  SEVERITY_LABEL,
  SEVERITY_ORDER,
  type Severity,
} from "@contracts/clause-library";
import { SeverityBadge } from "@/components/Severity";
import { severityTone } from "@/lib/severity";
import { ClauseDiff } from "@/components/Diff";

/**
 * Reads the same clause library the analysis endpoint uses, so this is the
 * product's actual output rather than a mock-up.
 *
 * Every clause's panel is in the HTML; only the selected one is shown. That
 * keeps all eight positions readable by crawlers and by anyone without
 * JavaScript, while the tabs still work as tabs.
 */
export function ClauseInspector() {
  const [filter, setFilter] = useState<Severity | "all">("all");
  const [activeId, setActiveId] = useState(CLAUSE_LIBRARY[0].id);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const baseId = useId();

  const visible =
    filter === "all"
      ? CLAUSE_LIBRARY
      : CLAUSE_LIBRARY.filter((clause) => clause.severity === filter);

  const active =
    visible.find((clause) => clause.id === activeId) ?? visible[0] ?? null;

  const tabId = (id: string) => `${baseId}-tab-${id}`;
  const panelId = (id: string) => `${baseId}-panel-${id}`;

  // Arrow keys, Home and End move between tabs.
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
      ?.querySelector<HTMLButtonElement>(`#${CSS.escape(tabId(next.id))}`)
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
            onClick={() => setFilter("all")}
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
                onClick={() => setFilter(severity)}
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
                id={tabId(clause.id)}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={panelId(clause.id)}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveId(clause.id)}
                className={`relative flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 ${
                  selected
                    ? "bg-insert-wash"
                    : "hover:bg-paper"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor: severityTone(clause.severity).text,
                  }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.9375rem] font-medium text-ink">
                    {clause.clauseName}
                  </span>
                  <span className="block truncate text-sm text-graphite">
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

      <div className="min-w-0">
        {CLAUSE_LIBRARY.map((clause) => (
          <article
            key={clause.id}
            id={panelId(clause.id)}
            role="tabpanel"
            aria-labelledby={tabId(clause.id)}
            hidden={clause.id !== active?.id}
            className="panel p-6 md:p-7"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="eyebrow">{clause.category}</p>
                <h2 className="display mt-1 text-display-sm text-ink">
                  {clause.clauseName}
                </h2>
              </div>
              <SeverityBadge severity={clause.severity} />
            </div>

            <p className="lede mt-4 max-w-2xl">{clause.explanation}</p>

            <div className="mt-6">
              <ClauseDiff
                original={clause.originalText}
                suggested={clause.suggestedText}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-paper-line pt-5">
              <p className="text-[0.9375rem] text-graphite">
                <span className="font-semibold text-ink">Why it matters: </span>
                {clause.leverage}
              </p>
              <Link to="/login?intent=register" className="link shrink-0 text-[0.9375rem]">
                Check my contract
              </Link>
            </div>
          </article>
        ))}
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
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors duration-150 ${
        active
          ? "border-ink bg-ink text-white"
          : "border-paper-line bg-paper-raised text-graphite hover:border-ink/30 hover:text-ink"
      }`}
    >
      {color ? (
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      ) : null}
      {label}
      <span className={active ? "text-white/60" : "text-graphite-light"}>
        {count}
      </span>
    </button>
  );
}
