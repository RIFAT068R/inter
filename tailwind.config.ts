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
        ink: "#020617",
        navy: "#081226",
        electric: "#3b82f6",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px rgba(2,6,23,0.45)",
      },
      backgroundImage: {
        grid: "radial-gradient(circle at top, rgba(59,130,246,0.18), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.04), transparent)",
      },
    },
  },
  plugins: [],
};

export default config;
