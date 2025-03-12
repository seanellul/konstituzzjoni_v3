/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#BD0F1F', // Red from Malta flag
        'primary-light': '#CF1126', // Light red from Malta flag
        'primary-dark': '#9B0B19', // Darker red for hover states
        secondary: '#F5F5F5',
        'secondary-light': '#FFFFFF', // White from Malta flag
        'secondary-dark': '#E5E5E5',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-merriweather)', 'serif'],
      },
    },
  },
  plugins: [],
} 