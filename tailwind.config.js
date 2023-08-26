const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        background2: "hsl(var(--background-2))",
        tableNodata: "hsl(var(--table-nodata))",
        active: "var(--active-cl)",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
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
        long: {
          DEFAULT: "hsl(var(--long))",
          foreground: "hsl(var(--long-foreground))",
        },
        short: {
          DEFAULT: "hsl(var(--short))",
          foreground: "hsl(var(--short-foreground))",
        },
        borderRadius: {
          lg: `var(--radius)`,
          md: `calc(var(--radius) - 2px)`,
          sm: "calc(var(--radius) - 4px)",
        },
        fontFamily: {
          sans: ["var(--font-sans)", ...fontFamily.sans],
        },
        keyframes: {
          "accordion-down": {
            from: { height: 0 },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: 0 },
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
        },
      },
      backgroundImage: {
        shine: "linear-gradient(120deg, rgba(255,255,255, 0) 30%, rgba(255,255,255, .8), rgba(255,255,255, 0) 70%)",
      },
      gridTemplateRows: {
        10: "repeat(10, minmax(0, 1fr))",
      },
      gridRow: {
        "span-7": "span 7 / span 7",
        "span-10": "span 10 / span 10",
      },
      keyframes: {
        swing: {
          "0%,100%": { transform: "rotate(15deg)" },
          "50%": { transform: "rotate(-15deg)" },
        },
        ripple: {
          to: {
            transform: "scale(4)",
            opacity: 0,
          },
        },
      },
      animation: {
        swing: "swing 1s infinite",
        ripple: "ripple 1000ms linear infinite",
      },
    },
    plugins: [require("tailwindcss-animate")],
  },
}
