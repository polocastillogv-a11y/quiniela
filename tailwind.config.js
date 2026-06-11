/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cesped: '#14442B',
        pasto: '#1E6B43',
        crema: '#EFE6CC',
        'crema-card': '#FBF6E6',
        'crema-hover': '#FFFDF4',
        'crema-text': '#F3EAD0',
        ocre: '#D9A441',
        plata: '#C9C4B2',
        bronce: '#C0845A',
        tinta: '#16271A',
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
