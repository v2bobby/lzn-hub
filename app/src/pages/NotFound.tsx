import { Link } from "react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { DIRECTORY_PAGES } from "@/lib/pages";

export default function NotFound() {
  useDocumentMeta(
    "Page not found | LenzerHub",
    "That page does not exist. Here is where everything else lives.",
  );

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-paper">
      <SiteHeader />

      <main
        id="main"
        className="shell flex flex-1 flex-col justify-center py-16 pt-[calc(var(--header-h)+4rem)]"
      >
        <h1 className="display text-display-lg text-ink">Page not found</h1>
        <p className="lede mt-4 max-w-xl">
          This page does not exist, or it moved. The useful parts of the site
          are one click away.
        </p>

        <ul className="mt-8 max-w-xl divide-y divide-paper-line overflow-hidden rounded-lg border border-paper-line bg-paper-raised">
          {DIRECTORY_PAGES.map((page) => (
            <li key={page.path}>
              <Link
                to={page.path}
                className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-paper"
              >
                <span className="text-[1.0625rem] font-medium text-ink">{page.label}</span>
                <span aria-hidden="true" className="text-graphite">→</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" className="btn btn-ink">
            Back to the homepage
          </Link>
          <Link to="/contact" className="btn btn-outline">
            Report a broken link
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
