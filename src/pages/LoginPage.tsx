import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { data, error: loginError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (loginError) throw loginError;
            if (!data.session) throw new Error("No se pudo iniciar sesión");

            // Guardar token y usuario
            localStorage.setItem("token", data.session.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate("/app");
        } catch (err: any) {
            setError(err.message || "Credenciales inválidas");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-xl p-8 shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                    Iniciar Sesión
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center font-medium">
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="Correo electrónico"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {loading ? "Ingresando..." : "Entrar"}
                    </button>

                    <p className="text-center text-gray-600 mt-4">
                        ¿Aún no tienes cuenta?{" "}
                        <Link to="/register" className="text-indigo-600 font-semibold">
                            Regístrate aquí
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
