import type { ReactNode } from "react";
import { PageShell } from "@/components/PageShell";

export type LegalSection = { heading: string; body: ReactNode };

/**
 * Shared layout for /terms and /privacy: a contents list beside a readable
 * column of numbered sections.
 */
export function LegalPage({
  path,
  updated,
  sections,
}: {
  path: string;
  updated: string;
  sections: LegalSection[];
}) {
  const slug = (heading: string) =>
    heading.toLowerCase().replace(/[^\w]+/g, "-");

  return (
    <PageShell path={path} aside={<p className="text-sm text-graphite">Last updated {updated}</p>}>
      <div className="shell grid gap-y-10 py-12 lg:grid-cols-[minmax(14rem,18rem)_1fr] lg:gap-x-16">
        <nav aria-label="Contents" className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
          <h2 className="text-[0.9375rem] font-semibold text-ink">Contents</h2>
          <ol className="mt-3 space-y-2">
            {sections.map((section, index) => (
              <li key={section.heading}>
                <a
                  href={`#${slug(section.heading)}`}
                  className="flex gap-3 text-[0.9375rem] text-graphite transition-colors hover:text-ink"
                >
                  <span className="tabular-nums text-graphite-light">{index + 1}.</span>
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-2xl space-y-10">
          {sections.map((section, index) => (
            <section
              key={section.heading}
              id={slug(section.heading)}
              className="scroll-mt-28 border-t border-paper-line pt-6"
            >
              <h2 className="display text-display-sm text-ink">
                {index + 1}. {section.heading}
              </h2>
              <div className="mt-3 space-y-3 text-[1rem] leading-relaxed text-graphite">
                {section.body}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
