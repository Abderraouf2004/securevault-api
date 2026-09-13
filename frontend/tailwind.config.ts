import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0F1A",
        paper: "#F5F6F8",
        surface: "#FFFFFF",
        line: "#E3E5EA",
        muted: "#6B7280",
        vault: {
          50: "#EEF0FE",
          100: "#DCE0FD",
          400: "#6E6AF6",
          500: "#4B3FF2",
          600: "#3B2FDB",
          700: "#2E24AD",
        },
        cipher: "#16A672",
        signal: "#F5A524",
        danger: "#E5484D",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,15,26,0.04), 0 1px 1px rgba(11,15,26,0.03)",
      },
    },
  },
  plugins: [],
} satisfies Config;
