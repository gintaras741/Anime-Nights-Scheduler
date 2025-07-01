import { useAuth } from "@/AuthContext";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

export default function ProtectedRoute({
    children,
    allowedRoles,
}: {
    children: ReactNode;
    allowedRoles: string[];
}) {
    const { isAuthenticated, role, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <h1>Loading...</h1>;
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        return <h1>Access Denied</h1>;
    }
    return children;
}
