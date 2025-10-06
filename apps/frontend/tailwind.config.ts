import type { Config } from 'tailwindcss'
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mocha: '#9d7b64',
        darkTan: '#888659',
        fern: '#5d7454',
        sage: '#9fae80',
        eucalyptus: '#7b9989',
        dark: '#0f1a14', // helper for text on light buttons
      }
    }
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config
