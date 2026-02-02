import { Routes, Route } from "react-router-dom"
import InventarioSuministros from "./inventario"
import ProtectedRoute from "/ProtectedRoute"
import AgregarProducto from "./agregarproducto"
import EditarProducto from "./editarproducto"



function RutasInventario() {
    return (
        <Routes>
            <Route path="/inventario" element={<ProtectedRoute allowedRoles={["Admin"]}><InventarioSuministros /></ProtectedRoute>} />
            <Route path="/inventario/agregar" element={<ProtectedRoute allowedRoles={["Admin"]}><AgregarProducto /></ProtectedRoute>} />
            <Route path="/inventario/editar/:id" element={<ProtectedRoute allowedRoles={["Admin"]}><EditarProducto /></ProtectedRoute>} />
        </Routes>
    )
}

export default RutasInventario  