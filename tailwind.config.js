/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0E4637',
          50: '#ECF7F2',
          100: '#D3EFE2',
          200: '#A6DEC6',
          300: '#6FC5A4',
          400: '#3DA37D',
          500: '#1E805F',
          600: '#0E5F48',
          700: '#0E4637',
          800: '#0A342A',
          900: '#08251F',
          950: '#051711',
        },
        accent: {
          DEFAULT: '#FF6B2C',
          50: '#FFF4ED',
          100: '#FFE5D5',
          200: '#FFC8A8',
          300: '#FFA370',
          400: '#FF8A4D',
          500: '#FF6B2C',
          600: '#F04E10',
          700: '#C93C07',
          800: '#A1310B',
          900: '#822C10',
        },
        ink: {
          DEFAULT: '#101828',
          50: '#F5F6F7',
          100: '#EEF0F2',
          500: '#3C4A5A',
          900: '#101828',
        },
        paper: '#FAFAF8',
        volt: '#D9F044',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.1)',
        lift: '0 8px 24px rgba(16,24,40,.12), 0 2px 6px rgba(16,24,40,.08)',
        glow: '0 0 0 1px rgba(255,107,44,.18), 0 8px 32px rgba(255,107,44,.25)',
        panel: '0 12px 40px rgba(5,23,17,.14)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-600px 0' },
          '100%': { backgroundPosition: '600px 0' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        float: 'float 5s ease-in-out infinite',
        fadeUp: 'fadeUp .5s ease-out both',
        shimmer: 'shimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
}