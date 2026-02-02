import { Routes, Route } from "react-router-dom";
import Dueños from "./dueños";
import ProtectedRoute from "/ProtectedRoute";
import AgregarDueño from "./agregardueño";
import DetalleDueño from "./detalledueño";
function RutasDueños() {
    return (
        <Routes>
            <Route path="/dueños" element={<ProtectedRoute allowedRoles={["Admin", "Veterinarios", "Secretario_turnos", "Secretarios"]}><Dueños /></ProtectedRoute>} />
            <Route path="/dueños/agregar" element={<ProtectedRoute allowedRoles={["Admin", "Veterinarios", "Secretarios"]}><AgregarDueño /></ProtectedRoute>} />
            <Route path="/dueños/detalle/:id" element={<ProtectedRoute allowedRoles={["Admin", "Veterinarios", "Secretario_turnos", "Secretarios"]}><DetalleDueño /></ProtectedRoute>} />
        </Routes>
    )
}

export default RutasDueños