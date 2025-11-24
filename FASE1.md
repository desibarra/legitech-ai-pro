Quiero que implementes la siguiente etapa del proyecto LegiTech AI Pro siguiendo estas reglas:

🎯 OBJETIVO DE ESTA ETAPA (EXCLUSIVO FRONTEND)

Agregar React Router (v6) al proyecto existente (Vite + React + TS).

Crear la Landing Page pública (no modificar estilo del dashboard existente).

Crear páginas adicionales:

/landing

/pricing

/login

/register

/app (protegida)

Crear el sistema Paywall básico del frontend:

Usuario sin membresía → redirigir a /pricing

Usuario no autenticado → redirigir a /login

Usuario con membresía → permitir acceso a /app

No modificar UI actual del dashboard. Solo envuélvelo con el router.

Crear un AuthContext temporal (solo frontend).

Crear un MembershipContext temporal con valores mock:{
  isMember: true | false,
  membershipType: "annual" | null
}
Crear un ProtectedRoute que revise:

auth

membresía

NO crear backend aún.
Solo estructura y navegación.
ESTRUCTURA DE ARCHIVOS QUE DEBES CREAR o validar si ya esta creada no sera neceseario solo revisa que todo este alineado
src/
 ├─ router/
 │   ├─ AppRouter.tsx
 │   ├─ ProtectedRoute.tsx
 │
 ├─ pages/
 │   ├─ LandingPage.tsx
 │   ├─ PricingPage.tsx
 │   ├─ LoginPage.tsx
 │   ├─ RegisterPage.tsx
 │   ├─ AppDashboard.tsx   // este solo importa el contenido actual de App.tsx
 │
 ├─ context/
 │   ├─ AuthContext.tsx
 │   ├─ MembershipContext.tsx
 │
 App.tsx     // quedará como componente interno del dashboard
 main.tsx    // envolver Router + Providers
FUNCIONALIDAD QUE DEBES IMPLEMENTAR
1) Configurar React Router

Agregar rutas:/
 /pricing
 /login
 /register
 /app       ← protegida con paywall
Sistema de membresía temporal

Mock:const [isMember, setIsMember] = useState(false);
const [membershipType, setMembershipType] = useState(null);
ProtectedRoute

Reglas:Si no está logueado → /login  
Si está logueado pero NO tiene membresía → /pricing  
Si tiene membresía → mostrar la página 

5)Landing Page (simple pero profesional)

Debe tener:

• Hero
• Explicación breve
• Botón “Comenzar” → /pricing
• No modificar estilos del dashboard
• No debe romper el theme de Vite actual

6) Pricing Page

Debe incluir:

• Plan anual (único plan por ahora)
• Botón “Comprar” → /register

7) Login / Register

Formularios simples y funcionales.

8) Conectar el dashboard existente a /app

No modificar las funcionalidades actuales.
Solo integrarlo como ruta protegida.

9) Respeta todo lo que hay en el archivo PROGRAMA.md

No cambies diseño, no borres componentes, no renombres nada.
🧠 TU SALIDA FINAL DEBE SER:

Archivos nuevos completos

Códigos completos listos para copiar/pegar

Integración sin romper ninguna funcionalidad actual

Navegación funcionando

Paywall funcionando

App lista para más etapas del backend

⚠️ IMPORTANTE

No modifiques estilos ni layout del dashboard.
No modificaciones masivas.
Solo añadir rutas, páginas y lógica básica de acceso.