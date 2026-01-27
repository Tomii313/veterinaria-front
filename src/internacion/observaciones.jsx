import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const indicacionesInternado = () => {

    const [notas, setNotas] = useState("");
    const [internacion, setInternacion] = useState(null);
    const [observaciones, setObservaciones] = useState([]);
    const [veterinarios, setVeterinarios] = useState([]);
    const [veterinario, setVeterinario] = useState("");
    const [observacion, setObservacion] = useState("");
    const [darAlta, setDarAlta] = useState([])
    const [paciente, setPaciente] = useState([])
    const { id } = useParams();
    const accessToken = localStorage.getItem("access");

    const imprimir = () => {
        window.open(
            `${import.meta.env.VITE_API_URL}/internaciones/${id}/imprimir/`,
            "_blank"
        );
    };



    const handleDarAlta = (internacionId) => {
        fetch(`${import.meta.env.VITE_API_URL}/internaciones/${internacionId}/dar_alta/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(async res => {
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Error al dar alta");
                }

                return data;
            })
            .then(() => {
                Swal.fire({
                    title: "Buen trabajo!",
                    text: "Se ha dado el alta correctamente al paciente.",
                    icon: "success"
                });

                fetch(`${import.meta.env.VITE_API_URL}/internaciones/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,

                    },
                })
                    .then(res => res.json())
                    .then(data => setInternaciones(data));
            })
            .catch(err => {
                Swal.fire(
                    "Atención",
                    err.message,
                    "warning"
                );
            });
    };



    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/internaciones/${id}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(response => response.json())
            .then(data => {
                setInternacion(data);
                setObservaciones(data.historial_observaciones || []);
            });
    }, [id]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/veterinarios/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(response => response.json())
            .then(data => setVeterinarios(data.results ?? data));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`${import.meta.env.VITE_API_URL}/observaciones/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
            body: JSON.stringify({
                internacion: id,
                veterinario,
                observacion,
            }),
        }).then(() => {
            setObservacion("");

            fetch(`${import.meta.env.VITE_API_URL}/internaciones/${id}/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,

                },
            })
                .then(response => response.json())
                .then(data => {
                    setInternacion(data);
                    setObservaciones(data.historial_observaciones || []);
                });
        });
    };

    return (
        <div className="bg-[#f6f8f6] min-h-screen text-[#111813] font-['Manrope',_sans-serif]">
            <header className="flex items-center justify-between border-b border-solid border-[#f0f4f2] bg-white px-10 py-3 sticky top-0 z-50">
                <Link to="/internaciones">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-3xl text-[#13ec5b]">pets</span>
                            <h2 className="text-lg font-bold tracking-tight">VetManager</h2>
                        </div>
                    </div>
                </Link>
                <div className="flex flex-1 justify-end gap-8">


                </div>
            </header>

            <main className="max-w-[1200px] mx-auto flex gap-6 p-6">
                <div className="flex gap-3 shrink-0">

                    {internacion && internacion.fecha_salida === null ? (
                        <button onClick={() => handleDarAlta(internacion.id)} className="px-6 h-11 bg-[#13ec5b] text-[#102216] rounded-lg text-sm font-bold shadow-lg shadow-[#13ec5b]/20 hover:scale-[1.02] transition-all">Alta Médica</button>
                    ) : (
                        <button type="button" disabled className="px-6 h-11 bg-[#13ec5b]/20 text-[#102216] rounded-lg text-sm font-bold shadow-lg shadow-[#13ec5b]/20 hover:scale-[1.02] transition-all cursor-not-allowed">Dado de Alta</button>
                    )}
                </div>
                <section className="flex-1 flex flex-col gap-6 text-left">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">

                        <div className="flex items-center gap-2 text-sm">
                            <Link to="/inicio">
                                <span className="text-[#61896f]">Inicio</span>
                            </Link>
                            <span className="material-symbols-outlined text-sm text-[#61896f]">chevron_right</span>
                            <Link to="/internaciones">
                                <span className="text-[#61896f]">Hospitalización</span>
                            </Link>
                            <span className="material-symbols-outlined text-sm text-[#61896f]">chevron_right</span>
                            <span className="font-bold">Paciente</span>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f0f4f2]">
                            {internacion && (
                                <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                                    <div className="flex gap-6 items-center w-full">

                                        <div>
                                            <h2 className="text-2xl font-bold tracking-tight">{internacion.nombre_animal}</h2>
                                            <div className="flex gap-4 mt-1 items-center">
                                                <span className="bg-[#f0f4f2] px-2 py-0.5 rounded text-xs font-bold text-[#61896f]">
                                                    {internacion.raza_animal}
                                                </span>
                                            </div>
                                            <p className="text-[#61896f] text-sm mt-2 flex items-center gap-4">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">door_front</span>
                                                    Jaula {internacion.jaula}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                    Ingreso: {internacion.fecha_ingreso}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-sm border border-[#f0f4f2] flex flex-col">
                                <div className="p-5 border-b border-[#f0f4f2] bg-[#f6f8f6] rounded-t-xl flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#13ec5b]">clinical_notes</span>
                                    <h3 className="text-lg font-bold">Indicaciones del Veterinario</h3>
                                </div>

                                <div className="p-6 flex-1 flex flex-col gap-4">
                                    {observaciones.map(obs => (
                                        <div key={obs.id} className="bg-[#13ec5b]/5 border-l-4 border-[#13ec5b] p-4 rounded-r-lg">
                                            <p className="text-sm italic">{obs.observacion}</p>
                                            <p className="text-xs text-[#61896f] mt-1">
                                                {obs.veterinario.nombre} {obs.veterinario.apellido} · {obs.fecha}
                                            </p>
                                        </div>
                                    ))}

                                    <label className="text-xs font-bold text-[#61896f] uppercase tracking-wider text-left">
                                        Notas adicionales del turno anterior
                                    </label>

                                    <textarea
                                        value={observacion}
                                        onChange={(e) => setObservacion(e.target.value)}
                                        className="w-full rounded-lg border-[#f0f4f2] bg-white text-sm p-3 min-h-[120px] focus:ring-[#13ec5b] focus:border-[#13ec5b] outline-none border"
                                        placeholder="Escribe aquí observaciones relevantes..."
                                    ></textarea>

                                    <div className="mt-auto flex justify-between items-center text-[11px] text-[#61896f] font-medium">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">history</span>
                                            Última actualización: Hoy
                                        </span>
                                        <select value={veterinario} onChange={(e) => setVeterinario(e.target.value)}>
                                            <option value="">Veterinario</option>
                                            {veterinarios.map(v => (
                                                <option key={v.id} value={v.id}>
                                                    {v.nombre} {v.apellido}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pb-10">
                            <button onClick={imprimir} className="flex items-center gap-2 px-6 h-12 rounded-xl bg-white border border-[#f0f4f2] font-bold hover:bg-[#f0f4f2] transition-all shadow-sm">
                                <span className="material-symbols-outlined">print</span> Imprimir Plan
                            </button>
                            <button className="flex items-center gap-2 px-8 h-12 rounded-xl bg-[#13ec5b] text-[#102216] font-bold hover:opacity-90 transition-all shadow-xl shadow-[#13ec5b]/30">
                                <span className="material-symbols-outlined">save</span> Finalizar y Notificar
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default indicacionesInternado;
