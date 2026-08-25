import { useMemo, useState } from "react";
import { Link } from "react-router";

/**
 * Pricing sized to the one variable that actually drives value here: how many
 * agreements you sign a year. A three-column tier table would hide that.
 *
 * Comparison baseline: outside counsel at $350/hour, roughly 1.5 hours to read
 * and mark up a standard mid-market agreement.
 */
const COUNSEL_HOURLY = 350;
const COUNSEL_HOURS_PER_CONTRACT = 1.5;

const STOPS = [1, 3, 6, 12, 24, 48, 96, 200];

type Plan = {
  id: string;
  name: string;
  price: string;
  cadence: string;
  monthlyCost: number | null;
  covers: string;
  includes: string[];
  cta: { label: string; to: string };
};

function planFor(volume: number): Plan {
  if (volume <= 3) {
    return {
      id: "solo",
      name: "Single review",
      price: "Free",
      cadence: "first contract, then $39 each",
      monthlyCost: 0,
      covers: "Up to 3 contracts a year",
      includes: [
        "Full clause scan and severity scoring",
        "Replacement language for every finding",
        "Shareable analysis report",
      ],
      cta: { label: "Start with one contract", to: "/login?intent=register" },
    };
  }

  if (volume <= 48) {
    return {
      id: "team",
      name: "Team",
      price: "$89",
      cadence: "per month, billed annually",
      monthlyCost: 89,
      covers: "Up to 48 contracts a year",
      includes: [
        "Everything in Single review",
        "Renewal alerts 60 days before every auto-renewal date",
        "Shared workspace for the whole contract history",
        "Benchmarks showing what similar companies negotiated",
      ],
      cta: { label: "Start a Team trial", to: "/login?intent=register" },
    };
  }

  return {
    id: "volume",
    name: "Volume",
    price: "Let's talk",
    cadence: "priced on your renewal calendar",
    monthlyCost: null,
    covers: "Unlimited contracts",
    includes: [
      "Everything in Team",
      "Bulk import of your existing agreement library",
      "Custom clause positions your counsel already approved",
      "Named contact for negotiation questions",
    ],
    cta: { label: "Talk to us", to: "/contact" },
  };
}

export function PlanSizer() {
  const [index, setIndex] = useState(3);
  const volume = STOPS[index];
  const plan = useMemo(() => planFor(volume), [volume]);

  const counselCost = Math.round(
    volume * COUNSEL_HOURS_PER_CONTRACT * COUNSEL_HOURLY,
  );
  const planCost = plan.monthlyCost === null ? null : plan.monthlyCost * 12;
  const delta = planCost === null ? null : counselCost - planCost;

  const currency = (value: number) =>
    value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  return (
    <div>
      <div className="rounded-lg border border-paper-line bg-paper-raised p-6 md:p-8">
        <label htmlFor="volume-slider" className="eyebrow text-graphite">
          Contracts you sign in a year
        </label>

        <p className="display mt-3 text-display-md tabular-nums text-ink">
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

        <div className="mt-3 flex justify-between font-mono text-[0.6875rem] text-graphite-light">
          {STOPS.map((stop, i) => (
            <button
              key={stop}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${stop} contracts a year`}
              className={`transition-colors hover:text-ink ${
                i === index ? "text-ink" : ""
              }`}
            >
              {stop === 200 ? "200+" : stop}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-[1.15fr_1fr]">
        <div className="rounded-lg border border-paper-line bg-ink p-6 text-paper md:p-8">
          <p className="eyebrow text-insert">{plan.covers}</p>
          <h3 className="display mt-3 text-display-sm text-paper">
            {plan.name}
          </h3>
          <p className="mt-4 flex items-baseline gap-2">
            <span className="display text-[2.75rem] leading-none text-paper">
              {plan.price}
            </span>
          </p>
          <p className="mt-2 font-mono text-xs text-paper/45">{plan.cadence}</p>

          <ul className="mt-6 space-y-3">
            {plan.includes.map((item) => (
              <li
                key={item}
                className="border-t border-ink-line pt-3 text-sm leading-relaxed text-paper/70 first:border-t-0 first:pt-0"
              >
                {item}
              </li>
            ))}
          </ul>

          <Link to={plan.cta.to} className="btn btn-primary mt-7 w-full">
            {plan.cta.label}
          </Link>
        </div>

        <div className="rounded-lg border border-paper-line bg-paper-raised p-6 md:p-8">
          <p className="eyebrow text-graphite">The comparison</p>
          <p className="mt-4 font-read text-[0.9375rem] leading-relaxed text-graphite">
            Outside counsel at {currency(COUNSEL_HOURLY)} an hour, about{" "}
            {COUNSEL_HOURS_PER_CONTRACT} hours to read and mark up a standard
            agreement.
          </p>

          <dl className="mt-6 space-y-4">
            <div className="flex items-baseline justify-between gap-4 border-t border-paper-line pt-4">
              <dt className="text-sm text-graphite">Counsel, {volume} contracts</dt>
              <dd className="font-mono text-sm tabular-nums text-ink">
                {currency(counselCost)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-paper-line pt-4">
              <dt className="text-sm text-graphite">{plan.name}, one year</dt>
              <dd className="font-mono text-sm tabular-nums text-ink">
                {planCost === null ? "Quoted" : currency(planCost)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-paper-line pt-4">
              <dt className="text-sm font-semibold text-ink">Difference</dt>
              <dd className="font-mono text-sm tabular-nums font-semibold text-insert-deep">
                {delta === null ? "—" : currency(delta)}
              </dd>
            </div>
          </dl>

          <p className="mt-6 text-xs leading-relaxed text-graphite-light">
            LenzerHub is not a law firm and does not give legal advice. For
            genuinely novel or high-value agreements, use this to arrive at your
            lawyer's office already knowing which clauses to spend the hour on.
          </p>
        </div>
      </div>
    </div>
  );
}
