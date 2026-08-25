import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Logo } from "@/components/Logo";
import { primaryNav, site } from "@/lib/site";
import { useAuth } from "@/hooks/useAuth";

/**
 * Fixed header. Transparent over the hero, solid once scrolled.
 * The mobile drawer locks body scroll, closes on backdrop click, on Escape,
 * and on route change, and returns focus to the trigger.
 */
export function SiteHeader({ overHero = false }: { overHero?: boolean }) {
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 24,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const transparent = overHero && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll lock + Escape while the drawer is open.
  useEffect(() => {
    if (!menuOpen) return;

    const { overflow, paddingRight } = document.body.style;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

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

  const linkTone = transparent
    ? "text-paper/70 hover:text-paper"
    : "text-graphite hover:text-ink";

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 h-[var(--header-h)] transition-colors duration-300 ease-precise ${
          transparent
            ? "bg-transparent"
            : "border-b border-paper-line bg-paper/92 backdrop-blur-[2px]"
        }`}
      >
        <div className="shell flex h-full items-center justify-between gap-6">
          <Logo tone={transparent ? "paper" : "ink"} size={26} />

          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 lg:flex"
          >
            {primaryNav.map((item) =>
              item.kind === "anchor" ? (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => goToAnchor(item.to)}
                  className={`text-sm font-medium transition-colors duration-200 ${linkTone}`}
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-sm font-medium transition-colors duration-200 ${linkTone}`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors duration-200 ${linkTone}`}
                >
                  Workspace
                </Link>
                <button
                  type="button"
                  onClick={() => void logout()}
                  className={`btn ${transparent ? "btn-onink" : "btn-outline"} px-4 py-2`}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-sm font-medium transition-colors duration-200 ${linkTone}`}
                >
                  Sign in
                </Link>
                <Link to="/login?intent=register" className="btn btn-primary px-4 py-2">
                  Review a contract
                </Link>
              </>
            )}
          </div>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={`-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors lg:hidden ${
              transparent ? "text-paper" : "text-ink"
            }`}
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 block h-[2px] w-5 bg-current transition-transform duration-300 ease-precise ${
                  menuOpen ? "top-[6px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-[6px] block h-[2px] w-5 bg-current transition-opacity duration-200 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-[2px] w-5 bg-current transition-transform duration-300 ease-precise ${
                  menuOpen ? "top-[6px] -rotate-45" : "top-[12px]"
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${menuOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 h-full w-full cursor-default bg-ink-deep transition-opacity duration-300 ${
            menuOpen ? "opacity-70" : "opacity-0"
          }`}
        />
        <div
          ref={panelRef}
          id="mobile-nav"
          role="dialog"
          aria-modal={menuOpen}
          aria-label="Site menu"
          className={`absolute inset-x-0 top-0 flex max-h-[100dvh] flex-col overflow-y-auto bg-paper pb-8 pt-[var(--header-h)] transition-transform duration-300 ease-precise ${
            menuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <nav aria-label="Mobile" className="shell flex flex-col pt-6">
            {primaryNav.map((item, index) => (
              <button
                key={item.to}
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  // Let the drawer close before scrolling.
                  window.setTimeout(() => goToAnchor(item.to), 260);
                }}
                className="flex items-baseline justify-between border-b border-paper-line py-4 text-left"
              >
                <span className="display text-[1.75rem] text-ink">
                  {item.label}
                </span>
                <span className="eyebrow text-graphite-light">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </button>
            ))}

            <div className="mt-7 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="btn btn-ink w-full"
                  >
                    Open workspace
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      void logout();
                    }}
                    className="btn btn-outline w-full"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login?intent=register"
                    onClick={() => setMenuOpen(false)}
                    className="btn btn-primary w-full"
                  >
                    Review a contract
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="btn btn-outline w-full"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>

            <a
              href={`mailto:${site.email}`}
              onClick={() => setMenuOpen(false)}
              className="mt-7 font-mono text-xs tracking-wide text-graphite underline underline-offset-4 hover:text-ink"
            >
              {site.email}
            </a>
          </nav>
        </div>
      </div>
    </>
  );
}
