
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";





function AgregarDuenio() {
    const accessToken = localStorage.getItem("access");
    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [telefono, setTelefono] = useState("")
    const [email, setEmail] = useState("")
    const [dni, setDni] = useState("")
    const Navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()



        const response = fetch(`${import.meta.env.VITE_API_URL}/duenios/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
            body: JSON.stringify({
                nombre,
                apellido,
                telefono,
                email,
                dni
            })



        }

        )
        Swal.fire({
            title: "Buen trabajo!",
            text: "El dueño ha sido creado con éxito!",
            icon: "success"
        });
        Navigate("/dueños")




    }
    return (
        <div className="bg-white text-[#111813] font-['Manrope',_sans-serif] min-h-screen flex flex-col">
            {/* Navegación Superior */}
            <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#f0f4f2] bg-white px-10 py-3 shadow-sm">
                <div className="flex items-center gap-8">
                    <Link to="/inicio">
                        <div className="flex items-center gap-4 text-[#111813]">

                            <div className="size-8 flex items-center justify-center text-[#13ec5b]">
                                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 48 48">
                                    <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-bold leading-tight tracking-tight">VetManager</h2>

                        </div>
                    </Link>
                    <nav className="hidden lg:flex items-center gap-9">

                    </nav>
                </div>

            </header>

            {/* Contenido Principal */}
            <main className="flex-1 flex flex-col items-center py-8 px-4 w-full max-w-[1200px] mx-auto">
                <form onSubmit={handleSubmit}>

                    {/* Cabecera de Página */}
                    <div className="w-full mb-8 text-left">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-sm font-bold text-[#61896f]">
                                    <Link to="/dueños">
                                        <span className="cursor-pointer hover:underline">Dueños</span>
                                    </Link>
                                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                                    <span className="text-[#13ec5b]">Nuevo</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight">Agregar Nuevo Dueño</h1>
                                <p className="text-[#61896f] text-base">Ingrese la información completa del cliente y registre sus mascotas iniciales.</p>
                            </div>
                            <div className="flex gap-3">

                                <Link to="/dueños">
                                    <button className="h-11 px-6 rounded-xl border border-slate-200 text-[#61896f] font-bold text-sm hover:bg-slate-50 transition-all">
                                        Cancelar
                                    </button>
                                </Link>

                                <button type="submit" className="flex items-center gap-2 h-11 px-6 bg-[#13ec5b] hover:bg-[#0fd14e] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#13ec5b]/20 transition-all active:scale-95">
                                    <span className="material-symbols-outlined text-[20px]">save</span>
                                    Guardar Dueño
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 w-full">

                        {/* Columna Izquierda: Información Personal */}
                        <div className="flex-1 text-left">
                            <section className="bg-white rounded-3xl border border-[#f0f4f2] shadow-sm p-8">
                                <div className="flex items-center gap-3 mb-8 border-b border-[#f0f4f2] pb-5">
                                    <div className="p-2 bg-[#eefdf3] rounded-xl text-[#13ec5b]">
                                        <span className="material-symbols-outlined">person</span>
                                    </div>
                                    <h3 className="text-xl font-bold">Información Personal</h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Nombre <span className="text-red-500">*</span></label>
                                        <input onChange={(e) => setNombre(e.target.value)} maxLength={50} className="w-full rounded-2xl border-slate-100 bg-[#f8fafc] text-slate-900 focus:ring-2 focus:ring-[#13ec5b]/20 h-12 px-5 placeholder:text-slate-300 font-bold outline-none transition-all" placeholder="Ej. Juan" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Apellido <span className="text-red-500">*</span></label>
                                        <input onChange={(e) => setApellido(e.target.value)} maxLength={50} className="w-full rounded-2xl border-slate-100 bg-[#f8fafc] text-slate-900 focus:ring-2 focus:ring-[#13ec5b]/20 h-12 px-5 placeholder:text-slate-300 font-bold outline-none transition-all" placeholder="Ej. Pérez" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest">DNI / Identificación</label>
                                            <input onChange={(e) => setDni(e.target.value)} maxLength={8} className="w-full rounded-2xl border-slate-100 bg-[#f8fafc] text-slate-900 focus:ring-2 focus:ring-[#13ec5b]/20 h-12 px-5 placeholder:text-slate-300 font-bold outline-none transition-all" placeholder="DNI" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Teléfono Móvil <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-4 top-3 text-slate-400 text-xl">call</span>
                                                <input onChange={(e) => setTelefono(e.target.value)} maxLength={15} className="w-full rounded-2xl border-slate-100 bg-[#f8fafc] text-slate-900 focus:ring-2 focus:ring-[#13ec5b]/20 h-12 pl-12 pr-5 placeholder:text-slate-300 font-bold outline-none transition-all" placeholder="341..." />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Correo Electrónico</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-3 text-slate-400 text-xl">mail</span>
                                            <input onChange={(e) => setEmail(e.target.value)} maxLength={50} className="w-full rounded-2xl border-slate-100 bg-[#f8fafc] text-slate-900 focus:ring-2 focus:ring-[#13ec5b]/20 h-12 pl-12 pr-5 placeholder:text-slate-300 font-bold outline-none transition-all" placeholder="juan.perez@email.com" type="email" />

                                        </div>

                                    </div>



                                </div>

                            </section>

                        </div>



                    </div>
                </form>

            </main >

        </div >

    )
}

export default AgregarDuenio