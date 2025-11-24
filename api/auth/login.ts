// api/auth/login.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';
import { verifyPassword } from '../../lib/auth';

export const config = {
    api: {
        bodyParser: true,
    },
};

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // Forzar siempre JSON y CORS
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña requeridos' });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'fallback_temporal_cambia_esto_ya',
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error: any) {
        console.error('Error en login:', error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
}
