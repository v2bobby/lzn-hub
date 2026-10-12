import { useState } from "react";
import { Link } from "react-router";
import {
  COUNSEL_HOURLY,
  COUNSEL_HOURS_PER_CONTRACT,
  PLANS,
  planFor,
} from "@/lib/plans";

/**
 * Pricing sized to the one variable that drives value here: how many
 * agreements you sign a year.
 *
 * Comparison baseline: outside counsel at $350/hour, roughly 1.5 hours to read
 * and mark up a standard mid-market agreement.
 */
const STOPS = [1, 3, 6, 12, 24, 48, 96, 200];

const currency = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

export function PlanSizer() {
  const [index, setIndex] = useState(3);
  const volume = STOPS[index];
  const plan = planFor(volume);

  const counselCost = Math.round(
    volume * COUNSEL_HOURS_PER_CONTRACT * COUNSEL_HOURLY,
  );
  const planCost = plan.monthlyCost === null ? null : plan.monthlyCost * 12;
  const delta = planCost === null ? null : counselCost - planCost;

  return (
    <div>
      <div className="panel p-6 md:p-8">
        <label htmlFor="volume-slider" className="text-[0.9375rem] font-semibold text-ink">
          Contracts you sign in a year
        </label>

        <p className="mt-2 text-[2.25rem] font-semibold leading-none tabular-nums text-ink">
          {volume === 200 ? "200+" : volume}
        </p>

        <input
          id="volume-slider"
          type="range"
          min={0}
          max={STOPS.length - 1}
          step={1}
          value={index}
          onChange={(event) => setIndex(Number(event.target.value))}
          aria-valuetext={`${volume} contracts a year`}
          className="mt-6 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-paper-sunk accent-insert"
        />

        <div className="mt-3 flex justify-between text-sm text-graphite">
          {STOPS.map((stop, i) => (
            <button
              key={stop}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${stop} contracts a year`}
              className={`tabular-nums transition-colors hover:text-ink ${
                i === index ? "font-semibold text-ink" : ""
              }`}
            >
              {stop === 200 ? "200+" : stop}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-[1.15fr_1fr]">
        <div className="panel p-6 md:p-8" aria-live="polite">
          <p className="eyebrow">Suggested plan · {plan.covers}</p>
          <h3 className="display mt-2 text-display-sm text-ink">{plan.name}</h3>
          <p className="mt-3 text-[2.25rem] font-semibold leading-none text-ink">
            {plan.price}
          </p>
          <p className="mt-2 text-sm text-graphite">{plan.cadence}</p>

          <ul className="mt-6 divide-y divide-paper-line border-t border-paper-line">
            {plan.includes.map((item) => (
              <li key={item} className="py-2.5 text-[0.9375rem] text-ink">
                {item}
              </li>
            ))}
          </ul>

          <Link to={plan.cta.to} className="btn btn-primary mt-6 w-full">
            {plan.cta.label}
          </Link>
        </div>

        <div className="panel p-6 md:p-8">
          <p className="eyebrow">The comparison</p>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-graphite">
            Outside counsel at {currency(COUNSEL_HOURLY)} an hour, about{" "}
            {COUNSEL_HOURS_PER_CONTRACT} hours to read and mark up a standard
            agreement.
          </p>

          <dl className="mt-5 divide-y divide-paper-line border-t border-paper-line">
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-sm text-graphite">Counsel, {volume} contracts</dt>
              <dd className="font-mono text-sm tabular-nums text-ink">
                {currency(counselCost)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-sm text-graphite">{plan.name}, one year</dt>
              <dd className="font-mono text-sm tabular-nums text-ink">
                {planCost === null ? "Quoted" : currency(planCost)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-sm font-semibold text-ink">Difference</dt>
              <dd className="font-mono text-sm font-semibold tabular-nums text-ink">
                {delta === null ? "Quoted" : currency(delta)}
              </dd>
            </div>
          </dl>

          <p className="mt-5 text-sm leading-relaxed text-graphite">
            LenzerHub is not a law firm and does not give legal advice. For
            genuinely novel or high-value agreements, use this to arrive at your
            lawyer's office already knowing which clauses to spend the hour on.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Every plan side by side, as plain content. */
export function PlanTable() {
  return (
    <div className="panel md:overflow-x-auto">
      <table className="block w-full border-collapse text-left md:table md:min-w-[40rem]">
        <caption className="sr-only">All LenzerHub plans</caption>
        <thead className="hidden md:table-header-group">
          <tr className="border-b border-paper-line text-sm text-graphite">
            <th scope="col" className="px-5 py-3 font-medium">Plan</th>
            <th scope="col" className="px-5 py-3 font-medium">Price</th>
            <th scope="col" className="px-5 py-3 font-medium">Sized for</th>
            <th scope="col" className="px-5 py-3 font-medium">Includes</th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {PLANS.map((plan) => (
            <tr key={plan.id} className="block border-b border-paper-line px-5 py-4 last:border-b-0 md:table-row md:p-0">
              <th scope="row" className="block pb-2 align-top md:table-cell md:px-5 md:py-4 text-[0.9375rem] font-semibold text-ink">
                {plan.name}
              </th>
              <td data-label="Price" className="block py-1 align-top before:block before:text-sm before:font-medium before:text-graphite before:content-[attr(data-label)] md:table-cell md:px-5 md:py-4 md:before:content-none text-[0.9375rem] text-ink">
                {plan.price}
                <span className="block text-sm text-graphite">{plan.cadence}</span>
              </td>
              <td data-label="Sized for" className="block py-1 align-top before:block before:text-sm before:font-medium before:text-graphite before:content-[attr(data-label)] md:table-cell md:px-5 md:py-4 md:before:content-none text-[0.9375rem] text-graphite">
                {plan.covers}
              </td>
              <td data-label="Includes" className="block py-1 align-top before:block before:text-sm before:font-medium before:text-graphite before:content-[attr(data-label)] md:table-cell md:px-5 md:py-4 md:before:content-none text-[0.9375rem] text-graphite">
                {plan.includes.join(". ")}.
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
