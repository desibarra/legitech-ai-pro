import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { hashPassword, signToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // SIEMPRE responde JSON, nunca HTML
    res.setHeader('Content-Type', 'application/json')

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' })
    }

    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) return res.status(400).json({ error: 'Faltan datos' })

        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) return res.status(400).json({ error: 'Email ya existe' })

        const user = await prisma.user.create({
            data: { name, email, password: await hashPassword(password) }
        })

        const token = signToken({ userId: user.id })
        return res.status(201).json({ message: 'OK', token, user: { id: user.id, name, email } })
    } catch (error: any) {
        console.error('ERROR EN REGISTER:', error)
        return res.status(500).json({ error: 'Error interno del servidor', details: error.message })
    }
}
