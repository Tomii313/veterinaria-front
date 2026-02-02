import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function Estudios() {
    const [estudios, setEstudios] = useState([]);
    const [permisos, setPermisos] = useState([]);
    const accessToken = localStorage.getItem("access");
    const isSuperuser = localStorage.getItem("is_superuser") === "true";
    const canAdd = isSuperuser || permisos.includes("estudios.add_estudio");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [tipoestudio, setTipoEstudio] = useState("");
    const [animal, setAnimal] = useState("")
    const [fechaDesde, setFechaDesde] = useState("")
    const [fechaHasta, setFechaHasta] = useState("")



    useEffect(() => {
        try {
            fetch(`${import.meta.env.VITE_API_URL}/estudios/?fecha__gte=${fechaDesde}&fecha__lte=${fechaHasta}&page=${page}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    setEstudios(data.results || []);
                    setTotalPages(Math.ceil(data.count / 10))
                });
        } catch (error) {
            console.error("Error obteniendo estudios:", error);
        }
    }, [fechaDesde, fechaHasta, page]);

    useEffect(() => {
        try {
            fetch(
                `${import.meta.env.VITE_API_URL}/estudios/?tipo=${tipoestudio}&page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            )
                .then(res => res.json())
                .then(data => {
                    setEstudios(data.results || []);
                    setTotalPages(Math.ceil(data.count / 10))
                });
        } catch (error) {
            console.error("Error obteniendo estudios:", error);
        }
    }, [tipoestudio, page]);

    useEffect(() => {
        try {
            fetch(
                `${import.meta.env.VITE_API_URL}/estudios/?animal__nombre__icontains=${animal}&page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            )
                .then(res => res.json())
                .then(data => {
                    setEstudios(data.results || []);
                    setTotalPages(Math.ceil(data.count / 10))
                });
        } catch (error) {
            console.error("Error obteniendo estudios:", error);
        }
    }, [animal, page]);




    useEffect(() => {
        try {
            fetch(`${import.meta.env.VITE_API_URL}/permisos/`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            })
                .then(res => res.json())
                .then(data => setPermisos(data))
        } catch (error) {
            console.error("Error obteniendo permisos:", error);
        }
    }, [])

    useEffect(() => {
        try {
            fetch(`${import.meta.env.VITE_API_URL}/estudios/`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    setEstudios(data.results || [])
                    setTotalPages(Math.ceil(data.count / 10))
                })
        } catch (error) {
            console.error("Error obteniendo estudios:", error);
        }
    }, [])

    const colorClasses = {
        blue: "bg-blue-100 text-blue-700",
        purple: "bg-purple-100 text-purple-700",
        red: "bg-red-100 text-red-700",
        amber: "bg-orange-100 text-orange-700",
    };

    return (
        <div className="flex flex-col min-h-screen font-['Manrope'] bg-[#f8fafc] text-slate-900">
            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar Lateral */}
                <aside className="w-64 border-r border-slate-200 bg-white hidden lg:flex flex-col p-4 gap-2">
                    <div className="mb-6 px-2 text-left">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Menú Principal</p>
                    </div>
                    <nav className="flex flex-col gap-1">
                        <Link to="/inicio" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                            <span className="material-symbols-outlined text-slate-500 group-hover:text-[#13ec5b]">home</span>
                            <span className="text-sm font-semibold">Inicio</span>
                        </Link>
                        <Link to="/pacientes" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                            <span className="material-symbols-outlined text-slate-500 group-hover:text-[#13ec5b]">group</span>
                            <span className="text-sm font-semibold">Pacientes</span>
                        </Link>
                        <Link to="/estudios" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#eefdf3] text-[#13ec5b] border border-[#13ec5b]/10">
                            <span className="material-symbols-outlined text-[#13ec5b]">description</span>
                            <span className="text-sm font-bold">Informes</span>
                        </Link>
                    </nav>
                </aside>

                {/* Área Principal */}
                <main className="flex-1 p-8 overflow-y-auto text-left">

                    {/* Encabezado */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-slate-900">Informes y Estudios</h1>
                            <p className="text-slate-500 font-medium mt-1">Gestione y consulte todos los estudios médicos de sus pacientes.</p>
                        </div>
                        {canAdd && (
                            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#13ec5b] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#13ec5b]/30 transition-all active:scale-95">
                                <span className="material-symbols-outlined font-bold">upload_file</span>
                                <Link to="/estudios/subir/">
                                    <span>Subir Nuevo Informe</span>
                                </Link>
                            </button>
                        )}
                    </div>

                    {/* Buscador y Filtros */}

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex flex-wrap items-center gap-4 shadow-sm">
                        <div className="flex-1 min-w-[300px] flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 px-1 opacity-0">
                                Buscar
                            </label>

                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13ec5b] transition-colors">
                                    search
                                </span>
                                <input
                                    value={animal}
                                    onChange={(e) => setAnimal(e.target.value)}
                                    className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-[#13ec5b]/20 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all font-medium"
                                    placeholder="Buscar por nombre de mascota"
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 px-1">
                                Tipo
                            </label>
                            <select
                                value={tipoestudio}
                                onChange={(e) => setTipoEstudio(e.target.value)}
                                className="h-10 px-4 rounded-xl bg-slate-100 text-sm font-bold hover:bg-slate-200 transition-colors"
                            >
                                <option value="">Todos</option>
                                <option value="RX">Rayos X</option>
                                <option value="ECO">Ecografía</option>
                                <option value="SANGRE">Sangre</option>
                                <option value="ORINA">Orina</option>
                                <option value="OTRO">Otros</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 px-1">
                                Fecha desde
                            </label>
                            <input
                                type="date"
                                value={fechaDesde}
                                onChange={(e) => setFechaDesde(e.target.value)}
                                className="h-10 px-4 rounded-xl bg-slate-100 text-sm font-bold hover:bg-slate-200 transition-colors"
                                max="2100-12-31"
                                min="2026-01-01"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 px-1">
                                Fecha hasta
                            </label>
                            <input
                                type="date"
                                value={fechaHasta}
                                onChange={(e) => setFechaHasta(e.target.value)}
                                className="h-10 px-4 rounded-xl bg-slate-100 text-sm font-bold hover:bg-slate-200 transition-colors"
                                max="2100-12-31"
                                min="2026-01-01"
                            />
                        </div>
                    </div>


                    {/* Tabla de Estudios */}
                    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Paciente</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tipo de Estudio</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Fecha</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Descripción</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {estudios.map((estudio) => (
                                    <tr key={estudio.id} className="hover:bg-[#13ec5b]/5 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                                                    <span className="material-symbols-outlined text-xl">pets</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-slate-900">{estudio.animal_nombre}</p>
                                                    <p className="text-[11px] font-medium text-slate-500">Dueño: {estudio.animal_dueño} {estudio.duenio_apellido}</p>

                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${colorClasses[estudio.color]}`}>
                                                {estudio.tipo}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-bold text-slate-600">{estudio.fecha}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm text-slate-500 font-medium line-clamp-1 max-w-xs">{estudio.informe}</p>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <a
                                                href={estudio.archivo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-400 hover:text-[#13ec5b]"
                                            >
                                                <span className="material-symbols-outlined">open_in_new</span>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-bold">
                            <p>Mostrando <span className="text-[#1e293b]">{page}</span> de <span className="text-[#1e293b]">{totalPages}</span> páginas</p>
                            <div className="flex gap-2">
                                <button onClick={() => { if (page > 1) { setPage(page - 1) } }} className="size-8 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
                                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                </button>
                                <button onClick={() => { if (page < totalPages) { setPage(page + 1) } }} className="size-8 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
                                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Estudios