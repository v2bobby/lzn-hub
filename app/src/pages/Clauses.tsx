import { PageShell, PageSection } from "@/components/PageShell";
import { ClauseInspector } from "@/components/ClauseInspector";
import { DATA_FILES } from "@/lib/seo";

export default function Clauses() {
  return (
    <PageShell path="/clauses">
      <PageSection>
        <ClauseInspector />
      </PageSection>

      <PageSection title="Where this comes from">
        <div className="max-w-2xl space-y-3 text-[0.9375rem] leading-relaxed text-graphite">
          <p>
            This is the live clause library. The analysis endpoint reads the
            same file, so nothing on this page is a mock-up.
          </p>
          <p>
            The full library, including severity weights and replacement
            wording, is published as open JSON:{" "}
            <a href={DATA_FILES.clauses.path} className="link">
              {DATA_FILES.clauses.path}
            </a>
            .
          </p>
        </div>
      </PageSection>
    </PageShell>
  );
}
