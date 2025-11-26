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
            console.error("Login Error:", err);
            let msg = err.message || "Credenciales inválidas";
            
            if (msg.includes("Failed to fetch")) {
                msg = "⚠️ Conexión bloqueada. Tu Antivirus o Firewall está impidiendo la conexión. Intenta desactivarlo temporalmente.";
            }
            
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4">
            <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-md rounded-xl p-8 shadow-2xl border border-white/10">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-legitech-primary rounded-xl">
                        {/* Assuming ShieldCheck is available or imported, otherwise just text */}
                        <span className="text-2xl font-bold text-white">LegiTech<span className="text-legitech-accent">AI</span></span>
                    </div>
                </div>
                
                <h2 className="text-3xl font-bold text-center mb-2 text-white">
                    Bienvenido
                </h2>
                <p className="text-center text-slate-400 mb-8">Ingresa a tu panel de control regulatorio</p>

                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded mb-4 text-center font-medium text-sm">
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Correo Electrónico</label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="ej. usuario@empresa.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-lg focus:ring-2 focus:ring-legitech-accent/50 focus:border-transparent text-white placeholder:text-slate-600 transition outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Contraseña</label>
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-lg focus:ring-2 focus:ring-legitech-accent/50 focus:border-transparent text-white placeholder:text-slate-600 transition outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-legitech-accent text-slate-900 font-bold rounded-lg hover:bg-legitech-accentHover transition disabled:opacity-50 shadow-lg shadow-legitech-accent/20 mt-2"
                    >
                        {loading ? "Autenticando..." : "Iniciar Sesión"}
                    </button>

                    <p className="text-center text-slate-500 mt-6 text-sm">
                        ¿Aún no tienes cuenta?{" "}
                        <Link to="/register" className="text-legitech-accent font-semibold hover:underline">
                            Solicitar Acceso
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
