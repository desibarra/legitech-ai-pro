import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RootRedirect: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (isAuthenticated) {
                navigate('/app');
            } else {
                navigate('/landing');
            }
        }
    }, [isAuthenticated, loading, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );
};

export default RootRedirect;
