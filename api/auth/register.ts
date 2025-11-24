import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';
import { hashPassword, signToken } from '../../lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: 'Faltan datos' });

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ error: 'Email ya existe' });

        const user = await prisma.user.create({
            data: { name, email, password: await hashPassword(password) }
        });

        const token = signToken({ userId: user.id });
        return res.status(201).json({ message: 'OK', token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ error: 'Error interno', details: err.message });
    }
}
