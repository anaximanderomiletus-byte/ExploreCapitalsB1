/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#77B6EA', // Iceberg Blue
        secondary: '#C7D3DD', // Iceberg Blue-Grey
        accent: '#D6C9C9', // Iceberg Rose
        surface: '#E8EEF2', // Iceberg Background
        'surface-dark': '#C7D3DD',
        text: '#37393A', // Iceberg Dark / Slate
        paper: '#FFFFFF',
      },
      boxShadow: {
        'premium': '0 4px 6px -1px rgba(55, 57, 58, 0.05), 0 2px 4px -1px rgba(55, 57, 58, 0.03)',
        'premium-hover': '0 10px 15px -3px rgba(55, 57, 58, 0.08), 0 4px 6px -2px rgba(55, 57, 58, 0.04)',
      },
      transitionTimingFunction: {
        'premium-ease': 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
      },
      animation: {
        'color-pulse': 'color-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wipe-screen': 'wipe-screen 1s cubic-bezier(0.65, 0, 0.35, 1) forwards',
      },
      keyframes: {
        'color-pulse': {
          '0%, 100%': { color: '#77B6EA' },
          '50%': { color: '#bfdbfe' },
        },
        'wipe-screen': {
          '0%': { transform: 'translateX(100%)' },
          '35%': { transform: 'translateX(0)' },
          '65%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      }
    },
  },
  plugins: [],
}