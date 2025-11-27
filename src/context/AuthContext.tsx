import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

interface AuthContextType {
    user: any;
    profile: any;
    loading: boolean;
    isAuthenticated: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId: string) => {
        console.log("Fetching profile for:", userId);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle();
            
            if (error) {
                console.warn('Error fetching profile:', error.message);
                return null;
            }
            console.log("Profile found:", data);
            return data;
        } catch (err) {
            console.error('Unexpected error fetching profile:', err);
            return null;
        }
    };

    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const currentUser = session?.user || null;
                
                if (mounted) {
                    setUser(currentUser);
                    if (currentUser) {
                        const userProfile = await fetchProfile(currentUser.id);
                        if (mounted) setProfile(userProfile);
                    } else {
                        if (mounted) setProfile(null);
                    }
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        initAuth();

        const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user || null;
            if (mounted) {
                // If session changes, we might need to show loading again if we want to be strict,
                // but usually onAuthStateChange is fast. However, for role security, let's be safe.
                if (currentUser?.id !== user?.id) {
                     setLoading(true);
                }
                
                setUser(currentUser);
                if (currentUser) {
                    const userProfile = await fetchProfile(currentUser.id);
                    if (mounted) setProfile(userProfile);
                } else {
                    if (mounted) setProfile(null);
                }
                if (mounted) setLoading(false);
            }
        });

        return () => {
            mounted = false;
            listener.subscription.unsubscribe();
        };
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        localStorage.clear();
    };

    const value: AuthContextType = {
        user,
        profile,
        loading,
        isAuthenticated: !!user,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be inside AuthProvider");
    return ctx;
};
