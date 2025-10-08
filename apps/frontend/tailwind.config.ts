// apps/frontend/tailwind.config.ts
import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brandNavy: '#19183B',
        brandSteel: '#708993',
        brandMint: '#A1C2BD',
        brandFoam: '#798a98',
        brandGreen: '#4a7937', // Button color - forest green
        brandText: '#f8f9fa',  // Light text for dark background
        brandTextMuted: '#e9ecef', // Slightly muted light text
      },
    },
  },
  plugins: [typography],
} satisfies Config
