import { Router } from 'express'
import { getPage, upsertPage } from '../controllers/pages.controller'
import { requireAdmin } from '../middleware/auth'

const r = Router()
r.get('/:slug', getPage)
r.put('/:slug', requireAdmin, upsertPage)
export default r