import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  // Modifiers that components assemble at runtime (`btn--${variant}`), which the
  // content scanner cannot see. Without this Tailwind drops them from @layer components.
  safelist: [
    "btn--coral",
    "btn--ghost",
    "btn--ink",
    "btn--line",
    "btn__arrow--out",
    "btn__arrow--right",
    "btn__arrow--up",
    "btn__arrow--down",
  ],
  theme: {
    extend: {
      colors: {
        night: "var(--night)",
        "night-2": "var(--night-2)",
        slate: "var(--slate)",
        harbor: "var(--harbor)",
        coral: "var(--coral)",
        "coral-ink": "var(--coral-ink)",
        lamp: "var(--lamp)",
        day: "var(--day)",
        concrete: "var(--concrete)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        mist: "var(--mist)",
        line: "var(--line)",
        "line-night": "var(--line-night)",
      },
      fontFamily: {
        sans: ["var(--f-text)"],
        display: ["var(--f-display)"],
        voice: ["var(--f-voice)"],
      },
      fontSize: {
        mega: ["var(--t-mega)", { lineHeight: "0.86" }],
        xl2: ["var(--t-xl)", { lineHeight: "0.9" }],
        l2: ["var(--t-l)", { lineHeight: "1" }],
        m2: ["var(--t-m)", { lineHeight: "1.3" }],
        body: ["var(--t-body)", { lineHeight: "1.55" }],
        small: ["var(--t-s)", { lineHeight: "1.45" }],
        tiny: ["var(--t-xs)", { lineHeight: "1.4" }],
      },
      maxWidth: {
        wrap: "var(--wrap)",
        measure: "38rem",
      },
      spacing: {
        gutter: "var(--gutter)",
        nav: "var(--nav-h)",
      },
      transitionTimingFunction: {
        gate: "var(--ease-gate)",
        out: "var(--ease-out)",
      },
    },
  },
  plugins: [],
}
export default config
