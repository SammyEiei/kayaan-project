// tailwind.config.js
/** @type {import('tailwindcss').Config} */

export default {
  darkMode: 'class', // Enable class-based dark mode
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      textColor: {
        skin: {
          base: 'var(--color-text-base)',
          secondary: 'var(--color-text-alt)',
          muted: 'var(--color-text-muted)',
          silver: 'var(--color-text-silver)',
          bronze: 'var(--color-text-bronze)',
          gold: 'var(--color-text-gold)',
        },
      },
      backgroundColor: {
        skin: {
          fill: 'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          'card-primary': 'var(--color-card-primary)',
          'card-hover': 'var(--color-card-secondary)',
          'button-accent': 'var(--color-button-primary)',
          'button-hover': 'var(--color-button-primary-hover)',
          'button-muted': 'var(--color-button-muted)',
          'button-muted-hover': 'var(--color-button-muted-hover)',
        },
      },
    },
    plugins: [],
  },
}
