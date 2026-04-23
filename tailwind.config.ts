import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ditto: {
          light: '#fdf2f8', // pink-50
          DEFAULT: '#e11d48', // rose-600
          dark: '#881337', // rose-900
          accent: '#be123c', // rose-700
        }
      },
    },
  },
  plugins: [],
}
export default config
