import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deepforest: "#041B14",
        pine: "#084734",
        limeglow: "#CEF17B",
        nl: {
          bg: "#041B14",
          surface: "#084734",
          surfaceSoft: "#0B5A42",
          accent: "#CEF17B",
          accentSoft: "#CDEDB3",
          text: "#E6FFF3",
          textMuted: "rgba(230,255,243,0.7)",
        },
        light: {
          bg: "#F4FBF7",
          surface: "#FFFFFF",
          border: "rgba(8,71,52,0.08)",
          text: "#041B14",
          textMuted: "#3a5f54",
        },
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px rgba(4,27,20,0.45)",
        glass: "0 10px 40px rgba(0,0,0,0.4)",
        soft: "0 6px 20px rgba(0,0,0,0.08)",
      },
      backdropBlur: {
        xl: "20px",
      },
      backgroundImage: {
        grid: "radial-gradient(circle at top, rgba(206,241,123,0.12), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.04), transparent)",
      },
    },
  },
  plugins: [],
};

export default config;
