import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2954D9",
          hover: "#2044B5",
          active: "#1A3793",
          light: "#EBF1FF",
          subtle: "#F0F4FE",
        },
        accent: {
          DEFAULT: "#F5A623",
          start: "#F5A623",
          end: "#F7931E",
          hover: "#E08514",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          panel: "#F5F7FB",
          subtle: "#F9FAFB",
          muted: "#F0F2F7",
        },
        border: {
          DEFAULT: "#E4E7EC",
          subtle: "#F2F4F7",
          focus: "#2954D9",
        },
        typography: {
          heading: "#101828",
          body: "#475467",
          muted: "#667085",
          light: "#98A2B3",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        soft: "0 1px 3px 0 rgba(16, 24, 40, 0.05)",
        "soft-md": "0 4px 12px -2px rgba(16, 24, 40, 0.06), 0 2px 6px -2px rgba(16, 24, 40, 0.04)",
        "soft-lg": "0 12px 24px -4px rgba(16, 24, 40, 0.08), 0 4px 12px -4px rgba(16, 24, 40, 0.03)",
        elevation: "0 2px 8px rgba(41, 84, 217, 0.15)",
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #F5A623 0%, #F7931E 100%)",
        "accent-gradient-hover": "linear-gradient(135deg, #F09E18 0%, #E8830E 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
