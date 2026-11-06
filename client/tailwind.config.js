/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0e0e0e',
          charcoal: '#141414',
          dark: '#181818',
          stone: '#262626',
          ash: '#3f3f46',
          muted: '#71717a',
          silver: '#a1a1aa',
          cream: '#f4f0e8',
          linen: '#e9e4da',
          brass: {
            DEFAULT: '#c5a059',
            light: '#dfc282',
            dark: '#9b7b38',
            deep: '#6e5624',
          },
          bronze: '#8c7047'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        display: ['"Cormorant Garamond"', 'Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        'tightest': '-0.04em',
        'wider': '0.15em',
        'widest': '0.25em',
        'super': '0.35em',
        'ultra': '0.45em',
      },
      borderWidth: {
        'hairline': '1px',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

