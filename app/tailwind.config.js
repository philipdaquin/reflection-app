/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: { 
        'primary' : ['Inter']
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require("daisyui")
  ]
}
