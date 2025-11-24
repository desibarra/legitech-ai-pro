import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '@/lib/prisma';
import { verifyPassword, signToken } from '@/lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Faltan datos' });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) return res.status(400).json({ error: 'Credenciales inválidas' });

        const token = signToken({ userId: user.id });
        return res.status(200).json({ message: 'OK', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ error: 'Error interno', details: err.message });
    }
}
