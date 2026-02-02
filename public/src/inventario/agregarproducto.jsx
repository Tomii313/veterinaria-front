import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

function AgregarProducto() {

    const navigate = useNavigate()
    const [nombre, setNombre] = useState("")
    const [categoria, setCategoria] = useState("")
    const [stock, setStock] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [imagen, setImagen] = useState("")
    const [categorias, setCategorias] = useState([])
    const accessToken = localStorage.getItem("access");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/categorias`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => setCategorias(data))

    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()


        const formData = new FormData()
        formData.append("nombre", nombre)
        formData.append("categoria", categoria)
        formData.append("stock", stock)
        formData.append("descripcion", descripcion)
        formData.append("imagen", imagen)

        fetch(`${import.meta.env.VITE_API_URL}/productos/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
            body: formData
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Error al crear producto");
                }
                return res.json();
            })
            .then(data => {
                Swal.fire({
                    title: "¡Creado!",
                    text: "El producto se ha creado correctamente.",
                    icon: "success"
                });
                navigate("/inventario");
            })
            .catch(err => {
                console.error(err);
            });

    }


    return (
        <div className="bg-white text-[#111813] font-['Manrope',_sans-serif] min-h-screen flex flex-col">
            {/* Top Navigation Bar */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#f0f4f2] px-10 py-3 bg-white sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-8 text-left">
                    <div className="flex items-center gap-4">
                        <div className="size-6 text-[#13ec5b]">
                            <svg fill="currentColor" viewBox="0 0 48 48">
                                <path d="M24 0.75L47.24 24L24 47.24L0.75 24L24 0.75ZM21 35.75V12.24L9.24 24L21 35.75Z" />
                            </svg>
                        </div>
                        <Link to="/inicio">
                            <h2 className="text-lg font-bold tracking-tight">VetManager</h2>
                        </Link>
                    </div>

                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center py-10 bg-[#f8fafc]">
                <div className="w-full max-w-[850px] px-6 text-left">

                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 mb-6 text-sm font-bold text-slate-400">
                        <Link to="/inventario" className="hover:text-[#13ec5b] flex items-center gap-1" href="#">
                            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                            Inventario
                        </Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900">Crear Producto</span>
                    </div>

                    {/* Page Heading */}
                    <div className="mb-10">
                        <h1 className="text-[#111813] text-3xl md:text-4xl font-black tracking-tight leading-tight">Crear Producto de Inventario Interno</h1>
                        <p className="text-[#61896f] text-base font-medium mt-2">Añade un nuevo insumo al stock de la clínica de forma rápida y organizada.</p>
                    </div>

                    {/* Main Form Card */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-slate-100 overflow-hidden mb-8">
                        <form className="p-8 md:p-10 space-y-10" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                                {/* Columna Izquierda: Info Básica */}
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Nombre del Producto</label>
                                        <input
                                            value={nombre} onChange={(e) => setNombre(e.target.value)}
                                            className="w-full rounded-2xl border-slate-100 bg-[#f8fafc] h-12 px-5 font-bold text-slate-900 focus:ring-2 focus:ring-[#13ec5b]/20 outline-none transition-all"
                                            placeholder="Ej. Gasas estériles, Jeringas 5ml"
                                            type="text"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Descripción</label>
                                        <textarea
                                            value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                                            className="w-full rounded-2xl border-slate-100 bg-[#f8fafc] h-12 px-5 font-bold text-slate-900 focus:ring-2 focus:ring-[#13ec5b]/20 outline-none transition-all"
                                            type="text"
                                            rows="4"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Categoría</label>
                                        <div className="relative">
                                            <select onChange={(e) => setCategoria(e.target.value)} className="w-full h-12 px-5 rounded-2xl border-slate-100 bg-[#f8fafc] font-bold text-slate-700 appearance-none outline-none focus:ring-2 focus:ring-[#13ec5b]/20 cursor-pointer">
                                                <option disabled selected>Seleccionar categoría</option>
                                                {categorias.map(categoria => (
                                                    <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                                                ))}

                                            </select>
                                            <span className="material-symbols-outlined absolute right-4 top-3 text-slate-400 pointer-events-none">expand_more</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Stock Inicial</label>
                                        <div className="flex items-center bg-[#f8fafc] border border-slate-100 rounded-2xl overflow-hidden h-12">
                                            <button className="px-5 h-full hover:bg-white text-slate-400 transition-colors" type="button">
                                                <span className="material-symbols-outlined text-[20px]">remove</span>
                                            </button>
                                            <input
                                                value={stock}
                                                onChange={(e) => setStock(e.target.value)}
                                                className="flex-1 text-center bg-transparent border-none text-slate-900 font-black focus:ring-0 text-base"
                                                min="0"
                                                type="number"
                                                defaultValue="0"
                                            />
                                            <button className="px-5 h-full hover:bg-white text-[#13ec5b] transition-colors" type="button">
                                                <span className="material-symbols-outlined text-[20px]">add</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Columna Derecha: Carga de Imagen */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">
                                        Imagen del Producto
                                    </label>

                                    {/* 👇 ESTE LABEL ES LA CLAVE */}
                                    <label
                                        htmlFor="imagen"
                                        className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-8 hover:border-[#13ec5b] hover:bg-[#eefdf3]/30 transition-all group cursor-pointer min-h-[220px]"
                                    >
                                        {imagen ? (
                                            <>
                                                <div className="bg-[#eefdf3] text-[#13ec5b] p-5 rounded-2xl mb-4 shadow-sm">
                                                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                                                </div>

                                                <p className="text-sm font-black text-[#0fb847] uppercase tracking-tight">
                                                    Imagen adjuntada
                                                </p>

                                                <p className="text-xs font-bold text-slate-500 mt-1">
                                                    {imagen.name}
                                                </p>

                                                <p className="mt-4 text-[#13ec5b] font-black text-xs uppercase tracking-widest hover:underline">
                                                    Click para cambiar imagen
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="bg-[#eefdf3] text-[#13ec5b] p-5 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                                    <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                                                </div>

                                                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">
                                                    Arrastra una imagen aquí
                                                </p>
                                                <p className="text-xs font-bold text-slate-400 mt-1">
                                                    PNG, JPG o GIF hasta 5MB
                                                </p>

                                                <button
                                                    className="mt-4 text-[#13ec5b] font-black text-xs uppercase tracking-widest hover:underline"
                                                    type="button"
                                                >
                                                    Seleccionar archivo
                                                </button>
                                            </>
                                        )}
                                    </label>

                                    {/* 👇 INPUT FUERA, OCULTO, PERO CONECTADO */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImagen(e.target.files[0])}
                                        className="hidden"
                                        id="imagen"
                                    />
                                </div>
                            </div>

                            {/* Botones de Acción */}
                            <div className="flex items-center justify-end gap-6 pt-8 border-t border-slate-50">
                                <Link to="/inventario">
                                    <button className="px-8 py-3 text-xs font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest" type="button">
                                        Cancelar
                                    </button>
                                </Link>
                                <button className="px-10 py-3.5 rounded-2xl bg-[#13ec5b] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-[#13ec5b]/20 hover:bg-[#0fb847] active:scale-95 transition-all" type="submit">
                                    Crear Producto
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Sección de Tips Informativos */}

                </div>
            </main>

            <footer className="py-8 px-10 text-center text-slate-400 text-[11px] font-black uppercase tracking-widest">
                <p>© 2026 VetManager Software de Gestión Veterinaria. Todos los derechos reservados.</p>
            </footer>
        </div>
    );

}

export default AgregarProducto
