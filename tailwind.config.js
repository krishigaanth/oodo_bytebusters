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
        dark: {
          950: '#07080b',
          900: '#0c0e14',
          850: '#11131a',
          800: '#161922',
          750: '#1d212d',
          700: '#262a39',
          600: '#353b4f',
          500: '#4c536e',
        },
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        }
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(124, 58, 237, 0.35)',
        'glow-sm': '0 0 15px -3px rgba(124, 58, 237, 0.25)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
