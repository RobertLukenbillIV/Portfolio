import * as ctrl from '../controllers/post.controller'
import { requireAuth } from '../middleware/auth'
import { Router } from 'express'
import { requireAdmin } from '../middleware/auth'
import { setFeatured, listFeatured } from '../controllers/post.controller'

const r = Router()
r.get('/featured', listFeatured)
r.put('/:id/featured', requireAdmin, setFeatured)

// public
r.get('/public', ctrl.listPublic)


// admin
r.get('/', requireAuth, ctrl.list)
r.post('/', requireAuth, ctrl.create)
r.delete('/:id', requireAuth, ctrl.remove)
export default r