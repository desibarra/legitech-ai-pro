import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMembership } from '../context/MembershipContext';

const ProtectedRoute = () => {
    const { isAuthenticated, profile, loading: authLoading } = useAuth();
    const { isMember, loading: membershipLoading } = useMembership();

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-legitech-accent"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // PRIORIDAD 1: ADMIN
    if (profile?.role === "admin") {
        return <Outlet />;
    }

    // PRIORIDAD 2: USUARIO NORMAL
    if (membershipLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-legitech-accent"></div>
            </div>
        );
    }

    if (!isMember) {
        return <Navigate to="/pricing" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
