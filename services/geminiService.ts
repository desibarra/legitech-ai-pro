
import { GoogleGenAI, Type } from "@google/genai";
import { IndustryType, Law, AuditResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
  try {
    const prompt = `Actúa como un Monitor Regulatorio en Tiempo Real para México. 
    Busca en tu base de conocimiento una regulación, norma oficial mexicana (NOM) o reforma legal REAL y VIGENTE que sea crítica para la industria: "${industry}".
    
    No inventes datos. Usa regulaciones existentes (ej: NOMs de STPS, SEMARNAT, SCT, SAT).
    Dame un caso específico que las empresas suelan olvidar o incumplir.
    
    Genera el objeto JSON con datos técnicos reales.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Nombre oficial de la NOM o Ley" },
            description: { type: Type.STRING, description: "Descripción técnica del requisito" },
            category: { type: Type.STRING, description: "Categoría (ej: Ambiental, Seguridad, Fiscal)" },
            isoImpact: { type: Type.STRING },
            impactLevel: { type: Type.STRING, enum: ["Alto", "Medio", "Bajo"] },
            aiSummary: { type: Type.STRING, description: "Resumen ejecutivo para Gerente de Planta" },
            actionSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            estimatedFine: { type: Type.STRING, description: "Multa real según Ley Federal de Derechos o Reglamento" },
            deadline: { type: Type.STRING, description: "Fecha límite crítica o plazo en días (ej: 45 días)" },
            complianceProgress: { type: Type.INTEGER, description: "Estimación de cumplimiento inicial típico (0-100)" }
          },
          required: ["title", "description", "impactLevel", "actionSteps", "estimatedFine", "deadline"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        id: Math.random().toString(36).substr(2, 9),
        title: data.title,
        description: data.description,
        category: data.category || "General",
        isoImpact: data.isoImpact,
        impactLevel: data.impactLevel,
        status: 'Pendiente',
        dateAdded: new Date().toISOString(),
        aiSummary: data.aiSummary,
        actionSteps: data.actionSteps,
        estimatedFine: data.estimatedFine,
        deadline: data.deadline,
        complianceProgress: data.complianceProgress || 15
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
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Realiza un análisis profundo y técnico de la regulación "${lawTitle}" aplicada a la industria "${industry}" en México.
            
            Usa datos reales de la legislación mexicana.
            Calcula multas basadas en UMAS vigentes.
            Define pasos de acción operativos, no administrativos.
            Estima un plazo crítico realista.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        aiSummary: { type: Type.STRING },
                        actionSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
                        estimatedFine: { type: Type.STRING },
                        deadline: { type: Type.STRING },
                        complianceProgress: { type: Type.INTEGER }
                    }
                }
            }
        });
        return JSON.parse(response.text) as Partial<Law>;
    } catch (e) {
        return { aiSummary: "Análisis no disponible en este momento." };
    }
}

/**
 * Analyzes ACTUAL user provided legal evidence text.
 */
export const analyzeEvidence = async (text: string): Promise<AuditResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Actúa como Auditor ISO Senior y Perito Legal en México.
      Analiza el siguiente TEXTO REAL extraído de un documento:
      
      "${text}"
      
      Tarea:
      1. Identifica qué tipo de documento es.
      2. Verifica si menciona fechas de vencimiento.
      3. Cruza la información contra NOMs vigentes (STPS, SEMARNAT, Protección Civil).
      4. Detecta inconsistencias o riesgos legales.
      
      Sé extremadamente crítico y analítico.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            compliant: { type: Type.BOOLEAN },
            verdictTitle: { type: Type.STRING, description: "Título corto del dictamen (ej: Vencido, Cumple Parcialmente)" },
            analysis: { type: Type.STRING, description: "Análisis detallado técnico citando normas específicas" },
            confidence: { type: Type.NUMBER, description: "Nivel de confianza 0-100" }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AuditResult;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Audit Error:", error);
    return {
      compliant: false,
      verdictTitle: "Error de Análisis",
      analysis: "No se pudo procesar el texto. Asegúrate de que el contenido sea legible.",
      confidence: 0
    };
  }
};

/**
 * Chat with the AI legal assistant with context awareness.
 */
export const sendChatMessage = async (
    history: {role: string, parts: {text: string}[]}[], 
    message: string,
    context?: string
): Promise<string> => {
  try {
    // Inject the massive persona into the system context for the chat
    const contextInstruction = context 
        ? `CONTEXTO ACTIVO DEL USUARIO: Estás analizando la regulación: ${context}. Usa la información de esta ley para llenar tu plantilla.`
        : "CONTEXTO: El usuario está en el dashboard general.";

    const fullSystemInstruction = `${LEGITECH_SYSTEM_INSTRUCTION}\n\n${contextInstruction}`;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction: fullSystemInstruction },
      history: history
    });

    const result = await chat.sendMessage({ message });
    return result.text || "Lo siento, no pude procesar tu solicitud.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Error de conexión con el servicio de IA.";
  }
};
