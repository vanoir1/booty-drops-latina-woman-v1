/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: '#E07B54',
        coral: '#D4654A',
        teal: '#1A6B6B',
        gold: '#D4A574',
        cream: '#FDF8F3',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        sans: ['Source Sans 3', 'sans-serif'],
      },
    },
  },
  plugins: [],
}