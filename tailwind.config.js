/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: { extend: { fontFamily: { sans: ['Poppins', 'sans-serif'] } } },
  },
  plugins: [],
};
