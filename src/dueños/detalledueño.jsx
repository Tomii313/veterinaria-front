import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

function DetalleDueño() {
    const accessToken = localStorage.getItem("access");
    const { id } = useParams()
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/duenios/${id}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setNombre(data.nombre)
                setApellido(data.apellido)
                setTelefono(data.telefono)
                setEmail(data.email)
                setDni(data.dni)
            })
    }, [id])

    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [telefono, setTelefono] = useState("")
    const [email, setEmail] = useState("")
    const [dni, setDni] = useState("")
    const Navigate = useNavigate()




    const handleSubmit = (e) => {
        e.preventDefault()

        fetch(`${import.meta.env.VITE_API_URL}/duenios/${id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                nombre,
                apellido,
                telefono,
                email,
                dni,
            })
        })
            .then(() => {
                Swal.fire({
                    title: "Buen trabajo!",
                    text: "El dueño ha sido editado con éxito!",
                    icon: "success"
                });
                Navigate("/dueños")
            })
    }
    return (
        <div className="bg-white text-[#111813] font-['Manrope',_sans-serif] min-h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 bg-white border-b border-solid border-[#e5e7eb] px-4 md:px-10 py-3 flex items-center justify-between whitespace-nowrap shadow-sm">
                <div className="flex items-center gap-4 md:gap-8">
                    <Link to="/dueños">
                        <div className="flex items-center gap-2 md:gap-4 text-[#111813]">

                            <div className="size-8 text-[#13ec5b]">
                                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 48 48">
                                    <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" />
                                </svg>
                            </div>
                            <h2 className="hidden md:block text-lg font-extrabold tracking-tight">VetManager</h2>

                        </div>
                    </Link>

                </div>
                <div className="flex flex-1 justify-end gap-4 md:gap-8 items-center">

                    <div className="flex gap-2">
                        <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-[#f0f4f2] text-[#111813] hover:bg-gray-200 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">notifications</span>
                        </button>
                        <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-[#f0f4f2] text-[#111813] hover:bg-gray-200 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">settings</span>
                        </button>
                    </div>

                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center py-8 px-4 md:px-10 lg:px-40 w-full max-w-[1200px] mx-auto">
                <div className="w-full text-left">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 pb-4 text-sm font-medium text-[#61896f]">
                        <a className="hover:text-[#13ec5b]" href="#">Inicio</a>
                        <span>/</span>
                        <Link to="/dueños">
                            <a className="hover:text-[#13ec5b]" href="#">Dueños</a>
                        </Link>
                        <span>/</span>
                        <span className="text-[#111813] font-bold">Editar Dueño</span>
                    </div>

                    {/* Page Header */}
                    <div className="pb-6 border-b border-[#e5e7eb] mb-8">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#111813]">Editar Dueño</h1>
                        <p className="text-[#61896f] text-base mt-1">Modifique los datos personales o de contacto.</p>
                    </div>

                    {/* Profile Overview Card */}
                    <div className="flex flex-col md:flex-row items-center gap-6 p-6 mb-8 bg-white rounded-3xl shadow-sm border border-[#e5e7eb]">
                        <div className="relative group cursor-pointer">

                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined text-white">edit</span>
                            </div>
                        </div>

                        <button className="bg-[#f0f4f2] hover:bg-[#eefdf3] hover:text-[#13ec5b] text-[#111813] font-bold py-2.5 px-6 rounded-xl transition-all text-sm border border-transparent hover:border-[#13ec5b]/30">
                            Ver Historial
                        </button>
                    </div>

                    {/* Form Section */}
                    <div className="bg-white rounded-3xl shadow-sm border border-[#e5e7eb] overflow-hidden mb-12">
                        <form onSubmit={handleSubmit} className="divide-y divide-[#e5e7eb]">
                            {/* Personal Data */}
                            <div className="p-8">
                                <h3 className="flex items-center gap-2 text-[#111813] text-lg font-black mb-8">
                                    <span className="material-symbols-outlined text-[#13ec5b]">person</span>
                                    Datos Personales
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Nombre</label>
                                        <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full rounded-2xl border border-slate-100 bg-[#f8fafc] px-5 py-3 text-[#111813] font-bold focus:ring-2 focus:ring-[#13ec5b]/20 outline-none transition-all" type="text" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Apellidos</label>
                                        <input value={apellido} onChange={(e) => setApellido(e.target.value)} className="w-full rounded-2xl border border-slate-100 bg-[#f8fafc] px-5 py-3 text-[#111813] font-bold focus:ring-2 focus:ring-[#13ec5b]/20 outline-none transition-all" type="text" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">DNI / Cédula</label>
                                        <input value={dni} onChange={(e) => setDni(e.target.value)} className="w-full rounded-2xl border border-slate-100 bg-[#f1f5f3] px-5 py-3 text-slate-400 font-bold cursor-not-allowed" readOnly />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Data */}
                            <div className="p-8">
                                <h3 className="flex items-center gap-2 text-[#111813] text-lg font-black mb-8">
                                    <span className="material-symbols-outlined text-[#13ec5b]">contact_phone</span>
                                    Información de Contacto
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Teléfono Móvil</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">smartphone</span>
                                            <input value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full rounded-2xl border border-slate-100 bg-[#f8fafc] pl-12 pr-5 py-3 text-[#111813] font-bold focus:ring-2 focus:ring-[#13ec5b]/20 outline-none transition-all" type="tel" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Correo Electrónico</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">mail</span>
                                            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-slate-100 bg-[#f8fafc] pl-12 pr-5 py-3 text-[#111813] font-bold focus:ring-2 focus:ring-[#13ec5b]/20 outline-none transition-all" type="email" />
                                        </div>
                                    </div>


                                </div>
                            </div>



                            {/* Form Actions */}
                            <div className="p-8 bg-[#f9fafb] flex flex-col md:flex-row justify-end gap-4">
                                <Link to="/dueños">
                                    <button className="px-8 py-3 rounded-2xl text-slate-500 font-black hover:text-slate-800 transition-colors uppercase tracking-widest text-xs" type="button">
                                        Cancelar
                                    </button>
                                </Link>
                                <button type="submit" className="px-10 py-4 rounded-2xl bg-[#13ec5b] text-white font-black hover:brightness-105 transition-all shadow-xl shadow-[#13ec5b]/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs active:scale-95">
                                    <span className="material-symbols-outlined text-[18px]">save</span>
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )



}

export default DetalleDueño