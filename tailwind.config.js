/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#003366",
      },
    },
   
  },
  plugins: [],
  variants: {
    extend: {
      backgroundColor: ['hover', 'group-hover', 'supports-hover'],
    },
  },
}