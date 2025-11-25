import { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { userId, planType } = req.body;

        if (!userId || !planType) {
            return res.status(400).json({ error: 'userId y planType son requeridos' });
        }

        const membership = await prisma.membership.upsert({
            where: { userId },
            update: {
                type: planType,
                status: 'active',
                startDate: new Date(),
                updatedAt: new Date()
            },
            create: {
                userId,
                type: planType,
                status: 'active',
                startDate: new Date()
            }
        });

        res.status(200).json({
            success: true,
            message: `Membership ${planType} activada`,
            membership
        });

    } catch (error: any) {
        console.error('Error en activate membership:', error);
        res.status(500).json({
            error: 'Error al activar membership',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        await prisma.$disconnect();
    }
}