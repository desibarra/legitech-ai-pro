import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Shield, Zap, Globe, Scale, FileText, Search, Lock, Users, Star, Sparkles } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500 selection:text-white">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Scale className="h-8 w-8 text-blue-500" />
                            <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                                LegiTech AI Pro
                            </span>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link to="/login" className="px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all">
                                    Iniciar Sesión
                                </Link>
                                <Link to="/register" className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105">
                                    Comenzar Gratis
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* 1. Hero WOW */}
            <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
                <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0">
                    <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                        <span className="block text-white">Inteligencia Artificial Legal</span>
                        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">
                            Que Trabaja Para Ti
                        </span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-400 mb-10">
                        Genera contratos, analiza documentos y redacta textos legales en segundos. La herramienta que todo profesional del derecho necesita.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Link to="/register" className="group flex items-center px-8 py-4 text-lg font-bold rounded-full text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-500/25 transition-all transform hover:scale-105">
                            Probar Gratis
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a href="#pricing" className="flex items-center px-8 py-4 text-lg font-bold rounded-full text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all">
                            Ver Precios
                        </a>
                    </div>
                </div>
            </section>

            {/* 2. Por qué LegiTech AI Pro */}
            <section className="py-20 bg-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">¿Por Qué LegiTech AI Pro?</h2>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                            Sabemos que abogados, contadores y asesores pierden horas en tareas repetitivas. Nosotros automatizamos lo tedioso para que te enfoques en lo estratégico.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <BenefitCard
                            icon={<Zap className="h-8 w-8 text-yellow-400" />}
                            title="Ahorra 10+ Horas Semanales"
                            description="Automatiza la redacción de contratos, análisis de documentos y generación de informes legales."
                        />
                        <BenefitCard
                            icon={<Shield className="h-8 w-8 text-green-400" />}
                            title="Precisión Garantizada"
                            description="IA entrenada con miles de documentos legales para garantizar exactitud y cumplimiento normativo."
                        />
                        <BenefitCard
                            icon={<Sparkles className="h-8 w-8 text-purple-400" />}
                            title="Calidad Profesional"
                            description="Documentos listos para firmar, con lenguaje técnico y formato impecable."
                        />
                    </div>
                </div>
            </section>

            {/* 3. Cómo Funciona */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white sm:text-4xl">Cómo Funciona</h2>
                        <p className="mt-4 text-lg text-slate-400">Tres pasos simples para transformar tu práctica legal</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <StepCard
                            number="1"
                            title="Ingresa el Tema"
                            description="Describe el contrato o documento que necesitas. Puedes subir archivos o escribir instrucciones."
                        />
                        <StepCard
                            number="2"
                            title="IA Analiza y Redacta"
                            description="Nuestra inteligencia artificial procesa tu solicitud, analiza riesgos y genera el documento completo."
                        />
                        <StepCard
                            number="3"
                            title="Exporta y Firma"
                            description="Descarga el documento en PDF o Word, listo para revisar, editar y firmar."
                        />
                    </div>
                </div>
            </section>

            {/* 4. Casos de Uso */}
            <section className="py-20 bg-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white sm:text-4xl">Casos de Uso</h2>
                        <p className="mt-4 text-lg text-slate-400">Soluciones para cada necesidad legal</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <UseCaseCard
                            icon={<FileText className="h-6 w-6 text-blue-400" />}
                            title="Generación de Contratos"
                            description="Crea contratos de compraventa, arrendamiento, prestación de servicios y más."
                        />
                        <UseCaseCard
                            icon={<Search className="h-6 w-6 text-cyan-400" />}
                            title="Análisis de Riesgos"
                            description="Identifica cláusulas problemáticas y riesgos legales en documentos existentes."
                        />
                        <UseCaseCard
                            icon={<FileText className="h-6 w-6 text-green-400" />}
                            title="Redacción Jurídica"
                            description="Genera demandas, escritos, oficios y comunicaciones legales profesionales."
                        />
                        <UseCaseCard
                            icon={<Lock className="h-6 w-6 text-purple-400" />}
                            title="Due Diligence"
                            description="Automatiza la revisión de documentos corporativos y análisis de cumplimiento."
                        />
                    </div>
                </div>
            </section>

            {/* 5. Características Avanzadas */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white sm:text-4xl">Características Avanzadas</h2>
                        <p className="mt-4 text-lg text-slate-400">Tecnología de punta para profesionales exigentes</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FeatureCard
                            icon={<Sparkles className="h-8 w-8 text-blue-400" />}
                            title="Motor de IA Especializado"
                            description="Entrenado con legislación mexicana, española y latinoamericana. Actualizado constantemente con jurisprudencia reciente."
                        />
                        <FeatureCard
                            icon={<Globe className="h-8 w-8 text-cyan-400" />}
                            title="Biblioteca Legal Integrada"
                            description="Acceso a códigos, leyes, reglamentos y tratados internacionales en un solo lugar."
                        />
                        <FeatureCard
                            icon={<FileText className="h-8 w-8 text-green-400" />}
                            title="Plantillas Premium"
                            description="Más de 200 plantillas profesionales listas para personalizar y usar inmediatamente."
                        />
                        <FeatureCard
                            icon={<Lock className="h-8 w-8 text-purple-400" />}
                            title="Panel Privado Seguro"
                            description="Tus documentos protegidos con encriptación de nivel bancario. Cumplimiento GDPR y LFPDPPP."
                        />
                    </div>
                </div>
            </section>

            {/* 6. Autoridad / Confianza */}
            <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Shield className="h-16 w-16 text-blue-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-6">Creado Para Profesionales Que Necesitan Velocidad y Precisión</h2>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        LegiTech AI Pro es la herramienta de confianza para más de 5,000 abogados, contadores y asesores en América Latina.
                        Desarrollada por expertos en derecho y tecnología, nuestra plataforma combina inteligencia artificial de última generación
                        con conocimiento legal profundo para entregar resultados que cumplen los más altos estándares profesionales.
                    </p>
                </div>
            </section>

            {/* 7. Testimonios */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white sm:text-4xl">Lo Que Dicen Nuestros Usuarios</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TestimonialCard
                            name="Lic. María Fernández"
                            role="Abogada Corporativa"
                            text="LegiTech AI Pro redujo mi tiempo de redacción de contratos en un 80%. Ahora puedo atender más clientes sin sacrificar calidad."
                        />
                        <TestimonialCard
                            name="CP. Roberto Sánchez"
                            role="Contador Público"
                            text="La función de análisis de riesgos me ha salvado de varios problemas legales. Es como tener un equipo de abogados trabajando 24/7."
                        />
                        <TestimonialCard
                            name="Lic. Ana Torres"
                            role="Asesora Legal Independiente"
                            text="Increíble herramienta. Mis clientes quedan impresionados con la rapidez y profesionalismo de los documentos que genero."
                        />
                    </div>
                </div>
            </section>

            {/* 8. Pricing */}
            <section id="pricing" className="py-20 bg-slate-800/50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">Plan Único – $27 USD / mes</h2>
                        <p className="text-lg text-slate-400">Todo lo que necesitas para transformar tu práctica legal</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 border border-slate-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-3">
                                    <PricingFeature text="Generación ilimitada de contratos" />
                                    <PricingFeature text="Redacción jurídica con IA" />
                                    <PricingFeature text="Análisis legal automatizado" />
                                    <PricingFeature text="Más de 200 plantillas profesionales" />
                                </div>
                                <div className="space-y-3">
                                    <PricingFeature text="Carpeta segura en la nube" />
                                    <PricingFeature text="Soporte prioritario 24/7" />
                                    <PricingFeature text="Actualizaciones incluidas" />
                                    <PricingFeature text="Exportación PDF y Word" />
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-slate-400 mb-6">Cancela cuando quieras, sin letra pequeña ni compromisos.</p>
                                <Link to="/register" className="inline-flex items-center px-8 py-4 text-lg font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all transform hover:scale-105">
                                    Comenzar Ahora
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 9. Footer Premium */}
            <footer className="bg-slate-900 border-t border-slate-800 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center">
                            <Scale className="h-6 w-6 text-slate-500" />
                            <span className="ml-2 text-slate-400 font-semibold">LegiTech AI Pro</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
                            <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
                            <Link to="/register" className="hover:text-white transition-colors">Registro</Link>
                            <a href="#pricing" className="hover:text-white transition-colors">Precios</a>
                            <Link to="/privacy" className="hover:text-white transition-colors">Políticas de Privacidad</Link>
                        </div>
                        <div className="text-slate-500 text-sm">
                            © {new Date().getFullYear()} LegiTech AI Pro. Todos los derechos reservados.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Component Helpers
const BenefitCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="p-8 bg-slate-900 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10 group">
        <div className="mb-4 p-3 bg-slate-800 rounded-lg inline-block group-hover:bg-slate-700 transition-colors">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400">{description}</p>
    </div>
);

const StepCard = ({ number, title, description }: { number: string, title: string, description: string }) => (
    <div className="relative p-8 bg-slate-800 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all">
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {number}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 mt-2">{title}</h3>
        <p className="text-slate-400">{description}</p>
    </div>
);

const UseCaseCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
        <div className="mb-3 p-2 bg-slate-800 rounded-lg inline-block">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
    </div>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="p-8 bg-slate-800 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10 group">
        <div className="mb-4 p-3 bg-slate-900 rounded-lg inline-block group-hover:bg-slate-700 transition-colors">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400">{description}</p>
    </div>
);

const TestimonialCard = ({ name, role, text }: { name: string, role: string, text: string }) => (
    <div className="p-8 bg-slate-800 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all">
        <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
        </div>
        <p className="text-slate-300 mb-6 italic">"{text}"</p>
        <div>
            <p className="text-white font-bold">{name}</p>
            <p className="text-slate-400 text-sm">{role}</p>
        </div>
    </div>
);

const PricingFeature = ({ text }: { text: string }) => (
    <div className="flex items-center text-slate-300">
        <Check className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
        <span>{text}</span>
    </div>
);

export default LandingPage;
