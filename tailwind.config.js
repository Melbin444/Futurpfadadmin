/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#faf9f6',
        cream: '#f5f0e6',
        champagne: '#f0e6d2',
        peach: '#fdf0e6',
        lavender: '#f6f0fd',
        mint: '#f0fdf6',
        sky: '#f0f6fd',
        navy: {
          light: '#3b4e66',
          DEFAULT: '#0c1c30',
          deep: '#071324',
        },
        gold: {
          light: '#fbbf24',
          DEFAULT: '#d97706',
          dark: '#b45309',
        }
      },
      fontFamily: {
        display: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "ui-serif", "serif"],
      },
      boxShadow: {
        soft: '0 2px 4px rgba(7, 19, 36, 0.02), 0 16px 40px -16px rgba(7, 19, 36, 0.08)',
        card: '0 1px 2px rgba(7, 19, 36, 0.03), 0 12px 30px -12px rgba(7, 19, 36, 0.12)',
        luxe: '0 1px 2px rgba(7, 19, 36, 0.04), 0 8px 20px -8px rgba(7, 19, 36, 0.12), 0 30px 60px -20px rgba(7, 19, 36, 0.18)',
      }
    },
  },
  plugins: [],
}
