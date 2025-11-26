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
            }

            navigate("/pricing");

        } catch (err: any) {
            setError(err.message || "Error al crear la cuenta");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-100 px-4">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-xl border border-white/40 rounded-2xl p-10">

                <h2 className="text-center text-3xl font-extrabold text-slate-900 mb-3">
                    Crear Cuenta
                </h2>
                <p className="text-center text-slate-500 mb-6">
                    Únete y empieza a usar la plataforma
                </p>

                {error && (
                    <div className="bg-rose-100 text-rose-700 p-3 rounded-md mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        name="name"
                        type="text"
                        placeholder="Nombre completo"
                        required
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg"
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Correo electrónico"
                        required
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg"
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Contraseña"
                        required
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-lg"
                    >
                        {loading ? "Creando cuenta..." : "Registrarse"}
                    </button>
                </form>

                <p className="text-center text-slate-600 mt-6">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="text-indigo-600 font-semibold">
                        Iniciar sesión
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default RegisterPage;
