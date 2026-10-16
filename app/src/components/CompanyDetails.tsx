import { registeredAddress, registrationDate, site } from "@/lib/site";

/**
 * The company's registration details, read from lib/site.ts.
 * Used on the About page; the footer and legal pages show a shorter form.
 */
export function CompanyDetails() {
  const { company } = site;
  const rows = [
    { term: "Legal name", detail: company.legalName },
    { term: "Registration number", detail: company.registrationNumber },
    { term: "Registered with", detail: company.registry },
    { term: "Registered under", detail: company.act },
    { term: "Date of registration", detail: registrationDate() },
    { term: "Registered office", detail: registeredAddress() },
  ];

  return (
    <dl className="panel max-w-3xl divide-y divide-paper-line">
      {rows.map(row => (
        <div
          key={row.term}
          className="grid gap-1 px-5 py-3.5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6"
        >
          <dt className="text-[0.9375rem] text-graphite">{row.term}</dt>
          <dd className="text-[0.9375rem] text-ink">{row.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
