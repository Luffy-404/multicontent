import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05070d",
          900: "#0a0f1c",
          850: "#0f172a",
        },
      },
      boxShadow: {
        glow: "0 0 80px rgba(56, 189, 248, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
