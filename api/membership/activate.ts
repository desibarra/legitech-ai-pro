import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../lib/prisma';
import { allowCors, verifyToken } from '../lib/auth';

async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const user = verifyToken(req);
        const userId = user.userId;
        const { type = 'annual' } = req.body;

        const startDate = new Date();
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1); // Default 1 year duration

        const membership = await prisma.membership.upsert({
            where: { userId },
            update: {
                status: 'active',
                startDate,
                endDate,
                type
            },
            create: {
                userId,
                status: 'active',
                startDate,
                endDate,
                type
            }
        });

        res.json({ message: 'Membership activated', membership });
    } catch (error: any) {
        if (error.message === 'No token provided' || error.message === 'Invalid token') {
            return res.status(401).json({ message: error.message });
        }
        console.error('Activate membership error:', error);
        res.status(500).json({ message: 'Error activating membership', error: String(error) });
    }
}

export default allowCors(handler);
