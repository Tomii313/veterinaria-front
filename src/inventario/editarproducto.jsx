import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useNavigate, Link } from "react-router-dom"


function EditarProducto() {

    const navigate = useNavigate()
    const [nombre, setNombre] = useState("")
    const [stock, setStock] = useState("")
    const [categoria, setCategoria] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const { id } = useParams()
    const [producto, setProducto] = useState([])
    const [categorias, setCategorias] = useState([])
    const [imagenActual, setImagenActual] = useState("")
    const [imagenNueva, setImagenNueva] = useState(null)
    const accessToken = localStorage.getItem("access");



    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/productos/${id}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => {
                setNombre(data.nombre)
                setStock(data.stock)
                setCategoria(data.categoria)
                setDescripcion(data.descripcion)
                setImagenActual(data.imagen)
            })
    }, [id])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/categorias/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => {
                setCategorias(data)
            })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        if (imagenNueva) {
            const formData = new FormData()
            formData.append("nombre", nombre)
            formData.append("stock", stock)
            formData.append("categoria", categoria)
            formData.append("descripcion", descripcion)
            formData.append("imagen", imagenNueva)

            fetch(`${import.meta.env.VITE_API_URL}/productos/${id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,

                },
                body: formData,
            })
        } else {
            fetch(`${import.meta.env.VITE_API_URL}/productos/${id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,

                },
                body: JSON.stringify({
                    nombre,
                    stock,
                    categoria,
                    descripcion,
                }),
            })
                .then(response => {
                    if (response.ok) {
                        Swal.fire({
                            title: "¡Actualizado!",
                            text: "La información del producto se ha modificado correctamente.",
                            icon: "success"
                        });
                        navigate("/inventario");
                    }
                })

        }

    }
    return (
        <div className="flex h-screen overflow-hidden bg-white font-['Manrope',_sans-serif] text-[#111813]">
            {/* Side Navigation */}
            <aside className="w-64 hidden lg:flex flex-col justify-between bg-white border-r border-zinc-200 p-4 shrink-0">
                <div className="flex flex-col gap-8">
                    <Link to="/inicio">
                        <div className="flex gap-3 items-center px-2 text-left">
                            <div className="bg-[#13ec5b] rounded-lg p-1.5 flex items-center justify-center shadow-sm shadow-[#13ec5b]/20">
                                <span className="material-symbols-outlined text-white text-[20px]">pets</span>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-[#111813] text-base font-black leading-tight">VetManager</h1>

                            </div>
                        </div>
                    </Link>
                    <nav className="flex flex-col gap-1 text-left">



                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#eefdf3] text-[#13ec5b]">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
                            <p className="text-sm font-black">Inventario</p>
                        </div>
                    </nav>
                </div>

                {/* User Profile Sidebar */}
                <div className="flex items-center gap-3 px-3 py-4 border-t border-zinc-100 text-left">


                </div>
            </aside >

            {/* Main Content Area */}
            < main className="flex-1 overflow-y-auto bg-[#f8fafc]" >
                {/* Top Nav Header */}


                < div className="max-w-4xl mx-auto p-8 text-left" >
                    {/* Breadcrumbs */}
                    < div className="flex items-center gap-2 mb-6 text-sm font-bold text-slate-400" >
                        <Link to="/inventario">
                            <a className="hover:text-[#13ec5b] transition-colors" href="#">Inventario</a>
                        </Link>
                        <span className="material-symbols-outlined text-slate-300 text-xs">chevron_right</span>
                        <span className="text-slate-900">Editar Producto</span>
                    </div >

                    {/* Page Heading */}
                    < div className="mb-10 text-left" >
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Editar Producto</h1>
                        <p className="text-slate-500 font-medium mt-2">Modifica los detalles del insumo seleccionado para actualizar el stock y la información clínica.</p>
                    </div >

                    {/* Main Form Card */}
                    < div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-slate-100 overflow-hidden mb-12" >
                        <div className="p-8 border-b border-slate-50">
                            <h3 className="text-xl font-black text-slate-800">Información General</h3>
                        </div>

                        <form className="p-8 md:p-10 space-y-10" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                                {/* Columna Izquierda: Detalles */}
                                <div className="space-y-6 text-left">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Nombre del Insumo</label>
                                        <input
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            className="w-full rounded-2xl border-slate-100 bg-[#f8fafc] px-5 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#13ec5b]/20 outline-none transition-all"
                                            type="text"

                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Categoría</label>
                                        <div className="relative">
                                            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full px-5 py-3 rounded-2xl border-slate-100 bg-[#f8fafc] font-bold text-slate-700 appearance-none outline-none focus:ring-2 focus:ring-[#13ec5b]/20 cursor-pointer">
                                                {categorias.map((categoria) => (
                                                    <option key={categoria.id} value={categoria.id}>
                                                        {categoria.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="material-symbols-outlined absolute right-4 top-3 text-slate-400 pointer-events-none">expand_more</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Stock Actual</label>
                                            <div className="flex items-center bg-[#f8fafc] border border-slate-100 rounded-2xl overflow-hidden h-11">
                                                <button className="px-3 h-full hover:bg-white text-slate-400 transition-colors">
                                                    <span className="material-symbols-outlined text-[18px]">remove</span>
                                                </button>
                                                <input value={stock} onChange={(e) => setStock(e.target.value)} className="w-full text-center bg-transparent border-none text-slate-900 font-black focus:ring-0 text-sm" type="number" defaultValue="125" />
                                                <button className="px-3 h-full hover:bg-white text-[#13ec5b] transition-colors">
                                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/* Columna Derecha: Imagen */}
                                <div className="space-y-6 text-left">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">
                                            Imagen del Producto
                                        </label>

                                        <div className="relative group">
                                            <label
                                                htmlFor="imagen"
                                                className="w-full aspect-video rounded-3xl border-2 border-dashed border-slate-200 overflow-hidden bg-white flex items-center justify-center transition-all group-hover:border-[#13ec5b] cursor-pointer"
                                            >
                                                <img
                                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-40 transition-opacity"
                                                    src={
                                                        imagenNueva
                                                            ? URL.createObjectURL(imagenNueva)
                                                            : imagenActual
                                                    }
                                                    alt="Producto"
                                                />

                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                                                    <div className="bg-white px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-widest active:scale-95 transition-transform">
                                                        <span className="material-symbols-outlined text-[20px] text-[#13ec5b]">
                                                            photo_camera
                                                        </span>
                                                        Cambiar Imagen
                                                    </div>
                                                </div>
                                            </label>

                                            {/* INPUT REAL */}
                                            <input
                                                id="imagen"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => setImagenNueva(e.target.files[0])}
                                            />
                                        </div>

                                        <p className="text-[10px] text-[#61896f] font-bold mt-2 uppercase tracking-tight">
                                            JPG, PNG o WEBP. Tamaño máximo 2MB.
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Descripción </label>
                                        <textarea
                                            value={descripcion}
                                            onChange={(e) => setDescripcion(e.target.value)}
                                            className="w-full px-5 py-4 rounded-2xl border-slate-100 bg-[#f8fafc] text-slate-900 font-bold text-sm focus:ring-2 focus:ring-[#13ec5b]/20 outline-none transition-all resize-none min-h-[100px]"

                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Footer */}
                            <div className="flex items-center justify-end gap-6 pt-8 border-t border-slate-50">
                                <Link to="/inventario">
                                    <button className="px-8 py-3 text-xs font-black text-slate-400 hover:text-slate-700 transition-colors uppercase tracking-widest" type="button">
                                        Cancelar
                                    </button>
                                </Link>
                                <button className="px-10 py-3.5 rounded-2xl bg-[#13ec5b] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-[#13ec5b]/20 hover:bg-[#0fb847] active:scale-95 transition-all flex items-center gap-2" type="submit">
                                    <span className="material-symbols-outlined text-[20px]">save</span>
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div >
                </div >
            </main >
        </div >
    );


}

export default EditarProducto