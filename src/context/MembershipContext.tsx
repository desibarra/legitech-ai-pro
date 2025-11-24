import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Membership {
    id: number;
    type: string;
    status: string;
    endDate: string;
}

interface MembershipContextProps {
    isMember: boolean;
    membership: Membership | null;
    activateMembership: (type?: string) => Promise<void>;
    checkStatus: () => Promise<void>;
    loading: boolean;
}

const MembershipContext = createContext<MembershipContextProps | undefined>(undefined);

export const MembershipProvider = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useAuth();
    const [isMember, setIsMember] = useState(false);
    const [membership, setMembership] = useState<Membership | null>(null);
    const [loading, setLoading] = useState(false);

    const checkStatus = async () => {
        if (!isAuthenticated) {
            setIsMember(false);
            setMembership(null);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/membership/status', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setIsMember(data.isMember);
            setMembership(data.membership);
        } catch (error) {
            console.error(error);
            setIsMember(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkStatus();
    }, [isAuthenticated]);

    const activateMembership = async (type = 'annual') => {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/membership/activate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ type }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        await checkStatus();
    };

    return (
        <MembershipContext.Provider value={{ isMember, membership, activateMembership, checkStatus, loading }}>
            {children}
        </MembershipContext.Provider>
    );
};

export const useMembership = () => {
    const context = useContext(MembershipContext);
    if (!context) throw new Error('useMembership must be used within MembershipProvider');
    return context;
};
