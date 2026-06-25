import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a2744',
          deep: '#131d33',
          700: '#26354f',
          600: '#3a4d6e',
        },
        gold: {
          DEFAULT: '#c9a55c',
          light: '#dcc088',
          deep: '#a8843f',
          soft: '#e8d5a8',
        },
        sand: {
          50: '#faf7f0',
          100: '#f5efe1',
          200: '#efe6d2',
          300: '#e6d9bf',
        },
        cream: '#faf7f0',
        ink: '#2a2620',
        mist: '#7a7264',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.22em',
      },
      maxWidth: {
        content: '1160px',
      },
      boxShadow: {
        card: '0 2px 20px -8px rgba(26, 39, 68, 0.12)',
        cardHover: '0 16px 40px -12px rgba(26, 39, 68, 0.22)',
        gold: '0 8px 30px -10px rgba(201, 165, 92, 0.4)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fade-in 1s ease forwards',
        'scale-in': 'scale-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
