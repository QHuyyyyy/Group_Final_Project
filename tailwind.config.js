/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  
  ],
  theme: {
    extend: {
      animation: {
        'bubble': 'bubble 7s linear infinite',
      },
      keyframes: {
        bubble: {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '50%': { opacity: '1' },
          '70%': { opacity: '1' },
          '100%': { transform: 'translateY(-80vh)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
  important: true,
}  