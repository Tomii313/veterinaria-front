import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { logout } from "/utils/logout";






function Pacientes() {
    const accessToken = localStorage.getItem("access");
    const [permisos, setPermisos] = useState([])
    const [pacientes, setPacientes] = useState([])
    const [busqueda, setBusqueda] = useState("")
    const [messageError, setMessageError] = useState("")
    const [especie, setEspecie] = useState("")
    const [estado, setEstado] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const navigate = useNavigate()
    const canAdd = permisos.includes("animales.add_animal")
    const canUpdate = permisos.includes("animales.change_animal")


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
        try {
            fetch(`${import.meta.env.VITE_API_URL}/animales/?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,

                },
            })
                .then(response => response.json())
                .then(data => {
                    setPacientes(data.results ?? data)
                    setTotalPages(Math.ceil(data.count / 10))
                })
        } catch (error) {
            console.log(error)
        }
    }, [page])

    /* function buscar() {
        if (busqueda.trim() === "") {
            // si el input está vacío, recargamos todos
            fetch(`${import.meta.env.VITE_API_URL}/animales/?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,

                },

            })
                .then(res => res.json())
                .then(data => {
                    setPacientes(data.results ?? data)
                    setMessageError(""); // limpiamos mensaje de error
                })
                .catch(err => setMessageError("Error al cargar los pacientes"));

            return;
        } */


    useEffect(() => {
        const nombre = busqueda.trim();

        if (nombre === "") return;

        fetch(`${import.meta.env.VITE_API_URL}/animales/?search=${nombre}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
        })
            .then(res => res.json())
            .then(data => setPacientes(data.results ?? []))
            .catch(() => setPacientes([]));
    }, [busqueda]);

    function buscarespecie() {
        if (especie.trim() === "") {
            fetch(`${import.meta.env.VITE_API_URL}/animales/?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,

                },
            })
                .then(res => res.json())
                .then(data => {
                    setPacientes(data.results);
                    setMessageError("");
                })
                .catch(err => setMessageError("Error al cargar los pacientes"));
            return;
        }
        fetch(`${import.meta.env.VITE_API_URL}/animales/especies/?especie=${especie}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => {
                setPacientes(data.results ?? data)
                setMessageError("")
            })
            .catch(err => setMessageError("Error al cargar los pacientes"));
    }


    useEffect(() => {
        buscarespecie();
    }, [especie]);


    function filtrarestado() {
        if (estado.trim() === "") {
            fetch(`${import.meta.env.VITE_API_URL}/animales/?page=${page}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            })
                .then(res => res.json())
                .then(data => {
                    setPacientes(data.results ?? data);
                    setMessageError("");
                })
                .catch(err => {
                    setPacientes([]); // siempre aseguramos que sea un array
                    setMessageError("Error al cargar los pacientes");
                });
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL}/animales/filtrar_estado/?estado=${estado}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        })
            .then(res => {
                if (res.status === 404) {
                    // si no hay resultados, devolvemos array vacío
                    return { results: [] };
                }
                if (!res.ok) throw new Error("Error al cargar los pacientes");
                return res.json();
            })
            .then(data => {
                setPacientes(data.results ?? data); // ahora siempre será array
                setMessageError("");
            })
            .catch(err => {
                setPacientes([]); // fallback por si hay otro error
                setMessageError(err.message);
            });
    }

    useEffect(() => {
        filtrarestado();
    }, [estado]);
    return (
        <div className="flex h-screen w-full bg-[#f8fafc] font-['Manrope',_sans-serif] text-[#1e293b]">
            {/* Sidebar / Navegación Lateral */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-4">
                <div className="flex items-center gap-3 px-2 mb-10">
                    <div className="size-10 bg-[#f1e4d1] rounded-full flex items-center justify-center border border-slate-100">
                        <span className="material-symbols-outlined text-[#a28b6a]">pets</span>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold leading-tight">VetManager</h1>

                    </div>
                </div>

                <nav className="space-y-1 flex-1">
                    <Link to="/inicio">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[22px]">grid_view</span>
                            <span className="text-sm font-semibold">Inicio</span>
                        </button>
                    </Link>
                    <Link to="/estudios">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[22px]">grid_view</span>
                            <span className="text-sm font-semibold">Estudios</span>
                        </button>
                    </Link>

                    <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-[#eefdf3] text-[#13ec5b] rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
                        <span className="text-sm font-bold">Pacientes</span>
                    </button>

                </nav>

                <button onClick={() => logout(navigate)} className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-red-500 transition-colors mt-10 border-t border-slate-100 pt-6">
                    <span className="material-symbols-outlined text-[22px]">logout</span>
                    <span className="text-sm font-semibold">Cerrar Sesión</span>
                </button>
            </aside>

            {/* Contenido Principal */}
            <main className="flex-1 overflow-y-auto p-8">
                {/* Header de Sección */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-[#1e293b]">Pacientes</h2>
                        <p className="text-slate-500 text-sm mt-1">Gestión total de historias clínicas y mascotas registradas.</p>
                    </div>
                    {canAdd && (
                        <button className="bg-[#13ec5b] hover:bg-[#0fb847] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm">
                            <Link to="/pacientes/agregar">
                                <span className="material-symbols-outlined">add</span>
                                Nueva Mascota
                            </Link>
                        </button>
                    )}
                </header>

                {/* Filtros y Buscador */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">

                            <input onChange={(e) => setBusqueda(e.target.value)}
                                type="text"
                                placeholder="Buscar por nombre"
                                value={busqueda}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#13ec5b]/20"
                            />

                        </div>

                        <select value={especie} onChange={(e) => setEspecie(e.target.value)} className="bg-white border-slate-200 rounded-xl text-sm px-4 py-2.5 outline-none focus:border-[#13ec5b] transition-all">
                            <option value="">Todas las Especies</option>
                            <option value="perro">Perros</option>
                            <option value="gato">Gatos</option>
                        </select>
                        <select value={estado} onChange={(e) => setEstado(e.target.value)} className="bg-white border-slate-200 rounded-xl text-sm px-4 py-2.5 outline-none focus:border-[#13ec5b] transition-all">
                            <option value="">Cualquier Estado</option>
                            <option value="TRATAMIENTO">En Tratamiento</option>
                            <option value="VACUNACION">Vacunación Pendiente</option>
                            <option value="DESPARASITACIÓN">Desparasitación</option>
                            <option value="FALLECIDO">Fallecido</option>
                            <option value="SANO">Sano</option>
                        </select>
                    </div>



                    {/* Tabla de Pacientes */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Perfil Mascota</th>
                                    <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dueño</th>
                                    <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Última Visita</th>
                                    <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                                    <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {pacientes.map((p) => (
                                    <tr key={p.id} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="px-4 py-5">
                                            <div className="flex items-center gap-3">
                                                {p.especie.toLowerCase() === "perro" ? (
                                                    <div className="size-10 rounded-full object-cover shadow-sm"><img src="/dog.png" alt="" /></div>
                                                ) : (
                                                    p.especie.toLowerCase() === "gato" ? (
                                                        <div className="size-10 rounded-full object-cover shadow-sm"><img src="/gato.png" alt="" /></div>
                                                    ) : (
                                                        <div className="size-10 rounded-full object-cover shadow-sm"></div>
                                                    )
                                                )}
                                                <div>
                                                    <p className="text-sm font-bold text-[#1e293b]">{p.nombre}</p>
                                                    <p className="text-xs text-slate-400 font-medium">{p.especie} • {p.raza}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            <p className="text-sm font-bold text-slate-600">{p.duenio_nombre} {p.duenio_apellido}</p>

                                        </td>
                                        <td className="px-4 py-5">
                                            {/* <p className="text-sm font-bold text-slate-600">{p.fecha}</p>
                                            <p className="text-xs text-slate-400 font-medium">{p.motivo}</p> */}
                                        </td>
                                        <td className="px-4 py-5">

                                            <span className={`px-3 py-1 rounded-lg text-[11px] font-bold flex w-fit items-center gap-1.5
                        ${p.colorEstado === 'blue' ? 'bg-blue-50 text-blue-600' : ''}
                        ${p.colorEstado === 'green' ? 'bg-green-50 text-green-600' : ''}
                        ${p.colorEstado === 'orange' ? 'bg-orange-50 text-orange-600' : ''}
                        ${p.colorEstado === 'red' ? 'bg-red-50 text-red-600' : ''}
                      `}>
                                                <span className={`size-1.5 rounded-full 
                          ${p.colorEstado === 'blue' ? 'bg-blue-600' : ''}
                          ${p.colorEstado === 'green' ? 'bg-green-600' : ''}
                          ${p.colorEstado === 'orange' ? 'bg-orange-600' : ''}
                          ${p.colorEstado === 'red' ? 'bg-red-600' : ''}
                        `}></span>
                                                {p.estado === "VACUNACION" ?
                                                    <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-full text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                                                        <span className="size-2 rounded-full bg-orange-400"></span> Vacunación Pendiente
                                                    </button>
                                                    : p.estado === "TRATAMIENTO" ?
                                                        <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-full text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                                                            <span className="size-2 rounded-full bg-blue-400"></span> En Tratamiento
                                                        </button>
                                                        : p.estado === "INTERNACION" ?
                                                            <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-full text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                                                                <span className="size-2 rounded-full bg-red-400"></span> Internado
                                                            </button>
                                                            : p.estado === "FALLECIDO" ?
                                                                <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-full text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                                                                    <span className="size-2 rounded-full bg-gray-400"></span> Fallecido
                                                                </button>
                                                                : p.estado === "SANO" ?
                                                                    <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-full text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                                                                        <span className="size-2 rounded-full bg-green-400"></span> Sano
                                                                    </button>
                                                                    : p.estado === "DESPARASITACIÓN" ?
                                                                        <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-full text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                                                                            <span className="size-2 rounded-full bg-yellow-400"></span> Desparasitación
                                                                        </button>
                                                                        : ""}
                                            </span>

                                        </td>
                                        <td className="px-4 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link to={`/pacientes/detalle/${p.id}`}>
                                                    <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-[#13ec5b] hover:shadow-sm transition-all">
                                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                    </button>
                                                </Link>
                                                {canUpdate && (
                                                    <Link to={`/pacientes/actualizar/${p.id}`}>
                                                        <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-600 hover:shadow-sm transition-all">
                                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                                        </button>
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer de Tabla / Paginación */}
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
            </main >
        </div >
    );
}

export default Pacientes