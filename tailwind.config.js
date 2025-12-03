/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFB800', // Richer Gold/Yellow
        secondary: '#FF7A00', // Vibrant Orange
        accent: '#111111', // Deep Black
        dark: '#1A1A1A',
        light: '#FFF6E5', // Warm Apricot/Beige Background
        'surface': '#FFFBF2', // Light Cream for cards
        'surface-alt': '#FFF0D4', // Darker cream for inputs
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2.5rem', // Extra rounded for the main card
      }
    },
  },
  plugins: [],
}

