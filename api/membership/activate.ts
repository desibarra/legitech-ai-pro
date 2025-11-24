import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../lib/prisma';
import { verifyToken } from '../lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Content-Type", "application/json");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
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

        return res.status(200).json({ message: 'Membership activated', membership });
    } catch (error: any) {
        console.error('Activate membership error:', error);
        return res.status(500).json({ message: 'Error activating membership', error: String(error) });
    }
}
