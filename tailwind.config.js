/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A90E2',  // Example color, adjust to match the site's primary color
        secondary: '#ffffff',
        accent: '#8C30F5',   // Another accent color used in buttons or highlights
        dark: '#1a1a1a',     // Dark background color
      },
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
