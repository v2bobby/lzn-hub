import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { formatPhone, site } from "@/lib/site";

const TOPICS = [
  "A contract question",
  "Pricing for higher volume",
  "Something is broken",
  "Something else",
];

export default function Contact() {
  useDocumentMeta(
    "Contact — LenzerHub",
    "Ask a contract question, request volume pricing, or report a problem.",
  );

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
    const body = `${form.message}\n\n— ${form.name} (${form.email})`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      `[${form.topic}] from ${form.name}`,
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
    toast.success("Opening your email client", {
      description: `The message is addressed to ${site.email}.`,
    });
  };

  return (
    <div className="overflow-x-hidden bg-paper">
      <SiteHeader />

      <main id="main">
        <div className="shell grid gap-y-12 pb-24 pt-[calc(var(--header-h)+5rem)] lg:grid-cols-[minmax(15rem,22rem)_1fr] lg:gap-x-16 xl:gap-x-24">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
            <p className="eyebrow text-insert-deep">Contact</p>
            <h1 className="display mt-5 text-display-md text-ink">
              Ask before you sign.
            </h1>
            <p className="mt-5 max-w-read font-read text-[1.0625rem] leading-relaxed text-graphite">
              Questions about a specific clause, volume pricing, or something
              that is not working. Replies usually land within one business day.
            </p>

            <hr className="rule my-8" />

            <dl className="space-y-4 text-sm">
              <div>
                <dt className="eyebrow text-graphite-light">Email</dt>
                <dd className="mt-1.5">
                  <a
                    href={`mailto:${site.email}`}
                    className="text-ink underline underline-offset-4 transition-colors hover:text-insert-deep"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
              {site.phone ? (
                <div>
                  <dt className="eyebrow text-graphite-light">Phone</dt>
                  <dd className="mt-1.5">
                    <a
                      href={`tel:${site.phone}`}
                      className="text-ink underline underline-offset-4 transition-colors hover:text-insert-deep"
                    >
                      {formatPhone(site.phone)}
                    </a>
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className="eyebrow text-graphite-light">LinkedIn</dt>
                <dd className="mt-1.5">
                  <a
                    href={site.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink underline underline-offset-4 transition-colors hover:text-insert-deep"
                  >
                    {site.founder.name}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="max-w-xl">
            {sent ? (
              <div
                role="status"
                className="rounded-lg border border-insert/30 bg-insert-wash p-8"
              >
                <h2 className="display text-display-sm text-ink">
                  Your email client is open.
                </h2>
                <p className="mt-4 font-read text-[1rem] leading-relaxed text-graphite">
                  If nothing appeared, write to{" "}
                  <a
                    href={`mailto:${site.email}`}
                    className="underline underline-offset-4"
                  >
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
              <form onSubmit={submit} noValidate className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className="field-label">
                      Name
                    </label>
                    <input
                      id="c-name"
                      className="field"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "c-name-error" : undefined}
                    />
                    {errors.name ? (
                      <p id="c-name-error" role="alert" className="mt-1.5 text-xs text-strike">
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
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "c-email-error" : undefined}
                    />
                    {errors.email ? (
                      <p id="c-email-error" role="alert" className="mt-1.5 text-xs text-strike">
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
                    <p id="c-message-error" role="alert" className="mt-1.5 text-xs text-strike">
                      {errors.message}
                    </p>
                  ) : null}
                </div>

                <button type="submit" className="btn btn-primary">
                  Send message
                </button>

                <p className="text-xs leading-relaxed text-graphite-light">
                  Do not send confidential contract text through this form. Once
                  you have an account you can upload agreements to your
                  workspace instead.
                </p>
              </form>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
