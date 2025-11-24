import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface DecodedUser {
    userId: string;
    role: string;
    iat: number;
    exp: number;
}

export function verifyToken(req: VercelRequest): DecodedUser {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        throw new Error('No token provided');
    }

    try {
        return jwt.verify(token, JWT_SECRET) as DecodedUser;
    } catch (error) {
        throw new Error('Invalid token');
    }
}

export function allowCors(fn: Function) {
    return async (req: VercelRequest, res: VercelResponse) => {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
        );

        if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
        }

        return await fn(req, res);
    };
}
