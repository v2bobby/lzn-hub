import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router";
import { Logo } from "@/components/Logo";
import { NAV_PAGES } from "@/lib/pages";
import { formatPhone, site } from "@/lib/site";
import { useAuth } from "@/hooks/useAuth";

/**
 * One navigation, identical on every page. The current page is marked with
 * aria-current="page" (NavLink sets it). Below the width where the links stop
 * fitting (xl, 1280px) they move behind a Menu button.
 */
export function SiteHeader({ overHero = false }: { overHero?: boolean }) {
  // Always false on first render so the server-rendered HTML and the first
  // client render match; the real value is read after mount.
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { isAuthenticated, logout } = useAuth();

  const onDark = overHero && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Scroll lock, Escape to close, focus into the panel while it is open.
  useEffect(() => {
    if (!menuOpen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

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
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  const desktopLink = ({ isActive }: { isActive: boolean }) =>
    [
      "relative py-2 text-[0.9375rem] transition-colors duration-150",
      onDark
        ? isActive
          ? "text-white"
          : "text-white/75 hover:text-white"
        : isActive
          ? "font-medium text-ink"
          : "text-graphite hover:text-ink",
      isActive
        ? `after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full ${onDark ? "after:bg-white" : "after:bg-ink"}`
        : "",
    ].join(" ");

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 h-[var(--header-h)] transition-colors duration-200 ${
          onDark
            ? "bg-transparent"
            : "border-b border-paper-line bg-paper-raised"
        }`}
      >
        <div className="shell flex h-full items-center justify-between gap-6">
          <Logo tone={onDark ? "paper" : "ink"} size={26} />

          <nav aria-label="Main" className="hidden items-center gap-6 xl:flex">
            {NAV_PAGES.map((page) => (
              <NavLink key={page.path} to={page.path} end className={desktopLink}>
                {page.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-4 xl:flex">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={desktopLink}>
                  Workspace
                </NavLink>
                <button
                  type="button"
                  onClick={() => void logout()}
                  className={`btn ${onDark ? "btn-onink" : "btn-outline"} px-4 py-2`}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={desktopLink}>
                  Sign in
                </NavLink>
                <Link
                  to="/login?intent=register"
                  className="btn btn-primary px-4 py-2"
                >
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
            aria-controls="site-menu"
            className={`-mr-2 inline-flex h-11 items-center gap-2 rounded-md px-3 text-[0.9375rem] font-medium xl:hidden ${
              onDark ? "text-white" : "text-ink"
            }`}
          >
            <span aria-hidden="true" className="relative block h-3 w-4">
              <span
                className={`absolute left-0 block h-[1.5px] w-4 bg-current transition-transform duration-200 ${
                  menuOpen ? "top-[5px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 block h-[1.5px] w-4 bg-current transition-transform duration-200 ${
                  menuOpen ? "top-[5px] -rotate-45" : "top-[10px]"
                }`}
              />
            </span>
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {/* Menu panel for narrow screens */}
      <div
        className={`fixed inset-0 z-40 xl:hidden ${menuOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close menu"
          onClick={close}
          className={`absolute inset-0 h-full w-full cursor-default bg-ink-deep transition-opacity duration-200 ${
            menuOpen ? "opacity-50" : "opacity-0"
          }`}
        />
        <div
          ref={panelRef}
          id="site-menu"
          role="dialog"
          aria-modal={menuOpen}
          aria-label="Site menu"
          className={`absolute inset-x-0 top-0 flex max-h-[100dvh] flex-col overflow-y-auto border-b border-paper-line bg-paper-raised pb-8 pt-[var(--header-h)] transition-transform duration-200 ${
            menuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <nav aria-label="Menu" className="shell flex flex-col pt-2">
            <NavLink
              to="/"
              end
              onClick={close}
              className={({ isActive }) =>
                `border-b border-paper-line py-3.5 text-lg ${isActive ? "font-semibold text-ink" : "text-ink"}`
              }
            >
              Home
            </NavLink>
            {NAV_PAGES.map((page) => (
              <NavLink
                key={page.path}
                to={page.path}
                end
                onClick={close}
                className={({ isActive }) =>
                  `flex items-baseline justify-between gap-4 border-b border-paper-line py-3.5 text-lg ${
                    isActive ? "font-semibold text-ink" : "text-ink"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{page.label}</span>
                    {isActive ? (
                      <span className="text-sm font-normal text-graphite">
                        Current page
                      </span>
                    ) : null}
                  </>
                )}
              </NavLink>
            ))}

            <div className="mt-6 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={close} className="btn btn-ink w-full">
                    Open workspace
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      close();
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
                    onClick={close}
                    className="btn btn-primary w-full"
                  >
                    Review a contract
                  </Link>
                  <Link to="/login" onClick={close} className="btn btn-outline w-full">
                    Sign in
                  </Link>
                </>
              )}
            </div>

            <p className="mt-6 text-sm text-graphite">
              <a href={`mailto:${site.email}`} className="link">
                {site.email}
              </a>
              <span aria-hidden="true"> · </span>
              <a href={`tel:${site.phone}`} className="link">
                {formatPhone(site.phone)}
              </a>
            </p>
          </nav>
        </div>
      </div>
    </>
  );
}
