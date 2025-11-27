import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";

interface Membership {
    id: string;
    user_id: string;
    type: string;
    status: string;
    start_date: string | null;
    end_date: string | null;
}

interface MembershipContextType {
    membership: Membership | null;
    isMember: boolean;
    loading: boolean;
    refreshMembership: () => Promise<void>;
    activateMembership: (type?: string) => Promise<void>;
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

export const MembershipProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [membership, setMembership] = useState<Membership | null>(null);
    const [loading, setLoading] = useState(false);

    // 🔄 Obtener membresía desde Supabase
    const refreshMembership = async () => {
        if (!user) {
            setMembership(null);
            return;
        }

        setLoading(true);

        const { data, error } = await supabase
            .from("memberships")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();

        if (error) {
            console.error("Membership error:", error.message);
            setMembership(null);
        } else {
            setMembership(data);
        }

        setLoading(false);
    };

    // 🚀 Activar membresía
    const activateMembership = async (type: string = "annual") => {
        if (!user) throw new Error("User not logged in.");

        setLoading(true);

        try {
            // Crear o actualizar registro
            const { data, error } = await supabase
                .from("memberships")
                .upsert({
                    user_id: user.id,
                    type,
                    status: "active",
                    start_date: new Date().toISOString(),
                    end_date: null
                }, { onConflict: 'user_id' })
                .select()
                .single();

            if (error) throw error;

            setMembership(data);
        } catch (error: any) {
            console.error("Activate Membership Error:", error);
            // Si el error es por duplicado (aunque upsert debería manejarlo), lo ignoramos si ya existe
            if (error.code === '23505') { // unique_violation
                 await refreshMembership();
            } else {
                throw error;
            }
        } finally {
            setLoading(false);
        }
    };

    // Refrescar cuando el usuario cambie
    useEffect(() => {
        refreshMembership();
    }, [user]);

    return (
        <MembershipContext.Provider
            value={{
                membership,
                isMember: !!membership && membership.status === "active",
                loading,
                refreshMembership,
                activateMembership
            }}
        >
            {children}
        </MembershipContext.Provider>
    );
};

export const useMembership = () => {
    const context = useContext(MembershipContext);
    if (!context) throw new Error("useMembership must be used within MembershipProvider");
    return context;
};
