import { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { userId } = req.query;

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ error: 'userId es requerido' });
        }

        const membership = await prisma.membership.findUnique({
            where: { userId },
            include: { user: { select: { name: true, email: true } } }
        });

        if (!membership) {
            return res.status(404).json({ error: 'Membership no encontrada' });
        }

        res.status(200).json({
            success: true,
            membership
        });

    } catch (error: any) {
        console.error('Error en membership status:', error);
        res.status(500).json({
            error: 'Error al obtener membership',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        await prisma.$disconnect();
    }
}