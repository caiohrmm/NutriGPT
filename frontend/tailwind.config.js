/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(214.3 31.8% 91.4%)',
        input: 'hsl(214.3 31.8% 91.4%)',
        ring: 'hsl(142.1 70.6% 45.3%)',
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222.2 84% 4.9%)',
        primary: {
          DEFAULT: 'hsl(142.1 70.6% 45.3%)',
          foreground: 'hsl(355.7 100% 97.3%)',
        },
        secondary: {
          DEFAULT: 'hsl(142.1 76.2% 96.3%)',
          foreground: 'hsl(142.1 76.2% 15.3%)',
        },
        destructive: {
          DEFAULT: 'hsl(0 84.2% 60.2%)',
          foreground: 'hsl(210 40% 98%)',
        },
        muted: {
          DEFAULT: 'hsl(210 40% 98%)',
          foreground: 'hsl(215.4 16.3% 46.9%)',
        },
        accent: {
          DEFAULT: 'hsl(142.1 76.2% 96.3%)',
          foreground: 'hsl(142.1 76.2% 15.3%)',
        },
        popover: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(222.2 84% 4.9%)',
        },
        card: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(222.2 84% 4.9%)',
        },
        // NutriGPT custom colors
        nutrigpt: {
          50: 'hsl(142.1 76.2% 96.3%)',
          100: 'hsl(142.1 76.2% 91.3%)',
          200: 'hsl(142.1 76.2% 81.3%)',
          500: 'hsl(142.1 70.6% 45.3%)',
          600: 'hsl(142.1 70.6% 35.3%)',
          700: 'hsl(142.1 70.6% 25.3%)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}