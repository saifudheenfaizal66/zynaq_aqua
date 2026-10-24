/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './*.{html,js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Zynaq.Aqua Extracted Brand Green Palette
        brand: {
          green: '#00e599',
          'green-hover': '#1affab',
          'green-glow': 'rgba(0, 229, 153, 0.38)',
          'green-subtle': 'rgba(0, 229, 153, 0.08)',
          'green-border': 'rgba(0, 229, 153, 0.25)',
          'green-surface': 'rgba(0, 229, 153, 0.035)',
        },
        // Primary & Accent Semantic Aliases
        primary: {
          DEFAULT: '#00e599',
          hover: '#1affab',
          muted: '#00b875',
          subtle: 'rgba(0, 229, 153, 0.08)',
          border: 'rgba(0, 229, 153, 0.25)',
          glow: 'rgba(0, 229, 153, 0.38)',
        },
        accent: {
          DEFAULT: '#00e599',
          cyan: '#00e599', // Remapped from legacy cyan to brand green
          purple: '#a78bfa',
          amber: '#fbbf24',
          red: '#f43f5e',
        },
        // Deep Obsidian Backgrounds
        surface: {
          darkest: '#0a0d12',
          dark: '#0e121a',
          DEFAULT: '#111622',
          card: 'rgba(17, 22, 34, 0.75)',
          'card-hover': 'rgba(22, 30, 46, 0.88)',
        },
      },
      boxShadow: {
        'brand-glow': '0 0 28px rgba(0, 229, 153, 0.35)',
        'brand-glow-lg': '0 8px 32px rgba(0, 229, 153, 0.65), 0 0 16px rgba(0, 229, 153, 0.4)',
        'card-hover': '0 16px 48px -8px rgba(0, 229, 153, 0.18)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
