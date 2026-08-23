/**
 * Redline diff. The original clause is struck in stamp red, the replacement
 * is set in insert green. This is the product's core artefact, so it gets a
 * real component rather than ad-hoc markup on each page.
 */
export function ClauseDiff({
  original,
  suggested,
  compact = false,
}: {
  original?: string | null;
  suggested?: string | null;
  compact?: boolean;
}) {
  if (!original && !suggested) return null;

  return (
    <div
      className={`grid gap-px overflow-hidden rounded-md border border-paper-line bg-paper-line ${
        compact ? "" : "md:grid-cols-2"
      }`}
    >
      {original ? (
        <div className="bg-paper-raised p-4 md:p-5">
          <p className="eyebrow mb-2.5 text-strike">As written</p>
          <p className="font-read text-[0.9375rem] leading-relaxed text-graphite line-through decoration-strike/60 decoration-1">
            {original}
          </p>
        </div>
      ) : null}
      {suggested ? (
        <div className="bg-insert-wash p-4 md:p-5">
          <p className="eyebrow mb-2.5 text-insert-deep">Send this instead</p>
          <p className="font-read text-[0.9375rem] leading-relaxed text-ink">
            {suggested}
          </p>
        </div>
      ) : null}
    </div>
  );
}
