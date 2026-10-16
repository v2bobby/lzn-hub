import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { PageShell, PageSection } from "@/components/PageShell";
import { formatPhone, mailto, registeredAddress, site, workWithUs } from "@/lib/site";

const TOPICS = [
  "A contract question",
  "Pricing for higher volume",
  "Something is broken",
  "Something else",
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: TOPICS[0],
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();

    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Tell us who you are.";
    if (!form.email.includes("@")) next.email = "Enter a valid email address.";
    if (form.message.trim().length < 10)
      next.message = "A sentence or two helps us reply usefully.";

    setErrors(next);
    if (Object.keys(next).length) {
      toast.error("Check the highlighted fields");
      return;
    }

    // There is no inbound message endpoint yet, so this hands off to the
    // visitor's mail client rather than silently dropping the message.
    const body = `${form.message}\n\n${form.name} (${form.email})`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      `[${form.topic}] from ${form.name}`,
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
    toast.success("Opening your email client", {
      description: `The message is addressed to ${site.email}.`,
    });
  };

  return (
    <PageShell path="/contact">
      <PageSection>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-12">
          <aside className="space-y-6">
            <dl className="panel divide-y divide-paper-line">
              <div className="p-5">
                <dt className="eyebrow">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${site.email}`} className="link text-[0.9375rem]">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div className="p-5">
                <dt className="eyebrow">Phone</dt>
                <dd className="mt-1">
                  <a href={`tel:${site.phone}`} className="link text-[0.9375rem]">
                    {formatPhone(site.phone)}
                  </a>
                </dd>
              </div>
              <div className="p-5">
                <dt className="eyebrow">Registered office</dt>
                <dd className="mt-1 text-[0.9375rem] text-ink">
                  {site.company.legalName}
                  <span className="block">{registeredAddress()}</span>
                  <span className="block text-sm text-graphite">
                    {`${site.company.registryShort} registration no. ${site.company.registrationNumber}`}
                  </span>
                </dd>
              </div>
              <div className="p-5">
                <dt className="eyebrow">Team</dt>
                <dd className="mt-1 text-[0.9375rem] text-ink">
                  {site.team.map((m) => `${m.name}, ${m.role.toLowerCase()}`).join("; ")}
                  <Link to="/team" className="link mt-1 block text-sm">
                    About the team
                  </Link>
                </dd>
              </div>
            </dl>

            <div>
              <h2 className="text-[0.9375rem] font-semibold text-ink">Work with us</h2>
              <ul className="mt-2 space-y-1.5">
                {workWithUs.map((topic) => (
                  <li key={topic.label}>
                    <a href={mailto(topic.subject)} className="link text-[0.9375rem]">
                      {topic.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="max-w-xl">
            {sent ? (
              <div role="status" className="rounded-lg border border-insert/30 bg-insert-wash p-6 md:p-8">
                <h2 className="display text-display-sm text-ink">
                  Your email client is open
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-graphite">
                  If nothing appeared, write to{" "}
                  <a href={`mailto:${site.email}`} className="link">
                    {site.email}
                  </a>{" "}
                  directly and we will pick it up from there.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="btn btn-outline mt-6"
                >
                  Write another message
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="panel space-y-5 p-6 md:p-8">
                <h2 className="display text-display-sm text-ink">Send a message</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className="field-label">
                      Name
                    </label>
                    <input
                      id="c-name"
                      className="field"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "c-name-error" : undefined}
                    />
                    {errors.name ? (
                      <p id="c-name-error" role="alert" className="mt-1.5 text-sm text-strike">
                        {errors.name}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label htmlFor="c-email" className="field-label">
                      Email
                    </label>
                    <input
                      id="c-email"
                      type="email"
                      className="field"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "c-email-error" : undefined}
                    />
                    {errors.email ? (
                      <p id="c-email-error" role="alert" className="mt-1.5 text-sm text-strike">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label htmlFor="c-topic" className="field-label">
                    What is this about
                  </label>
                  <select
                    id="c-topic"
                    className="field"
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  >
                    {TOPICS.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="c-message" className="field-label">
                    Message
                  </label>
                  <textarea
                    id="c-message"
                    rows={6}
                    className="field resize-y"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "c-message-error" : undefined}
                  />
                  {errors.message ? (
                    <p id="c-message-error" role="alert" className="mt-1.5 text-sm text-strike">
                      {errors.message}
                    </p>
                  ) : null}
                </div>

                <button type="submit" className="btn btn-primary">
                  Send message
                </button>

                <p className="text-sm leading-relaxed text-graphite">
                  Do not send confidential contract text through this form. Once
                  you have an account you can upload agreements to your
                  workspace instead.
                </p>
              </form>
            )}
          </div>
        </div>
      </PageSection>
    </PageShell>
  );
}
