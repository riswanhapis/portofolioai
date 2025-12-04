/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#00ff88', // Neon Green
        secondary: '#00f0ff', // Electric Blue
        dark: '#0a0a0a',
        'dark-lighter': '#1a1a1a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
