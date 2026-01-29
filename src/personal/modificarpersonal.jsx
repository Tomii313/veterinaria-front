import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"


function ModificarPersonal() {
    const [personal, setPersonal] = useState({})
    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [dni, setDni] = useState("")
    const [telefono, setTelefono] = useState("")
    const [email, setEmail] = useState("")
    const [nacimiento, setNacimiento] = useState("")
    const [horarios, setHorarios] = useState({
        Lunes: { id: null, activo: false, inicio: "", fin: "" },
        Martes: { id: null, activo: false, inicio: "", fin: "" },
        Miercoles: { id: null, activo: false, inicio: "", fin: "" },
        Jueves: { id: null, activo: false, inicio: "", fin: "" },
        Viernes: { id: null, activo: false, inicio: "", fin: "" },
        Sabado: { id: null, activo: false, inicio: "", fin: "" },
        Domingo: { id: null, activo: false, inicio: "", fin: "" },
    })
    const actualizarHorario = (dia, campo, valor) => {
        setHorarios(prev => ({
            ...prev,
            [dia]: {
                ...prev[dia],
                [campo]: valor,
            }
        }))
    }

    const accessToken = localStorage.getItem("access")

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/personal/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => {
                setPersonal(data)
            })
    }, [])


    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/veterinarios/${id}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => {
                setNombre(data.nombre)
                setApellido(data.apellido)
                setDni(data.dni)
                setTelefono(data.telefono)
                /* setEmail(data.email) */
                setNacimiento(data.nacimiento)
            })
        fetch(`${import.meta.env.VITE_API_URL}/horarios/?veterinario=${id}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                const copia = { ...horarios }

                data.forEach(h => {
                    copia[h.dias] = {
                        id: h.id,
                        activo: true,
                        inicio: h.hora_inicio,
                        fin: h.hora_fin,
                    }
                })

                setHorarios(copia)
            })
    }, [id])




    const handleSubmit = async (e) => {
        e.preventDefault()

        // Veterinario
        const response = await fetch(`${import.meta.env.VITE_API_URL}/veterinarios/${id}/`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
            body: JSON.stringify({
                nombre,
                apellido,
                dni,
                telefono,
                nacimiento
            })
        })

        // Horarios
        for (const [dia, h] of Object.entries(horarios)) {
            if (h.activo) {
                if (h.id) {
                    // Ya existe → PATCH
                    await fetch(`${import.meta.env.VITE_API_URL}/horarios/${h.id}/`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify({
                            dias: dia,
                            hora_inicio: h.inicio,
                            hora_fin: h.fin,
                        }),
                    });
                } else {
                    // No existe → POST
                    await fetch(`${import.meta.env.VITE_API_URL}/horarios/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify({
                            veterinario: id,
                            dias: dia,
                            hora_inicio: h.inicio,
                            hora_fin: h.fin,
                        }),
                    });
                }
            }
        }



        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(Object.values(errorData)[0][0])
        }

        Swal.fire({
            icon: 'success',
            title: 'Veterinario actualizado',
            showConfirmButton: false,
            timer: 1500
        })

        navigate("/personal")

            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message,
                    showConfirmButton: false,
                    timer: 1500
                })
            })


    }


    return (
        <div className="flex h-screen w-full overflow-hidden bg-white font-['Manrope',_sans-serif] text-[#111813]">
            {/* Sidebar Lateral */}
            <aside className="hidden w-64 flex-col border-r border-[#e5e7eb] bg-white lg:flex">
                <div className="flex h-full flex-col justify-between p-4">
                    <div className="flex flex-col gap-6">
                        {/* Logo / Brand */}
                        <Link to="/inicio">
                            <div className="flex items-center gap-3 px-2 text-left">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#13ec5b]/20 text-[#13ec5b]">
                                    <span className="material-symbols-outlined text-3xl">pets</span>
                                </div>
                                <div className="flex flex-col text-left">
                                    <h1 className="text-base font-bold leading-tight text-[#111813]">VetManager</h1>

                                </div>
                            </div>
                        </Link>
                        {/* Navegación Sidebar */}

                    </div>
                    {/* Perfil Inferior */}

                </div>
            </aside>

            {/* Área de Contenido Principal */}
            <div className="flex flex-1 flex-col overflow-y-auto bg-[#f8fafc]">
                {/* Top Navbar */}


                <main className="flex-1 p-4 md:p-8 lg:px-12 xl:px-16 text-left">
                    <div className="mx-auto max-w-5xl">
                        {/* Breadcrumbs */}
                        <nav className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-400">
                            <Link to="/inicio">
                                <a className="hover:text-[#13ec5b]" href="#">Inicio</a>
                            </Link>
                            <span className="material-symbols-outlined text-base font-normal">chevron_right</span>
                            <Link to="/personal">
                                <a className="hover:text-[#13ec5b]" href="#">Personal</a>
                            </Link>
                            <span className="material-symbols-outlined text-base font-normal">chevron_right</span>
                            <span className="text-[#111813]">Editar Veterinario</span>
                        </nav>

                        {/* Title & Actions */}
                        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start text-left">
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Editar Veterinario</h1>
                                <p className="mt-2 text-slate-500 font-medium">Actualice la información del perfil, especialidad y disponibilidad horaria.</p>
                            </div>
                            <button className="flex items-center gap-2 rounded-xl border border-red-100 bg-white px-5 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-all shadow-sm">
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                <span>Eliminar</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-8 text-left">
                            {/* Profile Card */}
                            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                                <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center">
                                    <div className="relative group cursor-pointer">
                                        {/*  <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-[#f8fafc] shadow-lg">
                                            <img src="" alt="Dr" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                        </div> */}
                                        {/*  <div className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#13ec5b] text-white shadow-lg">
                                            <span className="material-symbols-outlined text-xl"></span>
                                        </div> */}
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-2xl font-black text-slate-900 mb-1">Dr {nombre} {apellido}</h3>

                                        {/*  <button className="rounded-xl bg-slate-50 px-6 py-2.5 text-sm font-black text-slate-600 hover:bg-[#eefdf3] hover:text-[#13ec5b] transition-all border border-slate-100">
                                            Cambiar Foto
                                        </button> */}
                                    </div>
                                </div>
                            </div>

                            {/* Information Grid */}
                            <div className="flex flex-col gap-8">
                                {/* Personal Info */}
                                <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                                    <div className="mb-8 flex items-center gap-3 border-b border-slate-50 pb-4 text-left">
                                        <span className="material-symbols-outlined text-[#13ec5b] text-[28px]">person</span>
                                        <h3 className="text-xl font-bold text-slate-800">Información Personal</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div className="text-left">
                                                <label className="mb-2 block text-[11px] font-black text-slate-400 uppercase tracking-widest">Nombre</label>
                                                <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full rounded-2xl border-none bg-slate-50 px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-[#13ec5b]/20" type="text" defaultValue="Juan" maxLength={50} />
                                            </div>
                                            <div className="text-left">
                                                <label className="mb-2 block text-[11px] font-black text-slate-400 uppercase tracking-widest">Apellidos</label>
                                                <input value={apellido} onChange={(e) => setApellido(e.target.value)} className="w-full rounded-2xl border-none bg-slate-50 px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-[#13ec5b]/20" type="text" defaultValue="Pérez García" maxLength={50} />
                                            </div>
                                        </div>

                                        <div className="text-left">
                                            <label className="mb-2 block text-[11px] font-black text-slate-400 uppercase tracking-widest">Teléfono</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-3 material-symbols-outlined text-[20px] text-slate-400">call</span>
                                                <input value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full rounded-2xl border-none bg-slate-50 pl-12 pr-5 py-3 text-sm font-bold focus:ring-2 focus:ring-[#13ec5b]/20" type="tel" defaultValue="+34 600 123 456" maxLength={15} />
                                            </div>

                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">DNI / Cédula</label>
                                            <input value={dni} onChange={(e) => setDni(e.target.value)} className="w-full rounded-2xl border border-slate-100 bg-[#f1f5f3] px-5 py-3 text-slate-400 font-bold cursor-not-allowed" readOnly />
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Info */}

                            </div>

                            {/* HORARIOS LABORALES */}
                            {Object.entries(horarios).map(([dia, h]) => (
                                <div key={dia} className="bg-white p-4 rounded-2xl shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-black text-slate-700 text-sm">{dia}</span>
                                        <input
                                            type="checkbox"
                                            checked={h.activo}
                                            onChange={e => actualizarHorario(dia, "activo", e.target.checked)}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="time"
                                            value={h.inicio}
                                            disabled={!h.activo}
                                            onChange={e => actualizarHorario(dia, "inicio", e.target.value)}
                                            className="flex-1 bg-slate-50 rounded-xl px-2 py-2 text-xs font-bold"
                                        />
                                        <span>-</span>
                                        <input
                                            type="time"
                                            value={h.fin}
                                            disabled={!h.activo}
                                            onChange={e => actualizarHorario(dia, "fin", e.target.value)}
                                            className="flex-1 bg-slate-50 rounded-xl px-2 py-2 text-xs font-bold"
                                        />
                                    </div>
                                </div>
                            ))}


                            {/* Botones Finales */}
                            <div className="mt-4 flex items-center justify-end gap-4 text-left">
                                <Link to="/personal">
                                    <button className="px-8 py-3 text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">
                                        Cancelar
                                    </button>
                                </Link>
                                <button type="submit" className="rounded-2xl bg-[#13ec5b] px-10 py-3.5 text-xs font-black text-white shadow-xl shadow-[#13ec5b]/20 hover:bg-[#0eb545] transition-all active:scale-95 uppercase tracking-widest">
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default ModificarPersonal