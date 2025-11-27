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

    const fetchProfile = async (userId: string, email?: string) => {
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

            if (!data && email) {
                console.log("Profile missing, creating default admin profile for:", email);
                // Auto-create admin profile if missing
                const { data: newProfile, error: insertError } = await supabase
                    .from('profiles')
                    .insert({ 
                        id: userId, 
                        email: email, 
                        role: 'admin',
                        full_name: email.split('@')[0] 
                    })
                    .select()
                    .single();
                
                if (insertError) {
                    console.error("Error creating default profile:", insertError);
                    return null;
                }
                console.log("Created new profile:", newProfile);
                return newProfile;
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
            // Timeout safety mechanism
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Auth initialization timeout")), 8000)
            );

            const loadAuth = async () => {
                const { data: { session } } = await supabase.auth.getSession();
                const currentUser = session?.user || null;
                
                if (mounted) {
                    setUser(currentUser);
                    if (currentUser) {
                        const userProfile = await fetchProfile(currentUser.id, currentUser.email);
                        if (mounted) setProfile(userProfile);
                    } else {
                        if (mounted) setProfile(null);
                    }
                }
            };

            try {
                await Promise.race([loadAuth(), timeoutPromise]);
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
                if (currentUser?.id !== user?.id) {
                     setLoading(true);
                }
                
                setUser(currentUser);
                if (currentUser) {
                    const userProfile = await fetchProfile(currentUser.id, currentUser.email);
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
