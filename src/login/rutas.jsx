import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "/ProtectedRoute";
import Login from "./login";

function RutasLogin() {
    return (

        <Routes>
            <Route path="/" element={<Login />} />
        </Routes>

    )
}

export default RutasLogin
