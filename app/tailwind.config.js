/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── LenzerHub brand ───────────────────────────────────────────
        // Ink: the dark field. Paper: the reading surface.
        // Insert green is the only decorative accent, borrowed from the
        // "accepted redline" colour because that is what the product sells.
        ink: {
          DEFAULT: "#0E1620",
          deep: "#080D14",
          2: "#17222E",
          3: "#22303E",
          line: "rgba(255,255,255,0.10)",
        },
        // Neutral, slightly cool off-white for the page; pure white for
        // panels sitting on it. Deliberately no warm cream or beige.
        paper: {
          DEFAULT: "#F5F6F7",
          raised: "#FFFFFF",
          sunk: "#ECEEF1",
          line: "rgba(14,22,32,0.10)",
        },
        // Both greys pass WCAG AA for body text on the off-white page.
        graphite: {
          DEFAULT: "#4F5B67",
          light: "#6B7684",
        },
        insert: {
          DEFAULT: "#2E8B65",
          deep: "#1C6349",
          wash: "#E4EFE9",
        },
        strike: {
          DEFAULT: "#B3311C",
          wash: "#F6E6E2",
        },
        sev: {
          critical: "#B3311C",
          high: "#C0701B",
          medium: "#9C8514",
          low: "#4A7C63",
        },

        // ── shadcn tokens (kept so the ui/ primitives still work) ──────
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      // Fonts are self-hosted through @fontsource (imported in main.tsx), so
      // no request leaves for a third-party font CDN.
      fontFamily: {
        display: ['"Archivo Variable"', "Archivo", "system-ui", "sans-serif"],
        sans: ['"Archivo Variable"', "Archivo", "system-ui", "sans-serif"],
        // Reading text uses the UI sans. Kept as its own token so it can be
        // changed in one place.
        read: ['"Archivo Variable"', "Archivo", "system-ui", "sans-serif"],
        // Serif is reserved for contract language itself, so quoted clause
        // text reads as a document rather than as interface copy.
        contract: ['"Newsreader Variable"', "Newsreader", "Georgia", "serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      // Calm, moderate heading sizes. Sentence case, weight 600, normal width.
      fontSize: {
        "display-xl": ["clamp(2.25rem, 4.6vw, 3.5rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(1.875rem, 3.6vw, 2.75rem)", { lineHeight: "1.12", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.625rem, 2.8vw, 2.125rem)", { lineHeight: "1.18", letterSpacing: "-0.01em" }],
        "display-sm": ["clamp(1.25rem, 1.9vw, 1.5rem)", { lineHeight: "1.25", letterSpacing: "-0.005em" }],
      },
      borderRadius: {
        // Balanced radii, 4-10px. No pill-shaped everything.
        xl: "10px",
        lg: "8px",
        md: "6px",
        sm: "4px",
        xs: "3px",
      },
      maxWidth: {
        shell: "88rem",
        read: "34rem",
      },
      spacing: {
        rail: "22rem",
      },
      transitionTimingFunction: {
        precise: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "sweep": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(220%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        sweep: "sweep 1.6s cubic-bezier(0.4,0,0.2,1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
