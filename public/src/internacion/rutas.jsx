import { Routes, Route } from "react-router-dom"
import ProtectedRoute from "/ProtectedRoute"
import Internaciones from "./internaciones"
import AgregarInternado from "./agregarinternado"
import ModificarInternado from "./modificarinternado"
import IndicacionInternado from "./observaciones"


function RutasInternacion() {
    return (
        <Routes>
            <Route path="/internaciones" element={<ProtectedRoute allowedRoles={["Admin", "Veterinarios", "Secretarios"]}><Internaciones /></ProtectedRoute>} />
            <Route path="/internaciones/agregar" element={<ProtectedRoute allowedRoles={["Admin", "Veterinarios", "Secretarios"]}><AgregarInternado /></ProtectedRoute>} />
            <Route path="/internaciones/modificar/:id" element={<ProtectedRoute allowedRoles={["Admin", "Veterinarios", "Secretarios"]}><ModificarInternado /></ProtectedRoute>} />
            <Route path="/internaciones/observaciones/:id" element={<ProtectedRoute allowedRoles={["Admin", "Veterinarios"]}><IndicacionInternado /></ProtectedRoute>} />
        </Routes>
    )
}

export default RutasInternacion

