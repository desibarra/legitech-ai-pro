import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import PricingPage from '../pages/PricingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AppDashboard from '../pages/AppDashboard';
import ProtectedRoute from './ProtectedRoute';

const AppRouter: React.FC = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/landing" replace />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Protected area */}
            <Route element={<ProtectedRoute />}> {/* wrapper */}
                <Route path="/app" element={<AppDashboard />} />
            </Route>
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
    </BrowserRouter>
);

export default AppRouter;
