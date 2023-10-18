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
      },
      boxShadow: { 
        customMedium: '0 7px 41px 0 rgba(0, 0, 0, 0.27)'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require("daisyui")
  ]
}
