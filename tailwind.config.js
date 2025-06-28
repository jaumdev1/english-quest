/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#0A0A0B', // Deepest black for backgrounds
          900: '#121214',
          800: '#17171A',
          700: '#1C1C20',
          600: '#222226',
          500: '#2A2A30',
          400: '#373740',
          300: '#434350',
          200: '#505060',
          100: '#606070',
        },
        neon: {
          500: '#AAFF00', // Bright neon green
          400: '#BBFF33',
          300: '#CCFF66',
          200: '#DDFF99',
          100: '#EEFFCC',
        },
        surface: {
          dark: '#151518', // Card dark background
          light: '#FFFFFF', // Card light background
        },
        divider: {
          dark: 'rgba(255,255,255,0.1)',
          light: 'rgba(0,0,0,0.1)',
        }
      },
      fontFamily: {
        'display': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'ui': ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'slideInUp': 'slideInUp 0.6s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideInUp: {
          'from': { 
            transform: 'translateY(30px)',
            opacity: '0'
          },
          'to': { 
            transform: 'translateY(0)',
            opacity: '1'
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(170, 255, 0, 0.5)'
          },
          '50%': {
            boxShadow: '0 0 20px rgba(170, 255, 0, 0.8), 0 0 30px rgba(170, 255, 0, 0.6)'
          },
        },
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
} 