import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMembership } from '../context/MembershipContext';

const PricingPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { activateMembership } = useMembership();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            await activateMembership('annual');
            navigate('/app');
        } catch (error) {
            console.error(error);
            alert('Error al activar la suscripción');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Plan Anual</h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl text-center">
                Acceso completo a todas las funcionalidades de LegiTech AI Pro durante un año.
            </p>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Suscripción Anual</h2>
                <p className="text-4xl font-bold text-indigo-600 mb-4">$199 MXN / año</p>
                <ul className="text-left mb-6 space-y-2">
                    <li>✔️ Acceso ilimitado al dashboard</li>
                    <li>✔️ Auditorías en tiempo real</li>
                    <li>✔️ Reportes PDF/Excel</li>
                    <li>✔️ Soporte prioritario</li>
                </ul>

                {isAuthenticated ? (
                    <button
                        onClick={handleSubscribe}
                        disabled={loading}
                        className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Procesando...' : 'Comprar Ahora'}
                    </button>
                ) : (
                    <Link
                        to="/register"
                        className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        Registrarse para Comprar
                    </Link>
                )}
            </div>
        </div>
    );
};

export default PricingPage;
