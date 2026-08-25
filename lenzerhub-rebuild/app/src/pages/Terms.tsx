import { Link } from "react-router";
import { LegalPage } from "@/components/LegalPage";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { site } from "@/lib/site";

export default function Terms() {
  useDocumentMeta(
    "Terms of service — LenzerHub",
    "The terms that govern your use of LenzerHub, including account, payment and liability terms.",
  );

  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of service"
      updated="18 August 2026"
      intro="These terms govern your use of LenzerHub. They are written to be read, not to be survived. If something here is unclear, write to us and we will explain it in plain terms."
      sections={[
        {
          heading: "What LenzerHub does",
          body: (
            <>
              <p>
                LenzerHub compares agreements you provide against a library of
                clause positions and returns findings, severity scores and
                suggested replacement language.
              </p>
              <p>
                <strong className="font-semibold text-ink">
                  LenzerHub is not a law firm and does not provide legal advice.
                </strong>{" "}
                Using the service does not create an attorney-client
                relationship. You remain responsible for the agreements you sign.
              </p>
            </>
          ),
        },
        {
          heading: "Your account",
          body: (
            <p>
              You are responsible for keeping your credentials secure and for
              activity under your account. Tell us promptly at{" "}
              <a
                href={`mailto:${site.email}`}
                className="underline underline-offset-4 hover:text-ink"
              >
                {site.email}
              </a>{" "}
              if you believe an account has been accessed without permission.
            </p>
          ),
        },
        {
          heading: "Acceptable use",
          body: (
            <p>
              Do not upload material you have no right to share, attempt to
              disrupt the service, or resell output as your own legal service.
              We may suspend accounts that do.
            </p>
          ),
        },
        {
          heading: "Fees and cancellation",
          body: (
            <p>
              Paid plans bill in advance for the period shown at checkout.
              Cancel at any time and the plan runs to the end of the period you
              have paid for. We do not pro-rate partial periods.
            </p>
          ),
        },
        {
          heading: "Your content",
          body: (
            <p>
              You keep ownership of everything you upload. You grant us the
              limited licence needed to process it and return your analysis.
              Uploaded agreements are not used to train models.
            </p>
          ),
        },
        {
          heading: "Limitation of liability",
          body: (
            <p>
              To the extent permitted by law, our aggregate liability is limited
              to the fees you paid in the twelve months before the claim. We are
              not liable for outcomes of negotiations or for agreements you sign.
            </p>
          ),
        },
        {
          heading: "Changes and contact",
          body: (
            <>
              <p>
                If we change these terms materially, we will notify account
                holders by email before the change takes effect.
              </p>
              <p>
                Questions go to{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="underline underline-offset-4 hover:text-ink"
                >
                  {site.email}
                </a>
                . See also our{" "}
                <Link
                  to="/privacy"
                  className="underline underline-offset-4 hover:text-ink"
                >
                  privacy policy
                </Link>
                .
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
