import type { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/**
 * The site's structural spine below the hero: a sticky left rail carrying the
 * section's identity and a wide right column carrying the working content.
 * Collapses to a single column below lg, where the rail simply leads.
 */
export function Split({
  id,
  eyebrow,
  title,
  lede,
  rail,
  children,
  tone = "paper",
  className = "",
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  /** Optional extra content pinned under the rail heading. */
  rail?: ReactNode;
  children: ReactNode;
  tone?: "paper" | "ink" | "sunk";
  className?: string;
}) {
  const ref = useScrollReveal<HTMLElement>();

  const surface =
    tone === "ink"
      ? "bg-ink text-paper"
      : tone === "sunk"
        ? "bg-paper-sunk text-ink"
        : "bg-paper text-ink";

  const eyebrowTone = tone === "ink" ? "text-insert" : "text-insert-deep";
  const ledeTone = tone === "ink" ? "text-paper/60" : "text-graphite";
  const ruleTone = tone === "ink" ? "rule-ink" : "rule";

  return (
    <section
      id={id}
      ref={ref}
      className={`reveal scroll-mt-24 border-t ${
        tone === "ink" ? "border-ink-line" : "border-paper-line"
      } ${surface} ${className}`}
    >
      <div className="shell grid gap-y-10 py-20 md:py-28 lg:grid-cols-[minmax(15rem,20rem)_1fr] lg:gap-x-16 xl:gap-x-24">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
          <p className={`eyebrow ${eyebrowTone}`}>{eyebrow}</p>
          <h2 className="display mt-4 text-display-md">{title}</h2>
          {lede ? (
            <p
              className={`mt-5 max-w-read font-read text-[1.0625rem] leading-relaxed ${ledeTone}`}
            >
              {lede}
            </p>
          ) : null}
          {rail ? (
            <>
              <hr className={`${ruleTone} my-7`} />
              {rail}
            </>
          ) : null}
        </div>

        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
