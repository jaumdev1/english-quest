/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'slideInUp': 'slideInUp 0.6s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
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
            boxShadow: '0 0 5px rgba(16, 185, 129, 0.5)'
          },
          '50%': {
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.8), 0 0 30px rgba(16, 185, 129, 0.6)'
          },
        },
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'exo': ['Exo 2', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 