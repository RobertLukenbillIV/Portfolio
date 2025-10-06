import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import authRoutes from './routes/auth.routes.js'
import postRoutes from './routes/post.routes.js'


export const app = express()
app.use(helmet())
app.use(express.json({limit:'5mb'}))
app.use(cookieParser())
app.use(cors({ origin: (process.env.CORS_ORIGIN||'http://localhost:5173').split(','), credentials: true }))


app.get('/api/health',(_,res)=>res.json({ok:true}))
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)