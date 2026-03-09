import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          dark: "#09141A",
          middle: "#0D1D23",
          light: "#1F4247",
        },
        accent: {
          cyan: "#62CDCB",
          blue: "#4A90E2",
          gold: "#D5BE88",
        },
        surface: {
          card: "#0E191F",
          input: "#162329",
        },
        border: {
          card: "#FFFFFF22",
          input: "#FFFFFF33",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#FFFFFFAA",
          tertiary: "#FFFFFF66",
        },
      },
      backgroundImage: {
        "app-radial": "radial-gradient(circle at center, #1F4247 0%, #0D1D23 50%, #09141A 100%)",
        "gradient-primary": "linear-gradient(to right, #62CDCB, #4A90E2)",
      },
      boxShadow: {
        card: "0 4px 6px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;