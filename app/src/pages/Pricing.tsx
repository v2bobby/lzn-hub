import { PageShell, PageSection } from "@/components/PageShell";
import { PlanSizer, PlanTable } from "@/components/PlanSizer";
import { DATA_FILES } from "@/lib/seo";

export default function Pricing() {
  return (
    <PageShell path="/pricing">
      <PageSection>
        <PlanSizer />
      </PageSection>

      <PageSection title="All plans" intro="Every plan at a glance. Prices are in US dollars.">
        <PlanTable />
        <p className="mt-5 text-[0.9375rem] text-graphite">
          Plans and prices are also published as open JSON:{" "}
          <a href={DATA_FILES.plans.path} className="link">
            {DATA_FILES.plans.path}
          </a>
          .
        </p>
      </PageSection>
    </PageShell>
  );
}
