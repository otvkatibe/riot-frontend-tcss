/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lolblue: "#0A1428",
        lolgold: "#C89B3C",
        lolgray: "#A09B8C",
        lolblack: "#010A13",
      },
    },
  },
  plugins: [],
}

