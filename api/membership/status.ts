import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../lib/prisma';
import { verifyToken } from '../lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = verifyToken(token);
        if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const userId = (decoded as any).userId;
        const membership = await prisma.membership.findUnique({ where: { userId } });

        if (!membership) {
            return res.json({ isMember: false, membership: null });
        }

        const isActive = membership.status === 'active' && new Date() < membership.endDate;

        // Auto-expire if date passed
        if (!isActive && membership.status === 'active') {
            await prisma.membership.update({
                where: { id: membership.id },
                data: { status: 'expired' }
            });
        }

        return res.json({ isMember: isActive, membership });
    } catch (error: any) {
        console.error('Get membership error:', error);
        return res.status(500).json({ message: 'Error fetching membership', error: String(error) });
    }
}
