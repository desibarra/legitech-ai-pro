// api/auth/register.ts - VERSIÓN CORREGIDA PARA TU SCHEMA
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('🔧 Register endpoint called');

    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        console.log('🔧 OPTIONS request');
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        console.log('❌ Method not allowed:', req.method);
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        console.log('🔧 Processing registration...');

        const { name, email, password } = req.body;
        console.log('🔧 Request data:', { name, email: email?.substring(0, 10) + '...' });

        // Validar campos requeridos
        if (!name || !email || !password) {
            console.log('❌ Missing fields:', { name: !!name, email: !!email, password: !!password });
            return res.status(400).json({
                success: false,
                error: 'Todos los campos son requeridos'
            });
        }

        // Verificar variables de entorno
        if (!process.env.DATABASE_URL) {
            console.log('❌ DATABASE_URL not set');
            return res.status(500).json({
                success: false,
                error: 'Error de configuración: DATABASE_URL no configurada'
            });
        }

        if (!process.env.JWT_SECRET) {
            console.log('❌ JWT_SECRET not set');
            return res.status(500).json({
                success: false,
                error: 'Error de configuración: JWT_SECRET no configurada'
            });
        }

        console.log('🔧 Checking existing user...');

        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existingUser) {
            console.log('❌ User already exists:', email);
            return res.status(400).json({
                success: false,
                error: 'El email ya está registrado'
            });
        }

        console.log('🔧 Hashing password...');

        // Hash de contraseña
        const hashedPassword = await bcrypt.hash(password, 12);

        console.log('🔧 Creating user with membership...');

        // Crear usuario CON membership (como requiere tu schema)
        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                role: 'user',
                membership: {
                    create: {
                        status: 'active',
                        type: 'free',
                        startDate: new Date()
                    }
                }
            },
            include: {
                membership: true // Incluir la membership en la respuesta
            }
        });

        console.log('🔧 User created:', user.id);

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

        console.log('✅ Registration successful for:', email);

        // Respuesta EXITOSA
        return res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            token,
            user: userWithoutPassword
        });

    } catch (error: any) {
        console.error('❌ ERROR EN REGISTER:', error);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error message:', error.message);

        // Manejar errores específicos de Prisma
        if (error.code === 'P2002') {
            return res.status(400).json({
                success: false,
                error: 'El email ya está registrado'
            });
        }

        if (error.code === 'P1001') {
            return res.status(500).json({
                success: false,
                error: 'No se puede conectar a la base de datos. Verifica DATABASE_URL.'
            });
        }

        if (error.code === 'P1012') {
            return res.status(500).json({
                success: false,
                error: 'Error en el esquema de la base de datos'
            });
        }

        // Error general del servidor
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            ...(process.env.NODE_ENV === 'development' && {
                details: error.message,
                code: error.code
            })
        });
    } finally {
        await prisma.$disconnect();
    }
}