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
        veyora: {
          bg: '#FAF7F2',
          surface: '#FFFFFF',
          card: '#F5F0E6',
          border: '#E8E1D5',
          dark: '#1C1917',
          darker: '#11100F',
          muted: '#78716C',
          rose: '#F9ECE6',
          gold: '#B8860B',
          accent: '#8C6D46',
          subtle: '#F3EFE6'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(28, 25, 23, 0.05)',
        'elevated': '0 10px 30px -5px rgba(28, 25, 23, 0.1)',
      }
    },
  },
  plugins: [],
}
