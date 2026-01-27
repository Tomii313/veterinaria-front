import Personal from "./personal"
import { Routes, Route } from "react-router-dom"
import ProtectedRoute from "/ProtectedRoute"
import ModificarPersonal from "./modificarpersonal"
import AñadirVeterinario from "./añadirveterinario"


function RutasPersonal() {
    return (
        <Routes>
            <Route
                path="/personal"
                element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <Personal />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/personal/modificar/:id"
                element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <ModificarPersonal />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/personal/añadir"
                element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <AñadirVeterinario />
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}


export default RutasPersonal