/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#BD0F1F', // Red from Malta flag
          '50': '#fef2f3',
          '100': '#fde6e7',
          '200': '#fbd0d5',
          '300': '#f7aab2',
          '400': '#f27a8a',
          '500': '#e63f5c',
          '600': '#d42a46',
          '700': '#bd0f1f', // Same as DEFAULT
          '800': '#9b0b19', // Darker red for hover states
          '900': '#7f0a17',
          'light': '#CF1126', // Light red from Malta flag
          'dark': '#9B0B19', // Same as 800
        },
        secondary: '#F5F5F5',
        'secondary-light': '#FFFFFF', // White from Malta flag
        'secondary-dark': '#E5E5E5',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-merriweather)', 'serif'],
      },
      typography: theme => ({
        DEFAULT: {
          css: {
            color: '#1f2937', // text-gray-800
            lineHeight: '1.65', // Slightly increased line height for readability
            a: {
              color: '#BD0F1F',
              '&:hover': {
                color: '#9B0B19',
              },
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            h1: {
              fontFamily: 'var(--font-merriweather), serif',
              color: '#111827', // text-gray-900
              fontWeight: '700',
            },
            h2: {
              fontFamily: 'var(--font-merriweather), serif',
              color: '#111827', // text-gray-900
              fontWeight: '700',
            },
            h3: {
              fontFamily: 'var(--font-merriweather), serif',
              color: '#111827', // text-gray-900
              fontWeight: '600',
            },
            h4: {
              fontFamily: 'var(--font-inter), sans-serif',
              color: '#374151', // text-gray-700
              fontWeight: '600',
            },
            p: {
              marginTop: '1em',
              marginBottom: '1em',
            },
            ol: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            ul: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            blockquote: {
              fontStyle: 'normal',
              fontWeight: '500',
              borderLeftColor: '#BD0F1F',
            },
          },
        },
        dark: {
          css: {
            color: '#d1d5db', // text-gray-300
            a: {
              color: '#f27a8a', // primary-400
              '&:hover': {
                color: '#f7aab2', // primary-300
              },
            },
            h1: {
              color: '#f9fafb', // text-gray-50
            },
            h2: {
              color: '#f9fafb', // text-gray-50
            },
            h3: {
              color: '#f3f4f6', // text-gray-100
            },
            h4: {
              color: '#e5e7eb', // text-gray-200
            },
            blockquote: {
              borderLeftColor: '#f27a8a', // primary-400
              color: '#9ca3af', // text-gray-400
            },
            strong: {
              color: '#f3f4f6', // text-gray-100
            },
            code: {
              color: '#e5e7eb', // text-gray-200
            },
            figcaption: {
              color: '#9ca3af', // text-gray-400
            },
            hr: {
              borderColor: '#374151', // text-gray-700
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 