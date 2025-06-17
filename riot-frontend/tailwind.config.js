/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lolblue: '#0A1C2E',
        lolgold: '#C8AA6E',
        lolblack: '#1E2328',
        lolgray: '#A0A0A0',

        'theme-bg': '#010A13',
        'theme-primary-text': '#F0E6D2',
        'theme-gold-text': '#C89B3C',
        'theme-border': '#C89B3C',
        'theme-button-bg': '#0A323C',
        'theme-button-hover': '#1A505A',
        'theme-input-bg': '#0A1428',
        'theme-input-placeholder': '#A09B8C',
        'theme-input-border': '#2c3a4b',
      },
      fontFamily: {
        sans: ['Beaufort for LOL', 'Segoe UI', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

