import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kiwi: {
          50: "#f5fbe9",
          100: "#e8f6cf",
          200: "#d1eea4",
          300: "#b2e06e",
          400: "#92ce40",
          500: "#73b422",
          600: "#589017",
          700: "#446e16",
          800: "#385817",
          900: "#304b18",
          950: "#172907",
        },
        bark: {
          50: "#fbf7f3",
          100: "#f5ece2",
          200: "#ead5c1",
          300: "#dcb899",
          400: "#cd956d",
          500: "#c0794d",
          600: "#b3633f",
          700: "#954e35",
          800: "#794130",
          900: "#633729",
          950: "#351b14",
        },
        rvscet: {
          blue: "#003399",
          gold: "#F2C94C",
        },
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-5px)" },
        },
        keyTurn: {
          "0%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(90deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "key-turn": "keyTurn 1.2s ease-in-out",
        "pulse-soft": "pulseSoft 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
