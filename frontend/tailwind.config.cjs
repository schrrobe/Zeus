/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: '#0f172a',
        foreground: '#f8fafc',
        primary: {
          DEFAULT: '#6366f1',
          light: '#a5b4fc',
          dark: '#4f46e5'
        },
        secondary: '#22d3ee',
        success: '#22c55e',
        warning: '#facc15',
        danger: '#ef4444'
      }
    }
  },
  plugins: []
};
