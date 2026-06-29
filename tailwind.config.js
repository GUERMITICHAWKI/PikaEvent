/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9973A',
          light:   '#F0C060',
          dark:    '#A67C2E',
        },
        cream: {
          DEFAULT: '#FAF6EF',
          dark:    '#F0E8D8',
        },
        dark: {
          DEFAULT: '#0D0D0D',
          soft:    '#1A1A1A',
        }
      },
      fontFamily: {
        serif:  ['Playfair Display', 'serif'],
        sans:   ['Inter', 'sans-serif'],
        script: ['Dancing Script', 'cursive'],
      },
      borderRadius: {
        'pill': '50px',
      },
      boxShadow: {
        'gold': '0 8px 24px rgba(201,151,58,0.35)',
        'card': '0 8px 32px rgba(0,0,0,0.12)',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.5s ease forwards',
        'slide-left': 'slideLeft 0.6s ease forwards',
        'marquee':    'marquee 25s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}