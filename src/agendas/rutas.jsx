import { Routes, Route } from "react-router-dom";
import Citas from "./agendas";
import ModificarTurno from "./modificarturno";
import ProtectedRoute from "/ProtectedRoute";

function RutasAgendas() {
    return (
        <Routes>
            <Route path="/agenda" element={<ProtectedRoute allowedRoles={["Admin", "Veterinarios", "Secretario_turnos", "Secretarios"]}><Citas /></ProtectedRoute>} />
            <Route path="/agenda/modificarturno/:turnoId" element={<ProtectedRoute allowedRoles={["Admin", "Veterinarios", "Secretario_turnos", "Secretarios"]}><ModificarTurno /></ProtectedRoute>} />
        </Routes>
    )
}

export default RutasAgendas
