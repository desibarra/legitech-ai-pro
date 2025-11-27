import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMembership } from '../context/MembershipContext';

const ProtectedRoute = () => {
    const { isAuthenticated, profile, loading: authLoading } = useAuth();
    const { isMember, loading: membershipLoading } = useMembership();

    // 1. Wait for Auth to be ready
    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-legitech-accent"></div>
            </div>
        );
    }

    // 2. If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 3. Admin Bypass - Allow access immediately, ignoring membership status
    if (profile?.role === "admin") {
        return <Outlet />;
    }

    // 4. Wait for Membership to be ready (only for non-admins)
    if (membershipLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-legitech-accent"></div>
            </div>
        );
    }

    // 5. If not a member, redirect to pricing
    if (!isMember) {
        return <Navigate to="/pricing" replace />;
    }

    // 6. Allow access
    return <Outlet />;
};

export default ProtectedRoute;

export default ProtectedRoute;

export default ProtectedRoute;
