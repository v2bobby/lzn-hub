import { SEVERITY_LABEL, type Severity } from "@contracts/clause-library";
import { severityTone } from "@/lib/severity";

export function SeverityBadge({
  severity,
  onInk = false,
}: {
  severity: Severity;
  onInk?: boolean;
}) {
  const tone = severityTone(severity);
  return (
    <span
      className="eyebrow inline-flex shrink-0 items-center gap-1.5 rounded-sm border px-2 py-1"
      style={{
        color: onInk ? "#F1F2EE" : tone.text,
        backgroundColor: onInk ? "rgba(255,255,255,0.06)" : tone.wash,
        borderColor: tone.border,
      }}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: tone.text }}
      />
      {SEVERITY_LABEL[severity]}
    </span>
  );
}
