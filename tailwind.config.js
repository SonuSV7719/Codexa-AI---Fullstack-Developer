/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": '#111111',
        "bg-secondary": "#252525",
        "btn-primary": "#A7F205",
        "btn-secondary": "#698C1C",
        "btn-ternary": '#5503A6',
        'bg-ternary': '#242424',
        'font-primary': '#ffffff'
      },
      screens: {
        'tablet': '640px',
        // => @media (min-width: 640px) { ... }
  
        'laptop': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'desktop': '1280px',
        // => @media (min-width: 1280px) { ... }
      },
    },
  },
  plugins: [],
}