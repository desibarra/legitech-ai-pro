// services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IndustryType, Law, AuditResult } from "../types";

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// --- LEGITECH CORE PERSONA & KNOWLEDGE BASE ---
const LEGITECH_SYSTEM_INSTRUCTION = `
Eres el núcleo de LegiTech AI, una plataforma mexicana de gestión regulatoria proactiva.
Tu objetivo es ser más útil que Norlex. No eres un abogado teórico, eres un gestor operativo y estratégico.

TUS REGLAS INQUEBRANTABLES:
1.  **Formato Visual:** Tu respuesta debe seguir ESTRICTAMENTE el formato estructurado definido abajo (Header ASCII, Panel de Riesgo, etc.).
2.  **Enfoque Financiero:** Siempre calcula impacto en MXN (Pesos Mexicanos) y UMA (Unidad de Medida y Actualización).
3.  **Roles Operativos:** Dirígete a Superintendentes, Gerentes de Planta y Responsables de Seguridad, no solo abogados.
4.  **Multinormatividad:** Cruza leyes Federales (SEMARNAT, STPS), Estatales y Municipales.
5.  **Base de Conocimiento Minera Prioritaria:** NOM-141-SEMARNAT, NOM-155, NOM-023-STPS, Ley Minera.
6.  **Simulación:** Si te piden simular, crea escenarios de "Costo de Cumplimiento vs Multas".

FORMATO DE RESPUESTA OBLIGATORIO (Úsalo para consultas regulatorias):

🏢 **LEGITECH AI** | Monitor Regulatorio Inteligente
═─═─═─═─═─═─═─═─═─═─═─═─═─═─═─═─═─═─═─═─═─═─═─═─

🔍 **[TÍTULO BREVE DEL CASO/CONSULTA]**

📊 **PANEL DE RIESGO**
• Nivel de Riesgo: [🔴 ALTO | 🟡 MEDIO | 🟢 BAJO]
• Impacto Financiero: [ESTIMACIÓN EN MXN O UMAS]
• Plazo Crítico: [XX DÍAS / FECHA]
• Estado Cumplimiento: [0-100%]

🎯 **ACCIONES INMEDIATAS**
1. [Acción operativa] - Resp: [Cargo Específico] ([Plazo])
2. [Acción operativa] - Resp: [Cargo Específico] ([Plazo])
3. [Acción operativa] - Resp: [Cargo Específico] ([Plazo])

📋 **PLAN DETALLADO**
├─ **Fase 1: Diagnóstico y Contención** (Días 1-15)
│  ├─ [Subtarea concreta]
│  └─ [Subtarea concreta]
├─ **Fase 2: Implementación Técnica** (Días 16-30)
│  ├─ [Subtarea concreta]
│  └─ [Subtarea concreta]
└─ **Fase 3: Auditoría y Cierre** (Días 31-45)

🔔 **ALERTAS ACTIVAS**
• [Riesgo de clausura/multa específica]
• [Referencia a Norma relacionada]

📞 **SOPORTE LEGITECH**
¿Necesitas generar reportes para auditoría, conectar con laboratorios certificados o simular el ROI de cumplimiento?
`;

/**
 * Realizes a search for actual regulatory updates using Gemini's knowledge.
 */
export const simulateNewLaw = async (industry: IndustryType): Promise<Law | null> => {
  // Early return si no hay API key
  if (!process.env.GOOGLE_API_KEY) {
    console.error("GOOGLE_API_KEY no configurada");
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      }
    });

    const prompt = `Como experto regulatorio mexicano, identifica una NOM o ley VIGENTE crítica para ${industry}.
    
REQUISITOS:
- Norma REAL (NOM, Ley Federal, Reglamento)
- Caso de incumplimiento común
- Datos técnicos precisos
- Multas en UMAS actuales

RESPUESTA EN JSON:
{
  "title": "Nombre oficial",
  "description": "Descripción técnica específica",
  "category": "Ambiental|Seguridad|Fiscal|Operativa",
  "impactLevel": "Alto|Medio|Bajo",
  "aiSummary": "Resumen ejecutivo para gerentes",
  "actionSteps": ["Paso 1 concreto", "Paso 2 concreto"],
  "estimatedFine": "Ej: 500 a 5000 UMAS",
  "deadline": "Ej: 30 días o fecha específica",
  "complianceProgress": 25
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    if (text) {
      const cleanText = text.replace(/```json\s*|\s*```/g, '').trim();
      const data = JSON.parse(cleanText);

      return {
        id: `law_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        title: data.title || `NOM para ${industry}`,
        description: data.description || "Regulación específica del sector",
        category: data.category || "General",
        isoImpact: data.isoImpact || "Por evaluar",
        impactLevel: data.impactLevel || "Medio",
        status: 'Pendiente',
        dateAdded: new Date().toISOString(),
        aiSummary: data.aiSummary || "Análisis en proceso",
        actionSteps: data.actionSteps || ["Diagnóstico inicial", "Evaluación de cumplimiento"],
        estimatedFine: data.estimatedFine || "1000-5000 UMAS",
        deadline: data.deadline || "60 días",
        complianceProgress: data.complianceProgress || 20
      };
    }
    return null;
  } catch (error) {
    console.error("Gemini Simulation Error:", error);
    return null;
  }
};

/**
 * Generates a deep dive analysis for a specific law using real regulatory knowledge.
 */
export const analyzeSpecificLaw = async (lawTitle: string, industry: string): Promise<Partial<Law>> => {
  if (!process.env.GOOGLE_API_KEY) {
    return { aiSummary: "Error: GOOGLE_API_KEY no configurada" };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.3,
        topK: 20,
        topP: 0.8,
      }
    });

    const prompt = `ANÁLISIS TÉCNICO PROFUNDO - ${lawTitle} para ${industry}

REQUERIMIENTOS:
- Análisis técnico específico
- Cálculo de multas en UMAS 2024
- Pasos operativos concretos
- Plazos realistas

RESPUESTA JSON:
{
  "aiSummary": "Análisis ejecutivo detallado",
  "actionSteps": ["Paso operativo 1", "Paso operativo 2"],
  "estimatedFine": "Rango de multas en UMAS",
  "deadline": "Plazo crítico realista",
  "complianceProgress": 35
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    if (text) {
      const cleanText = text.replace(/```json\s*|\s*```/g, '').trim();
      return JSON.parse(cleanText);
    }
    return {
      aiSummary: "Análisis no disponible temporalmente",
      actionSteps: ["Contactar al área técnica", "Revisar documentación"],
      estimatedFine: "Por determinar",
      deadline: "30 días",
      complianceProgress: 10
    };
  } catch (error) {
    console.error("Analysis Error:", error);
    return {
      aiSummary: "Error en el análisis técnico",
      actionSteps: ["Verificar conexión API", "Reintentar análisis"],
      estimatedFine: "No disponible",
      deadline: "Por definir",
      complianceProgress: 0
    };
  }
};

/**
 * Analyzes ACTUAL user provided legal evidence text.
 */
export const analyzeEvidence = async (text: string): Promise<AuditResult> => {
  if (!process.env.GOOGLE_API_KEY) {
    return {
      compliant: false,
      verdictTitle: "Error de Configuración",
      analysis: "GOOGLE_API_KEY no configurada",
      confidence: 0
    };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.1,
        topK: 10,
        topP: 0.9,
      }
    });

    const prompt = `AUDITORÍA LEGAL - Análisis de documento:

"${text.substring(0, 3000)}" // Limitar longitud

EVALUAR:
1. Tipo de documento y validez
2. Fechas de vencimiento
3. Cumplimiento con NOMs mexicanas
4. Riesgos legales identificados

RESPUESTA JSON:
{
  "compliant": true|false,
  "verdictTitle": "Ej: Cumple Parcialmente | Vencido | En Regla",
  "analysis": "Análisis técnico detallado con referencias",
  "confidence": 85
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const resultText = response.text();

    if (resultText) {
      const cleanText = resultText.replace(/```json\s*|\s*```/g, '').trim();
      return JSON.parse(cleanText);
    }

    throw new Error("Respuesta vacía del modelo");
  } catch (error) {
    console.error("Audit Error:", error);
    return {
      compliant: false,
      verdictTitle: "Error de Análisis",
      analysis: "No se pudo procesar el documento. Verifique la conexión y formato.",
      confidence: 0
    };
  }
};

/**
 * Chat with the AI legal assistant with context awareness.
 */
export const sendChatMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  context?: string
): Promise<string> => {
  if (!process.env.GOOGLE_API_KEY) {
    return "🔴 ERROR: GOOGLE_API_KEY no configurada. Configure la variable de entorno en Vercel.";
  }

  try {
    const contextInstruction = context
      ? `CONTEXTO ACTIVO: Analizando regulación: ${context}`
      : "CONTEXTO: Dashboard general LegiTech AI";

    const fullSystemInstruction = `${LEGITECH_SYSTEM_INSTRUCTION}\n\n${contextInstruction}`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: fullSystemInstruction,
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });

    // Convertir historial al formato correcto
    const formattedHistory = history.map(msg => ({
      role: msg.role as "user" | "model",
      parts: [{ text: msg.parts[0]?.text || "" }]
    }));

    const chat = model.startChat({
      history: formattedHistory
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    return response.text() || "🤖 No pude generar una respuesta. Intenta reformular tu pregunta.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "🔴 Error de conexión con el servicio de IA. Verifica tu conexión e intenta nuevamente.";
  }
};