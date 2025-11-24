import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { comparePassword, signToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Content-Type', 'application/json')

    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

    try {
        const { email, password } = req.body
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !(await comparePassword(password, user.password))) {
            return res.status(401).json({ error: 'Credenciales inválidas' })
        }

        const token = signToken({ userId: user.id })
        return res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email } })
    } catch (error: any) {
        console.error('ERROR EN LOGIN:', error)
        return res.status(500).json({ error: 'Error interno', details: error.message })
    }
}
