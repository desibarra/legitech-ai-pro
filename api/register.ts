import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from './lib/prisma';
import { hashPassword } from './lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'fallback_temporal',
            { expiresIn: '7d' }
        );

        return res.status(201).json({
            message: 'Usuario registrado correctamente',
            token,
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (error: any) {
        console.error('Error en register:', error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
}
