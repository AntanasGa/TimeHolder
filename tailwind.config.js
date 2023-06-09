/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx,css}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      transitionProperty: {
        'popout': 'opacity, transform, color'
      },
    },
  },
  plugins: [],
}

