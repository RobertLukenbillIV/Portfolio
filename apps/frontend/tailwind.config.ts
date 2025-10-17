// apps/frontend/tailwind.config.ts
import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ACME UI Light Mode Color Palette
        brandPrimary: '#3498db',    // Primary blue
        brandSecondary: '#2c3e50',  // Dark blue-gray for text
        brandSuccess: '#27ae60',    // Green for success states
        brandWarning: '#f39c12',    // Orange for warnings
        brandError: '#e74c3c',      // Red for errors
        brandText: '#2c3e50',       // Primary text color
        brandTextMuted: '#7f8c8d',  // Secondary text color
        brandBackground: '#f5f5f5', // Light gray background
        brandCard: '#ffffff',       // White card backgrounds
        brandBorder: '#ddd',        // Light gray borders
        brandHover: '#f8f9fa',      // Light hover state
      },
    },
  },
  plugins: [typography],
} satisfies Config
