import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMembership } from '../context/MembershipContext';

/**
 * ProtectedRoute checks authentication and membership status.
 * - If loading → show spinner
 * - If not authenticated → redirect to /login
 * - If authenticated but not a member → redirect to /pricing
 * - If both satisfied → render the requested component via <Outlet />
 */
const ProtectedRoute = () => {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const { isMember, loading: membershipLoading } = useMembership();

    if (authLoading || membershipLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    if (!isMember) {
        return <Navigate to="/pricing" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;
