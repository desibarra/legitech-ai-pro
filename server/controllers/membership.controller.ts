import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getMembershipStatus = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;
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
    } catch (error) {
        console.error('Get membership error:', error);
        res.status(500).json({ message: 'Error fetching membership', error });
    }
};

export const activateMembership = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;
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
    } catch (error) {
        console.error('Activate membership error:', error);
        res.status(500).json({ message: 'Error activating membership', error });
    }
};
