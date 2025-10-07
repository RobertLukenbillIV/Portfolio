// Authentication routes - handles user login, logout, and profile endpoints
// Mounted at /api/auth in app.ts
// Connected to: controllers/auth.controller.ts, middleware/auth.ts

import { Router } from 'express'
import { login, logout, me } from '../controllers/auth.controller' // Authentication handlers
import { requireAuth } from '../middleware/auth'                   // Authentication middleware

const router = Router()

// POST /api/auth/login - Authenticate user and set JWT cookie
// Public access - no authentication required
// Body: { email: string, password: string }
router.post('/login', login)

// POST /api/auth/logout - Clear JWT cookie and end session
// Public access - works whether user is authenticated or not
router.post('/logout', logout)

// GET /api/auth/me - Get current user information
// Protected route - requires valid JWT cookie
// Returns user object if authenticated, 401 if not
router.get('/me', requireAuth, me)

export default router
