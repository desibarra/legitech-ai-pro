import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'temporal-cambiar-en-produccion';

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const comparePassword = (password: string, hash: string) => bcrypt.compare(password, hash);
export const signToken = (payload: object) => jwt.sign(payload, secret, { expiresIn: '30d' });

// Compatibility exports for existing endpoints
export const verifyPassword = comparePassword;
export const verifyToken = (token: string) => jwt.verify(token, secret);
