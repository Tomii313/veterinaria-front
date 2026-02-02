import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'

function DetallePaciente() {

    const [paciente, setPacientes] = useState(null)
    const [historial, setHistorial] = useState([])
    const [estado, setEstado] = useState([])
    const [estadoSeleccionado, setEstadoSeleccionado] = useState("")

    const accessToken = localStorage.getItem("access");
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        try {
            fetch(`${import.meta.env.VITE_API_URL}/animales/${id}/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,

                },
            })
                .then(res => res.json())
                .then(data => setPacientes(data.results ?? data))
                .catch(error => console.log(error))
        } catch (error) {
            console.log(error)
        }
    }, [id])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/animales/select_estado/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => setEstado(data))
    }, [])

    function eliminarPaciente() {

        Swal.fire({
            title: "Eliminar paciente?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Eliminar"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${import.meta.env.VITE_API_URL}/animales/${id}/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${accessToken}`,

                    }
                })
                Swal.fire({
                    title: "Eliminado!",
                    text: "El paciente ha sido eliminado.",
                    icon: "success"
                });
                navigate('/pacientes')
            }
        });
    }


    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/turnos/${id}/historial_medico/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => {
                const turnos = data.turnos.map(t => ({
                    id: `turno-${t.id}`,
                    tipo: "turno",
                    fecha: t.fecha,
                    hora: t.hora,
                    titulo: t.motivo,
                    veterinario: `${t.veterinario_nombre} ${t.veterinario_apellido}`
                }))

                const internaciones = data.internaciones.map(i => ({
                    id: `internacion-${i.id}`,
                    tipo: "internacion",
                    fecha: i.fecha_ingreso,
                    hora: "",
                    titulo: i.fecha_alta ? "Alta médica" : "Ingreso a internación",
                    veterinario: ""
                }))

                setHistorial([...turnos, ...internaciones])
            })
    }, [id])


    const handleSubmit = (e) => {
        e.preventDefault()
        fetch(`${import.meta.env.VITE_API_URL}/animales/${id}/`, {

            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${accessToken}`,

            },
            body: JSON.stringify({
                estado: estadoSeleccionado




            })

        })
            .then(() => {
                Swal.fire({
                    title: "Buen trabajo!",
                    text: "El estado del paciente ha sido editado con éxito!",
                    icon: "success"
                });
                navigate("/pacientes")
            })
    }



    return (

        <div className="bg-[#f8fafc] text-[#1e293b] font-['Manrope',_sans-serif] min-h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/inicio">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2 text-[#111813]">
                                <div className="text-[#13ec5b]">
                                    <span className="material-symbols-outlined text-4xl">pets</span>
                                </div>
                                <h2 className="text-xl font-bold tracking-tight">VetManager</h2>
                            </div>

                        </div>
                    </Link>

                </div>
            </header>

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Breadcrumbs */}
                <nav className="flex mb-6 text-sm font-medium text-slate-400">
                    <Link to="/inicio">
                        <a className="hover:text-[#13ec5b] transition-colors" href="#">Inicio</a>
                    </Link>
                    <span className="mx-2">/</span>
                    <Link to="/pacientes">
                        <a className="hover:text-[#13ec5b] transition-colors" href="#">Pacientes</a>
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-slate-900 font-bold">Detalles de la Mascota</span>
                </nav>

                {/* Header de la página */}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-1">Perfil de Paciente</h1>
                        <p className="text-slate-500 font-medium">ID: {id}</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={eliminarPaciente} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-red-500 hover:bg-red-50 font-bold text-sm transition-all shadow-sm">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                            <span>Eliminar</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700 font-bold text-sm transition-all shadow-sm">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                            <span>Editar Información</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Columna Izquierda: Card de Perfil */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-6">

                                    <span className="absolute bottom-4 right-4 h-6 w-6 rounded-full bg-[#13ec5b] border-4 border-white shadow-sm"></span>
                                </div>


                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="bg-slate-50 p-4 rounded-2xl">
                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Edad</p>
                                        <p className="font-bold text-lg text-slate-800">{paciente?.edad}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl">
                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Peso</p>
                                        <p className="font-bold text-lg text-slate-800">{paciente?.peso}</p>
                                    </div>
                                </div>


                                <div className="w-full h-px bg-slate-100 my-8"></div>

                                <div className="w-full text-left">
                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-3">Dueño</p>
                                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-transparent">
                                        <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                                            <img src={`https://ui-avatars.com/api/?name=${paciente?.duenio_nombre ?? ""}+${paciente?.duenio_apellido ?? ""}&background=random`} alt="Owner" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm text-slate-800 truncate">{paciente?.duenio_nombre} {paciente?.duenio_apellido}</p>
                                            <p className="text-xs text-slate-500 font-medium">{paciente?.duenio_telefono}</p>
                                        </div>
                                        <button className="ml-auto size-8 shrink-0 flex items-center justify-center bg-white text-[#13ec5b] border border-slate-100 rounded-full shadow-sm hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-[18px]">call</span>
                                        </button>

                                    </div>

                                </div>

                            </div>
                        </div>


                    </div>

                    {/* Columna Derecha: Historial y Nueva Entrada */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* Nueva Entrada */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <form onSubmit={handleSubmit}>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-[#13ec5b] text-[28px]">add_circle</span>
                                    <h3 className="text-xl font-bold text-slate-800">Nueva Entrada Histórica</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 text-left">
                                    <div className="md:col-span-1">
                                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Actualizar Estado Actual</label>
                                        <select value={estadoSeleccionado} onChange={(e) => setEstadoSeleccionado(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#13ec5b] text-slate-700 font-bold outline-none cursor-pointer">
                                            {estado.map(e => (
                                                <option key={e.value} value={e.value}>{e.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Notas / Observaciones</label>
                                        <input
                                            className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#13ec5b] text-slate-700 font-medium outline-none"
                                            placeholder="Escribe detalles del diagnóstico o tratamiento..."
                                            type="text"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" className="bg-[#13ec5b] hover:bg-[#0fb847] text-white font-black py-3 px-8 rounded-2xl text-sm transition-all shadow-xl shadow-[#13ec5b]/20 flex items-center gap-2 active:scale-95">
                                        <span>Actualizar Estado</span>
                                        <span className="material-symbols-outlined text-[20px]">save</span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Listado Historial */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col flex-1">
                            <div className="border-b border-slate-50 px-8">
                                <div className="flex gap-8 overflow-x-auto no-scrollbar">
                                    <button className="flex items-center gap-2 border-b-[3px] border-[#13ec5b] py-5 px-1 whitespace-nowrap text-slate-900 font-black">
                                        <span className="material-symbols-outlined text-[22px]">history</span>
                                        <span className="text-sm tracking-tight">Historial Médico</span>
                                    </button>



                                </div>

                            </div>

                            <div className="p-8 text-left">
                                <div className="relative pl-8 border-l-2 border-slate-100 space-y-10">
                                    {historial.map(his => (
                                        <div key={his.id} className="relative group">

                                            {/* Punto del timeline */}
                                            <div className="absolute -left-[41px] top-1 bg-white h-6 w-6 rounded-full border-2 border-[#13ec5b] flex items-center justify-center shadow-sm">
                                                <div className="h-2 w-2 rounded-full bg-[#13ec5b]"></div>
                                            </div>

                                            {/* Card del evento */}
                                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:bg-white transition shadow-sm">

                                                {/* Fecha y hora */}
                                                <div className="flex items-center gap-4 text-xs text-slate-500 font-bold mb-2">
                                                    <div className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                                                        {his.fecha}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                                                        {his.hora}
                                                    </div>
                                                </div>

                                                {/* Motivo */}
                                                <p className="text-sm font-black text-slate-900 mb-1">
                                                    {his.titulo}
                                                </p>

                                                {his.veterinario && (
                                                    <p className="text-xs text-slate-500 font-medium">
                                                        Atendido por {his.veterinario}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Item 1 */}


                                </div>

                                <div className="mt-12 flex justify-center">
                                    <button className="text-xs font-black text-slate-400 hover:text-[#13ec5b] transition-all flex items-center gap-2 uppercase tracking-widest group">
                                        Ver historial completo
                                        <span className="material-symbols-outlined text-[20px] group-hover:translate-y-1 transition-transform">expand_more</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>


        </div >

    );
}

export default DetallePaciente