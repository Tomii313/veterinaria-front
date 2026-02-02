import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2" // Asegúrate de tenerlo importado

function ModificarInternado() {
    const { id } = useParams(); // Obtenemos el ID del internado a editar
    const navigate = useNavigate();

    // Estados de los datos
    const [animales, setAnimales] = useState([]);
    const [jaulas, setJaulas] = useState([]);
    const [veterinarios, setVeterinarios] = useState([]);
    const accessToken = localStorage.getItem("access");
    // Estados del formulario
    const [animalSelect, setAnimalSelect] = useState("")
    const [motivo, setMotivo] = useState("")
    const [nivelUrgencia, setNivelUrgencia] = useState("")
    const [jaulaSelect, setJaulaSelect] = useState("")
    const [observaciones, setObservaciones] = useState("")
    const [veterinarioSelect, setVeterinarioSelect] = useState("")

    // 1. Cargar datos iniciales (Jaulas y Veterinarios)
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

    // 2. CARGAR LOS DATOS DEL INTERNADO A EDITAR
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/internaciones/${id}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => {
                setAnimalSelect(data.animal);
                setMotivo(data.motivo);
                setNivelUrgencia(data.nivel_urgencia);
                setJaulaSelect(data.jaula);
                setObservaciones(data.observaciones);
                setVeterinarioSelect(data.veterinario);

                // Si el animal no está en la lista de búsqueda actual, 
                // podrías necesitar cargar su info específica para mostrarla en el select
                setAnimales([{ id: data.animal, nombre: "Paciente actual" }]);
            })
            .catch(error => console.error("Error al cargar internación:", error))
    }, [id])

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
        setAnimales(data.results ?? data);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/internaciones/${id}/`, {
                method: "PUT", // O PATCH si prefieres actualización parcial
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
            });

            if (response.ok) {
                Swal.fire({
                    title: "¡Actualizado!",
                    text: "La información de la internación se ha modificado correctamente.",
                    icon: "success"
                });
                navigate("/internaciones");
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
        }
    }

    return (
        <div className="bg-white text-[#111813] font-['Manrope',_sans-serif] min-h-screen flex flex-col">
            <header className="flex items-center justify-between border-b border-solid border-gray-200 px-10 py-3 bg-white sticky top-0 z-50">
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
                <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden lg:flex flex-col gap-6">

                    <nav className="flex flex-col gap-2 text-left">
                        <Link to="/inicio"><div className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-[#eefdf3] rounded-xl font-bold cursor-pointer"><span className="material-symbols-outlined">home</span><p className="text-sm">Inicio</p></div></Link>
                        <Link to="/pacientes"><div className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-[#eefdf3] rounded-xl font-bold cursor-pointer"><span className="material-symbols-outlined">pets</span><p className="text-sm">Pacientes</p></div></Link>
                        <Link to="/internaciones"><div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#eefdf3] text-[#13ec5b] font-black"><span className="material-symbols-outlined">bed</span><p className="text-sm">Internamientos</p></div></Link>
                    </nav>
                </aside>

                <main className="flex-1 overflow-y-auto bg-[#f8fafc] pb-20">
                    <div className="max-w-5xl mx-auto px-6 py-10 text-left">
                        <div className="flex items-center gap-2 mb-4 text-sm font-bold text-slate-400">
                            <Link className="hover:text-[#13ec5b]" to="/inicio">Inicio</Link>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <Link className="hover:text-[#13ec5b]" to="/internaciones">Hospitalización</Link>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <Link className="hover:text-[#13ec5b]" to="/internaciones">Hospitalización</Link>

                        </div>

                        <div className="mb-10">
                            <h1 className="text-[#111813] text-3xl md:text-4xl font-black tracking-tight">Editar Registro Hospitalario</h1>
                            <p className="text-slate-500 text-base mt-2">Modifique la información del paciente ID: {id}</p>
                        </div>

                        <form className="space-y-8" onSubmit={handleSubmit}>
                            {/* Selección de Paciente */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="bg-[#f8fafc] px-8 py-4 border-b border-slate-50">
                                    <h2 className="text-[#111813] text-lg font-black flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[#13ec5b] text-[24px]">person_search</span>
                                        Selección de Paciente
                                    </h2>
                                </div>
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    <div className="text-left">
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Cambiar Mascota (Opcional)</label>
                                        <div className="relative">
                                            <input className="w-full rounded-2xl border-slate-100 bg-[#f8fafc] h-12 px-5 font-bold outline-none" placeholder="Buscar para cambiar..." onChange={(e) => buscarAnimales(e.target.value)} />
                                            <span className="material-symbols-outlined absolute right-4 top-3 text-slate-300">search</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                        <select value={animalSelect} onChange={(e) => setAnimalSelect(e.target.value)} className="w-full h-12 px-5 rounded-2xl border-slate-100 bg-[#f8fafc] font-bold text-slate-700">
                                            {animales.map((animal) => (
                                                <option key={animal.id} value={animal.id}>{animal.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Detalles */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-2 text-left">
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Motivo del Ingreso</label>
                                        <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} className="w-full rounded-2xl border-slate-100 bg-[#f8fafc] p-5 font-bold min-h-[120px]" />
                                    </div>
                                    <div className="text-left">
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Nivel de Urgencia</label>
                                        <div className="space-y-3">
                                            {["EMERGENCIA", "OBSERVACION", "CONTROL"].map((u) => (
                                                <label key={u} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 cursor-pointer">
                                                    <input type="radio" name="urgency" value={u} checked={nivelUrgencia === u} onChange={(e) => setNivelUrgencia(e.target.value)} />
                                                    <span className="text-xs font-black">{u}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 pt-0">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Jaula</label>
                                    <select value={jaulaSelect} onChange={(e) => setJaulaSelect(e.target.value)} className="w-full h-12 px-5 rounded-2xl border-slate-100 bg-[#f8fafc] font-bold">
                                        <option value="">Seleccione una jaula</option>
                                        {jaulas.map((j) => (
                                            <option key={j.id} value={j.id}>Jaula {j.numero}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Observaciones y Vet */}
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Indicaciones Veterinarias</label>
                                    <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} className="w-full rounded-2xl border-slate-100 bg-[#f8fafc] p-5 font-bold min-h-[180px]" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Veterinario Responsable</label>
                                    <select value={veterinarioSelect} onChange={(e) => setVeterinarioSelect(e.target.value)} className="w-full h-12 px-5 rounded-2xl border-slate-100 bg-[#f8fafc] font-bold">
                                        <option value="">Seleccionar Veterinario</option>
                                        {veterinarios.map((v) => (
                                            <option key={v.id} value={v.id}>{v.nombre} {v.apellido}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-6 pt-6 border-t border-slate-100">
                                <button type="button" onClick={() => navigate("/internaciones")} className="px-8 h-12 rounded-2xl text-slate-400 font-black text-xs uppercase">Cancelar</button>
                                <button type="submit" className="px-10 h-12 rounded-2xl bg-[#13ec5b] text-white font-black text-xs uppercase shadow-xl hover:bg-[#0fb847] transition-all flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[20px]">save</span>
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ModificarInternado;