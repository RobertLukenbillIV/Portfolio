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

app.use('/api/pages', pagesRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/posts', postsRoutes)
app.set('trust proxy', 1) // required for secure cookies on Render
app.use(helmet())
app.use(cookieParser())
const csv = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || ''
const allowlist = csv.split(',').map(s => s.trim()).filter(Boolean)
const corsOptions: cors.CorsOptions = {
  origin(origin, cb) {
    // allow server-to-server/no-origin (curl/health checks)
    if (!origin) return cb(null, true)
    try {
      const host = new URL(origin).hostname
      const allowed =
        allowlist.includes(origin) ||
        host.endsWith('.vercel.app') // allow all vercel previews if you want
      return allowed ? cb(null, true) : cb(new Error(`CORS blocked: ${origin}`))
    } catch {
      return cb(new Error(`Bad Origin: ${origin}`))
    }
  },
  credentials: true, // needed because your axios client uses withCredentials
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(attachUser)
// mount routes
import authRoutes from './routes/auth.routes'
app.use('/api/auth', authRoutes)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

export default app
