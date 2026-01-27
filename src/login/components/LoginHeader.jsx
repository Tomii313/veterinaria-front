import { useState } from "react"
import "../../index.css"

function LoginHeader() {

    return (

        <>

            {/* Logo */}
            <div className="mb-10 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary-dark dark:text-primary">
                    <span className="material-symbols-outlined text-3xl">pets</span>
                </div>
                <span className="text-2xl font-extrabold tracking-tight dark:text-white">
                    VetManager
                </span>
            </div>

            {/* Heading */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold leading-tight tracking-tight dark:text-white mb-2">
                    Iniciar Sesión
                </h1>
                <p className="text-text-sub-light dark:text-text-sub-dark text-base font-medium">
                    Bienvenido al portal de gestión veterinaria.
                </p>
            </div>

        </>

    )
}

export default LoginHeader