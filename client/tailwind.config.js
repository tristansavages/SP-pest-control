/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          50: '#fff3ed',
          100: '#ffe1d2',
          200: '#ffc0a4',
          300: '#ff986f',
          400: '#fb7f4f',
          500: '#EF6E37',
          600: '#dd5624',
          700: '#b8401c',
          800: '#94361e',
          900: '#762f1d',
          950: '#40160b',
        },
        navy: {
          950: '#060d14',
          900: '#0d1b2a',
          800: '#1b2d3e',
          700: '#243447',
          600: '#2d4a63',
          500: '#3d6480',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
