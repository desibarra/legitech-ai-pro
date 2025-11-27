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
        
        // Define the query promise
        const queryPromise = async () => {
             const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle();
             
             if (error) throw error;
             return data;
        };

        // Define a timeout promise (4s)
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Profile query timeout")), 4000)
        );

        try {
            // Race them to prevent hanging
            // @ts-ignore
            const data = await Promise.race([queryPromise(), timeoutPromise]);
            
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
                    // If insert fails, still return a mock admin profile for the admin email
                    if (email === 'crecesonline@gmail.com') {
                        return { id: userId, email, role: 'admin' };
                    }
                    return null;
                }
                console.log("Created new profile:", newProfile);
                return newProfile;
            }

            console.log("Profile found:", data);
            return data;
        } catch (err) {
            console.error('Error or timeout fetching profile:', err);
            // Fallback for admin on timeout/error
            if (email === 'crecesonline@gmail.com') {
                 console.warn("Returning emergency admin profile due to error/timeout");
                 return { id: userId, email, role: 'admin' };
            }
            return null;
        }
    };

    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            // Timeout safety mechanism (reduced to 5s)
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Auth initialization timeout")), 5000)
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
                return currentUser;
            };

            try {
                await Promise.race([loadAuth(), timeoutPromise]);
            } catch (error) {
                console.error("Auth initialization error:", error);
                // Fallback: If timeout occurs but we have a session in local storage or memory (which loadAuth might have set before hanging on profile)
                // Actually, if loadAuth hangs on fetchProfile, setUser might have been called.
                // Let's check if we can recover for admin.
                if (mounted) {
                    // Try to get user from supabase synchronously-ish if possible, or just check if user state was set
                    // But we can't access 'user' state immediately here as it's a closure.
                    // We can try to get session again quickly?
                    const { data: { session } } = await supabase.auth.getSession(); 
                    if (session?.user?.email === 'crecesonline@gmail.com') {
                        console.warn("Emergency admin override activated due to timeout");
                        setUser(session.user);
                        setProfile({ id: session.user.id, email: session.user.email, role: 'admin' });
                    }
                }
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
