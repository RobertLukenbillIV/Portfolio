import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'

const app = express()
const isProd = process.env.NODE_ENV === 'production'

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
