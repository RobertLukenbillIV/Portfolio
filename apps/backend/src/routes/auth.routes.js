import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller';
const r = Router();
r.post('/login', ctrl.login);
r.get('/me', ctrl.me);
r.post('/logout', ctrl.logout);
export default r;
