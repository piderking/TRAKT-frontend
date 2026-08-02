/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        console: {
          bg: '#0A0C10',
          surface: '#12161F',
          border: '#1F2937',
          card: '#161B26',
          accent: '#E50914',
          primary: '#3B82F6',
          emerald: '#10B981',
          amber: '#F59E0B',
          purple: '#8B5CF6',
          textMuted: '#9CA3AF'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
