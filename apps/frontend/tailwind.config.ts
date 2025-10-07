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
        brandFoam: '#E7F2EF',
      },
    },
  },
  plugins: [typography],
} satisfies Config
