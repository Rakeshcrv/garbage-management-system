/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10b981', // green-500
        secondary: '#059669', // green-600
        dark: '#111827', // gray-900
        darker: '#0f172a', // slate-900
      },
    },
  },
  plugins: [],
}