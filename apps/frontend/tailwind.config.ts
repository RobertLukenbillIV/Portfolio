import type { Config } from 'tailwindcss'
export default {
content: ['./index.html','./src/**/*.{ts,tsx}'],
theme: {
extend: {
colors: {
mocha: '#9d7b64',
darktan: '#888659',
fern: '#5d7454',
sage: '#9fae80',
eucalyptus: '#7b9989'
},
fontFamily: {
sans: ['Inter','system-ui','sans-serif']
}
}
},
plugins: []
} satisfies Config