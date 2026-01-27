import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("access");
    const userRol = localStorage.getItem("rol");

    // Si no hay token, al login de una
    if (!token) return <Navigate to="/" />;

    // Si no hay roles definidos para esta ruta, que pase cualquiera que esté logueado
    if (!allowedRoles) return children;

    // Si el rol del pibe no está en la lista, al inicio
    if (!allowedRoles.includes(userRol)) {
        return <Navigate to="/inicio" />;
    }

    return children;
}

export default ProtectedRoute;