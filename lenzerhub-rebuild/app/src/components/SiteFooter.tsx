import { Link, useLocation, useNavigate } from "react-router";
import { LogoMark } from "@/components/Logo";
import { footerNav, formatPhone, site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const goToAnchor = (to: string) => {
    const [path, hash] = to.split("#");
    if (location.pathname === (path || "/") && hash) {
      document
        .getElementById(hash)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(to);
    }
  };

  return (
    <footer className="bg-ink text-paper">
      <div className="shell py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link
              to="/"
              aria-label="LenzerHub home"
              className="inline-flex items-center gap-2.5 rounded-sm"
            >
              <LogoMark size={26} tone="paper" />
              <span className="display text-[1.15rem] leading-none text-paper">
                Lenzer<span className="font-medium opacity-70">Hub</span>
              </span>
            </Link>
            <p className="mt-4 font-read text-[0.9375rem] leading-relaxed text-paper/55">
              {site.tagline} Contract review for companies that sign more
              agreements than they have lawyers to read them.
            </p>

            <div className="mt-6 flex flex-col gap-2 text-sm">
              <a
                href={`mailto:${site.email}`}
                className="w-fit text-paper/70 underline underline-offset-4 transition-colors hover:text-paper"
              >
                {site.email}
              </a>
              {site.phone ? (
                <a
                  href={`tel:${site.phone}`}
                  className="w-fit text-paper/70 underline underline-offset-4 transition-colors hover:text-paper"
                >
                  {formatPhone(site.phone)}
                </a>
              ) : null}
            </div>
          </div>

          {footerNav.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="eyebrow text-paper/40">{group.heading}</h2>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.label}>
                    {item.kind === "anchor" ? (
                      <button
                        type="button"
                        onClick={() => goToAnchor(item.to)}
                        className="text-left text-sm text-paper/60 transition-colors hover:text-paper"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        to={item.to}
                        className="text-sm text-paper/60 transition-colors hover:text-paper"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <hr className="rule-ink my-10" />

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-paper/35">
            © {year} {site.name}. All rights reserved.
          </p>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs text-paper/45 transition-colors hover:text-paper"
          >
            LinkedIn
            <svg
              width="11"
              height="11"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 9L9 3M9 3H4M9 3v5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
