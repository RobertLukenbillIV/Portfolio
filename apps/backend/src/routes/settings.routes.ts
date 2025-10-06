import { Router } from 'express'
import { getSettings, updateSettings } from '../controllers/settings.controller'
import { requireAdmin } from '../middleware/auth'

const r = Router()
r.get('/', getSettings)
r.put('/', requireAdmin, updateSettings)
export default r
