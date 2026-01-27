export async function logout(navigate) {
    const refresh = localStorage.getItem("refresh");
    const access = localStorage.getItem("access");

    try {
        if (refresh && access) {
            await fetch(`${import.meta.env.VITE_API_URL}/logout/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                },
                body: JSON.stringify({ refresh })
            });
        }
    } catch (e) {
        console.log("Error en backend logout", e);
    }

    //El clear borra rol, permisos, todo
    localStorage.clear();
    navigate("/");
}