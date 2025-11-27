import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

interface AuthContextType {
    user: any;
    profile: any;
    loading: boolean;
    authLoading: boolean;
    isAuthenticated: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrCreateProfile = async (currentUser: any) => {
        if (!currentUser) return null;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        try {
            // 1. Try to fetch existing profile
            const { data: existingProfile, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentUser.id)
                .maybeSingle()
                .abortSignal(controller.signal);

            if (fetchError) {
                console.error("Error fetching profile:", fetchError.message);
                return null;
            }

            if (existingProfile) {
                return existingProfile;
            }

            // 2. If no profile, create one
            console.log("Profile missing, creating new user profile...");
            const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert({
                    id: currentUser.id,
                    email: currentUser.email,
                    role: 'user',
                    full_name: currentUser.email?.split('@')[0] || 'User'
                })
                .select()
                .single()
                .abortSignal(controller.signal);

            if (insertError) {
                console.error("Error creating profile:", insertError.message);
                return null;
            }

            return newProfile;

        } catch (err: any) {
            if (err.name === 'AbortError') {
                console.error("Profile fetch aborted due to timeout");
            } else {
                console.error("Unexpected error in profile handling:", err);
            }
            return null;
        } finally {
            clearTimeout(timeoutId);
        }
    };

    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            try {
                // Step 1: Get User
                const { data: { user: currentUser }, error } = await supabase.auth.getUser();
                
                if (error) {
                    console.warn("Error checking auth session:", error.message);
                }

                if (mounted) {
                    setUser(currentUser);
                    
                    if (currentUser) {
                        // Step 2-4: Fetch or Create Profile
                        const userProfile = await fetchOrCreateProfile(currentUser);
                        if (mounted) setProfile(userProfile);
                    } else {
                        if (mounted) setProfile(null);
                    }
                }
            } catch (err) {
                console.error("Auth initialization failed:", err);
            } finally {
                // Step 5: Always release loading
                if (mounted) setLoading(false);
            }
        };

        initAuth();

        const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user || null;
            
            if (mounted) {
                setUser(currentUser);
                
                if (currentUser) {
                    const userProfile = await fetchOrCreateProfile(currentUser);
                    if (mounted) setProfile(userProfile);
                } else {
                    if (mounted) setProfile(null);
                }
                setLoading(false); 
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
        authLoading: loading,
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
