// apps/frontend/tailwind.config.ts
import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brandNavy: '#0d1117',  // Navbar color - dark GitHub-style
        brandSteel: '#708993',
        brandMint: '#A1C2BD', 
        brandFoam: '#798a98',
        brandGreen: '#212830', // Button color - dark gray
        brandText: '#f8f9fa',  // Light text for dark background
        brandTextMuted: '#e9ecef', // Slightly muted light text
        brandBackground: '#010409', // Main background color - very dark
      },
    },
  },
  plugins: [typography],
} satisfies Config
