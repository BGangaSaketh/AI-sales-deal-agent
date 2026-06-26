/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
          border: "var(--card-border)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        ai: {
          DEFAULT: "var(--ai)",
          foreground: "var(--ai-foreground)",
          glow: "var(--ai-glow)",
        },
        gold: {
          DEFAULT: "var(--gold)",
          foreground: "var(--gold-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        destructive: {
          DEFAULT: "#B75D4B",
          foreground: "#ffffff",
        },
        emerald: {
          50: "#f4f9f6",
          100: "#e5efe9",
          200: "#cedfd3",
          300: "#a7c3b2",
          400: "#7fa38c",
          500: "#3F7D58",
          600: "#306244",
          700: "#274f38",
          800: "#20402e",
          900: "#1b3527",
          950: "#0e1d15",
        },
        red: {
          50: "#fdf6f5",
          100: "#fbebe7",
          200: "#f6d8d2",
          300: "#edb7ab",
          400: "#e08f7e",
          500: "#B75D4B",
          600: "#9c4737",
          700: "#82392c",
          800: "#6c2f25",
          900: "#5a2720",
          950: "#32110c",
        },
        amber: {
          50: "#fcfaf4",
          100: "#faf4e4",
          200: "#f3e5c2",
          300: "#ebd095",
          400: "#e0b666",
          500: "#B08D57",
          600: "#947244",
          700: "#7a5c37",
          800: "#654a2e",
          900: "#533d26",
          950: "#2e2012",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-plus-jakarta)", "sans-serif"],
      },
      boxShadow: {
        premium: "0 10px 30px -10px rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.02)",
        "premium-dark": "0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 1px 1px rgba(255, 255, 255, 0.02)",
        glow: "0 0 20px 2px rgba(59, 130, 246, 0.15)",
        "ai-glow": "0 0 25px 3px rgba(124, 58, 237, 0.25)",
      },
    },
  },
  plugins: [],
}
