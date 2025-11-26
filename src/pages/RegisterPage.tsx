import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: { data: { name: formData.name } }
            });

            if (signUpError) throw signUpError;

            if (data.session) {
                localStorage.setItem("token", data.session.access_token);
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/pricing");
            } else {
                // Caso: Confirmación de correo requerida
                setError("✅ Cuenta creada. Por favor verifica tu correo electrónico para continuar.");
                // Opcional: Redirigir al login después de unos segundos
                setTimeout(() => navigate("/login"), 5000);
            }

        } catch (err: any) {
            console.error("Registration Error:", err);
            let msg = err.message || "Error al crear la cuenta";
            
            // Detección específica de bloqueo por Antivirus/Firewall (Kaspersky injects traffic.js)
            if (msg.includes("Failed to fetch")) {
                msg = "⚠️ Conexión bloqueada. Tu Antivirus (Kaspersky/Avast) o AdBlocker está impidiendo la conexión con Supabase. Intenta desactivarlo temporalmente o agrega este sitio a excepciones.";
            }
            
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4">
            <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-md shadow-2xl border border-white/10 rounded-xl p-8">

                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-legitech-primary rounded-xl">
                        <span className="text-2xl font-bold text-white">LegiTech<span className="text-legitech-accent">AI</span></span>
                    </div>
                </div>

                <h2 className="text-center text-3xl font-bold text-white mb-2">
                    Crear Cuenta
                </h2>
                <p className="text-center text-slate-400 mb-8">
                    Únete y empieza a usar la plataforma
                </p>

                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded mb-4 text-center font-medium text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nombre Completo</label>
                        <input
                            name="name"
                            type="text"
                            placeholder="Tu nombre"
                            required
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-lg focus:ring-2 focus:ring-legitech-accent/50 focus:border-transparent text-white placeholder:text-slate-600 transition outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Correo Electrónico</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="ej. usuario@empresa.com"
                            required
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-lg focus:ring-2 focus:ring-legitech-accent/50 focus:border-transparent text-white placeholder:text-slate-600 transition outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Contraseña</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-lg focus:ring-2 focus:ring-legitech-accent/50 focus:border-transparent text-white placeholder:text-slate-600 transition outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-legitech-accent text-slate-900 font-bold rounded-lg hover:bg-legitech-accentHover transition disabled:opacity-50 shadow-lg shadow-legitech-accent/20 mt-2"
                    >
                        {loading ? "Creando cuenta..." : "Registrarse"}
                    </button>
                </form>

                <p className="text-center text-slate-500 mt-6 text-sm">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="text-legitech-accent font-semibold hover:underline">
                        Iniciar sesión
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default RegisterPage;
