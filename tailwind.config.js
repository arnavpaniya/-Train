/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#090E1A',
        primary: '#00E5CC',
        warning: '#F5A623',
        alert: '#FF3B5C',
        panel: 'rgba(16, 23, 41, 0.6)',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'scanline': 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'drift-alert': 'drift-alert 2s ease-in-out infinite',
      },
      keyframes: {
        'drift-alert': {
          '0%, 100%': { borderColor: 'rgba(255, 59, 92, 0.2)', boxShadow: '0 0 0px rgba(255, 59, 92, 0)' },
          '50%': { borderColor: 'rgba(255, 59, 92, 1)', boxShadow: '0 0 20px rgba(255, 59, 92, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}
