/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      width: {
        main: '1320px'
      },
      colors:{
        colorBg: "#F1F1F1"
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        'slide-top':{
          '0%':{
            '-webkit-transform': 'translateY(40px)',
            transform: 'translateY(40px)',
          },
          '100%': {
            '-webkit-transform': 'translateY(-50px)',
            transform: 'translateY(-50px)',
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'slide-top' : 'slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
      },
      
    },
  },
  plugins: [require("tailwindcss-animate")],
}