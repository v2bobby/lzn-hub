import type { ReactNode } from "react";
import { Link } from "react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { getPage, type PageDef } from "@/lib/pages";

/**
 * Layout for every content page: shared header, a page heading and intro,
 * the page's own content, a "Next" link to the following page, and the
 * shared footer.
 */
export function PageShell({
  path,
  children,
  aside,
}: {
  path: string;
  children: ReactNode;
  /** Optional content to the right of the heading on wide screens. */
  aside?: ReactNode;
}) {
  const page = getPage(path);
  useDocumentMeta(page.title, page.description, page.path);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-paper">
      <SiteHeader />
      <main id="main" className="flex-1">
        <PageIntro page={page} aside={aside} />
        {children}
        {page.next ? <NextLink from={page} /> : null}
      </main>
      <SiteFooter />
    </div>
  );
}

function PageIntro({ page, aside }: { page: PageDef; aside?: ReactNode }) {
  return (
    <header className="border-b border-paper-line bg-paper-raised">
      <div className="shell pb-10 pt-[calc(var(--header-h)+2.5rem)] md:pb-12">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-graphite">
            <li>
              <Link to="/" className="hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {page.label}
            </li>
          </ol>
        </nav>
        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl">
            <h1 className="display text-display-lg text-ink">{page.heading}</h1>
            <p className="lede mt-4 max-w-2xl">{page.intro}</p>
          </div>
          {aside ? <div>{aside}</div> : null}
        </div>
      </div>
    </header>
  );
}

function NextLink({ from }: { from: PageDef }) {
  const next = getPage(from.next!);
  return (
    <div className="shell py-12">
      <Link
        to={next.path}
        className="group flex flex-col gap-1 rounded-lg border border-paper-line bg-paper-raised p-6 transition-colors hover:border-ink/30 sm:flex-row sm:items-center sm:justify-between"
      >
        <span>
          <span className="block text-sm text-graphite">Next</span>
          <span className="mt-1 block text-lg font-semibold text-ink">
            {next.label}
          </span>
        </span>
        <span className="text-[0.9375rem] text-graphite group-hover:text-ink">
          {next.oneLiner}
          <span aria-hidden="true"> →</span>
        </span>
      </Link>
    </div>
  );
}

/** A section inside a content page. */
export function PageSection({
  title,
  intro,
  children,
  id,
}: {
  title?: string;
  intro?: ReactNode;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="shell py-12 md:py-14">
      {title ? (
        <div className="mb-6 max-w-2xl">
          <h2 className="display text-display-md text-ink">{title}</h2>
          {intro ? <p className="lede mt-3">{intro}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
