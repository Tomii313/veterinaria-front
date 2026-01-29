import { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"


const Internaciones = () => {

    const [internaciones, setInternaciones] = useState([])
    const [jaulasDisponibles, setJaulasDisponibles] = useState([])
    const [jaulasOcupadas, setJaulasOcupadas] = useState([])
    const [jaulas, setJaulas] = useState([])

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const { id } = useParams()
    const accessToken = localStorage.getItem("access");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/internaciones/?page=${page}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => {
                setInternaciones(data.results ?? data)
                setTotalPages(Math.ceil(data.count / 10))
            })
    }, [page])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/jaulas/jaulas_disponibles/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => setJaulasDisponibles(data))
    }, [])


    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/jaulas/jaulas_ocupadas/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => setJaulasOcupadas(data))
    }, [])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/jaulas/total_jaulas/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(res => res.json())
            .then(data => setJaulas(data))
    }, [])



    return (
        <div className="bg-white text-[#111813] font-['Manrope',_sans-serif] min-h-screen flex flex-col">
            {/* Barra de Navegación */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#f0f4f2] px-10 py-3 bg-white sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4 text-[#111813]">
                        <div className="size-6 text-[#13ec5b]">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
                                <path clipRule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z" fill="currentColor" fillRule="evenodd"></path>
                            </svg>
                        </div>
                        <Link to="/inicio">
                            <h2 className="text-[#111813] text-lg font-bold tracking-tight">VetManager</h2>
                        </Link>
                    </div>

                </div>
                <div className="flex flex-1 justify-end gap-6 items-center">

                    <Link to="/internaciones/agregar">
                        <button className="h-10 px-6 bg-[#13ec5b] text-[#111813] rounded-xl font-bold text-sm hover:brightness-105 transition-all shadow-md active:scale-95">
                            Hospitalizar Paciente
                        </button>
                    </Link>

                </div>
            </header>

            {/* Contenido Principal */}
            <main className="flex-1 flex flex-col items-center py-10 bg-[#f8fafc]">
                <div className="w-full max-w-[1200px] px-6">

                    {/* Cabecera de Página */}
                    <div className="flex flex-wrap justify-between items-end gap-4 mb-10 text-left">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-[#111813] text-4xl font-black tracking-tight leading-tight">Estado de Jaulas y Pacientes</h1>
                            <p className="text-[#61896f] text-lg font-medium">Gestión operativa de hospitalización en tiempo real</p>
                        </div>
                        {/* <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#dbe6df] rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                                <span className="material-symbols-outlined text-[20px]">filter_list</span> Filtrar
                            </button>

                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#dbe6df] rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                                <span className="material-symbols-outlined text-[20px]">sync</span> Actualizar
                            </button>

                        </div> */}
                    </div>

                    {/* Tarjetas de Resumen */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-left">
                            <div className="flex items-center gap-3 mb-3 text-[#61896f]">
                                <span className="material-symbols-outlined text-[#13ec5b]">grid_view</span>
                                <p className="text-[11px] font-black uppercase tracking-widest">Total Jaulas</p>
                            </div>
                            <p className="text-[#111813] text-4xl font-black tracking-tight">{jaulas}</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-left">
                            <div className="flex items-center gap-3 mb-3 text-[#61896f]">
                                <span className="material-symbols-outlined text-orange-500">pending_actions</span>
                                <p className="text-[11px] font-black uppercase tracking-widest">Ocupadas
                                </p>
                            </div>
                            <p className="text-[#111813] text-4xl font-black tracking-tight">{jaulasOcupadas}</p>
                        </div>
                        <div className="bg-[#eefdf3] p-8 rounded-3xl border border-[#13ec5b]/20 shadow-sm text-left">
                            <div className="flex items-center gap-3 mb-3 text-[#13ec5b]">
                                <span className="material-symbols-outlined">check_circle</span>
                                <p className="text-[11px] font-black uppercase tracking-widest text-[#61896f]">Disponibles</p>
                            </div>
                            <p className="text-[#111813] text-4xl font-black tracking-tight">{jaulasDisponibles}</p>
                        </div>
                    </div>

                    {/* Tabla de Pacientes */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden mb-12">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f8fafc] border-b border-slate-50">
                                    <th className="px-8 py-5 text-[#61896f] text-[11px] font-black uppercase tracking-widest">ID Jaula</th>
                                    <th className="px-8 py-5 text-[#61896f] text-[11px] font-black uppercase tracking-widest">Paciente</th>
                                    <th className="px-8 py-5 text-[#61896f] text-[11px] font-black uppercase tracking-widest">Motivo Internación</th>
                                    <th className="px-8 py-5 text-[#61896f] text-[11px] font-black uppercase tracking-widest">Observaciones</th>
                                    <th className="px-8 py-5 text-[#61896f] text-[11px] font-black uppercase tracking-widest">Fecha Ingreso</th>
                                    <th className="px-8 py-5 text-[#61896f] text-[11px] font-black uppercase tracking-widest">Tipo de Urgencia</th>
                                    <th className="px-8 py-5 text-[#61896f] text-[11px] font-black uppercase tracking-widest">Alta</th>
                                    <th className="px-5 py-5 text-[#61896f] text-[11px] font-black uppercase tracking-widest text-right">Acciones</th>

                                </tr>
                            </thead>

                            {internaciones.map(int => (

                                int.fecha_salida === null && (
                                    <tbody className="divide-y divide-slate-50">

                                        {/* Paciente Ocupado */}
                                        <tr className="hover:bg-[#f8fafc] transition-colors group">
                                            <td className="px-8 py-6 font-black text-[#13ec5b] text-sm">{int.jaula}</td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                                        <span className="material-symbols-outlined text-xl">pets</span>
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-bold text-slate-800 text-sm">{int.nombre_animal}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{int.especie_animal} • {int.raza_animal}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 rounded-lg bg-red-50 text-red-600 text-[10px] font-black border border-red-100 uppercase tracking-wider">
                                                    {int.motivo}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3 bg-[#f8fafc] p-3 rounded-2xl border border-slate-100 w-fit">
                                                    <span className="material-symbols-outlined text-orange-500 text-lg">medical_services</span>
                                                    <span className="text-xs font-bold text-slate-600">{int.observaciones}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3 bg-[#f8fafc] p-3 rounded-2xl border border-slate-100 w-fit">
                                                    <span className="material-symbols-outlined text-orange-500 text-lg">calendar_today</span>
                                                    <span className="text-xs font-bold text-slate-600 ">{int.fecha_ingreso}</span>
                                                </div>
                                            </td>
                                            <td className="px-1 py-6">
                                                <div className="flex items-center gap-3 bg-[#f8fafc] p-3 rounded-2xl border border-slate-100 w-fit">
                                                    <span className="material-symbols-outlined text-orange-500 text-lg">priority_high</span>
                                                    <span className="text-xs font-bold text-slate-600">{int.nivel_urgencia}</span>
                                                </div>
                                            </td>

                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-4">

                                                    <button className="text-slate-300 hover:text-slate-600 transition-all">
                                                        <span className="material-symbols-outlined">open_with</span>
                                                    </button>
                                                </div>
                                            </td>
                                            <div className="flex items-center gap-4">
                                                <td>
                                                    <Link to={`/internaciones/modificar/${int.id}`}>
                                                        <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-600 hover:shadow-sm transition-all">
                                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                                        </button>
                                                    </Link>
                                                    <Link to={`/internaciones/observaciones/${int.id}`}>
                                                        <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-600 hover:shadow-sm transition-all">
                                                            <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                                        </button>
                                                    </Link>
                                                </td>
                                            </div>

                                        </tr>




                                    </tbody>
                                )

                            ))}

                        </table>

                    </div>
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

            {/* Footer Pro */}
            < footer className="mt-auto py-8 px-10 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white text-[11px] font-black text-slate-400 uppercase tracking-widest" >
                <p>© 2024 VetManager Pro. Todos los derechos reservados.</p>
                <div className="flex gap-8">
                    <a className="hover:text-[#13ec5b] transition-colors" href="#">Soporte Técnico</a>
                    <a className="hover:text-[#13ec5b] transition-colors" href="#">Manual de Usuario</a>
                </div>
            </footer >
        </div >
    );
}

export default Internaciones