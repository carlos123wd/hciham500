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
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        },
        dark: {
          background: '#1a1a1a',
          card: '#2a2a2a',
          text: '#f5f5f5',
          border: '#3a3a3a',
        }
      }
    },
  },
  plugins: [],
}
