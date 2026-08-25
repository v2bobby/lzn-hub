import { Link } from "react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { primaryNav } from "@/lib/site";

export default function NotFound() {
  useDocumentMeta(
    "Page not found — LenzerHub",
    "That page does not exist. Here is where everything else lives.",
  );

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-paper">
      <SiteHeader />

      <main
        id="main"
        className="shell flex flex-1 flex-col justify-center py-24 pt-[calc(var(--header-h)+5rem)]"
      >
        <p className="eyebrow text-graphite-light">Error 404</p>
        <h1 className="display mt-5 max-w-[16ch] text-display-lg text-ink">
          No clause here.
        </h1>
        <p className="mt-6 max-w-read font-read text-[1.0625rem] leading-relaxed text-graphite">
          This page does not exist, or it moved. The useful parts of the site
          are one click away.
        </p>

        <div className="mt-10 max-w-xl divide-y divide-paper-line border-y border-paper-line">
          {primaryNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center justify-between py-4 transition-colors duration-200 hover:text-insert-deep"
            >
              <span className="display text-[1.5rem] text-ink transition-colors hover:text-insert-deep">
                {item.label}
              </span>
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M3 9L9 3M9 3H4M9 3v5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
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
