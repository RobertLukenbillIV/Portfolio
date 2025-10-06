import { Router } from 'express';
import * as ctrl from '../controllers/post.controller';
import { requireAuth } from '../middleware/auth';
const r = Router();
// public
r.get('/public', ctrl.listPublic);
// admin
r.get('/', requireAuth, ctrl.list);
r.post('/', requireAuth, ctrl.create);
r.delete('/:id', requireAuth, ctrl.remove);
export default r;
