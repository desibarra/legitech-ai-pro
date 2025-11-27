import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Shield, Zap, Globe, Scale, FileText, Search, Lock, Star, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate('/app');
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading) return null; // Or a spinner

    return (
        <div className="min-h-screen w-full flex flex-col bg-slate-900 text-white font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center group">
                            <Scale className="h-8 w-8 text-blue-500 group-hover:text-blue-400 transition-colors" />
                            <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                                LegiTech AI Pro
                            </span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200">
                                Iniciar Sesión
                            </Link>
                            <Link to="/register" className="px-5 py-2.5 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 transform hover:scale-105 active:scale-95">
                                Comenzar Gratis
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* 1. Hero Section */}
            <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in">
                        <span className="block text-white mb-2">Inteligencia Artificial Legal</span>
                        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">
                            Que Trabaja Para Ti
                        </span>
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed px-4">
                        Genera contratos, analiza documentos y redacta textos legales en segundos. La herramienta que todo profesional del derecho necesita.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
                        <Link to="/register" className="group inline-flex items-center justify-center px-8 py-4 text-base sm:text-lg font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95">
                            Probar Gratis
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a href="#pricing" className="inline-flex items-center justify-center px-8 py-4 text-base sm:text-lg font-bold rounded-xl text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600 transition-all duration-200">
                            Ver Precios
                        </a>
                    </div>
                </div>
            </section>

            {/* 2. Benefits Section */}
            <section className="py-16 sm:py-20 bg-slate-800/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">¿Por Qué LegiTech AI Pro?</h2>
                        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto px-4 leading-relaxed">
                            Sabemos que abogados, contadores y asesores pierden horas en tareas repetitivas. Nosotros automatizamos lo tedioso para que te enfoques en lo estratégico.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
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

            {/* 3. How It Works */}
            <section className="py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Cómo Funciona</h2>
                        <p className="text-base sm:text-lg text-slate-400 px-4">Tres pasos simples para transformar tu práctica legal</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
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

            {/* 4. Use Cases */}
            <section className="py-16 sm:py-20 bg-slate-800/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Casos de Uso</h2>
                        <p className="text-base sm:text-lg text-slate-400 px-4">Soluciones para cada necesidad legal</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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

            {/* 5. Advanced Features */}
            <section className="py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Características Avanzadas</h2>
                        <p className="text-base sm:text-lg text-slate-400 px-4">Tecnología de punta para profesionales exigentes</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
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

            {/* 6. Trust Section */}
            <section className="py-16 sm:py-20 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Shield className="h-16 w-16 text-blue-400 mx-auto mb-6 animate-pulse" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 px-4">Creado Para Profesionales Que Necesitan Velocidad y Precisión</h2>
                    <p className="text-base sm:text-lg text-slate-300 leading-relaxed px-4">
                        LegiTech AI Pro es la herramienta de confianza para más de 5,000 abogados, contadores y asesores en América Latina.
                        Desarrollada por expertos en derecho y tecnología, nuestra plataforma combina inteligencia artificial de última generación
                        con conocimiento legal profundo para entregar resultados que cumplen los más altos estándares profesionales.
                    </p>
                </div>
            </section>

            {/* 7. Testimonials */}
            <section className="py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white">Lo Que Dicen Nuestros Usuarios</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
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
            <section id="pricing" className="py-16 sm:py-20 bg-slate-800/30">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Plan Único – $27 USD / mes</h2>
                        <p className="text-base sm:text-lg text-slate-400 px-4">Todo lo que necesitas para transformar tu práctica legal</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-3xl p-6 sm:p-8 md:p-12 border border-slate-700/50 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
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
                                <p className="text-slate-400 mb-6 text-sm sm:text-base px-4">Cancela cuando quieras, sin letra pequeña ni compromisos.</p>
                                <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 text-base sm:text-lg font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/40 hover:shadow-blue-600/60 transition-all duration-300 transform hover:scale-105 active:scale-95">
                                    Comenzar Ahora
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 9. Footer */}
            <footer className="bg-slate-900/50 border-t border-slate-800/50 py-10 sm:py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center">
                            <Scale className="h-6 w-6 text-slate-500" />
                            <span className="ml-2 text-slate-400 font-semibold">LegiTech AI Pro</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-slate-400">
                            <Link to="/" className="hover:text-white transition-colors duration-200">Inicio</Link>
                            <Link to="/register" className="hover:text-white transition-colors duration-200">Registro</Link>
                            <a href="#pricing" className="hover:text-white transition-colors duration-200">Precios</a>
                            <Link to="/privacy" className="hover:text-white transition-colors duration-200">Políticas de Privacidad</Link>
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

// Optimized Component Helpers
const BenefitCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="p-6 sm:p-8 bg-slate-900/50 rounded-2xl border border-slate-800/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group backdrop-blur-sm hover:-translate-y-1">
        <div className="mb-4 p-3 bg-slate-800/50 rounded-xl inline-block group-hover:bg-slate-700/50 transition-colors duration-200">
            {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">{description}</p>
    </div>
);

const StepCard = ({ number, title, description }: { number: string, title: string, description: string }) => (
    <div className="relative p-6 sm:p-8 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {number}
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 mt-2">{title}</h3>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">{description}</p>
    </div>
);

const UseCaseCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="p-5 sm:p-6 bg-slate-900/50 rounded-xl border border-slate-800/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 backdrop-blur-sm hover:-translate-y-1">
        <div className="mb-3 p-2 bg-slate-800/50 rounded-lg inline-block">
            {icon}
        </div>
        <h3 className="text-base sm:text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="p-6 sm:p-8 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group backdrop-blur-sm hover:-translate-y-1">
        <div className="mb-4 p-3 bg-slate-900/50 rounded-xl inline-block group-hover:bg-slate-700/50 transition-colors duration-200">
            {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">{description}</p>
    </div>
);

const TestimonialCard = ({ name, role, text }: { name: string, role: string, text: string }) => (
    <div className="p-6 sm:p-8 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
        <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
            ))}
        </div>
        <p className="text-sm sm:text-base text-slate-300 mb-6 italic leading-relaxed">"{text}"</p>
        <div>
            <p className="text-white font-bold text-sm sm:text-base">{name}</p>
            <p className="text-slate-400 text-xs sm:text-sm">{role}</p>
        </div>
    </div>
);

const PricingFeature = ({ text }: { text: string }) => (
    <div className="flex items-start text-slate-300">
        <Check className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
        <span className="text-sm sm:text-base leading-relaxed">{text}</span>
    </div>
);

export default LandingPage;
