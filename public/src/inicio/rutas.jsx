import { Routes, Route } from "react-router-dom"
import Inicio from "./pages/inicio"
import ProtectedRoute from "/ProtectedRoute"

function RutasInicio() {
    return (
        <Routes>
            <Route path="/inicio" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />
        </Routes>
    )
}

export default RutasInicio