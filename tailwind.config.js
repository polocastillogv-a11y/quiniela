/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cesped: '#1a4731',
        pasto: '#349959',
        crema: '#f3ecd8',
        ocre: '#c99b41',
        tinto: '#b54a3b',
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', 'sans-serif'],
        sans: ['Archivo', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
