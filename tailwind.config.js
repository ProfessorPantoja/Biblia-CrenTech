/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './index.tsx',
    './App.tsx',
    './components/**/*.{ts,tsx}',
    './contexts/**/*.{ts,tsx}',
    './router/**/*.{ts,tsx}',
    './config/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        sans: ['Inter', 'sans-serif'],
        hand: ['Patrick Hand', 'cursive'],
        gothic: ['Cinzel', 'serif'], // Medieval font
      },
      colors: {
        bible: {
          dark: '#0f172a',
          paper: '#f8fafc',
          gold: '#d4af37',
          accent: '#3b82f6',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'radar': 'radar 2s linear infinite',
        'fire-pulse': 'firePulse 0.1s ease-in-out infinite alternate',
        'breathing-glow': 'breathingGlow 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #d4af37, 0 0 10px #d4af37' },
          '100%': { boxShadow: '0 0 20px #d4af37, 0 0 30px #ffbb00' },
        },
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        firePulse: {
          '0%': { transform: 'scale(1)', filter: 'brightness(100%)' },
          '100%': { transform: 'scale(1.02)', filter: 'brightness(120%)' },
        },
        breathingGlow: {
          '0%': { boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)', transform: 'scale(1)' },
          '50%': { boxShadow: '0 0 25px rgba(59, 130, 246, 0.8), 0 0 50px rgba(59, 130, 246, 0.4)', transform: 'scale(1.02)' },
          '100%': { boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
