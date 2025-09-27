import { join } from 'path'

export default {
  content: [
    join(__dirname, 'components/**/*.{vue,js,ts}'),
    join(__dirname, 'layouts/**/*.vue'),
    join(__dirname, 'pages/**/*.vue'),
    join(__dirname, 'composables/**/*.{js,ts}'),
    join(__dirname, 'plugins/**/*.{js,ts}'),
    join(__dirname, 'app.vue')
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
