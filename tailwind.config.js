/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}"
  ],
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
  gold: {
    DEFAULT: '#3B82C4',
    light:   '#5FA3DE',
    dark:    '#2A6BA8',
  },
  accent: {
    DEFAULT: '#C9973A',
    light:   '#F0C060',
  },
  cream: {
    DEFAULT: '#F4F7FA',
    dark:    '#E5EBF1',
  },
  dark: {
    DEFAULT: '#16284A',   // gardé pour navbar/footer seulement
    soft:    '#1F3A63',
    deep:    '#0F2A47',
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
        'gold': '0 8px 24px rgba(59,130,196,0.35)',
        'card': '0 8px 32px rgba(15,42,71,0.10)',
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