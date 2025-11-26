import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMembership } from "../context/MembershipContext";

const PricingPage: React.FC = () => {
    const { isAuthenticated, user, loading: authLoading } = useAuth();
    const { activateMembership } = useMembership();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const handleSubscribe = async () => {
        if (!user) {
            navigate("/register");
            return;
        }

        setLoading(true);

        try {
            await activateMembership("annual");
            navigate("/app");
        } catch (error: any) {
            console.error("Subscription Error:", error);
            alert(`Error al activar la suscripción: ${error.message || "Intente nuevamente"}`);
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
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Suscripción Anual
                </h2>
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
                        {loading ? "Procesando..." : "Comprar Ahora"}
                    </button>
                ) : (
                    <div className="space-y-3">
                        <Link
                            to="/login"
                            className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                            Iniciar Sesión para Comprar
                        </Link>
                        <p className="text-center text-sm text-gray-500">
                            ¿No tienes cuenta? <Link to="/register" className="text-indigo-600 hover:underline">Regístrate aquí</Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PricingPage;
