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
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `Actúa como un Monitor Regulatorio en Tiempo Real para México. 
    Busca en tu base de conocimiento una regulación, norma oficial mexicana (NOM) o reforma legal REAL y VIGENTE que sea crítica para la industria: "${industry}".
    
    No inventes datos. Usa regulaciones existentes (ej: NOMs de STPS, SEMARNAT, SCT, SAT).
    Dame un caso específico que las empresas suelan olvidar o incumplir.
    
    Devuelve SOLO un objeto JSON válido sin markdown con la siguiente estructura:
    {
      "title": "Nombre oficial",
      "description": "Descripción técnica",
      "category": "Categoría",
      "isoImpact": "Impacto ISO",
      "impactLevel": "Alto|Medio|Bajo",
      "aiSummary": "Resumen ejecutivo",
      "actionSteps": ["paso1", "paso2"],
      "estimatedFine": "Multa estimada",
      "deadline": "Plazo crítico",
      "complianceProgress": número
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (text) {
      // Limpiar el texto en caso de que venga con backticks de JSON
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      const data = JSON.parse(cleanText);

      return {
        id: Math.random().toString(36).substring(2, 9),
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
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `Realiza un análisis profundo y técnico de la regulación "${lawTitle}" aplicada a la industria "${industry}" en México.
    
    Usa datos reales de la legislación mexicana.
    Calcula multas basadas en UMAS vigentes.
    Define pasos de acción operativos, no administrativos.
    Estima un plazo crítico realista.
    
    Devuelve SOLO un objeto JSON válido sin markdown con la siguiente estructura:
    {
      "aiSummary": "Resumen analítico",
      "actionSteps": ["paso1", "paso2"],
      "estimatedFine": "Multa estimada",
      "deadline": "Plazo crítico",
      "complianceProgress": número
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (text) {
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanText) as Partial<Law>;
    }
    return { aiSummary: "Análisis no disponible en este momento." };
  } catch (e) {
    console.error("Analysis Error:", e);
    return { aiSummary: "Error al analizar la regulación." };
  }
}

/**
 * Analyzes ACTUAL user provided legal evidence text.
 */
export const analyzeEvidence = async (text: string): Promise<AuditResult> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `Actúa como Auditor ISO Senior y Perito Legal en México.
    Analiza el siguiente TEXTO REAL extraído de un documento:
    
    "${text}"
    
    Tarea:
    1. Identifica qué tipo de documento es.
    2. Verifica si menciona fechas de vencimiento.
    3. Cruza la información contra NOMs vigentes (STPS, SEMARNAT, Protección Civil).
    4. Detecta inconsistencias o riesgos legales.
    
    Sé extremadamente crítico y analítico.
    
    Devuelve SOLO un objeto JSON válido sin markdown con la siguiente estructura:
    {
      "compliant": boolean,
      "verdictTitle": "Título del dictamen",
      "analysis": "Análisis detallado",
      "confidence": número
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const resultText = response.text();

    if (resultText) {
      const cleanText = resultText.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanText) as AuditResult;
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
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  context?: string
): Promise<string> => {
  try {
    // Inject the massive persona into the system context for the chat
    const contextInstruction = context
      ? `CONTEXTO ACTIVO DEL USUARIO: Estás analizando la regulación: ${context}. Usa la información de esta ley para llenar tu plantilla.`
      : "CONTEXTO: El usuario está en el dashboard general.";

    const fullSystemInstruction = `${LEGITECH_SYSTEM_INSTRUCTION}\n\n${contextInstruction}`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: fullSystemInstruction
    });

    // Construir el historial de chat
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.parts[0].text }]
      }))
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text() || "Lo siento, no pude procesar tu solicitud.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Error de conexión con el servicio de IA.";
  }
};