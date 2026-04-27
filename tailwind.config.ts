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
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px rgba(4,27,20,0.45)",
      },
      backgroundImage: {
        grid: "radial-gradient(circle at top, rgba(206,241,123,0.12), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.04), transparent)",
      },
    },
  },
  plugins: [],
};

export default config;
