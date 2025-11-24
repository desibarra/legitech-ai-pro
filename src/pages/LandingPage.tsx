import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Shield, Zap, Globe, Scale } from 'lucide-react';

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
                                    Login
                                </Link>
                                <Link to="/register" className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105">
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
                <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0">
                    <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                        <span className="block text-white">Legal Intelligence</span>
                        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">
                            Reimagined for the Future
                        </span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-400 mb-10">
                        Automate legal research, draft documents instantly, and get AI-powered insights with the most advanced legal tech platform.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/register" className="group flex items-center px-8 py-4 text-lg font-bold rounded-full text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-500/25 transition-all transform hover:scale-105">
                            Start Free Trial
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/pricing" className="flex items-center px-8 py-4 text-lg font-bold rounded-full text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all">
                            View Pricing
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="py-20 bg-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white sm:text-4xl">Why Choose LegiTech?</h2>
                        <p className="mt-4 text-lg text-slate-400">Built for modern law firms and independent practitioners.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="h-8 w-8 text-yellow-400" />}
                            title="Lightning Fast Analysis"
                            description="Process thousands of documents in seconds using our advanced AI engine."
                        />
                        <FeatureCard
                            icon={<Shield className="h-8 w-8 text-green-400" />}
                            title="Bank-Grade Security"
                            description="Your client data is encrypted and protected with enterprise-level security standards."
                        />
                        <FeatureCard
                            icon={<Globe className="h-8 w-8 text-purple-400" />}
                            title="Global Jurisdiction"
                            description="Access legal databases and precedents from over 50 countries instantly."
                        />
                    </div>
                </div>
            </div>

            {/* Pricing Preview */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-16 border border-slate-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="text-left">
                                <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your practice?</h2>
                                <ul className="space-y-3">
                                    <ListItem text="Unlimited AI Queries" />
                                    <ListItem text="Document Automation" />
                                    <ListItem text="24/7 Priority Support" />
                                </ul>
                            </div>
                            <div className="flex-shrink-0">
                                <Link to="/register" className="inline-block px-8 py-4 text-lg font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all transform hover:scale-105">
                                    Join Pro Membership
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 border-t border-slate-800 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <Scale className="h-6 w-6 text-slate-500" />
                        <span className="ml-2 text-slate-400 font-semibold">LegiTech AI Pro</span>
                    </div>
                    <div className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} LegiTech AI Pro. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="p-8 bg-slate-900 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10 group">
        <div className="mb-4 p-3 bg-slate-800 rounded-lg inline-block group-hover:bg-slate-700 transition-colors">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400">{description}</p>
    </div>
);

const ListItem = ({ text }: { text: string }) => (
    <li className="flex items-center text-slate-300">
        <Check className="h-5 w-5 text-blue-400 mr-2" />
        {text}
    </li>
);

export default LandingPage;
