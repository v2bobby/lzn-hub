import { PageShell, PageSection } from "@/components/PageShell";
import { RiskEstimator } from "@/components/RiskEstimator";
import { severityTone } from "@/lib/severity";
import {
  SEVERITY_LABEL,
  SEVERITY_ORDER,
  SEVERITY_WEIGHTS,
  riskBand,
} from "@contracts/clause-library";

/** Score ranges, read from riskBand so they always match the product. */
function bands() {
  const out: { from: number; to: number; label: string; tone: ReturnType<typeof riskBand>["tone"] }[] = [];
  for (let score = 0; score <= 100; score++) {
    const band = riskBand(score);
    const last = out[out.length - 1];
    if (last && last.label === band.label) last.to = score;
    else out.push({ from: score, to: score, label: band.label, tone: band.tone });
  }
  return out.reverse();
}

export default function Scoring() {
  return (
    <PageShell path="/scoring">
      <PageSection>
        <RiskEstimator />
      </PageSection>

      <PageSection
        title="How the score is calculated"
        intro="The same three rules apply to every contract."
      >
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="panel p-6">
            <h3 className="text-lg font-semibold text-ink">1. Each finding has a fixed weight</h3>
            <dl className="mt-4 divide-y divide-paper-line border-t border-paper-line">
              {SEVERITY_ORDER.map((severity) => (
                <div key={severity} className="flex items-center justify-between py-2.5">
                  <dt className="flex items-center gap-2 text-[0.9375rem] text-ink">
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: severityTone(severity).text }}
                    />
                    {SEVERITY_LABEL[severity]}
                  </dt>
                  <dd className="font-mono text-[0.9375rem] tabular-nums text-ink">
                    {SEVERITY_WEIGHTS[severity]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="panel p-6">
            <h3 className="text-lg font-semibold text-ink">2. The weights are summed against the worst case</h3>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-graphite">
              The worst case for a set of findings is every one of them being
              critical, so the denominator is the number of findings times 4.
            </p>
            <p className="mt-4 rounded-md bg-paper px-4 py-3 font-mono text-sm text-ink">
              score = (sum of weights ÷ (findings × 4)) × 100
            </p>
          </div>

          <div className="panel p-6">
            <h3 className="text-lg font-semibold text-ink">3. The score falls into a band</h3>
            <dl className="mt-4 divide-y divide-paper-line border-t border-paper-line">
              {bands().map((band) => (
                <div key={band.label} className="flex items-center justify-between py-2.5">
                  <dt className="flex items-center gap-2 text-[0.9375rem] text-ink">
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: severityTone(band.tone).text }}
                    />
                    {band.label}
                  </dt>
                  <dd className="font-mono text-[0.9375rem] tabular-nums text-graphite">
                    {`${band.from} to ${band.to}`}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </PageSection>
    </PageShell>
  );
}
