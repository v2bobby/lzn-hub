import type { Severity } from "@contracts/clause-library";

/**
 * Severity colours live outside the component file so the tone lookup can be
 * imported by pages without breaking fast refresh.
 */
export const SEVERITY_TONE: Record<
  Severity,
  { text: string; wash: string; border: string }
> = {
  critical: {
    text: "#B3311C",
    wash: "rgba(179,49,28,0.09)",
    border: "rgba(179,49,28,0.28)",
  },
  high: {
    text: "#C0701B",
    wash: "rgba(192,112,27,0.09)",
    border: "rgba(192,112,27,0.28)",
  },
  medium: {
    text: "#9C8514",
    wash: "rgba(156,133,20,0.10)",
    border: "rgba(156,133,20,0.30)",
  },
  low: {
    text: "#4A7C63",
    wash: "rgba(74,124,99,0.10)",
    border: "rgba(74,124,99,0.30)",
  },
};

export function severityTone(severity: Severity) {
  return SEVERITY_TONE[severity];
}
