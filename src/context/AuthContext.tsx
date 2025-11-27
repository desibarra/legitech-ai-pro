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

    const fetchProfile = async (userId: string, email?: string, retries = 3): Promise<any> => {
        console.log(`Fetching profile for: ${userId} (Attempts left: ${retries})`);
        
        try {
            // Race the query against a 6s timeout to detect hanging
            const queryPromise = supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
                
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Request timeout")), 6000)
            );

            // @ts-ignore
            const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

            if (error) {
                // Handle "Row not found" (PGRST116) -> Create Profile
                if (error.code === 'PGRST116' && email) {
                    console.log("Profile missing, creating new profile...");
                    const { data: newProfile, error: insertError } = await supabase
                        .from('profiles')
                        .insert({ 
                            id: userId, 
                            email: email, 
                            role: 'user', 
                            full_name: email.split('@')[0] 
                        })
                        .select()
                        .single();
                    
                    if (insertError) throw insertError;
                    return newProfile;
                }
                throw error;
            }
            
            console.log("Profile found:", data);
            return data;

        } catch (err: any) {
            console.warn(`Profile fetch error (Attempt ${4 - retries}):`, err.message || err);

            // Retry on timeout or network error
            if (retries > 0) {
                console.log("Retrying profile fetch...");
                await new Promise(res => setTimeout(res, 1500));
                return fetchProfile(userId, email, retries - 1);
            }

            console.error("All profile fetch attempts failed.");
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
                        const userProfile = await fetchProfile(currentUser.id, currentUser.email);
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
