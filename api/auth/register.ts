// api/auth/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Configurar CORS inmediatamente
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
        const { name, email, password } = req.body;

        // Validar campos requeridos
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Todos los campos son requeridos: nombre, email, contraseña'
            });
        }

        // Validar formato email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Formato de email inválido'
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'El email ya está registrado'
            });
        }

        // Hash de contraseña
        const hashedPassword = await bcrypt.hash(password, 12);

        // Crear usuario
        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password: hashedPassword,
            },
        });

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

        // Respuesta EXITOSA
        return res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            token,
            user: userWithoutPassword
        });

    } catch (error: any) {
        console.error('❌ ERROR EN REGISTER:', error);

        // Manejar errores de Prisma
        if (error.code === 'P2002') {
            return res.status(400).json({
                success: false,
                error: 'El email ya está registrado'
            });
        }

        // Error general del servidor
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            ...(process.env.NODE_ENV === 'development' && { details: error.message })
        });
    }
}