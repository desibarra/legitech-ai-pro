import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">LegiTech AI Pro</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl text-center">
            Plataforma de cumplimiento normativo sectorial con IA. Monitorea, audita y gestiona riesgos legales y financieros.
        </p>
        <Link
            to="/pricing"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
            Comenzar
        </Link>
    </div>
);

export default LandingPage;
