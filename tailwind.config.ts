import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f7f7f2",
          100: "#e7e5da",
          200: "#c8c2ae",
          500: "#4d4a40",
          700: "#25231e",
          900: "#11100d"
        },
        clay: "#9e5d47",
        moss: "#5e7156",
        ocean: "#205b73",
        citrus: "#d7b548",
        blush: "#d9908c",
        primary: {
          DEFAULT: "#11100d",
          foreground: "#f7f7f2"
        },
        secondary: {
          DEFAULT: "#e7e5da",
          foreground: "#11100d"
        },
        neutral: {
          DEFAULT: "#c8c2ae",
          foreground: "#25231e"
        },
        success: {
          DEFAULT: "#5e7156",
          foreground: "#f7f7f2"
        },
        error: {
          DEFAULT: "#b91c1c",
          foreground: "#fef2f2"
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f7f7f2",
          dark: "#25231e"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "Space Grotesk", "system-ui", "sans-serif"]
      },
      fontSize: {
        hero: ["clamp(2.8rem, 8vw, 6rem)", { lineHeight: "0.95", letterSpacing: "-0.03em", fontWeight: "600" }],
        h1: ["clamp(2.25rem, 6vw, 4rem)", { lineHeight: "0.98", letterSpacing: "-0.025em", fontWeight: "600" }],
        h2: ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "600" }],
        h3: ["1.5rem", { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        body: ["1rem", { lineHeight: "1.7" }],
        label: ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.06em", fontWeight: "600" }],
        caption: ["0.875rem", { lineHeight: "1.4" }]
      },
      boxShadow: {
        soft: "0 18px 60px rgba(17, 16, 13, 0.10)",
        lift: "0 12px 30px rgba(17, 16, 13, 0.16)",
        float: "0 28px 80px rgba(17, 16, 13, 0.2)"
      },
      borderRadius: {
        sm: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.25rem"
      },
      animation: {
        "shimmer": "shimmer 1.8s infinite linear",
        "slide-up": "slide-up 0.28s ease-out",
        "float-y": "float-y 6s ease-in-out infinite"
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" }
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
