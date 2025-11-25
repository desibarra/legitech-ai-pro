// api/auth/login.ts - VERSIÓN CORREGIDA
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Configurar CORS
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
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email y contraseña son requeridos'
            });
        }

        // Buscar usuario INCLUYENDO membership
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            include: {
                membership: true
            }
        });

        if (!user) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Generar JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Excluir password de la respuesta
        const { password: _, ...userWithoutPassword } = user;

        return res.status(200).json({
            success: true,
            message: 'Login exitoso',
            token,
            user: userWithoutPassword
        });

    } catch (error: any) {
        console.error('ERROR EN LOGIN:', error);

        if (error.code === 'P1001') {
            return res.status(500).json({
                error: 'Error de conexión con la base de datos'
            });
        }

        return res.status(500).json({
            error: 'Error interno del servidor',
            ...(process.env.NODE_ENV === 'development' && { details: error.message })
        });
    } finally {
        await prisma.$disconnect();
    }
}