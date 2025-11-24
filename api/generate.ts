import type { NextApiRequest, NextApiResponse } from 'next'
import { GoogleGenerativeAI } from '@google/genai'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
        const { prompt } = req.body

        if (!prompt) {
            return res.status(400).json({ error: 'El prompt es requerido' })
        }

        // Inicializar Gemini SOLO en backend
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            console.error('GEMINI_API_KEY no configurada')
            return res.status(500).json({ error: 'API Key no configurada' })
        }

        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        return res.status(200).json({ output: text })

    } catch (error: any) {
        console.error('ERROR EN GENERATE:', error)
        return res.status(500).json({
            error: 'Error al generar contenido',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}
