import { Routes, Route } from "react-router-dom"
import Estudios from "./estudios"
import ProtectedRoute from "/ProtectedRoute"
import SubirInforme from "./subirinforme"
export default function EstudiosRoutes() {
    return (
        <Routes>
            <Route path="/estudios" element={<ProtectedRoute allowedRoles={["Admin", "Secretarios"]}><Estudios /></ProtectedRoute>} />
            <Route path="/estudios/subir" element={<ProtectedRoute allowedRoles={["Admin", "Secretarios"]}><SubirInforme /></ProtectedRoute>} />
        </Routes>
    )
}   