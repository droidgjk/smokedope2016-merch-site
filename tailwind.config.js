/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Change the accent in ONE place: src/index.css (--accent). Tailwind reads it from there.
        ink: '#0b0b0a',
        coal: '#141413',
        ash: '#1d1d1b',
        smoke: '#8a8a82',
        bone: '#e9e7df',
        acid: 'rgb(var(--accent) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', 'Impact', '"Arial Narrow"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: { DEFAULT: '0', sm: '0', md: '0', lg: '0', xl: '0', full: '9999px' },
    },
  },
  plugins: [],
}
