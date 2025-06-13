// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Dynamic theme colors using CSS variables
        primary: {
          DEFAULT: 'var(--primary)',
          50: 'color-mix(in srgb, var(--primary) 10%, white)',
          100: 'color-mix(in srgb, var(--primary) 20%, white)',
          200: 'color-mix(in srgb, var(--primary) 30%, white)',
          300: 'color-mix(in srgb, var(--primary) 40%, white)',
          400: 'color-mix(in srgb, var(--primary) 50%, white)',
          500: 'var(--primary)',
          600: 'color-mix(in srgb, var(--primary) 90%, black)',
          700: 'color-mix(in srgb, var(--primary) 80%, black)',
          800: 'color-mix(in srgb, var(--primary) 70%, black)',
          900: 'color-mix(in srgb, var(--primary) 60%, black)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          50: 'color-mix(in srgb, var(--secondary) 10%, white)',
          100: 'color-mix(in srgb, var(--secondary) 20%, white)',
          200: 'color-mix(in srgb, var(--secondary) 30%, white)',
          300: 'color-mix(in srgb, var(--secondary) 40%, white)',
          400: 'color-mix(in srgb, var(--secondary) 50%, white)',
          500: 'var(--secondary)',
          600: 'color-mix(in srgb, var(--secondary) 90%, black)',
          700: 'color-mix(in srgb, var(--secondary) 80%, black)',
          800: 'color-mix(in srgb, var(--secondary) 70%, black)',
          900: 'color-mix(in srgb, var(--secondary) 60%, black)',
        },
        'theme-bg': 'var(--background)',
        'theme-surface': 'var(--surface)',
        'theme-text': 'var(--text)',
        'theme-text-secondary': 'var(--text-secondary)',
        'theme-border': 'var(--border)',
        'theme-success': 'var(--success)',
        'theme-warning': 'var(--warning)',
        'theme-error': 'var(--error)',
      },
      backgroundColor: {
        theme: 'var(--background)',
        surface: 'var(--surface)',
      },
      textColor: {
        theme: 'var(--text)',
        secondary: 'var(--text-secondary)',
      },
      borderColor: {
        theme: 'var(--border)',
      },
    },
  },
  plugins: [],
}
