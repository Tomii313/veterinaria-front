import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"



function añadirVeterinario() {

    const [horarios, setHorarios] = useState({
        Lunes: { activo: true, inicio: "09:00", fin: "18:00" },
        Martes: { activo: true, inicio: "09:00", fin: "18:00" },
        Miercoles: { activo: false, inicio: "", fin: "" },
        Jueves: { activo: false, inicio: "", fin: "" },
        Viernes: { activo: false, inicio: "", fin: "" },
        Sabado: { activo: false, inicio: "", fin: "" },
        Domingo: { activo: false, inicio: "", fin: "" },
    })

    const actualizarHorario = (dia, campo, valor) => {
        setHorarios(prev => ({
            ...prev,
            [dia]: {
                ...prev[dia],
                [campo]: valor
            }
        }))
    }

    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [dni, setDni] = useState("")
    const [telefono, setTelefono] = useState("")
    const [fechaNacimiento, setFechaNacimiento] = useState("")
    const [page, setPage] = useState(1)
    const navigate = useNavigate()
    const accessToken = localStorage.getItem("access")


    const handleSubmit = (e) => {
        e.preventDefault()

        fetch(`${import.meta.env.VITE_API_URL}/veterinarios/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
            body: JSON.stringify({
                nombre,
                apellido,
                dni,
                telefono,
                fecha_nacimiento: fechaNacimiento
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log("Veterinario guardado:", data)
                crearHorarios(data.id)   // 🔥 ACÁ SE CREAN LOS HORARIOS
                navigate("/personal")
            })
            .catch(err => {
                console.error("Error:", err)
            })
    }
    const crearHorarios = (veterinarioId) => {
        Object.entries(horarios).forEach(([dia, data]) => {
            if (!data.activo) return

            fetch(`${import.meta.env.VITE_API_URL}/horarios/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,

                },
                body: JSON.stringify({
                    dias: dia,
                    hora_inicio: data.inicio,
                    hora_fin: data.fin,
                    veterinario: veterinarioId
                })
            })
                .then(res => res.json())

                .then(data => console.log("Horario creado:", data))
            navigate("/personal")
        })
    }
    return (
        <div className="flex h-screen w-full overflow-hidden bg-white font-['Manrope',_sans-serif] text-[#111813]">
            {/* Sidebar Lateral */}
            <aside className="w-64 hidden lg:flex flex-col bg-white border-r border-[#e5e7eb] h-full flex-shrink-0 transition-colors duration-200">
                <div className="p-6">
                    <Link to="/personal">
                        <div className="flex items-center gap-3 mb-8 text-left">
                            <div className="bg-[#13ec5b]/20 rounded-full size-10 flex items-center justify-center text-[#13ec5b]">
                                <span className="material-symbols-outlined text-2xl">pets</span>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-base font-bold leading-tight">VetManager</h1>

                            </div>

                        </div>
                    </Link>
                    <nav className="flex flex-col gap-2 text-left">
                        <Link to="/inicio">
                            <a className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#61896f] hover:bg-[#f0f4f2] hover:text-[#111813] transition-all" href="#">
                                <span className="material-symbols-outlined">dashboard</span>
                                <span className="text-sm font-bold">Inicio</span>
                            </a>
                        </Link>

                        <Link to="/personal">
                            <a className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#eefdf3] text-[#13ec5b]" href="#">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stethoscope</span>
                                <span className="text-sm font-black">Veterinarios</span>
                            </a>
                        </Link>
                    </nav>

                </div>

            </aside >

            {/* Área de Contenido Principal */}
            < main className="flex-1 h-full overflow-y-auto bg-[#f8fafc]" >
                <form onSubmit={handleSubmit}>
                    <div className="container mx-auto px-6 py-8 max-w-5xl text-left">

                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 mb-6 text-sm font-bold text-[#61896f]">
                            <a className="hover:text-[#13ec5b]" href="#">Inicio</a>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <a className="hover:text-[#13ec5b]" href="#">Personal</a>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <span className="text-[#111813]">Agregar Veterinario</span>
                        </div>

                        {/* Cabecera */}
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#111813]">Agregar Nuevo Veterinario</h1>
                            <p className="text-[#61896f] text-base font-medium mt-1">Complete la información para registrar un nuevo especialista en el sistema.</p>
                        </div>

                        {/* Formulario Principal */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-12">

                            {/* Sección Foto de Perfil */}
                            <div className="p-8 border-b border-slate-50">
                                {/* <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="relative group cursor-pointer">
                                        <div className="h-32 w-32 rounded-full border-4 border-[#f8fafc] shadow-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                                            <span className="material-symbols-outlined text-slate-300 text-5xl">person</span>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="material-symbols-outlined text-white">photo_camera</span>
                                        </div>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h3 className="text-xl font-black text-slate-800">Foto de Perfil</h3>
                                        <p className="text-[#61896f] text-sm mb-4 font-medium">Suba una foto profesional (JPG o PNG). Máx 2MB.</p>
                                        <div className="flex gap-3 justify-center md:justify-start">
                                            <button className="px-5 py-2.5 bg-[#f0f4f2] text-slate-700 text-sm font-black rounded-xl hover:bg-[#eefdf3] hover:text-[#13ec5b] transition-all">
                                                Subir Imagen
                                            </button>
                                            <button className="px-5 py-2.5 text-red-500 text-sm font-bold rounded-xl hover:bg-red-50 transition-all">
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div> */}
                            </div>


                            {/* Campos del Formulario */}
                            <div className="p-8 space-y-10">



                                {/* Información Profesional */}

                                <div className="text-left">
                                    <h4 className="text-slate-800 font-black text-lg mb-6 flex items-center gap-2 uppercase tracking-widest text-[11px]">
                                        <span className="material-symbols-outlined text-[#13ec5b] text-[20px]">id_card</span>
                                        Información Profesional
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="flex flex-col gap-2 text-left">
                                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Nombre<span className="text-red-500">*</span></label>
                                            <input onChange={(e) => setNombre(e.target.value)} className="w-full rounded-2xl border-slate-100 bg-[#f8fafc] h-12 px-5 font-bold focus:ring-2 focus:ring-[#13ec5b]/20 outline-none transition-all" placeholder="Juan" />
                                        </div>
                                        <div className="flex flex-col gap-2 text-left">
                                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Apellido<span className="text-red-500">*</span></label>
                                            <input onChange={(e) => setApellido(e.target.value)} className="w-full rounded-2xl border-slate-100 bg-[#f8fafc] h-12 px-5 font-bold focus:ring-2 focus:ring-[#13ec5b]/20 outline-none transition-all" placeholder="Perez" />
                                        </div>
                                        <div className="flex flex-col gap-2 text-left">
                                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">DNI<span className="text-red-500">*</span></label>
                                            <input onChange={(e) => setDni(e.target.value)} className="w-full rounded-2xl border-slate-100 bg-[#f8fafc] h-12 px-5 font-bold focus:ring-2 focus:ring-[#13ec5b]/20 outline-none transition-all" placeholder="DNI" />
                                        </div>


                                    </div>
                                </div>

                                {/* Contacto */}
                                <div className="text-left">
                                    <h4 className="text-slate-800 font-black text-lg mb-6 flex items-center gap-2 uppercase tracking-widest text-[11px]">
                                        <span className="material-symbols-outlined text-[#13ec5b] text-[20px]">contact_mail</span>
                                        Contacto
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                        {/*  <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Correo Electrónico <span className="text-red-500">*</span></label>
                                        <input className="w-full rounded-2xl border-slate-100 bg-[#f8fafc] h-12 px-5 font-bold focus:ring-2 focus:ring-[#13ec5b]/20 outline-none transition-all" placeholder="juan.perez@clinica.com" type="email" />
                                    </div> */}
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Teléfono Móvil</label>
                                            <input onChange={(e) => setTelefono(e.target.value)} className="w-full rounded-2xl border-slate-100 bg-[#f8fafc] h-12 px-5 font-bold focus:ring-2 focus:ring-[#13ec5b]/20 outline-none transition-all" placeholder="+54 9 .." type="tel" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Fecha de Nacimiento</label>
                                            <input onChange={(e) => setFechaNacimiento(e.target.value)} className="w-full rounded-2xl border-slate-100 bg-[#f8fafc] h-12 px-5 font-bold focus:ring-2 focus:ring-[#13ec5b]/20 outline-none transition-all" placeholder="dd/mm/yyyy" type="date" />
                                        </div>
                                    </div>
                                </div>

                                {/* Horario Laboral */}
                                <div className="text-left">
                                    <h4 className="text-slate-800 font-black text-lg mb-6 flex items-center gap-2 uppercase tracking-widest text-[11px]">
                                        <span className="material-symbols-outlined text-[#13ec5b] text-[20px]">schedule</span>
                                        Horario Laboral
                                    </h4>

                                    <div className="bg-[#f8fafc] rounded-3xl border border-slate-50 p-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">

                                            {/* Lunes */}
                                            <div className="bg-white p-4 rounded-2xl shadow-sm">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="font-black text-slate-700 text-sm">Lunes</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={horarios.Lunes.activo}
                                                        onChange={e => actualizarHorario("Lunes", "activo", e.target.checked)}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="time"
                                                        value={horarios.Lunes.inicio}
                                                        onChange={e => actualizarHorario("Lunes", "inicio", e.target.value)}
                                                        className="flex-1 bg-slate-50 rounded-xl px-2 py-2 text-xs font-bold"
                                                    />
                                                    <span>-</span>
                                                    <input
                                                        type="time"
                                                        value={horarios.Lunes.fin}
                                                        onChange={e => actualizarHorario("Lunes", "fin", e.target.value)}
                                                        className="flex-1 bg-slate-50 rounded-xl px-2 py-2 text-xs font-bold"
                                                    />
                                                </div>
                                            </div>

                                            {/* Martes */}
                                            <div className="bg-white p-4 rounded-2xl shadow-sm">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="font-black text-slate-700 text-sm">Martes</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={horarios.Martes.activo}
                                                        onChange={e => actualizarHorario("Martes", "activo", e.target.checked)}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="time"
                                                        value={horarios.Martes.inicio}
                                                        onChange={e => actualizarHorario("Martes", "inicio", e.target.value)}
                                                        className="flex-1 bg-slate-50 rounded-xl px-2 py-2 text-xs font-bold"
                                                    />
                                                    <span>-</span>
                                                    <input
                                                        type="time"
                                                        value={horarios.Martes.fin}
                                                        onChange={e => actualizarHorario("Martes", "fin", e.target.value)}
                                                        className="flex-1 bg-slate-50 rounded-xl px-2 py-2 text-xs font-bold"
                                                    />
                                                </div>
                                            </div>

                                            {/* Miércoles */}
                                            <div className="bg-white p-4 rounded-2xl shadow-sm">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="font-black text-slate-700 text-sm">Miércoles</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={horarios.Miercoles.activo}
                                                        onChange={e => actualizarHorario("Miercoles", "activo", e.target.checked)}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="time"
                                                        value={horarios.Miercoles.inicio}
                                                        onChange={e => actualizarHorario("Miercoles", "inicio", e.target.value)}
                                                        className="flex-1 bg-slate-50 rounded-xl px-2 py-2 text-xs font-bold"
                                                    />
                                                    <span>-</span>
                                                    <input
                                                        type="time"
                                                        value={horarios.Miercoles.fin}
                                                        onChange={e => actualizarHorario("Miercoles", "fin", e.target.value)}
                                                        className="flex-1 bg-slate-50 rounded-xl px-2 py-2 text-xs font-bold"
                                                    />
                                                </div>
                                            </div>

                                            {/* Jueves */}
                                            <div className="bg-white p-4 rounded-2xl shadow-sm">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="font-black text-slate-700 text-sm">Jueves</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={horarios.Jueves.activo}
                                                        onChange={e => actualizarHorario("Jueves", "activo", e.target.checked)}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="time"
                                                        value={horarios.Jueves.inicio}
                                                        onChange={e => actualizarHorario("Jueves", "inicio", e.target.value)}
                                                        className="flex-1 bg-slate-50 rounded-xl px-2 py-2 text-xs font-bold"
                                                    />
                                                    <span>-</span>
                                                    <input
                                                        type="time"
                                                        value={horarios.Jueves.fin}
                                                        onChange={e => actualizarHorario("Jueves", "fin", e.target.value)}
                                                        className="flex-1 bg-slate-50 rounded-xl px-2 py-2 text-xs font-bold"
                                                    />
                                                </div>
                                            </div>

                                            {/* Viernes */}
                                            <div className="bg-white p-4 rounded-2xl shadow-sm">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="font-black text-slate-700 text-sm">Viernes</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={horarios.Viernes.activo}
                                                        onChange={e => actualizarHorario("Viernes", "activo", e.target.checked)}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="time"
                                                        value={horarios.Viernes.inicio}
                                                        onChange={e => actualizarHorario("Viernes", "inicio", e.target.value)}
                                                        className="flex-1 bg-slate-50 rounded-xl px-2 py-2 text-xs font-bold"
                                                    />
                                                    <span>-</span>
                                                    <input
                                                        type="time"
                                                        value={horarios.Viernes.fin}
                                                        onChange={e => actualizarHorario("Viernes", "fin", e.target.value)}
                                                        className="flex-1 bg-slate-50 rounded-xl px-2 py-2 text-xs font-bold"
                                                    />
                                                </div>
                                            </div>

                                            {/* Sábado */}
                                            <div className="bg-white p-4 rounded-2xl shadow-sm">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="font-black text-slate-700 text-sm">Sábado</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={horarios.Sabado.activo}
                                                        onChange={e => actualizarHorario("Sabado", "activo", e.target.checked)}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="time"
                                                        value={horarios.Sabado.inicio}
                                                        onChange={e => actualizarHorario("Sabado", "inicio", e.target.value)}
                                                        className="flex-1 bg-slate-50 rounded-xl px-2 py-2 text-xs font-bold"
                                                    />
                                                    <span>-</span>
                                                    <input
                                                        type="time"
                                                        value={horarios.Sabado.fin}
                                                        onChange={e => actualizarHorario("Sabado", "fin", e.target.value)}
                                                        className="flex-1 bg-slate-50 rounded-xl px-2 py-2 text-xs font-bold"
                                                    />
                                                </div>
                                            </div>

                                            {/* Domingo */}
                                            <div className="bg-white p-4 rounded-2xl shadow-sm">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="font-black text-slate-700 text-sm">Domingo</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={horarios.Domingo.activo}
                                                        onChange={e => actualizarHorario("Domingo", "activo", e.target.checked)}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="time"
                                                        value={horarios.Domingo.inicio}
                                                        onChange={e => actualizarHorario("Domingo", "inicio", e.target.value)}
                                                        className="flex-1 bg-slate-50 rounded-xl px-2 py-2 text-xs font-bold"
                                                    />
                                                    <span>-</span>
                                                    <input
                                                        type="time"
                                                        value={horarios.Domingo.fin}
                                                        onChange={e => actualizarHorario("Domingo", "fin", e.target.value)}
                                                        className="flex-1 bg-slate-50 rounded-xl px-2 py-2 text-xs font-bold"
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Barra de Acciones */}
                            <div className="bg-white border-t border-slate-50 p-8 flex flex-col-reverse sm:flex-row justify-end gap-4 text-left">
                                <Link to="/personal">
                                    <button className="px-8 h-12 rounded-2xl text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-700 transition-all">
                                        Cancelar
                                    </button>
                                </Link>
                                <button type="submit" className="px-10 h-12 rounded-2xl bg-[#13ec5b] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-[#13ec5b]/20 hover:bg-[#0fb847] active:scale-95 transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[20px]">check</span>
                                    Guardar Veterinario
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest pb-12">
                            © 2024 VetManager System. Todos los derechos reservados.
                        </div>
                    </div>
                </form>
            </main >
        </div >
    )
}

export default añadirVeterinario