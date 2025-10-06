import jwt from 'jsonwebtoken';
export const sign = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
export const verify = (token) => jwt.verify(token, process.env.JWT_SECRET);
