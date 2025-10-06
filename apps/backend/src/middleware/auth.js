import { verify } from '../utils/jwt';
export function requireAuth(req, res, next) {
    const token = req.cookies['token'];
    try {
        const user = token ? verify(token) : null;
        if (!user)
            return res.status(401).json({ message: 'Unauthorized' });
        req.user = user;
        next();
    }
    catch {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
