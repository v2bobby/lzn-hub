import { Link } from "react-router";
import { LogoMark } from "@/components/Logo";
import { COMPANY_PAGES, PRODUCT_PAGES } from "@/lib/pages";
import { companyLine, formatPhone, mailto, registeredAddress, site, workWithUs } from "@/lib/site";

/**
 * Shared detailed footer, identical on every page.
 * Contact details come only from lib/site.ts.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  const heading = "text-sm font-semibold text-ink";
  const item = "text-sm text-graphite transition-colors hover:text-ink";

  return (
    <footer className="border-t border-paper-line bg-paper-raised">
      <div className="shell py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.3fr]">
          {/* Brand */}
          <div className="max-w-xs sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              aria-label="LenzerHub home"
              className="inline-flex items-center gap-2.5 rounded-sm"
            >
              <LogoMark size={26} />
              <span className="text-[1.0625rem] font-semibold leading-none text-ink">
                LenzerHub
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-graphite">
              {site.summary}
            </p>
            <Link
              to="/login?intent=register"
              className="btn btn-primary mt-5 px-4 py-2.5"
            >
              Review a contract free
            </Link>
          </div>

          {/* Product */}
          <nav aria-label="Product">
            <h2 className={heading}>Product</h2>
            <ul className="mt-3 space-y-2">
              {PRODUCT_PAGES.map((page) => (
                <li key={page.path}>
                  <Link to={page.path} className={item}>
                    {page.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/dashboard" className={item}>
                  Your workspace
                </Link>
              </li>
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <h2 className={heading}>Company</h2>
            <ul className="mt-3 space-y-2">
              {COMPANY_PAGES.map((page) => (
                <li key={page.path}>
                  <Link to={page.path} className={item}>
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Work with us */}
          <nav aria-label="Work with us">
            <h2 className={heading}>Work with us</h2>
            <ul className="mt-3 space-y-2">
              {workWithUs.map((topic) => (
                <li key={topic.label}>
                  <a href={mailto(topic.subject)} className={item}>
                    {topic.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className={heading}>Contact</h2>
            <address className="mt-3 space-y-2 not-italic">
              <p>
                <a href={`mailto:${site.email}`} className={item}>
                  {site.email}
                </a>
              </p>
              <p>
                <a href={`tel:${site.phone}`} className={item}>
                  {formatPhone(site.phone)}
                </a>
              </p>
              <p className="text-sm text-graphite">{registeredAddress()}</p>
              <p className="text-sm text-graphite">
                {site.team.map((member) => member.name).join(" and ")}
              </p>
              {site.social.map((profile) => (
                <p key={profile.href}>
                  <a
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={item}
                  >
                    {profile.label}
                  </a>
                </p>
              ))}
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-paper-line pt-6 text-sm text-graphite md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p>{`© ${year} ${companyLine()}.`}</p>
            <p>{site.disclaimer}</p>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link to="/privacy" className={item}>
                Privacy
              </Link>
            </li>
            <li>
              <Link to="/terms" className={item}>
                Terms
              </Link>
            </li>
            <li>
              <Link to="/contact" className={item}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
