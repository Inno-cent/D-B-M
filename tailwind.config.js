/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        earth: {
          50:  '#f7f5f0',
          100: '#ede8df',
          200: '#d8cfc0',
          300: '#c2b49e',
          400: '#a8957a',
          500: '#8f7a5e',
          600: '#75624a',
          700: '#5c4d3a',
          800: '#42382b',
          900: '#2a231b',
        },
        forest: {
          50:  '#f0f7f0',
          100: '#d9eeda',
          200: '#b3dcb5',
          300: '#83c487',
          400: '#52a857',
          500: '#2d8a33',
          600: '#1e6b23',
          700: '#164f1a',
          800: '#0f3612',
          900: '#081f0a',
        },
        cream: '#faf8f4',
        parchment: '#f2ede4',
        bark: '#8B6914',
        harvest: '#c8860a',
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'float-slow':  'float 9s ease-in-out infinite',
        'marquee':     'marquee 30s linear infinite',
        'fade-up':     'fadeUp 0.8s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}