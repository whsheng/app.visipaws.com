import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // New Design System Colors
        primary: {
          DEFAULT: "#26A69A",
          50: "#E8F5F3",
          100: "#CCE8E4",
          200: "#99D1C9",
          300: "#66BAAD",
          400: "#33A392",
          500: "#26A69A",
          600: "#1D8077",
          700: "#145954",
          800: "#0B3330",
          900: "#020C0B",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#4A90E2",
          50: "#EEF5FC",
          100: "#DDEAF9",
          200: "#BBD5F3",
          300: "#99BFED",
          400: "#77A9E7",
          500: "#4A90E2",
          600: "#3A73B5",
          700: "#2A5688",
          800: "#1A385B",
          900: "#0A1B2E",
          foreground: "#FFFFFF",
        },
        tertiary: {
          DEFAULT: "#FF7043",
          50: "#FFF2EE",
          100: "#FFE5DD",
          200: "#FFCBBB",
          300: "#FFB199",
          400: "#FF9777",
          500: "#FF7043",
          600: "#CC5A36",
          700: "#994429",
          800: "#662D1B",
          900: "#33170E",
          foreground: "#FFFFFF",
        },
        neutral: {
          DEFAULT: "#727B77",
          50: "#F7F8F8",
          100: "#EFF0F0",
          200: "#DEE0DF",
          300: "#CDCBC9",
          400: "#BCBDBA",
          500: "#ABAFAC",
          600: "#9AA09D",
          700: "#727B77",
          800: "#4A5551",
          900: "#222B28",
        },
        
        // Legacy colors (for compatibility)
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px",
        xl: "24px",
        "2xl": "32px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
