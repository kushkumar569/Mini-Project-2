import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

function PrivateRoute({ allowedRoles }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/me`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    setIsAuthenticated(true);
                    setUserRole(data.user.role);
                } else {
                    setIsAuthenticated(false);
                }
            })
            .catch(() => setIsAuthenticated(false))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading...</div>;

    // Redirect if not authenticated or role mismatch
    if (!isAuthenticated || allowedRoles !== userRole) {
        return <Navigate to="/unauthorized" />;
    }

    return <><Outlet /></> ;
}

export default PrivateRoute;
