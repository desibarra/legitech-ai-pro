import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const secret = process.env.JWT_SECRET || 'fallback-secret-change-me';

export const signToken = (payload: object) => jwt.sign(payload, secret, { expiresIn: '7d' });
export const hashPassword = (pass: string) => bcrypt.hash(pass, 10);
export const verifyPassword = (pass: string, hash: string) => bcrypt.compare(pass, hash);
export const verifyToken = (token: string) => jwt.verify(token, secret);
