import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import pagesRoutes from './routes/pages.routes'
import settingsRoutes from './routes/settings.routes'
import postsRoutes from './routes/posts.routes'

const app = express()
const isProd = process.env.NODE_ENV === 'production'

app.use('/api/pages', pagesRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/posts', postsRoutes)
app.set('trust proxy', 1) // required for secure cookies on Render
app.use(helmet())
app.use(cookieParser())
app.use(cors({
  origin: (process.env.CORS_ORIGIN || '').split(',').map(s=>s.trim()).filter(Boolean),
  credentials: true,
}))
app.use(express.json())

// mount routes
import authRoutes from './routes/auth.routes'
app.use('/api/auth', authRoutes)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

export default app
