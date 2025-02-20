import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)"],
        mono: ["var(--font-dm-mono)"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        highlight: "var(--highlight)",
        secondary: "var(--secondary)",
        secondaryBackground: "var(--secondary-background)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
