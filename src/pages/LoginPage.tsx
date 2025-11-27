import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Redirect if already authenticated and not loading
    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            navigate("/app");
        }
    }, [isAuthenticated, authLoading, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleMagicLink = async () => {
        if (!formData.email) {
            setError("Ingresa tu correo primero.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email: formData.email,
                options: {
                    emailRedirectTo: "https://legitech-ai-pro.vercel.app/app"
                }
            });
            if (error) throw error;
            setError("✅ ¡Enlace enviado! Revisa tu correo (y spam) para entrar.");
        } catch (err: any) {
            console.error("Magic Link Error:", err);
            setError(err.message || "Error al enviar enlace mágico");
        } finally {
            setLoading(false);
        }
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

            // Force session refresh to ensure AuthContext picks it up
            await supabase.auth.refreshSession();

            // Guardar token y usuario (opcional, ya que AuthContext lo maneja)
            localStorage.setItem("token", data.session.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Navigation is handled by the useEffect above when auth state updates
        } catch (err: any) {
            console.error("Login Error:", err);
            let msg = err.message || "Credenciales inválidas";
            
            if (msg.includes("Failed to fetch")) {
                msg = "⚠️ Conexión bloqueada. Tu Antivirus o Firewall está impidiendo la conexión. Intenta desactivarlo temporalmente.";
            }
            
            setError(msg);
            setLoading(false); // Only stop loading on error, success waits for redirect
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

                    {/* Admin Bypass / Magic Link Button */}
                    {(formData.email === "crecesonline@gmail.com" || error.includes("Credenciales")) && (
                        <button
                            type="button"
                            onClick={handleMagicLink}
                            disabled={loading}
                            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg mt-4 border border-white/20"
                        >
                            {loading ? "Enviando..." : "🔑 Ingresar con Enlace Mágico (Sin Password)"}
                        </button>
                    )}

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
