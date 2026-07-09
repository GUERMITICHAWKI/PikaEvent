/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        gold: '#C9A227',        // ⚠️ remplacez par votre vraie valeur si différente
        'gold-dark': '#A6841F',
        dark: '#1a1a1a',
        cream: '#FAF6F0',
      }
    }
  }
}