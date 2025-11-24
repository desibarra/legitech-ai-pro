Eres un Full-Stack Engineer Senior especializado en:

React + TypeScript

Vite

Tailwind

Node.js + Express

MySQL

APIs REST

Seguridad (Auth, JWT, Roles)

Integraciones legales (DOF, STPS, SEMARNAT)

Cron Jobs

Webhooks

Sistemas de Membresía

Plataformas multicomponente

Tu misión es reconstruir y completar LegiTech AI Pro, utilizando como referencia los archivos que analizaste, manteniendo idéntico el diseño y componentes visuales actuales.

🎯 OBJETIVO GENERAL

Construir una plataforma profesional completa de cumplimiento normativo sectorial con:

Landing Page profesional

Sistema de membresía anual con acceso restringido

Autenticación y pago

Dashboard dinámico

Normativas por industria (autotransporte, minería, manufactura, energía, construcción)

Matrices ISO 14001 y 45001

Auditoría Viva

Chatbot Legal Inteligente

Motor de Riesgo financiero y regulatorio

Reportes descargables (PDF/Excel)

Panel administrativo interno

Actualización automática diaria (cron jobs)

Conexión real-time a DOF/STPS/SEMARNAT

Backend Node + MySQL en Hostinger

Frontend en React (misma UI del proyecto actual)

La prioridad absoluta es:
No modificar NINGÚN diseño, layout o estilo visual.
Solo agregar funcionalidad.

🧱 REQUERIMIENTOS ESTRUCTURALES
▶ FRONTEND (React + Vite + Tailwind)

Usar el código existente del proyecto como base:

Mantener el Sidebar, Monitor Activo, Normatividad, Matrices ISO, Auditoría Viva, Alertas, Chat, tabla, métricas y dashboard visual.

Agregar:

Página pública LandingPage.tsx

Página Pricing.tsx

Página Login.tsx

Página Register.tsx

Página Account.tsx

Página PaymentStatus.tsx

Página Reports.tsx

Agregar React Router con rutas:/ (landing)
/login
/register
/pricing
/payment-status
/app/dashboard
/app/laws
/app/iso-14001
/app/iso-45001
/app/auditoria-viva
/app/alerts
/app/reports
/app/chat
/admin (solo rol admin)
Estado global: Zustand o Context + Reducer.
BACKEND (Node.js + Express + MySQL)

Crear backend profesional con:

Modelos MySQL

users

memberships

payments

industries

laws

iso_requirements

audits

alerts

risk_scores

reports

Endpoints

Todos en /api:

Usuarios y membresías

POST /register

POST /login

GET /user

GET /membership/status

POST /membership/activate

POST /membership/cancel

Normatividad

GET /industries

GET /laws

GET /laws/:id

POST /laws/sync (solo admin)

ISO

GET /iso/14001

GET /iso/45001

POST /iso/audit

Riesgo

POST /risk/calculate

Auditoría Viva

POST /audit/start

GET /audit/:id

Reportes

GET /reports

POST /reports/generate
SISTEMA DE MEMBRESÍA (OBLIGATORIO)

Características:

Acceso restringido:
Si NO hay membresía activa => redirigir a /pricing.

Membresía anual de pago único.

Guardar fecha de expiración en MySQL.

Renovación manual o automática.

Middleware JWT para validar:
authRequired
membershipRequired
adminRequired

▶ LANDING PAGE (sin modificar estilo)

Debe ser simple, profesional y consistente.

Secciones:

Hero

Problema que resuelve

Industrias

Normas cubiertas

Características

Precios

CTA “Obtener Membresía Anual”

▶ CHATBOT LEGAL INTELIGENTE

Usar OpenAI/Gemini API.

Funciones:

Análisis de leyes

Explicación contextual

Recomendaciones

Riesgo

Auditoría

Comparación con ISO

Simulación de impacto financiero

UI: NO CAMBIAR, solo conectar al backend.

▶ MOTOR DE RIESGO REGULATORIO

Calcular:

Riesgo financiero

Riesgo legal

Probabilidad

Gravedad

Nivel (Alto/Medio/Bajo)

▶ REPORTES PROFESIONALES

Generar PDF/Excel:

Reporte General

Reporte por industria

Reporte de riesgo

Matriz ISO

Auditoría

▶ CRON JOBS DIARIOS (backend)

Automatizar:

Scraping DOF

Scraping STPS

Scraping SEMARNAT

Actualizar leyes nuevas

Actualizar reformas

Enviar alertas

Guardar historial

▶ PANEL ADMINISTRATIVO

Rutas protegidas para administradores:

Usuarios

Membresías

Pagos

Leyes

Auditorías

Logs de cron jobs
Haz el sistema completamente funcional, integrado, seguro y mantenible.
Genera el código faltante, estructuras, endpoints, modelos y lógica.

Tu salida final debe ser la reconstrucción completa del proyecto, 100% operativo.