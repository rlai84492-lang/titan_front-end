/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      colors: {
        titan: {
          50:  '#FFF7F4',
          100: '#FFE8DF',
          200: '#FFCBB8',
          400: '#F28260',
          500: '#E85A2B',
          600: '#C94418',
          700: '#9E3010',
          800: '#721F08',
          900: '#4A1203',
        },
        ink: {
          50:  '#F8F7F6',
          100: '#EFEDEA',
          200: '#DDD9D4',
          300: '#C4BEB6',
          400: '#A49D94',
          500: '#7D7670',
          600: '#5C5650',
          700: '#3E3A35',
          800: '#28241F',
          900: '#151210',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10), 0 12px 32px rgba(0,0,0,0.06)',
        glow: '0 0 0 3px rgba(232,90,43,0.18)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}