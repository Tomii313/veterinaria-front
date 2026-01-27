import { useState } from "react"
import { useNavigate } from "react-router-dom"
import LoginHeader from "./LoginHeader"
import "../../index.css"

function LoginForm() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",

                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                })
            })
            const data = await response.json()
            if (response.ok) {
                localStorage.clear(); // Limpiamos basura

                localStorage.setItem("access", data.access);
                localStorage.setItem("refresh", data.refresh);

                // USAMOS LA INFO REAL DEL BACKEND
                localStorage.setItem("rol", data.rol);
                localStorage.setItem("is_superuser", String(data.is_superuser));
                localStorage.setItem("permisos", JSON.stringify(data.permisos));

                navigate("/inicio");


                // Guardá también el is_superuser si lo vas a usar
                localStorage.setItem("is_superuser", data.is_superuser ? "true" : "false");

                navigate("/inicio");

            } else {
                alert("Credenciales incorrectas")
            }
        } catch (error) {
            console.log(error)
            alert("Error al iniciar sesión")
        }
    }

    return (

        <>
            <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 py-12 lg:px-20 xl:px-32 bg-surface-light dark:bg-surface-dark z-10">
                <div className="mx-auto w-full max-w-[480px]"></div>
                <LoginHeader />

                {/* Form */}
                <form
                    className="flex flex-col gap-6"
                    onSubmit={handleSubmit}
                >

                    {/* Username */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="username"
                            className="text-sm font-semibold"
                        >
                            Usuario o Correo
                        </label>
                        <input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            placeholder="ej. doctor@vetmanager.com"
                            className="form-input w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 p-[15px]"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="password"
                            className="text-sm font-semibold"
                        >
                            Contraseña
                        </label>

                        <div className="flex rounded-lg border border-border-light dark:border-border-dark">
                            <input
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Ingrese su contraseña"
                                className="flex-1 h-14 p-[15px] bg-transparent outline-none"
                            />
                            <button
                                type="button"
                                className="px-4 text-text-sub-light hover:text-primary"
                            >
                                <span className="material-symbols-outlined">visibility</span>
                            </button>
                        </div>
                    </div>

                    {/* Forgot */}
                    <div className="flex justify-end">
                        <a
                            href="#"
                            className="text-sm font-semibold text-text-sub-light hover:text-primary"
                        >
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="h-12 rounded-lg bg-primary hover:bg-primary-dark font-bold"
                    >
                        Acceder al Sistema
                    </button>

                </form>


            </div>
        </>

    )
}

export default LoginForm