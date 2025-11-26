console.log("📌 ENV DEBUG:", {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
});
import { createClient } from '@supabase/supabase-js';

// ⚠️ Importar variables de entorno correctas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// 🔐 Validación opcional (no rompe build)
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Supabase no está configurado correctamente.");
    console.warn("Faltan variables en el archivo .env:");
    console.warn(" VITE_SUPABASE_URL");
    console.warn(" VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
