/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'onyx': '#121212',
        'accent-red': '#E53935',
        'accent-orange': '#FB8C00',
        'accent-yellow': '#FDD835',
        'dark-gray': '#212121',
      },
      fontFamily: {
        'sans': ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
