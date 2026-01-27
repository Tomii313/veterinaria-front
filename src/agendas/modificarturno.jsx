import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
function ModificarTurno() {
    const { turnoId } = useParams()
    const navigate = useNavigate()
    const [turno, setTurno] = useState(null)
    const [fecha, setFecha] = useState("")
    const [hora, setHora] = useState("")
    const [veterinario, setVeterinario] = useState("")
    const [veterinarios, setVeterinarios] = useState([])
    const [horariosDisponibles, setHorariosDisponibles] = useState([])
    const accessToken = localStorage.getItem("access");



    useEffect(() => {
        if (!turnoId) return

        fetch(`${import.meta.env.VITE_API_URL}/turnos/${turnoId}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                setTurno(data)
                setVeterinario("")
                setFecha(data.fecha)
                setHora(data.hora)
            })

    }, [turnoId])




    const handleSubmit = async (e) => {
        e.preventDefault()


        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/turnos/${turnoId}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,

                },
                body: JSON.stringify({
                    fecha,
                    hora,
                    veterinario

                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    setTurno(data)
                })
                .catch(error => {
                    console.log(error)
                })
            navigate("/agenda")
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        if (!fecha || !turno) return

        fetch(`${import.meta.env.VITE_API_URL}/turnos/veterinarios_disponibles/?fecha=${fecha}`)
            .then(res => res.json())
            .then(data => {
                // 👇 protección clave
                if (!Array.isArray(data)) {
                    setVeterinarios([])
                    return
                }

                const vets = data.map(v => ({
                    id: v.id,
                    nombre: `Dr. ${v.nombre} ${v.apellido}`
                }))

                setVeterinarios(vets)
            })
            .catch(err => {
                console.error(err)
                setVeterinarios([])
            })
    }, [fecha, turno])


    useEffect(() => {
        if (!fecha) return

        fetch(`${import.meta.env.VITE_API_URL}/turnos/veterinarios_disponibles/?fecha=${fecha}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => {
                setVeterinarios(Array.isArray(data) ? data : [])
                setVeterinario("") // 🔥 OBLIGATORIO
            })
            .catch(() => setVeterinarios([]))
    }, [fecha])


    // 🔥 Este es el que te trae los horarios cuando elegís fecha y vet
    useEffect(() => {
        // Si no hay fecha o no elegiste veterinario, vaciamos los horarios
        if (!fecha || !veterinario) {
            setHorariosDisponibles([]);
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL}/turnos/horarios_disponibles/?veterinario_id=${veterinario}&fecha=${fecha}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => {
                setHorariosDisponibles(data);

                // Opcional: Si la hora que estaba antes no está en los nuevos horarios, la reseteamos
                if (!data.includes(hora)) {
                    setHora("");
                }
            })
            .catch(err => console.error("Error trayendo horarios:", err));
    }, [fecha, veterinario]); // 👈 Se ejecuta cuando cambia cualquiera de estos dos
    return (


        <div className="bg-[#f6f8f6] dark:bg-[#102216] text-[#111813] dark:text-white min-h-screen font-['Manrope',_sans-serif]">
            <form onSubmit={handleSubmit}>
                {/* TopNavBar */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e0e8e2] dark:border-[#1a3a24] bg-white dark:bg-[#0a140d] px-10 py-3 sticky top-0 z-50">
                    <Link to="/inicio">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-4 text-[#111813] dark:text-white">
                                <div className="size-8 text-[#13ec5b]">

                                    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 48 48">
                                        <path d="M8.57 8.57C5.52 11.62 3.45 15.51 2.6 19.74c-.84 4.23-.41 8.61 1.25 12.6 1.65 3.98 4.44 7.39 8.03 9.79 3.58 2.39 7.8 3.67 12.12 3.67s8.54-1.28 12.12-3.67c3.59-2.4 6.38-5.81 8.03-9.79 1.65-3.99 2.08-8.37 1.24-12.6-.84-4.23-2.91-8.12-5.96-11.17L24 24 8.57 8.57z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold leading-tight tracking-tight">VetManager </h2>
                            </div>

                        </div>
                    </Link>

                </header>

                <main className="max-w-6xl mx-auto px-6 py-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 mb-6">
                        <Link to="/inicio">
                            <a className="text-[#61896f] text-sm font-medium hover:text-[#13ec5b] transition-colors" href="#">Inicio</a>
                        </Link>
                        <span className="material-symbols-outlined text-xs text-[#61896f]">chevron_right</span>
                        <Link to="/agenda">
                            <a className="text-[#61896f] text-sm font-medium hover:text-[#13ec5b] transition-colors" href="#">Agenda</a>
                        </Link>
                        <span className="material-symbols-outlined text-xs text-[#61896f]">chevron_right</span>
                        <span className="text-[#111813] dark:text-white text-sm font-bold">Modificar Turno</span>
                    </nav>

                    {/* PageHeading */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-black leading-tight tracking-tight text-[#111813] dark:text-white">Modificar Fecha de Turno</h1>
                        <p className="text-[#61896f] text-lg mt-1">Ajuste la programación de la cita existente para el paciente.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Patient Context */}
                        <div className="lg:col-span-1 space-y-6 text-left">
                            <div className="bg-white dark:bg-[#0a140d] rounded-xl shadow-sm border border-[#e0e8e2] dark:border-[#1a3a24] overflow-hidden">
                                <div className="p-5 border-b border-[#e0e8e2] dark:border-[#1a3a24] bg-[#f6f8f6] dark:bg-[#102216]">
                                    <h3 className="font-bold text-[#111813] dark:text-white">Resumen de Cita</h3>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-6">

                                        <div>
                                            <p className="text-xl font-bold text-[#111813] dark:text-white">{turno?.nombre_animal}</p>
                                            <p className="text-sm text-[#61896f]">{turno?.raza_animal} ({turno?.edad_animal} años)</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-1">

                                            <span className="text-xs font-bold uppercase tracking-wider text-[#61896f]">Motivo</span>
                                            <p className="text-base font-medium">{turno?.motivo}</p>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-bold uppercase tracking-wider text-[#61896f]">Dueño</span>
                                            <p className="text-base font-medium">{turno?.duenio_nombre} {turno?.duenio_apellido}</p>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className={`px-2 py-1 text-xs font-bold rounded w-fit
    ${turno?.estado === "Cancelado"
                                                    ? "bg-red-100 text-red-800"
                                                    : turno?.estado === "Pendiente"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-green-100 text-green-800"
                                                }`}
                                            >
                                                {turno?.estado}
                                            </span>
                                        </div>
                                    </div>
                                    <hr className="my-6 border-[#e0e8e2] dark:border-[#1a3a24]" />
                                    <button className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-[#f6f8f6] dark:bg-[#1a3a24] text-[#111813] dark:text-white font-semibold text-sm hover:bg-[#13ec5b]/10 transition-colors">
                                        <span className="material-symbols-outlined text-sm">history</span>
                                        Ver Historial Clínico
                                    </button>
                                </div>
                            </div>
                            <div className="bg-[#13ec5b]/5 dark:bg-[#13ec5b]/10 p-5 rounded-xl border border-[#13ec5b]/20 flex gap-3">
                                <span className="material-symbols-outlined text-[#13ec5b]">info</span>
                                <p className="text-sm text-[#111813] dark:text-white">La reprogramación debe hacerse con al menos 24hs de antelación según las políticas de la clínica.</p>
                            </div>
                        </div>

                        {/* Right Column: Form */}
                        <div className="lg:col-span-2 space-y-6 text-left">
                            <div className="bg-white dark:bg-[#0a140d] rounded-xl shadow-sm border border-[#e0e8e2] dark:border-[#1a3a24] p-8">
                                {/* Section: Veterinarian */}
                                <div className="mb-10">
                                    <label className="block text-sm font-bold text-[#111813] dark:text-white mb-3">Veterinario Asignado</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-[#61896f]">person</span>
                                        </div>




                                        <select
                                            value={veterinario}
                                            onChange={e => setVeterinario(Number(e.target.value))}
                                            disabled={veterinarios.length === 0}
                                            className="w-full pl-10 pr-4 py-3 bg-[#f6f8f6] dark:bg-[#1a3a24] rounded-lg font-medium"
                                        >
                                            {veterinarios.length === 0 ? (
                                                <option value="">
                                                    No hay veterinarios disponibles para esta fecha
                                                </option>
                                            ) : (
                                                <>
                                                    <option value="">Seleccione un veterinario</option>
                                                    {veterinarios.map(vet => (
                                                        <option key={vet.id} value={vet.id}>
                                                            {vet.nombre}
                                                        </option>
                                                    ))}
                                                </>
                                            )}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-[#61896f]">expand_more</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Date & Time */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                    {/* Date Picker Mock */}
                                    <div>
                                        <label className="block text-sm font-bold text-[#111813] dark:text-white mb-4">Nueva Fecha</label>
                                        <div>


                                            <input
                                                type="date"
                                                value={fecha}
                                                onChange={e => setFecha(e.target.value)}
                                                className="w-full px-4 py-3 bg-[#f6f8f6] dark:bg-[#1a3a24] rounded-lg font-medium text-[#111813] dark:text-white"
                                            />

                                        </div>
                                    </div>

                                    {/* Time Picker Mock */}
                                    <div>

                                        <div>
                                            <label className="block text-sm font-bold text-[#111813] dark:text-white mb-4">
                                                Horarios Disponibles
                                            </label>

                                            <select
                                                value={hora}
                                                onChange={e => setHora(e.target.value)}
                                                className="w-full px-4 py-3 bg-[#f6f8f6] dark:bg-[#1a3a24] rounded-lg font-medium"
                                            >
                                                <option value="">Seleccione horario</option>

                                                {horariosDisponibles.map(h => (
                                                    <option key={h} value={h}>
                                                        {h}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>




                                {/* Footer Actions */}
                                <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#e0e8e2] dark:border-[#1a3a24]">
                                    <button className="px-6 py-3 text-sm font-bold text-[#61896f] hover:text-[#111813] dark:hover:text-white transition-colors">
                                        Cancelar
                                    </button>
                                    <button type="submit" className="px-8 py-3 bg-[#13ec5b] text-white font-bold rounded-lg shadow-lg shadow-[#13ec5b]/30 hover:brightness-105 active:scale-95 transition-all">
                                        Actualizar Turno
                                    </button>

                                </div>
                            </div>

                            {/* History log simple */}
                            <div className="p-4 bg-white/50 dark:bg-white/5 rounded-lg border border-dashed border-[#e0e8e2] dark:border-[#1a3a24]">
                                <div className="flex items-center gap-2 text-[#61896f] text-xs">
                                    <span className="material-symbols-outlined text-sm">schedule</span>

                                </div>

                            </div>

                        </div>

                    </div>

                </main>
            </form>
        </div >
    );





}

export default ModificarTurno
