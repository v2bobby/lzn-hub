import { Link } from "react-router";

/**
 * The mark is a contract page with one line struck and one line inserted:
 * the whole product in nine pixels of green.
 */
export function LogoMark({
  size = 28,
  tone = "ink",
}: {
  size?: number;
  tone?: "ink" | "paper";
}) {
  const plate = tone === "ink" ? "#0E1620" : "#FFFFFF";
  const rule = tone === "ink" ? "#8A97A6" : "#56626E";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="7" fill={plate} />
      <path
        d="M8 9h16M8 13.5h11M8 22.5h9"
        stroke={rule}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 18h13"
        stroke="#2E8B65"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  tone = "ink",
  size = 28,
  className = "",
}: {
  tone?: "ink" | "paper";
  size?: number;
  className?: string;
}) {
  return (
    <Link
      to="/"
      aria-label="LenzerHub home"
      className={`inline-flex items-center gap-2.5 rounded-sm ${className}`}
    >
      <LogoMark size={size} tone={tone === "ink" ? "ink" : "paper"} />
      <span
        className="text-[1.0625rem] font-semibold leading-none tracking-[-0.01em]"
        style={{ color: tone === "ink" ? "#0E1620" : "#FFFFFF" }}
      >
        LenzerHub
      </span>
    </Link>
  );
}
