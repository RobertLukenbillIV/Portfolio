import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import pagesRoutes from './routes/pages.routes'
import settingsRoutes from './routes/settings.routes'
import postsRoutes from './routes/posts.routes'
import { attachUser } from './middleware/auth'
import 'dotenv/config'

const app = express()
const isProd = process.env.NODE_ENV === 'production'

app.set('trust proxy', 1) // required for secure cookies on Render
app.use(helmet())
app.use(cookieParser())
const csv = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || ''
const allowlist = csv.split(',').map(s => s.trim()).filter(Boolean)

// Add default development origins if no environment variable is set
const defaultOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://portfolio-frontend-eight-sooty.vercel.app'
]

const corsOptions: cors.CorsOptions = {
  origin(origin, cb) {
    // allow server-to-server/no-origin (curl/health checks)
    if (!origin) return cb(null, true)
    
    try {
      const host = new URL(origin).hostname
      const allowed = 
        allowlist.includes(origin) ||
        defaultOrigins.includes(origin) ||
        host.endsWith('.vercel.app') ||
        (host === 'localhost') ||
        (!isProd && (host === '127.0.0.1' || host.startsWith('192.168.')))
      
      console.log(`CORS check: ${origin} -> ${allowed ? 'ALLOWED' : 'BLOCKED'}`)
      
      return allowed ? cb(null, true) : cb(new Error(`CORS blocked: ${origin}`))
    } catch (err) {
      console.error(`CORS error for origin ${origin}:`, err)
      return cb(new Error(`Bad Origin: ${origin}`))
    }
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}
app.use(cors(corsOptions))
app.use(express.json())

// Add error handling middleware for CORS issues
app.use((err: any, req: any, res: any, next: any) => {
  if (err && err.message && err.message.includes('CORS')) {
    console.error('CORS Error:', err.message, 'Origin:', req.headers.origin)
    return res.status(403).json({ error: 'CORS policy violation' })
  }
  next(err)
})

app.use(attachUser)
// mount routes
import authRoutes from './routes/auth.routes'
app.use('/api/auth', authRoutes)
app.use('/api/pages', pagesRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/posts', postsRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    cors: !!process.env.CORS_ORIGINS
  })
})

// Add a simple ping endpoint
app.get('/ping', (_req, res) => res.send('pong'))

export default app
