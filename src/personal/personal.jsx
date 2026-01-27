import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { logout } from "/utils/logout.jsx"


function Personal() {

    const [permisos, setPermisos] = useState([])
    const [veterinarios, setVeterinarios] = useState([])
    const [horarios, setHorarios] = useState([])
    const [messageError, setMessageError] = useState("")
    const [busqueda, setBusqueda] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const canDelete = permisos.includes("veterinarios.delete_veterinario")
    const canAdd = permisos.includes("veterinarios.add_veterinario")
    const canEdit = permisos.includes("veterinarios.change_veterinario")
    const navigate = useNavigate()
    const accessToken = localStorage.getItem("access")


    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/permisos`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => {
                if (res.status === 401) {
                    localStorage.clear();
                    navigate("/");
                    return;
                }
                return res.json();
            })
            .then(data => data && setPermisos(data));
    }, [])



    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/veterinarios/?page=${page}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => setVeterinarios(data.results ?? data))
            .then(data => setTotalPages(Math.ceil(data.count / 10)))
    }, [page])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/horarios`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => setHorarios(data))
    }, [])

    function buscar_veterinario() {
        if (busqueda.trim() === "") {
            fetch(`${import.meta.env.VITE_API_URL}/veterinarios/?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,

                },
            })
                .then(res => res.json())
                .then(data => {
                    setVeterinarios(data.results ?? data)
                    setMessageError(""); // limpiamos mensaje de error
                })
                .catch(err => setMessageError("Error al cargar los veterinarios"));
            return;
        }
        fetch(`${import.meta.env.VITE_API_URL}/veterinarios/buscar_por_nombre?nombre=${busqueda}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => setVeterinarios(data.results ?? data))
    }

    function eliminarVeterinario(id) {
        Swal.fire({
            title: "Estas seguro?",
            text: "No podras revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminarlo!"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${import.meta.env.VITE_API_URL}/veterinarios/${id}/`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,

                    },
                })
                Swal.fire({
                    title: "Deleted!",
                    text: "El veterinario ha sido eliminado",
                    icon: "success"
                });
                navigate("/personal")
            }
        });
    }
    return (
        <div className="flex h-screen w-full overflow-hidden bg-white font-['Manrope',_sans-serif] text-[#111813]">
            {/* Sidebar Lateral */}
            <aside className="hidden w-64 flex-col border-r border-[#e5e7eb] bg-white lg:flex">
                <div className="flex h-full flex-col justify-between p-4">
                    <div className="flex flex-col gap-4">
                        {/* Perfil Clínica */}
                        <div className="flex gap-3 mb-6 px-2 text-left">
                            <Link to="/internaciones">
                                <div className="flex flex-col justify-center">

                                    <h1 className="text-lg font-bold leading-tight">VetManager</h1>

                                </div>
                            </Link>
                        </div>
                        {/* Navegación Sidebar */}
                        <nav className="flex flex-col gap-2">
                            <Link to="/inicio">
                                <a className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#f0f4f2] rounded-xl text-[#61896f] hover:text-[#111813] transition-all" href="#">
                                    <span className="material-symbols-outlined">dashboard</span>
                                    <p className="text-sm font-bold">Inicio</p>

                                </a>
                            </Link>

                            <a className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#eefdf3] text-[#13ec5b] shadow-sm" href="#">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
                                <p className="text-sm font-black">Veterinarios</p>
                            </a>

                        </nav>
                    </div>
                    {/* Acciones Inferiores */}
                    <div className="flex flex-col gap-2 px-2 pb-2">

                        <button className="flex items-center gap-3 px-3 py-2 text-[#61896f] hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined">logout</span>
                            <span onClick={() => logout(navigate)} className="text-sm font-bold">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Contenido Principal */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8fafc]">
                <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
                    <div className="mx-auto max-w-7xl flex flex-col gap-8 text-left">

                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-sm font-bold text-[#61896f]">
                            <Link to="/inicio">
                                <a className="hover:text-[#13ec5b]" href="#">Inicio</a>
                            </Link>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <span className="text-[#111813]">Gestión de Veterinarios</span>
                        </div>

                        {/* Cabecera de Página */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#111813]">Equipo Veterinario</h1>
                                <p className="text-[#61896f] text-base max-w-2xl font-medium">
                                    Gestiona los perfiles, horarios y acceso de tu staff médico de manera centralizada.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                {/*  <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">
                                    <span className="material-symbols-outlined text-[20px]">file_download</span>
                                    <span>Exportar</span>
                                </button> */}
                                <Link to="/personal/añadir">
                                    {canAdd && (
                                        <button className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#13ec5b] text-white font-black hover:bg-[#0fb847] transition-all shadow-lg shadow-[#13ec5b]/20 active:scale-95">
                                            <span className="material-symbols-outlined text-[20px]">add</span>
                                            <span>Añadir Veterinario</span>
                                        </button>
                                    )}
                                </Link>
                            </div>
                        </div>

                        {/* Barra de Búsqueda y Filtros */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
                            <div className="w-full lg:max-w-md relative group">

                                <input
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 border-none rounded-xl bg-[#f8fafc] text-[#111813] placeholder:text-slate-400 focus:ring-2 focus:ring-[#13ec5b]/20 transition-all font-medium text-sm"
                                    placeholder="Buscar por nombre, ID o email..."
                                    type="text"
                                />

                                <span type="button" onClick={buscar_veterinario} className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13ec5b] transition-colors">search</span>


                            </div>

                        </div>

                        {/* Tabla de Resultados */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#f8fafc] border-b border-slate-50 text-[#61896f]">
                                            <th className="py-4 px-8 text-[11px] font-black uppercase tracking-widest">Veterinario</th>

                                            <th className="py-4 px-6 text-[11px] font-black uppercase tracking-widest">Contacto</th>
                                            <th className="py-4 px-6 text-[11px] font-black uppercase tracking-widest">Horario</th>
                                            <th className="py-4 px-6 text-[11px] font-black uppercase tracking-widest">Acciones</th>


                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {veterinarios.map(vet => {
                                            const horariosVet = horarios.filter(
                                                h => h.veterinario === vet.id
                                            );

                                            return (
                                                <tr key={vet.id} className="group hover:bg-[#eefdf3]/30 transition-all">

                                                    <td className="py-5 px-8 whitespace-nowrap">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-11 w-11 rounded-full overflow-hidden border-2 border-white shadow-sm bg-slate-100">
                                                                <img
                                                                    src={`https://ui-avatars.com/api/?name=${vet.nombre}`}
                                                                    alt="Vet"
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900 text-sm">{vet.nombre}</p>
                                                                <p className="text-[10px] font-black text-[#13ec5b] uppercase">
                                                                    ID: {vet.id}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>



                                                    <td className="py-5 px-8 whitespace-nowrap">
                                                        <div className="flex flex-col gap-1 text-slate-500 font-bold">
                                                            <div className="flex items-center gap-1.5 text-xs">
                                                                <span className="material-symbols-outlined text-[16px]">
                                                                    call
                                                                </span>
                                                                {vet.telefono || "Sin teléfono"}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* HORARIO */}
                                                    <td className="py-5 px-8 whitespace-nowrap">
                                                        {horariosVet.length > 0 ? (
                                                            <div className="flex flex-col gap-2">
                                                                {horariosVet.map(h => (
                                                                    <div key={h.id} className="flex flex-col gap-1">
                                                                        <span className="text-xs font-bold text-slate-700">
                                                                            {h.dias}
                                                                        </span>
                                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-black">
                                                                            <span className="material-symbols-outlined text-[14px]">
                                                                                schedule
                                                                            </span>
                                                                            {h.hora_inicio} – {h.hora_fin}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 text-slate-400 text-[10px] font-black">
                                                                Sin horario
                                                            </span>
                                                        )}
                                                    </td>



                                                    <td className="py-5 px-8 whitespace-nowrap text-right">

                                                        <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all">
                                                            {canEdit && (
                                                                <Link to={`/personal/modificar/${vet.id}`}>
                                                                    <button className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-[#13ec5b] hover:shadow-md transition-all shadow-sm">
                                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                                    </button>

                                                                </Link>
                                                            )}
                                                            {canDelete && (

                                                                <button onClick={() => eliminarVeterinario(vet.id)} className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:shadow-md transition-all shadow-sm">
                                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                                </button>
                                                            )}

                                                        </div>
                                                    </td>

                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación */}
                            <div className="bg-white border-t border-slate-50 px-8 py-5 flex items-center justify-between">
                                <p className="text-xs font-bold text-slate-400">
                                    Mostrando <span className="text-slate-900">{page}</span><span className="text-slate-900"> de </span><span className="text-slate-900">{totalPages}</span> resultados
                                </p>
                                <div className="flex gap-2">
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
                        </div>
                    </div>
                </div >
            </main >
        </div >
    )

}

export default Personal