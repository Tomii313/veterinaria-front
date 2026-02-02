import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"


function AgregarInternado() {
    const [animales, setAnimales] = useState([]);
    const navigate = useNavigate();
    const [motivo, setMotivo] = useState("")
    const [fechaIngreso, setFechaIngreso] = useState([])
    const [diagnostico, setDiagnostico] = useState([])
    const [nivelUrgencia, setNivelUrgencia] = useState("")
    const [estado, setEstado] = useState([])
    const [jaulas, setJaulas] = useState([])
    const [jaulaSelect, setJaulaSelect] = useState("")
    const [observaciones, setObservaciones] = useState("")
    const [veterinarios, setVeterinarios] = useState([])
    const [veterinarioSelect, setVeterinarioSelect] = useState("")
    const [animalSelect, setAnimalSelect] = useState("")
    const accessToken = localStorage.getItem("access");
    const buscarAnimales = async (texto) => {
        if (texto.length < 2) return;

        const res = await fetch(`${import.meta.env.VITE_API_URL}/animales/?search=${texto}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })

        const data = await res.json();
        setAnimales(data.results ?? data); // si usás paginación


    }

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/jaulas/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => setJaulas(data))
    }, [])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/veterinarios/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => setVeterinarios(data.results ?? data))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        fetch(`${import.meta.env.VITE_API_URL}/internaciones/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
            body: JSON.stringify({
                animal: animalSelect,
                motivo: motivo,
                observaciones: observaciones,
                veterinario: veterinarioSelect,
                jaula: jaulaSelect,
                nivel_urgencia: nivelUrgencia,
            })
        })
        Swal.fire({
            title: "Buen trabajo!",
            text: "Se ha insertado correctamente al paciente internado en el sistema.",
            icon: "success"
        });
        navigate("/internaciones")

            .then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.error(error))
    }


    return (
        <div className="bg-white text-[#111813] font-['Manrope',_sans-serif] min-h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 px-10 py-3 bg-white sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <Link to="/inicio">
                        <div className="flex items-center gap-4 text-[#111813]">
                            <div className="size-6 bg-[#13ec5b] rounded flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-[18px]">pets</span>
                            </div>
                            <h2 className="text-[#111813] text-lg font-bold tracking-tight">VetManager</h2>
                        </div>
                    </Link>

                </div>

            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden lg:flex flex-col gap-6">

                    <nav className="flex flex-col gap-2 text-left">
                        <Link to="/inicio">
                            <div className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-[#eefdf3] hover:text-[#13ec5b] rounded-xl cursor-pointer transition-all font-bold">
                                <span className="material-symbols-outlined">home</span>
                                <p className="text-sm font-bold">Inicio</p>
                            </div>
                        </Link>
                        <Link to="/pacientes">
                            <div className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-[#eefdf3] hover:text-[#13ec5b] rounded-xl cursor-pointer transition-all font-bold">
                                <span className="material-symbols-outlined">pets</span>
                                <p className="text-sm font-bold">Pacientes</p>
                            </div>
                        </Link>
                        <Link to="/internaciones">
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#eefdf3] text-[#13ec5b] font-black">
                                <span className="material-symbols-outlined">bed</span>
                                <p className="text-sm font-black">Internaciones</p>
                            </div>
                        </Link>


                    </nav>
                </aside>

                {/* Contenido Principal */}
                <main className="flex-1 overflow-y-auto bg-[#f8fafc] pb-20">
                    <div className="max-w-5xl mx-auto px-6 py-10 text-left">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 mb-4 text-sm font-bold text-slate-400">
                            <Link to="/inicio">
                                <a className="hover:text-[#13ec5b]" href="#">Inicio</a>
                            </Link>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <Link to="/internaciones">
                                <a className="hover:text-[#13ec5b]" href="#">Hospitalización</a>
                            </Link>


                        </div>

                        {/* Cabecera */}
                        <div className="mb-10">
                            <h1 className="text-[#111813] text-3xl md:text-4xl font-black tracking-tight">Registro de Ingreso Hospitalario</h1>
                            <p className="text-slate-500 text-base mt-2">Gestione el alta de pacientes al área de cuidados intensivos y observación.</p>
                        </div>

                        <form className="space-y-8" onSubmit={handleSubmit}>

                            {/* Sección 1: Selección de Paciente */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="bg-[#f8fafc] px-8 py-4 border-b border-slate-50">
                                    <h2 className="text-[#111813] text-lg font-black flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[#13ec5b] text-[24px]">person_search</span>
                                        Selección de Paciente
                                    </h2>
                                </div>
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    <div className="text-left">
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Buscar Mascota o Propietario</label>
                                        <div className="relative">
                                            <input className="w-full rounded-2xl border-slate-100 bg-[#f8fafc] h-12 px-5 font-bold focus:ring-2 focus:ring-[#13ec5b]/20 outline-none transition-all" placeholder="Ej: Max, Exp: 4502, Luna Garcia..."
                                                onChange={(e) => buscarAnimales(e.target.value)} />
                                            <span className="material-symbols-outlined absolute right-4 top-3 text-slate-300">search</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                        <div className="size-14 bg-white rounded-xl flex items-center justify-center text-slate-300 shadow-sm">
                                            <span className="material-symbols-outlined text-3xl">pets</span>
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <select value={animalSelect} onChange={(e) => setAnimalSelect(e.target.value)} className="w-full h-12 px-5 rounded-2xl border-slate-100 bg-[#f8fafc] font-bold text-slate-700">
                                                <option value="">Seleccionar paciente</option>

                                                {animales.map((animal) => (
                                                    <option key={animal.id} value={animal.id}>
                                                        {animal.nombre} – {animal.raza} – {animal.duenio_nombre} {animal.duenio_apellido} (DNI {animal.duenio_dni})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sección 2: Detalles de Hospitalización */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="bg-[#f8fafc] px-8 py-4 border-b border-slate-50">
                                    <h2 className="text-[#111813] text-lg font-black flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[#13ec5b] text-[24px]">medical_information</span>
                                        Detalles de Hospitalización
                                    </h2>
                                </div>
                                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-2 text-left">
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Motivo del Ingreso</label>
                                        <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} className="w-full rounded-2xl border-slate-100 bg-[#f8fafc] p-5 font-bold focus:ring-2 focus:ring-[#13ec5b]/20 outline-none transition-all resize-none min-h-[120px]" placeholder="Describa los síntomas principales y diagnóstico presuntivo..." />
                                    </div>
                                    <div className="text-left">
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Nivel de Urgencia</label>
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="urgency"
                                                    value="EMERGENCIA"
                                                    checked={nivelUrgencia === "EMERGENCIA"}
                                                    onChange={(e) => setNivelUrgencia(e.target.value)}
                                                />
                                                <span className="text-xs font-black">Crítico / Emergencia</span>
                                            </label>

                                            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="urgency"
                                                    value="OBSERVACION"
                                                    checked={nivelUrgencia === "OBSERVACION"}
                                                    onChange={(e) => setNivelUrgencia(e.target.value)}
                                                />
                                                <span className="text-xs font-black">Observación / Estable</span>
                                            </label>

                                            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="urgency"
                                                    value="CONTROL"
                                                    checked={nivelUrgencia === "CONTROL"}
                                                    onChange={(e) => setNivelUrgencia(e.target.value)}
                                                />
                                                <span className="text-xs font-black">Control Post-quirúrgico</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Asignación de Jaula</label>
                                        <select
                                            value={jaulaSelect}
                                            onChange={(e) => setJaulaSelect(e.target.value)}
                                            className="w-full h-12 px-5 rounded-2xl border-slate-100 bg-[#f8fafc] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#13ec5b]/20"
                                        >
                                            <option value="">Seleccione una jaula</option>

                                            {jaulas.map((j) => (
                                                <option key={j.id} value={j.id}>
                                                    Jaula {j.numero} {j.disponible ? "Disponible" : "Ocupada"}
                                                </option>
                                            ))}
                                        </select>
                                    </div>


                                </div>
                            </div>

                            {/* Sección 3: Tratamiento y Contacto */}
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">

                                {/* Observaciones */}
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                        Indicaciones Veterinarias
                                    </label>

                                    <textarea
                                        value={observaciones}
                                        onChange={(e) => setObservaciones(e.target.value)}
                                        className="w-full rounded-2xl border-slate-100 bg-[#f8fafc] p-5 font-bold focus:ring-2 focus:ring-[#13ec5b]/20 outline-none transition-all resize-none min-h-[180px]"
                                        placeholder="Fluidoterapia, frecuencia de monitoreo, medicación inmediata..."
                                    />


                                </div>

                                {/* Veterinario */}
                                <div className="flex flex-col">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                        Veterinario Responsable
                                    </label>

                                    <select
                                        value={veterinarioSelect}
                                        onChange={(e) => setVeterinarioSelect(e.target.value)}
                                        className="w-full h-12 px-5 rounded-2xl border-slate-100 bg-[#f8fafc] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#13ec5b]/20"
                                    >
                                        <option value="">Seleccionar Veterinario</option>

                                        {veterinarios.map((v) => (
                                            <option key={v.id} value={v.id}>
                                                {v.nombre} {v.apellido}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                            </div>
                            {/* Barra de Acciones Finales */}
                            <div className="flex flex-col sm:flex-row justify-end items-center gap-6 pt-6 border-t border-slate-100">
                                <p className="text-xs text-slate-400 font-bold italic mr-auto">Borrador guardado automáticamente hace 2 min.</p>
                                <Link to="/internaciones">
                                    <button className="px-8 h-12 rounded-2xl text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-700 transition-all">
                                        Cancelar
                                    </button>
                                </Link>
                                <button type="submit" className="px-10 h-12 rounded-2xl bg-[#13ec5b] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-[#13ec5b]/20 hover:bg-[#0fb847] active:scale-95 transition-all flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                                    Finalizar Registro de Ingreso
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div >
        </div >
    );
}

export default AgregarInternado