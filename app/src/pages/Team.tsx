import { Link } from "react-router";
import { PageShell, PageSection } from "@/components/PageShell";
import { formatPhone, site } from "@/lib/site";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export default function Team() {
  return (
    <PageShell path="/team">
      <PageSection>
        <ul className="grid gap-5 md:grid-cols-2">
          {site.team.map((member) => (
            <li
              key={member.name}
              id={member.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
              className="panel flex flex-col p-6 md:p-7"
            >
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-paper-sunk text-[0.9375rem] font-semibold text-ink"
                >
                  {initials(member.name)}
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-ink">{member.name}</h2>
                  <p className="text-[0.9375rem] text-graphite">{member.role}</p>
                </div>
              </div>

              <div className="mt-5 flex-1 space-y-3 text-[0.9375rem] leading-relaxed text-graphite">
                {member.bio.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <p className="mt-5 border-t border-paper-line pt-4 text-[0.9375rem]">
                <span className="text-graphite">Contact: </span>
                <a href={member.contact.href} className="link">
                  {member.contact.label}
                </a>
              </p>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection title="Reach the team">
        <div className="max-w-2xl text-[1.0625rem] leading-relaxed text-graphite">
          <p>
            Email{" "}
            <a href={`mailto:${site.email}`} className="link">
              {site.email}
            </a>{" "}
            or call{" "}
            <a href={`tel:${site.phone}`} className="link">
              {formatPhone(site.phone)}
            </a>
            . We are based in {`${site.location.city}, ${site.location.country}`}.
          </p>
          <div className="mt-6">
            <Link to="/contact" className="btn btn-outline">
              Send us a message
            </Link>
          </div>
        </div>
      </PageSection>
    </PageShell>
  );
}
