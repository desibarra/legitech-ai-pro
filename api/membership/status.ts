import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';
import { allowCors, verifyToken } from '../../lib/auth';

async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const user = verifyToken(req);
        const userId = user.userId;

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

        res.json({ isMember: isActive, membership });
    } catch (error: any) {
        if (error.message === 'No token provided' || error.message === 'Invalid token') {
            return res.status(401).json({ message: error.message });
        }
        console.error('Get membership error:', error);
        res.status(500).json({ message: 'Error fetching membership', error: String(error) });
    }
}

export default allowCors(handler);
