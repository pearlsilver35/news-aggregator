/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', 'sans-serif'],
      },
      colors: {
        background: {
          DEFAULT: '#f3f4f6', // This matches the gray-100 color
        }
      }
    },
  },
  plugins: [],
};
