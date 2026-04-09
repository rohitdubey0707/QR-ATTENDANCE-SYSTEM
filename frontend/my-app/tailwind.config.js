/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beachside: {
          blue: '#3B7097',   // Deep Blue
          sky: '#75BDE0',    // Sky Blue
          green: '#A9D09E',  // Soft Green
          sand: '#F6E2BC',   // Light Sand
        },
        primary: '#355C7D', // Dark Blue
        secondary: '#725A7A', // Deep Purple
        accent1: '#C56C86', // Magenta
        accent2: '#FF7582', // Coral
        neutral: {
          white: '#FFFFFF',
          dark: '#2A2D3',
          gray: '#F5F5F5',
        },
      },
    },
  },
  plugins: [],
}