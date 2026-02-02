import React from 'react';
import API_URL from '../config';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom"



const InventarioSuministros = () => {

    const [productos, setProductos] = useState([])
    const [categorias, setCategorias] = useState([])
    const [selectCategorias, setSelectCategorias] = useState("")
    const [buscar, setBuscar] = useState("")
    const [orden, setOrden] = useState(false)
    const [stockCritico, setStockCritico] = useState([])

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const accessToken = localStorage.getItem("access");



    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/productos/?page=${page}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })

            .then(response => response.json())
            .then(data => {
                setProductos(data.results ?? data)
                setTotalPages(Math.ceil(data.count / 10))
            })
    }, [page])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/productos/stock_critico/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(response => response.json())
            .then(data => setStockCritico(data))
    }, [])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/productos/filtrar_producto/?categoria=${selectCategorias}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(response => response.json())
            .then(data => setProductos(data.results ?? data))
    }, [selectCategorias])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/categorias/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(response => response.json())
            .then(data => setCategorias(data))
    }, [])



    function search(nombre) {
        if (nombre.length > 0) {
            fetch(`${import.meta.env.VITE_API_URL}/productos/buscar_producto?nombre=${nombre}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,

                },
            })
                .then(response => response.json())
                .then(data => setProductos(data))
        }
        else {
            fetch(`${import.meta.env.VITE_API_URL}/productos/?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,

                },
            })
                .then(response => response.json())
                .then(data => {
                    setProductos(data.results ?? data)
                    setTotalPages(Math.ceil(data.count / 10))
                })
        }



    }

    function stockMasAlto() {
        fetch(`${import.meta.env.VITE_API_URL}/productos/ordenar_productos/?page=${page}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(response => response.json())

            .then(data => setProductos(data.results ?? data))

    }

    function stockMasBajo() {
        fetch(`${import.meta.env.VITE_API_URL}/productos/ordenar_productos_desc/?page=${page}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(response => response.json())
            .then(data => setProductos(data.results ?? data))
    }

    function eliminarProducto(id) {

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
                fetch(`${import.meta.env.VITE_API_URL}/productos/${id}/`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    }

                })
                Swal.fire({
                    title: "Deleted!",
                    text: "El producto ha sido eliminado",
                    icon: "success"
                });

                setProductos(prev => prev.filter(d => d.id !== id));
            }
        });
    }


    return (
        <div className="bg-white text-[#111813] font-['Manrope',_sans-serif] min-h-screen flex flex-col">
            {/* Top Navigation Bar */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#f0f4f2] px-10 py-3 bg-white sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-8">
                    <Link to="/inicio">
                        <div className="flex items-center gap-4 text-[#111813]">

                            <div className="size-8 text-[#13ec5b]">
                                <svg fill="currentColor" viewBox="0 0 48 48">
                                    <path d="M24 0.75L47.24 24L24 47.24L0.75 24L24 0.75ZM21 35.75V12.24L9.24 24L21 35.75Z" />
                                </svg>
                            </div>

                            <h2 className="text-lg font-bold tracking-tight">VetManager</h2>

                        </div>
                    </Link>

                </div>

            </header>

            <div className="flex flex-1">
                {/* Sidebar Lateral */}
                <aside className="w-64 border-r border-[#f0f4f2] bg-white p-6 hidden lg:flex flex-col justify-between">
                    <div className="flex flex-col gap-8 text-left">

                        <nav className="flex flex-col gap-2">

                            <a className="flex items-center gap-3 px-4 py-2.5 bg-[#eefdf3] text-[#13ec5b] rounded-xl font-black shadow-sm" href="#">
                                <span className="material-symbols-outlined">inventory_2</span>
                                <span className="text-sm">Suministros Internos</span>
                            </a>


                            <a className="flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:bg-[#f8fafc] hover:text-[#13ec5b] rounded-xl transition-all font-bold cursor-not-allowed" href="#">
                                <span className="material-symbols-outlined">local_shipping</span>
                                <span className="text-sm">Proveedores</span>
                            </a>
                        </nav>
                    </div>

                </aside>

                {/* Contenido Principal */}
                <main className="flex-1 overflow-y-auto bg-[#f8fafc] px-6 py-10 md:px-12 lg:px-16 text-left">

                    {/* Cabecera del Contenido */}
                    <div className="flex flex-wrap justify-between items-end gap-4 mb-10 text-left">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-[#111813] text-3xl font-black tracking-tight">Inventario de Suministros Internos</h2>
                            <p className="text-[#61896f] text-base font-medium">Gestión integral y control de insumos médicos para uso clínico diario.</p>
                        </div>
                        <div className="flex gap-3">
                            {/*  <button className="flex items-center justify-center rounded-xl h-11 px-5 bg-white border border-[#dbe6df] text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
                                <span className="material-symbols-outlined mr-2 text-[20px]">download</span> Exportar
                            </button> */}
                            <Link to="/inventario/agregar">
                                <button className="flex items-center justify-center rounded-xl h-11 px-6 bg-[#13ec5b] text-white font-black text-sm shadow-lg shadow-[#13ec5b]/20 hover:scale-[1.02] transition-transform active:scale-95">
                                    <span className="material-symbols-outlined mr-2 text-[20px]">add_circle</span> Agregar Insumo
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Grid de Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {/* <div className="flex flex-col gap-2 rounded-3xl p-6 bg-white border border-slate-100 shadow-sm">
                            <p className="text-[#61896f] text-[10px] font-black uppercase tracking-widest">Total de Items</p>
                            <div className="flex items-end justify-between">
                                <p className="text-[#111813] text-3xl font-black">1,240</p>
                                <span className="text-[#13ec5b] text-xs font-black bg-[#eefdf3] px-2 py-1 rounded-lg">+5.2%</span>
                            </div>
                        </div> */}
                        <div className="flex flex-col gap-2 rounded-3xl p-6 bg-white border border-slate-100 shadow-sm">
                            <p className="text-[#61896f] text-[10px] font-black uppercase tracking-widest">Stock Crítico</p>
                            <div className="flex items-end justify-between">
                                <p className="text-red-500 text-3xl font-black">{stockCritico} Productos</p>
                                <span className="text-red-500 text-xs font-black bg-red-50 px-2 py-1 rounded-lg">+2</span>
                            </div>
                        </div>
                        {/*  <div className="flex flex-col gap-2 rounded-3xl p-6 bg-white border border-slate-100 shadow-sm">
                            <p className="text-[#61896f] text-[10px] font-black uppercase tracking-widest">Consumo Mensual</p>
                            <div className="flex items-end justify-between">
                                <p className="text-[#111813] text-3xl font-black">428</p>
                                <span className="text-[#13ec5b] text-xs font-black bg-[#eefdf3] px-2 py-1 rounded-lg">-3%</span>
                            </div>
                        </div> */}
                        {/*  <div className="flex flex-col gap-2 rounded-3xl p-6 bg-white border border-slate-100 shadow-sm text-left">
                            <p className="text-[#61896f] text-[10px] font-black uppercase tracking-widest">Valor Inventario</p>
                            <div className="flex items-end justify-between">
                                <p className="text-[#111813] text-3xl font-black">$14.2k</p>
                                <span className="text-slate-400 text-xs font-black uppercase">USD</span>
                            </div>
                        </div> */}
                    </div>

                    {/* Barra de Filtros y Tabla */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden mb-12">
                        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="relative w-full md:max-w-md">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                <input onChange={(e) => search(e.target.value)} className="w-full pl-11 pr-4 py-2.5 rounded-2xl border-none bg-slate-50 focus:ring-2 focus:ring-[#13ec5b]/20 font-medium text-sm" placeholder="Buscar por nombre..." />
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <select
                                    onChange={(e) => setSelectCategorias(e.target.value)}
                                    className="flex-1 md:flex-none px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600"
                                >
                                    <option value="">Todos</option>
                                    {categorias.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                    ))}
                                </select>

                                {/* 🔴 SOLO ESTE CONTENEDOR ES RELATIVE */}
                                <div className="relative">
                                    <button
                                        onClick={() => setOrden(!orden)}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600"
                                    >
                                        <span className="material-symbols-outlined text-lg">sort</span>
                                        Ordenar
                                    </button>

                                    {orden && (
                                        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl p-3 shadow flex flex-col gap-2 z-50">
                                            <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                                <input type="checkbox" onChange={stockMasAlto} />
                                                Stock más alto
                                            </label>

                                            <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                                <input type="checkbox" onChange={stockMasBajo} />
                                                Stock más bajo
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tabla de Insumos */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#f8fafc] text-[#61896f] text-[11px] font-black uppercase tracking-widest border-b border-slate-50">
                                        <th className="px-8 py-5">Imagen</th>
                                        <th className="px-8 py-5">Nombre del Insumo</th>
                                        <th className="px-8 py-5">ID</th>
                                        <th className="px-8 py-5">Categoría</th>
                                        <th className="px-8 py-5 text-center">Stock Actual</th>
                                        <th className="px-8 py-5 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                {productos.map(prod => (
                                    <tbody className="divide-y divide-slate-50 font-bold">

                                        < tr className="bg-red-50/50 hover:bg-red-50 transition-colors group" >
                                            <td className="px-8 py-6">


                                                <img
                                                    src={prod.imagen}
                                                    alt={prod.nombre}
                                                    className="w-16 h-16 object-cover"
                                                />

                                            </td>

                                            <td className="px-8 py-6 text-sm text-slate-500 font-medium text-left">{prod.nombre}</td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="text-lg font-black text-red-600">
                                                    {prod.id}
                                                </span>
                                            </td>

                                            <td className="px-8 py-6 text-sm text-slate-500 font-medium text-left">{prod.categoria_nombre}</td>
                                            <td className="px-8 py-6 text-sm text-slate-500 font-medium text-center">
                                                {prod.stock}
                                            </td>

                                            <td className="px-8 py-6">
                                                <div className="flex justify-center">
                                                    <Link to={`/inventario/editar/${prod.id}`}>
                                                        <button className="p-2 rounded-xl text-slate-300 hover:text-[#13ec5b] hover:bg-white hover:shadow-sm transition-all">
                                                            <span className="material-symbols-outlined">edit</span>
                                                        </button>
                                                    </Link>
                                                    <button onClick={() => eliminarProducto(prod.id)} className="p-2 rounded-xl text-slate-300 hover:text-[#13ec5b] hover:bg-white hover:shadow-sm transition-all">
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Fila Stock Bueno */}

                                    </tbody>

                                ))}
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
                    </div>
                </main>
            </div>
        </div>
    );
};

export default InventarioSuministros;