import { PageShell, PageSection } from "@/components/PageShell";
import { COVERAGE } from "@/lib/coverage";
import { DATA_FILES } from "@/lib/seo";

export default function Coverage() {
  return (
    <PageShell path="/coverage">
      <PageSection>
        {/* Scrolls inside its own panel so the page never moves sideways. */}
        <div className="panel md:overflow-x-auto">
          <table className="block w-full border-collapse text-left md:table md:min-w-[40rem]">
            <caption className="sr-only">
              Clause categories LenzerHub inspects and what each produces
            </caption>
            <thead className="hidden md:table-header-group">
              <tr className="border-b border-paper-line text-sm text-graphite">
                <th scope="col" className="px-5 py-3 font-medium">Category</th>
                <th scope="col" className="px-5 py-3 font-medium">What gets inspected</th>
                <th scope="col" className="px-5 py-3 font-medium">What you get back</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group">
              {COVERAGE.map((row) => (
                <tr key={row.area} className="block border-b border-paper-line px-5 py-4 last:border-b-0 md:table-row md:p-0">
                  <th scope="row" className="block pb-2 align-top md:table-cell md:px-5 md:py-4 text-[0.9375rem] font-semibold text-ink">
                    {row.area}
                  </th>
                  <td data-label="What gets inspected" className="block py-1 align-top before:block before:text-sm before:font-medium before:text-graphite before:content-[attr(data-label)] md:table-cell md:px-5 md:py-4 md:before:content-none text-[0.9375rem] leading-relaxed text-graphite">
                    {row.checks}
                  </td>
                  <td data-label="What you get back" className="block py-1 align-top before:block before:text-sm before:font-medium before:text-graphite before:content-[attr(data-label)] md:table-cell md:px-5 md:py-4 md:before:content-none text-[0.9375rem] leading-relaxed text-ink">
                    {row.output}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 text-[0.9375rem] text-graphite">
          This table is also published as open JSON:{" "}
          <a href={DATA_FILES.coverage.path} className="link">
            {DATA_FILES.coverage.path}
          </a>
          .
        </p>
      </PageSection>
    </PageShell>
  );
}
