import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../index.css"
import LoginForm from "./components/LoginForm"
import LoginImageSide from "./components/LoginImageSide"



function Login() {

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-text-main-light dark:text-text-main-dark transition-colors duration-200">
            <div className="flex min-h-screen w-full overflow-hidden">
                <LoginForm />
                <LoginImageSide />
            </div>
        </div>
    )
}

export default Login