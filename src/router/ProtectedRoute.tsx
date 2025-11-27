import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useMembership } from "@/context/MembershipContext";
import LoadingSpinner from "@/components/LoadingSpinner";

const ProtectedRoute = () => {
  const { isAuthenticated, authLoading, profile } = useAuth();
  const { membership, membershipLoading } = useMembership();

  // 1) Esperando autenticación
  if (authLoading) return <LoadingSpinner />;

  // 2) No autenticado → login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // 3) ADMIN → entrada inmediata sin esperar membresía
  if (profile?.role === "admin") {
    return <Outlet />;
  }

  // 4) Usuarios normales: esperar membresía
  if (membershipLoading) return <LoadingSpinner />;

  // 5) Sin membresía → pricing
  if (!membership) return <Navigate to="/pricing" replace />;

  // 6) Acceso permitido
  return <Outlet />;
};

export default ProtectedRoute;
