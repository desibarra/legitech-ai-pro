// services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IndustryType, Law, AuditResult } from "@/types";

// =========================
//  🔐 VITE ENV VARIABLES
// =========================
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || "";

if (!apiKey) {
  console.error("❌ ERROR: VITE_GOOGLE_API_KEY no está configurada en .env");
}

// Inicializar cliente Gemini
const genAI = new GoogleGenerativeAI(apiKey);

// =========================
//  ⚙ LegiTech System Prompt
// =========================
const LEGITECH_SYSTEM_INSTRUCTION = `
Eres el núcleo de LegiTech AI, una plataforma mexicana de gestión regulatoria proactiva.
Tu objetivo es ser más útil que Norlex. No eres un abogado teórico, eres un gestor operativo y estratégico.

TUS REGLAS INQUEBRANTABLES:
1. Formato Visual obligatorio.
2. Impacto financiero en MXN/UMA.
3. Enfoque operativo para gerentes y supervisores.
4. Cruzar normas Federales/Estatales/Municipales.
5. Prioridad: Sector minero mexicano.
6. Simulación de escenarios.

FORMATO DE RESPUESTA OBLIGATORIO:

🏢 **LEGITECH AI** | Monitor Regulatorio Inteligente
═─═─═─═─═─═─═─═─═─═─═─═─═─═─═─═─═─═─═─═

🔍 **[TÍTULO]**

📊 **PANEL DE RIESGO**
• Nivel: [🔴 / 🟡 / 🟢]
• Multa estimada (MXN/UMA)
• Plazo Crítico
• % Cumplimiento

🎯 **ACCIONES INMEDIATAS**
1. Acción - Responsable - Plazo
2. Acción - Responsable - Plazo

📋 **PLAN DETALLADO**
- Fase 1
- Fase 2
- Fase 3

🔔 **ALERTAS**
• Riesgo específico

📞 **SOPORTE LEGITECH**
`;

// ========================================================
//  1️⃣ SIMULAR UNA LEY / NORMA NUEVA
// ========================================================
export const simulateNewLaw = async (industry: IndustryType): Promise<Law | null> => {
  if (!apiKey) return null;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: { temperature: 0.7 },
    });

    const prompt = `
Dame una norma mexicana REAL aplicable al sector ${industry}.

Formato JSON:
{
  "title": "",
  "description": "",
  "category": "",
  "impactLevel": "",
  "aiSummary": "",
  "actionSteps": [],
  "estimatedFine": "",
  "deadline": "",
  "complianceProgress": 20
}`;

    const output = await model.generateContent(prompt);
    const text = output.response.text();
    const clean = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean);

    return {
      id: `law_${Date.now()}`,
      title: data.title,
      description: data.description,
      category: data.category,
      isoImpact: "Por evaluar",
      impactLevel: data.impactLevel,
      status: "Pendiente",
      dateAdded: new Date().toISOString(),
      aiSummary: data.aiSummary,
      actionSteps: data.actionSteps,
      estimatedFine: data.estimatedFine,
      deadline: data.deadline,
      complianceProgress: data.complianceProgress,
    };
  } catch (err) {
    console.error("Gemini Simulation Error:", err);
    return null;
  }
};

// ========================================================
//  2️⃣ ANÁLISIS ESPECÍFICO DE UNA LEY
// ========================================================
export const analyzeSpecificLaw = async (lawTitle: string, industry: string): Promise<Partial<Law>> => {
  if (!apiKey) return { aiSummary: "API Key no configurada" };

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: { temperature: 0.3 },
    });

    const prompt = `
ANÁLISIS TÉCNICO: ${lawTitle} para ${industry}

JSON:
{
  "aiSummary": "",
  "actionSteps": [],
  "estimatedFine": "",
  "deadline": "",
  "complianceProgress": 35
}`;

    const output = await model.generateContent(prompt);
    const text = output.response.text();
    const clean = text.replace(/```json|```/g, "").trim();

    return JSON.parse(clean);
  } catch (err) {
    console.error("Analysis Error:", err);
    return {
      aiSummary: "No se pudo analizar",
      actionSteps: ["Revisar manualmente"],
      estimatedFine: "N/D",
      deadline: "N/D",
      complianceProgress: 0,
    };
  }
};

// ========================================================
//  3️⃣ ANÁLISIS DE DOCUMENTOS (EVIDENCIA)
// ========================================================
export const analyzeEvidence = async (text: string): Promise<AuditResult> => {
  if (!apiKey) {
    return {
      compliant: false,
      verdictTitle: "API key faltante",
      analysis: "Configura VITE_GOOGLE_API_KEY",
      confidence: 0,
    };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: { temperature: 0.1 },
    });

    const prompt = `
Analiza el siguiente texto legal:

"${text.substring(0, 3000)}"

Formato JSON:
{
  "compliant": true/false,
  "verdictTitle": "",
  "analysis": "",
  "confidence": 90
}`;

    const output = await model.generateContent(prompt);
    const clean = output.response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error("Audit Error:", err);
    return {
      compliant: false,
      verdictTitle: "Error",
      analysis: "No se pudo procesar",
      confidence: 0,
    };
  }
};

// ========================================================
//  4️⃣ CHAT LEGITECH (SISTEMA PRINCIPAL)
// ========================================================
export const sendChatMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  context?: string
): Promise<string> => {
  if (!apiKey) return "API key no configurada";

  try {
    const fullInstruction = `${LEGITECH_SYSTEM_INSTRUCTION}
${context ? "CONTEXTO: " + context : ""}`;

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      systemInstruction: fullInstruction,
    });

    const formattedHistory = history.map(msg => ({
      role: msg.role as "user" | "model",
      parts: [{ text: msg.parts[0]?.text || "" }],
    }));

    const chat = model.startChat({ history: formattedHistory });
    const res = await chat.sendMessage(message);

    return res.response.text();
  } catch (err) {
    console.error("Chat Error:", err);
    return "Error procesando la solicitud.";
  }
};
