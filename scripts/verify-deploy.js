const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando estructura para deploy...\n');

let hasErrors = false;

// 1. Verificar imports en App.tsx
console.log('1️⃣ Verificando App.tsx...');
const appPath = path.join(__dirname, '../App.tsx');
if (fs.existsSync(appPath)) {
    const content = fs.readFileSync(appPath, 'utf8');
    if (content.includes("from './src/pages/") || content.includes('from "./src/pages/')) {
        console.log('   ✅ App.tsx tiene imports correctos\n');
    } else {
        console.log('   ❌ App.tsx tiene imports incorrectos\n');
        hasErrors = true;
    }
} else {
    console.log('   ⚠️  App.tsx no encontrado en raíz\n');
}

// 2. Verificar endpoints API
console.log('2️⃣ Verificando endpoints API...');
const endpoints = [
    'api/auth/register.ts',
    'api/auth/login.ts',
    'api/laws/real-simulate.ts',
    'api/generate.ts'
];

endpoints.forEach(endpoint => {
    const fullPath = path.join(__dirname, '..', endpoint);
    if (fs.existsSync(fullPath)) {
        console.log(`   ✅ ${endpoint}`);
    } else {
        console.log(`   ❌ Falta: ${endpoint}`);
        hasErrors = true;
    }
});
console.log('');

// 3. Verificar services
console.log('3️⃣ Verificando servicios...');
const services = [
    'src/services/geminiService.ts'
];

services.forEach(service => {
    const fullPath = path.join(__dirname, '..', service);
    if (fs.existsSync(fullPath)) {
        console.log(`   ✅ ${service}`);
    } else {
        console.log(`   ❌ Falta: ${service}`);
        hasErrors = true;
    }
});
console.log('');

// 4. Verificar pages
console.log('4️⃣ Verificando páginas...');
const pages = [
    'src/pages/LoginPage.tsx',
    'src/pages/RegisterPage.tsx',
    'src/pages/AppDashboard.tsx',
    'src/pages/LandingPage.tsx'
];

pages.forEach(page => {
    const fullPath = path.join(__dirname, '..', page);
    if (fs.existsSync(fullPath)) {
        console.log(`   ✅ ${page}`);
    } else {
        console.log(`   ❌ Falta: ${page}`);
        hasErrors = true;
    }
});
console.log('');

// 5. Verificar vercel.json
console.log('5️⃣ Verificando vercel.json...');
const vercelPath = path.join(__dirname, '../vercel.json');
if (fs.existsSync(vercelPath)) {
    console.log('   ✅ vercel.json existe\n');
} else {
    console.log('   ❌ vercel.json no encontrado\n');
    hasErrors = true;
}

// Resultado final
console.log('═'.repeat(50));
if (hasErrors) {
    console.log('❌ VERIFICACIÓN FALLIDA - Corregir errores antes de deploy');
    process.exit(1);
} else {
    console.log('✅ ESTRUCTURA VERIFICADA - LISTO PARA DEPLOY');
    console.log('═'.repeat(50));
    process.exit(0);
}
