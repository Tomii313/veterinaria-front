import { useState } from "react"
import { Link } from "react-router-dom"
import { useEffect } from "react"
import { logout } from "/utils/logout";
import { useNavigate } from "react-router-dom";


function Inicio() {
    const [citasProximas, setCitasProximas] = useState([])
    const [turnosFecha, setTurnosFecha] = useState([])
    const [internados, setInternados] = useState([])
    const [countInternados, setCountInternados] = useState([])
    const [permisos, setPermisos] = useState([])

    const canViewInventario = permisos.includes("inventario.view_producto")
    /* const canViewPersonal = permisos.includes("personal.view_personal") */
    const canViewPersonal = permisos.includes("veterinarios.view_veterinario")
    const canViewDueños = permisos.includes("duenios.view_duenio")
    const canViewPacientes = permisos.includes("animales.view_animal")
    const canViewAgenda = permisos.includes("turnos.view_turno")
    const canViewInternaciones = permisos.includes("internacion.view_internacion")
    const navigate = useNavigate()
    const acciones = [
        { to: "/dueños/agregar", icon: "person_add", label: "Registrar Cliente", color: "text-blue-600", bg: "bg-blue-50" },
        { to: "/inventario/", icon: "add_shopping_cart", label: "Inventario", color: "text-green-600", bg: "bg-green-50" },
        /* { to: "/labs/subir", icon: "upload_file", label: "Subir Labs", color: "text-purple-600", bg: "bg-purple-50" }, */
        { to: "/internaciones/", icon: "emergency", label: "Internaciones", color: "text-orange-600", bg: "bg-orange-50" },
    ]
    const accessToken = localStorage.getItem("access")


    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/internaciones/internaciones_activas/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setCountInternados(data)
            })
    })
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/permisos/`, {

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            }
        })
            .then(response => response.json())
            .then(data => {
                setPermisos(data)
            })
    }, [])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/veterinarios/turnos_fecha/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => setTurnosFecha(data))
    }, [])


    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/veterinarios/citas_proximas/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => setCitasProximas(data))
    }, [])

    function confirmarTurno(turnoId) {
        Swal.fire({
            title: "Confirmado!",
            text: "El turno ha sido confirmado.",
            icon: "success"
        });
        fetch(`${import.meta.env.VITE_API_URL}/turnos/${turnoId}/confirmar_turno/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(() => {
                // refrescar turnos
                fetch(`${import.meta.env.VITE_API_URL}/turnos?fecha=${fechaSeleccionada}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,

                    },
                })
                    .then(res => res.json())
                    .then(data => setTurnos(data.results ?? data))
            })
            .catch(error => console.error('Error:', error))
    }

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/animales/internados/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => setInternados(data))
    }, [])
    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#f6f8f6] font-['Manrope',_sans-serif] text-[#111813]">
            {/* Sidebar / Menú Lateral */}
            <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white hidden md:flex flex-col justify-between h-full">
                <div className="flex flex-col h-full">
                    {/* Brand / Logo */}
                    <div className="p-6">
                        <div className="flex gap-3 items-center">
                            <div className="flex items-center justify-center rounded-full size-10 bg-[#13ec5b]/20 text-[#0fb847]">
                                <span className="material-symbols-outlined">pets</span>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-base font-bold leading-none">VetManager</h1>

                            </div>
                        </div>
                    </div>

                    {/* Navegación */}
                    <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                        <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#13ec5b]/10 text-[#0fb847] font-medium transition-colors" href="#">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                            <span>Resumen</span>
                        </a>
                        <Link to="/agenda">
                            {canViewAgenda && (
                                <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#61896f] hover:bg-gray-100 hover:text-[#111813] font-medium transition-colors" href="#">
                                    <span className="material-symbols-outlined">calendar_today</span>
                                    <span>Agenda</span>
                                </a>
                            )}
                        </Link>

                        <Link to="/pacientes">
                            {canViewPacientes && (
                                <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#61896f] hover:bg-gray-100 hover:text-[#111813] font-medium transition-colors" href="#">
                                    <span className="material-symbols-outlined">pet_supplies</span>
                                    <span>Pacientes</span>
                                </a>
                            )}
                        </Link>
                        <Link to="/dueños">
                            {canViewDueños && (
                                <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#61896f] hover:bg-gray-100 hover:text-[#111813] font-medium transition-colors" href="#">
                                    <span className="material-symbols-outlined">people</span>
                                    <span>Dueños</span>
                                </a>
                            )}
                        </Link>
                        <Link to="/internaciones">
                            {canViewInternaciones && (
                                <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#61896f] hover:bg-gray-100 hover:text-[#111813] font-medium transition-colors" href="#">
                                    <span className="material-symbols-outlined">medical_services</span>
                                    <span>Internaciones</span>
                                    <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{countInternados}</span>
                                </a>
                            )}
                        </Link>
                        {canViewPersonal && (
                            <Link to="/personal">
                                <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#61896f] hover:bg-gray-100 hover:text-[#111813] font-medium transition-colors" href="#">
                                    <span className="material-symbols-outlined">diversity_3</span>
                                    <span>Personal</span>
                                </a>
                            </Link>
                        )}
                        {canViewInventario && (
                            <Link to="/inventario">
                                <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#61896f] hover:bg-gray-100 hover:text-[#111813] font-medium transition-colors" href="#">
                                    <span className="material-symbols-outlined">inventory_2</span>
                                    <span>Inventario</span>
                                </a>
                            </Link>
                        )}
                    </nav>

                    {/* Perfil del Doctor */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">

                            <div className="flex flex-col">
                                <p onClick={() => logout(navigate)} className="text-sm font-bold">Cerrar Sesión</p>

                            </div>
                        </div>
                    </div>
                </div>
            </aside >

            {/* Contenido Principal */}
            < main className="flex-1 h-full overflow-y-auto bg-[#f6f8f6]" >
                <div className="container mx-auto max-w-7xl p-6 lg:p-8">

                    {/* Header */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight">Panel de Control</h2>
                            <p className="text-[#61896f] mt-1">Bienvenido de nuevo. Aquí está el resumen de la clínica hoy.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link to="/agenda">
                                <button className="h-10 px-4 bg-[#13ec5b] hover:bg-[#0fb847] text-black font-bold rounded-lg flex items-center gap-2 transition-colors shadow-sm shadow-[#13ec5b]/30">
                                    <span className="material-symbols-outlined text-[20px]">add</span>
                                    <span>Nueva Cita</span>
                                </button>
                            </Link>
                        </div>
                    </header>

                    {/* Grid de Estadísticas */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {/* Citas Hoy */}
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                    <span className="material-symbols-outlined">calendar_month</span>
                                </div>
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
                            </div>
                            <p className="text-[#61896f] text-sm font-medium">Citas Hoy</p>
                            <h3 className="text-2xl font-bold mt-1">{turnosFecha}</h3>
                        </div>
                        {/* Hospitalizados */}
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                                    <span className="material-symbols-outlined">local_hospital</span>
                                </div>
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">Activos</span>
                            </div>
                            <p className="text-[#61896f] text-sm font-medium">Hospitalizados</p>
                            <h3 className="text-2xl font-bold mt-1">{internados}</h3>
                        </div>

                    </section>

                    {/* Cuerpo Central: 2 Columnas */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Columna Izquierda (Citas y Hospitalizados) */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Tabla de Citas */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">

                                    <h3 className="text-lg font-bold">Citas Próximas</h3>
                                    <Link to="/agenda">
                                        <a className="text-sm font-semibold text-[#0fb847] hover:underline" href="#">Ver todo</a>
                                    </Link>

                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-xs font-bold text-[#61896f] uppercase">Hora</th>
                                                <th className="px-6 py-3 text-xs font-bold text-[#61896f] uppercase">Paciente</th>
                                                <th className="px-6 py-3 text-xs font-bold text-[#61896f] uppercase">Motivo</th>
                                                <th className="px-6 py-3 text-xs font-bold text-[#61896f] uppercase text-right">Acción</th>
                                            </tr>
                                        </thead>
                                        {citasProximas.map((cita) => (
                                            <tbody className="divide-y divide-gray-100">

                                                {/* Fila 1 */}
                                                < tr className="hover:bg-gray-50 transition-colors" >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">{cita.hora}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative">
                                                                <div className="rounded-full size-10 bg-gray-200 overflow-hidden">
                                                                    <img src="https://placedog.net/100/100?id=1" alt="Max" />
                                                                </div>
                                                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                                                    <span className="material-symbols-outlined text-orange-500 bg-orange-100 rounded-full p-0.5" style={{ fontSize: '14px' }}>pets</span>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold">{cita.nombre_animal}</p>
                                                                <p className="text-xs text-[#61896f]">{cita.raza_animal}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{cita.motivo}</span>
                                                    </td>

                                                    <td className="px-6 py-4 text-right">
                                                        {cita.estado === "pendiente" ? (
                                                            <button onClick={() => confirmarTurno(cita.id)} className="text-[#0fb847] hover:text-green-700 font-medium text-sm">Iniciar</button>
                                                        ) : (
                                                            <button onClick={() => confirmarTurno(cita.id)} className="text-[#0fb847] hover:text-green-700 font-medium text-sm">Iniciado</button>
                                                        )}
                                                    </td>


                                                </tr>

                                            </tbody>
                                        ))}
                                    </table>
                                </div>
                            </div>

                            {/* Hospitalización */}
                            <div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Paciente 1 */}

                                    {/* Paciente 2 */}

                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha (Tareas y Acciones) */}
                        <div className="space-y-8">
                            {/* Tareas */}


                            {/* Acciones Rápidas */}
                            <div className="bg-[#13ec5b]/10 rounded-xl p-6 border border-[#13ec5b]/20">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#0fb847]">bolt</span>
                                    Acciones Rápidas
                                </h3>

                                <div className="grid grid-cols-2 gap-3">
                                    {acciones.map((btn, i) => (
                                        <Link key={i} to={btn.to} className="block">
                                            <button
                                                type="button"
                                                className="flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-sm hover:scale-105 transition-transform group w-full"
                                            >
                                                <div className={`${btn.bg} ${btn.color} p-2 rounded-full mb-2`}>
                                                    <span className="material-symbols-outlined">{btn.icon}</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-center">
                                                    {btn.label}
                                                </span>
                                            </button>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main >
        </div >
    );
}



export default Inicio