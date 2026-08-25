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
        paper: {
          DEFAULT: "#F1F2EE",
          raised: "#FAFAF7",
          sunk: "#E6E8E2",
          line: "rgba(14,22,32,0.12)",
        },
        graphite: {
          DEFAULT: "#56626E",
          light: "#8A97A6",
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
      fontFamily: {
        display: ['"Archivo"', "system-ui", "sans-serif"],
        sans: ['"Archivo"', "system-ui", "sans-serif"],
        read: ['"Newsreader"', "Georgia", "serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        // Fluid display sizes. Typography is the load-bearing element here.
        "display-xl": ["clamp(3rem, 12vw, 9.5rem)", { lineHeight: "0.86", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(2.5rem, 7.5vw, 5.5rem)", { lineHeight: "0.92", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(2rem, 4.6vw, 3.25rem)", { lineHeight: "0.98", letterSpacing: "-0.025em" }],
        "display-sm": ["clamp(1.5rem, 2.8vw, 2.125rem)", { lineHeight: "1.06", letterSpacing: "-0.02em" }],
        eyebrow: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.18em" }],
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
        "rise-in": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "none" },
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
        "rise-in": "rise-in 0.5s cubic-bezier(0.22,0.61,0.36,1) both",
        sweep: "sweep 1.6s cubic-bezier(0.4,0,0.2,1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
