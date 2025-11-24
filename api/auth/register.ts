import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { hashPassword, signToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // SIEMPRE responde JSON, nunca HTML
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' })
    }

    try {
        const { name, email, password } = req.body

        // Validaciones básicas
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' })
        }

        // Verificar si el email ya existe
        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            return res.status(400).json({ error: 'El email ya está registrado' })
        }

        // Hash password
        const hashedPassword = await hashPassword(password)

        // Crear usuario con membership en una transacción
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                membership: {
                    create: {
                        status: 'active',
                        type: 'free',
                        startDate: new Date(),
                    }
                }
            },
            include: {
                membership: true
            }
        })

        // Generar token
        const token = signToken({ userId: user.id })

        return res.status(201).json({
            success: true,
            message: 'Usuario registrado correctamente',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                membership: user.membership
            }
        })

    } catch (error: any) {
        console.error('ERROR EN REGISTER:', error)

        // Manejar error de duplicado (Prisma error code P2002)
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'El email ya está registrado' })
        }

        return res.status(500).json({
            error: 'Error interno del servidor',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}
