import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export type LegalSection = { heading: string; body: ReactNode };

/**
 * Shared shell for /terms and /privacy: sticky contents list on the left,
 * readable measure on the right.
 */
export function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  const slug = (heading: string) =>
    heading.toLowerCase().replace(/[^\w]+/g, "-");

  return (
    <div className="overflow-x-hidden bg-paper">
      <SiteHeader />

      <main id="main">
        <div className="shell grid gap-y-12 pb-24 pt-[calc(var(--header-h)+5rem)] lg:grid-cols-[minmax(15rem,20rem)_1fr] lg:gap-x-16 xl:gap-x-24">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
            <p className="eyebrow text-insert-deep">{eyebrow}</p>
            <h1 className="display mt-5 text-display-md text-ink">{title}</h1>
            <p className="mt-4 font-mono text-xs text-graphite-light">
              Last updated {updated}
            </p>

            <hr className="rule my-8" />

            <nav aria-label="Contents">
              <p className="eyebrow mb-3 text-graphite-light">Contents</p>
              <ol className="space-y-2">
                {sections.map((section, index) => (
                  <li key={section.heading}>
                    <a
                      href={`#${slug(section.heading)}`}
                      className="flex gap-3 text-sm text-graphite transition-colors hover:text-ink"
                    >
                      <span className="font-mono text-xs text-graphite-light">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="max-w-2xl">
            <p className="font-read text-[1.125rem] leading-relaxed text-graphite">
              {intro}
            </p>

            <div className="mt-12 space-y-12">
              {sections.map((section, index) => (
                <section
                  key={section.heading}
                  id={slug(section.heading)}
                  className="scroll-mt-28 border-t border-paper-line pt-8"
                >
                  <p className="font-mono text-xs text-graphite-light">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="display mt-2 text-display-sm text-ink">
                    {section.heading}
                  </h2>
                  <div className="mt-4 space-y-4 font-read text-[1.0625rem] leading-relaxed text-graphite">
                    {section.body}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
