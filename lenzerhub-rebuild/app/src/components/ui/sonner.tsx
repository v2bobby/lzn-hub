import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Brand-themed toaster. Dropped the next-themes dependency (the app has no
 * theme switcher) and the hsl() token indirection, which produced invalid
 * colours because the shadcn variables hold bare HSL triplets.
 */
const Toaster = (props: ToasterProps) => (
  <Sonner
    theme="light"
    className="toaster group"
    icons={{
      success: <Dot className="text-insert" />,
      info: <Dot className="text-graphite" />,
      warning: <Dot className="text-sev-high" />,
      error: <Dot className="text-strike" />,
      loading: <Dot className="animate-pulse text-graphite-light" />,
    }}
    style={
      {
        "--normal-bg": "#FAFAF7",
        "--normal-text": "#0E1620",
        "--normal-border": "rgba(14,22,32,0.12)",
        "--border-radius": "8px",
      } as React.CSSProperties
    }
    {...props}
  />
);

function Dot({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block size-2 rounded-full bg-current ${className}`}
    />
  );
}

export { Toaster };
