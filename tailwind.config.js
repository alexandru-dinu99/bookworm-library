/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eef1f8',
          100: '#d5dced',
          200: '#aab8db',
          300: '#7f95ca',
          400: '#5471b8',
          500: '#3356a8',
          600: '#284590',
          700: '#1B2951',
          800: '#152040',
          900: '#0e162d',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
