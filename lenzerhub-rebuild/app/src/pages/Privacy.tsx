import { Link } from "react-router";
import { LegalPage } from "@/components/LegalPage";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { site } from "@/lib/site";

export default function Privacy() {
  useDocumentMeta(
    "Privacy policy — LenzerHub",
    "What LenzerHub collects, why, how long it is kept, and the rights you have over it.",
  );

  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy policy"
      updated="18 August 2026"
      intro="This policy explains what we collect, why we collect it, and what you can ask us to do with it. Contracts are sensitive documents, so the short version is: we process them to produce your analysis and for nothing else."
      sections={[
        {
          heading: "What we collect",
          body: (
            <>
              <p>
                <strong className="font-semibold text-ink">Account data:</strong>{" "}
                your name, email address, and either a hashed password or an
                identifier from Google or Kimi if you sign in that way. Passwords
                are hashed with bcrypt and never stored in readable form.
              </p>
              <p>
                <strong className="font-semibold text-ink">Contract data:</strong>{" "}
                the agreements and metadata you add, plus the findings generated
                from them.
              </p>
              <p>
                <strong className="font-semibold text-ink">Technical data:</strong>{" "}
                standard server logs needed to run and secure the service.
              </p>
            </>
          ),
        },
        {
          heading: "Why we process it",
          body: (
            <p>
              To authenticate you, produce and store your analyses, send
              renewal alerts you have asked for, and keep the service running
              and secure. We do not sell personal data and we do not run
              advertising.
            </p>
          ),
        },
        {
          heading: "Training and model use",
          body: (
            <p>
              Your contracts are not used to train models and are not shared
              with other customers. Improvements to the clause library are
              written by hand from public and market-standard positions.
            </p>
          ),
        },
        {
          heading: "Retention and deletion",
          body: (
            <p>
              Contracts and their findings stay in your workspace until you
              delete them. Deleting a contract removes its findings at the same
              time. Ask us to close an account and we remove the associated data
              within 30 days, except where we must keep records for legal or
              accounting reasons.
            </p>
          ),
        },
        {
          heading: "Sub-processors",
          body: (
            <p>
              We use infrastructure providers for hosting, database storage and
              authentication. They process data on our instructions only. We
              will publish an up-to-date list on request.
            </p>
          ),
        },
        {
          heading: "Your rights",
          body: (
            <p>
              Depending on where you live, you may have the right to access,
              correct, export or erase your data, and to object to certain
              processing. Write to{" "}
              <a
                href={`mailto:${site.email}`}
                className="underline underline-offset-4 hover:text-ink"
              >
                {site.email}
              </a>{" "}
              and we will respond within 30 days.
            </p>
          ),
        },
        {
          heading: "Cookies",
          body: (
            <p>
              We set a session cookie so you stay signed in. There are no
              advertising or cross-site tracking cookies. See the{" "}
              <Link
                to="/terms"
                className="underline underline-offset-4 hover:text-ink"
              >
                terms of service
              </Link>{" "}
              for the rest of the arrangement.
            </p>
          ),
        },
      ]}
    />
  );
}
