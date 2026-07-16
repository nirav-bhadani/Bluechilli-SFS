import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    // Type scale with a hard 16px floor - nothing renders below 1rem.
    fontSize: {
      xs: ["1rem", { lineHeight: "1.5rem" }], // 16px (floor)
      sm: ["1rem", { lineHeight: "1.5rem" }], // 16px (floor)
      base: ["1rem", { lineHeight: "1.65" }], // 16px
      lg: ["1.125rem", { lineHeight: "1.6" }], // 18px
      xl: ["1.25rem", { lineHeight: "1.5" }], // 20px
      "2xl": ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }], // 24px
      "3xl": ["1.875rem", { lineHeight: "1.18", letterSpacing: "-0.015em" }], // 30px
      "4xl": ["2.375rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }], // 38px
      "5xl": ["3rem", { lineHeight: "1.04", letterSpacing: "-0.022em" }], // 48px
      "6xl": ["3.75rem", { lineHeight: "1.01", letterSpacing: "-0.025em" }], // 60px
      "7xl": ["4.5rem", { lineHeight: "0.98", letterSpacing: "-0.03em" }], // 72px
    },
    extend: {
      colors: {
        primary: "rgb(var(--primary-rgb) / <alpha-value>)",
        secondary: "rgb(var(--secondary-rgb) / <alpha-value>)",
        body: "rgb(var(--text-rgb) / <alpha-value>)",
        "bg-grey": "rgb(var(--bg-grey-rgb) / <alpha-value>)",
        ink: "rgb(var(--secondary-rgb) / <alpha-value>)",
        // SFS Figma design tokens (Section 2.0) — the homepage rebuild palette.
        sfs: {
          red: "#e50019",
          "red-deep": "#b70014",
          "red-80": "rgba(229,0,25,0.8)",
          "red-60": "rgba(229,0,25,0.6)",
          panel: "#f0f0f0",
          num: "#e8e8e8",
          border: "#e4e4e4",
          black: "#000000",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1234px",
        wide: "1280px",
        prose: "68ch",
      },
      borderRadius: {
        lg: "0.625rem",
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        // Figma radii tokens (Section 2.0): panels 10, cards/buttons 8, steps 4.
        "sfs-panel": "10px",
        "sfs-card": "8px",
        "sfs-step": "4px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
        card: "0 4px 14px -4px rgba(16,24,40,0.08), 0 2px 6px -2px rgba(16,24,40,0.05)",
        lift: "0 22px 48px -16px rgba(16,24,40,0.20), 0 8px 16px -8px rgba(16,24,40,0.10)",
        focus: "0 0 0 4px rgba(229,0,25,0.14)",
        // SFS Figma shadows (Section 2.0).
        "sfs-glow": "0px 20px 50px rgba(229,0,25,0.3)",
        "sfs-red-soft": "0px 20px 50px rgba(229,0,25,0.15)",
        "sfs-neutral": "0px 20px 50px rgba(0,0,0,0.15)",
        "sfs-chat": "0px 10px 20px rgba(229,0,25,0.15)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.98)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        blink: {
          "0%, 100%": { opacity: "1", transform: "translateY(0)" },
          "50%": { opacity: "0.25", transform: "translateY(-2px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.4s ease-out both",
        "scale-in": "scale-in 0.3s cubic-bezier(0.22,1,0.36,1) both",
        blink: "blink 1.2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
