import "../../index.css"
import { useState } from "react"

function LoginImageSide() {
    return (
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-50"
                style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAyMjV7Sf00EHdolNgUw4GW9MQbsSAtUqIcdclMlIa3c0r94pKq3f-OfFg9h5CK8vKIcdiH2j-iL-QKDimUF7b3RyEnhycgoVGyyxp9end2H72o0OsDOGw93713NTDDa53T2CzHk75z90__4zU7-_xHUnlAzfpckl0FO2y5JC5stNQ0uFdpb5xyqQr0Udjd1cb0mgAIa0ofRiKa7mzzq1hN9u8BRzGVSMVhGg0Pla9uFoOd_FSTxgUkx3bq47x1x80gBHbngAJjNQ")'
                }}
            />
            <div className="relative z-10 p-12 text-center max-w-lg text-white">
                <h2 className="text-3xl font-bold mb-4">
                    Gestión Clínica Inteligente
                </h2>
                <p className="text-lg">
                    Administra pacientes, citas e inventario.
                </p>
            </div>
        </div>
    )
}

export default LoginImageSide