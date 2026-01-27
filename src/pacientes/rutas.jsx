import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "/ProtectedRoute";
import Pacientes from "./pages/pacientes";
import AgregarPaciente from "./pages/agregar";
import ActualizarPaciente from "./pages/actualizar";
import DetallePaciente from "./pages/detalle";

function RutasPacientes() {
    return (

        <Routes>
            <Route path="/pacientes" element={<ProtectedRoute allowedRoles={["Admin", "Veterinarios", "Secretarios"]}><Pacientes /></ProtectedRoute>} />
            <Route path="/pacientes/agregar" element={<ProtectedRoute allowedRoles={["Admin", "Veterinarios", "Secretarios"]}><AgregarPaciente /></ProtectedRoute>} />
            <Route path="/pacientes/actualizar/:id" element={<ProtectedRoute allowedRoles={["Admin", "Veterinarios", "Secretarios"]}><ActualizarPaciente /></ProtectedRoute>} />
            <Route path="/pacientes/detalle/:id" element={<ProtectedRoute allowedRoles={["Admin", "Veterinarios", "Secretarios"]}><DetallePaciente /></ProtectedRoute>} />

        </Routes>

    )
}

export default RutasPacientes
