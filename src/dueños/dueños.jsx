import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';






const Dueños = () => {
    const accessToken = localStorage.getItem("access");
    const [permisos, setPermisos] = useState([])
    const [duenios, setDuenios] = useState([])
    const [animales, setAnimales] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [dni, setDni] = useState("")
    const navigate = useNavigate()
    const canAdd = permisos.includes("duenios.add_duenio")
    const canDelete = permisos.includes("duenios.delete_duenio")
    const canChange = permisos.includes("duenios.change_duenio")




    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/permisos/`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            }
        })
            .then(res => res.json())
            .then(data => setPermisos(data))
    }, [])

    useEffect(() => {
        try {
            fetch(`${import.meta.env.VITE_API_URL}/duenios/?page=${page}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                }
            })
                .then(res => res.json())
                .then(data => {
                    setDuenios(data.results ?? data)
                    setTotalPages(Math.ceil(data.count / 10))
                })

        } catch (error) {
            console.log(error)
        }
    }, [page])

    useEffect(() => {
        try {
            fetch(`${import.meta.env.VITE_API_URL}/animales/`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                }
            })
                .then(res => res.json())
                .then(data => setAnimales(data.results ?? data))
        } catch (error) {
            console.log(error)
        }
    }, [])

    function eliminarDuenio(id) {

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
                fetch(`${import.meta.env.VITE_API_URL}/duenios/${id}/`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    }

                })
                Swal.fire({
                    title: "Deleted!",
                    text: "El dueño ha sido eliminado",
                    icon: "success"
                });

                setDuenios(prev => prev.filter(d => d.id !== id));
            }
        });
    }

    function filtrar_dni() {

        try {
            fetch(`${import.meta.env.VITE_API_URL}/duenios/filtrar_dni/?dni=${dni}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (!Array.isArray(data) || data.length === 0) {
                        setDuenios([])
                        alert("Propietario no encontrado")
                        fetch(`${import.meta.env.VITE_API_URL}/duenios/`, {
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${accessToken}`,
                            }
                        })
                            .then(res => res.json())
                            .then(data => setDuenios(data.results ?? data))
                        return
                    }
                    setDuenios(data)
                })


                .catch(error => {
                    console.log(error)
                })
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="bg-white text-[#111813] font-['Manrope',_sans-serif] min-h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 bg-white border-b border-solid border-[#f0f4f2] px-6 lg:px-10 py-3 flex items-center justify-between whitespace-nowrap shadow-sm">
                <Link to="/inicio">
                    <div className="flex items-center gap-4">

                        <div className="size-8 flex items-center justify-center text-[#13ec5b]">
                            <span className="material-symbols-outlined text-3xl">pets</span>
                        </div>
                        <h2 className="text-[#111813] text-xl font-extrabold leading-tight tracking-tight">VetManager</h2>

                    </div>
                </Link>
                <nav className="hidden md:flex flex-1 justify-center gap-8 px-8">
                    <Link to="/inicio">
                        <a className="text-[#61896f] text-sm font-medium hover:text-[#13ec5b] transition-colors" href="#">Inicio</a>
                    </Link>

                </nav>
                <div className="flex items-center gap-4">

                    <div className="h-8 w-[1px] bg-[#f0f4f2] hidden sm:block"></div>
                    <div className="flex items-center gap-3">


                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col w-full max-w-[1440px] mx-auto p-6 lg:p-10">
                {/* Breadcrumbs & Heading */}
                <div className="flex flex-col gap-6 mb-8 text-left">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Link to="/inicio">
                            <a className="text-[#61896f] hover:text-[#13ec5b]" href="#">Inicio</a>
                        </Link>
                        <span className="text-[#61896f]">/</span>
                        <span className="text-[#111813]">Propietarios</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-[#111813] text-3xl md:text-4xl font-black leading-tight tracking-tight">Gestión de Dueños</h1>
                            <p className="text-[#61896f] text-base font-normal max-w-2xl">
                                Administra la información de los clientes, consulta historiales y gestiona las mascotas asociadas desde un único lugar.
                            </p>
                        </div>
                        {canAdd && (
                            <button className="flex items-center gap-2 h-12 px-6 bg-[#13ec5b] hover:bg-[#0fd14e] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#13ec5b]/20 transition-all active:scale-95 whitespace-nowrap">
                                <Link to="/dueños/agregar">
                                    <span className="material-symbols-outlined">person_add</span>
                                    <span>Agregar Dueño</span>
                                </Link>
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#f0f4f2] mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
                    {/* Search */}
                    <div className="flex items-center w-full lg:max-w-md h-12 bg-[#f6f8f6] rounded-xl overflow-hidden border border-transparent focus-within:border-[#13ec5b]/50 transition-all">
                        <div className="flex items-center justify-center pl-4 text-[#61896f]">
                            <button onClick={filtrar_dni}>
                                <span className="material-symbols-outlined">search</span>
                            </button>
                        </div>
                        <input
                            onChange={(e) => setDni(e.target.value)}
                            className="w-full h-full bg-transparent border-none text-[#111813] placeholder:text-[#61896f]/70 px-3 focus:ring-0 text-sm font-medium"
                            placeholder="Buscar por DNI"
                        />

                    </div>
                    {/* Filter Controls */}
                    <div className="flex items-center gap-3 w-full lg:w-auto">

                        <select className="h-10 pl-4 pr-10 bg-white border border-[#f0f4f2] rounded-xl text-sm font-bold text-[#111813] focus:ring-1 focus:ring-[#13ec5b] outline-none cursor-pointer min-w-[160px]">
                            <option>Ordenar por: Reciente</option>
                            <option>Nombre (A-Z)</option>
                        </select>
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-[#f0f4f2] bg-white text-[#61896f] hover:text-[#13ec5b] hover:border-[#13ec5b] transition-colors">
                            <span className="material-symbols-outlined">download</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#f0f4f2] overflow-hidden flex-1">
                    <div className="overflow-x-auto">

                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f6f8f6] border-b border-[#f0f4f2]">
                                    <th className="px-6 py-4 text-[11px] font-bold text-[#61896f] uppercase tracking-wider">Propietario</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-[#61896f] uppercase tracking-wider">Contacto</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-[#61896f] uppercase tracking-wider">Mascotas</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-[#61896f] uppercase tracking-wider">Última Visita</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-[#61896f] uppercase tracking-wider text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0f4f2]">
                                {/* Fila 1 */}
                                {duenios.map(duenio => (
                                    <tr className="group hover:bg-[#13ec5b]/5 transition-colors">
                                        <td className="px-6 py-5 align-top">

                                            <div className="flex items-center gap-3">


                                                <div>

                                                    <div className="text-sm font-bold text-[#111813]">{duenio.nombre} {duenio.apellido}</div>
                                                    <div className="text-xs text-[#61896f]">ID: {duenio.id}</div>

                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 align-top">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm text-[#111813]">
                                                    <span className="material-symbols-outlined text-[16px] text-[#61896f]">call</span> {duenio.telefono}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-[#61896f]">
                                                    <span className="material-symbols-outlined text-[16px]">mail</span> {duenio.email}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 align-top">
                                            <div className="flex flex-wrap gap-2">


                                                <span className="inline-flex flex-wrap items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-100 text-xs font-bold">
                                                    <span className="material-symbols-outlined text-[14px]"></span>

                                                    {duenio.mascotas.length > 0 ? (
                                                        duenio.mascotas.map((m, i) => (
                                                            <span key={i}>{m.nombre}</span>
                                                        ))
                                                    ) : (
                                                        <span>Sin mascotas</span>
                                                    )}
                                                </span>










                                            </div>
                                        </td>
                                        <td className="px-6 py-5 align-top">

                                            <div className="text-sm text-[#111813] font-bold">{duenio.ultimoturno}</div>

                                        </td>
                                        <td className="px-6 py-5 align-middle text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                {canDelete && (
                                                    <button onClick={() => eliminarDuenio(duenio.id)} className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-[#61896f] hover:text-[#13ec5b] transition-all"><span className="material-symbols-outlined text-xl">delete</span></button>
                                                )}
                                                {canChange && (
                                                    <Link to={`/dueños/detalle/${duenio.id}`}>
                                                        <button className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-[#61896f] hover:text-blue-500 transition-all"><span className="material-symbols-outlined text-xl">edit</span></button>
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                    </div>

                    {/* Pagination */}
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
    );
};

export default Dueños;