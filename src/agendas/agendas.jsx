import { useState, useEffect } from "react"
import { Link } from "react-router-dom"


const Citas = () => {
    const [fecha, setFecha] = useState("")
    const accessToken = localStorage.getItem("access");
    const [duenio, setDuenio] = useState(null)
    const [animal, setAnimal] = useState(null)
    const [motivo, setMotivo] = useState("")
    const [hora, setHora] = useState("")
    const [dni, setDni] = useState("")
    const [veterinario, setVeterinario] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [veterinarios, setVeterinarios] = useState([]);
    const [turnos, setTurnos] = useState([]);
    const [animales, setAnimales] = useState([]);
    const [vetFiltrado, setVetFiltrado] = useState(null);
    const [horariosDisponibles, setHorariosDisponibles] = useState([])
    const [esCliente, setEsCliente] = useState(null); // true | false
    const [nombreAnimal, setNombreAnimal] = useState("");
    const [permisos, setPermisos] = useState([]);
    const canAdd = permisos.includes("turnos.add_turno")
    const canDelete = permisos.includes("turnos.delete_turno")
    const canChange = permisos.includes("turnos.change_turno")


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

    const diasSemanaMap = {
        domingo: 0,
        lunes: 1,
        martes: 2,
        miercoles: 3,
        miércoles: 3,
        jueves: 4,
        viernes: 5,
        sabado: 6,
        sábado: 6,
    };



    const hoy = new Date();
    const cambiarDia = (dias) => {
        // Usamos el formato con T00:00:00 para forzar horario local y que no se desfase
        const fechaActual = new Date(fechaSeleccionada + "T00:00:00");
        fechaActual.setDate(fechaActual.getDate() + dias);

        const yyyy = fechaActual.getFullYear();
        const mm = String(fechaActual.getMonth() + 1).padStart(2, "0");
        const dd = String(fechaActual.getDate()).padStart(2, "0");

        setFechaSeleccionada(`${yyyy}-${mm}-${dd}`);
    };
    const fechaLocal = new Date(
        hoy.getTime() - hoy.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    const [fechaSeleccionada, setFechaSeleccionada] = useState(
        new Date().toISOString().slice(0, 10)
    );

    const horas = [];
    for (let h = 8; h <= 20; h++) {
        horas.push(h.toString().padStart(2, "0"));
    }
    const getTurnosParaHora = (hora) => {
        if (!Array.isArray(turnos)) return [];

        return turnos.filter(turno =>
            turno.hora && turno.hora.slice(0, 2) === hora
        );
    };

    const guardarTurno = async () => {
        // Validaciones básicas antes de mandar
        if (esCliente === true) {
            if (!duenio || !duenio.id) {
                alert("Primero debés buscar y seleccionar un dueño");
                return;
            }
            if (!animal || !animal.id) {
                alert("Seleccioná una mascota");
                return;
            }
        }
        if (!veterinario || !hora) {
            alert("Faltan datos del veterinario u horario");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/turnos/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    fecha: fechaSeleccionada,
                    veterinario: Number(veterinario),
                    hora: hora,
                    motivo: motivo,
                    animal: esCliente ? animal?.id : null,
                    nombre_animal: nombreAnimal
                })
            });

            if (response.ok) {
                // Si todo salió bien, cerramos y refrescamos
                setIsModalOpen(false);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/turnos?fecha=${fechaSeleccionada}`);
                const data = await res.json();
                setTurnos(data.results ?? data);

                // Limpiamos los campos para la próxima
                setMotivo("");
                setHora("");
            } else {
                // Si hay error (400), lo vemos en la consola
                const errorData = await response.json();
                console.error("Error del backend:", errorData);
                alert("Error al guardar: " + JSON.stringify(errorData));
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    };


    useEffect(() => {
        if (!veterinario || !fechaSeleccionada) return;

        fetch(
            `${import.meta.env.VITE_API_URL}/turnos/horarios_disponibles/?veterinario_id=${veterinario}&fecha=${fechaSeleccionada}`,
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
            }
        )
            .then(res => res.json())
            .then(data => setHorariosDisponibles(data));
    }, [veterinario, fechaSeleccionada]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/veterinarios`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
        })
            .then(response => response.json())
            .then(data => setVeterinarios(data.results ?? data))
            .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/turnos?fecha=${fechaSeleccionada}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
        })
            .then(res => res.json())
            .then(data => setTurnos(data.results ?? data));
    }, [fechaSeleccionada]);

    const TimeSlot = ({ hour, children }) => (
        <div className="grid grid-cols-8 min-h-24 border-b border-gray-100 dark:border-gray-800 relative group">
            <div className="w-16 text-right pr-3 -mt-2.5 text-xs text-gray-400 font-medium">{hour}</div>
            {children}
        </div>
    );

    function filtrar_turnos_veterinario(vetId) {
        // si clickeo el mismo → saco filtro
        if (vetFiltrado === vetId) {
            setVetFiltrado(null);

            fetch(`${import.meta.env.VITE_API_URL}/turnos?fecha=${fechaSeleccionada}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
            })
                .then(res => res.json())
                .then(data => setTurnos(data.results ?? data));

            return;
        }

        // si clickeo uno nuevo → filtro
        setVetFiltrado(vetId);

        fetch(
            `${import.meta.env.VITE_API_URL}/turnos/filtrar_turno_veterinario/?veterinario_id=${vetId}&fecha=${fechaSeleccionada}`
        )
            .then(res => res.json())
            .then(data => setTurnos(data.results ?? data));
    }



    function filtrar_dni() {

        try {
            fetch(`${import.meta.env.VITE_API_URL}/duenios/filtrar_dni/?dni=${dni}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
            })
                .then(response => response.json())
                .then(data => {
                    if (!Array.isArray(data) || data.length === 0) {
                        setDuenio(null)
                        setAnimales([])
                        alert("Propietario no encontrado")
                        return
                    }

                    const duenioEncontrado = data[0]
                    setDuenio(duenioEncontrado)

                    // 🔥 TRAER ANIMALES DE ESE DUEÑO
                    fetch(`${import.meta.env.VITE_API_URL}/animales/?duenio=${duenioEncontrado.id}`)
                        .then(res => res.json())
                        .then(data => setAnimales(data.results || []))
                })


                .catch(error => {
                    console.log(error)
                })
        } catch (error) {
            console.log(error)
        }
    }
    function cancelarTurno(turnoId) {
        Swal.fire({
            title: "Cancelar Turno?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${import.meta.env.VITE_API_URL}/turnos/${turnoId}/cancelar_turno/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                })
                Swal.fire({
                    title: "Turno cancelado!",
                    text: "El turno ha sido cancelado.",
                    icon: "success"
                })

                    .then(res => res.json())
                    .then(() => {
                        // refrescar turnos
                        fetch(`${import.meta.env.VITE_API_URL}/turnos?fecha=${fechaSeleccionada}`)
                            .then(res => res.json())
                            .then(data => setTurnos(data.results ?? data))
                    })
            }
        })
    }

    useEffect(() => {
        if (isModalOpen) {
            setEsCliente(null);
            setDni("");
            setDuenio(null);
            setAnimal(null);
            setAnimales([]);
            setNombreAnimal("");
            setMotivo("");
            setHora("");
        }
    }, [isModalOpen]);

    function confirmarTurno(turnoId) {
        Swal.fire({
            title: "Confirmado!",
            text: "El turno ha sido confirmado.",
            icon: "success"
        });
        fetch(`${import.meta.env.VITE_API_URL}/turnos/${turnoId}/confirmar_turno/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        })
            .then(res => res.json())
            .then(() => {
                // refrescar turnos
                fetch(`${import.meta.env.VITE_API_URL}/turnos?fecha=${fechaSeleccionada}`)
                    .then(res => res.json())
                    .then(data => setTurnos(data.results ?? data))
            })
            .catch(error => console.error('Error:', error))
    }
    useEffect(() => {
        if (!fechaSeleccionada) return;

        // Obtenemos el nombre del día para ver si es un día de semana (Lunes a Jueves/Viernes)
        const fechaObj = new Date(fechaSeleccionada + "T00:00:00");
        const nombreDia = fechaObj.toLocaleDateString("es-AR", { weekday: "long" }).toLowerCase();

        let fechaParaEnviar = fechaSeleccionada;

        /* HACK: Si el back busca por "icontains" y tenemos "Lunes a Viernes", 
           un martes no va a entrar. Mandamos un parámetro extra o ajustamos 
           la lógica de búsqueda si el back lo permite. 
        */

        fetch(`${import.meta.env.VITE_API_URL}/turnos/veterinarios_disponibles/?fecha=${fechaSeleccionada}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                setVeterinarios(data.results ?? data);
            });
    }, [fechaSeleccionada]);







    const AppointmentCard = ({ patient, reason, vet, time, color, estado, actions, customStyle = {} }) => {
        const colorClasses = {
            blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-800 dark:text-blue-100",
            orange: "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-100",
            green: "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-100",
        };

        return (
            <div
                className={`relative w-full border-l-4 rounded-xl p-3 shadow-sm hover:shadow-md transition-all ${colorClasses[color]}`}
                style={customStyle}
            >
                <div className="flex flex-col items-start text-left">
                    <div className="flex w-full justify-between items-start">
                        <p className="text-xs font-black uppercase tracking-tight">{patient}</p>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/50 border border-black/5">{estado}</span>
                    </div>
                    <p className="text-[11px] font-bold opacity-80 mt-0.5">{vet}</p>
                    <p className="text-[11px] opacity-70 mt-1 line-clamp-1 italic">"{reason}"</p>

                    <div className="flex items-center gap-1 mt-1 text-[10px] font-black">
                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                        {time} hs
                    </div>
                </div>

                {/* Acá se renderizan los botones si existen */}
                {actions}
            </div>
        );
    };
    return (
        <div className="bg-[#f6f8f6] dark:bg-[#102216] font-['Manrope',_sans-serif] text-[#111813] antialiased h-screen flex flex-col overflow-hidden">
            {/* Top Navigation */}
            <header className="flex shrink-0 items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2c20] px-6 py-3 z-20">
                <div className="flex items-center gap-4 dark:text-white">
                    <Link to="/inicio">
                        <div className="size-8 text-[#13ec5b]">
                            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 48 48">
                                <path d="M8.57 8.57C5.52 11.62 3.45 15.51 2.6 19.74c-.84 4.23-.41 8.61 1.25 12.6 1.65 3.98 4.44 7.39 8.03 9.79 3.58 2.39 7.8 3.67 12.12 3.67s8.54-1.28 12.12-3.67c3.59-2.4 6.38-5.81 8.03-9.79 1.65-3.99 2.08-8.37 1.24-12.6-.84-4.23-2.91-8.12-5.96-11.17L24 24 8.57 8.57z" />
                            </svg>
                        </div>
                    </Link>
                    <Link to="/inicio">
                        <h2 className="text-lg font-bold">VetManager</h2>
                    </Link>
                </div>
                <div className="flex flex-1 justify-end gap-8 items-center">
                    <nav className="hidden md:flex items-center gap-9">
                        <Link to="/inicio" className="text-slate-600 dark:text-gray-300 hover:text-[#13ec5b] text-sm font-medium">Inicio</Link>


                    </nav>

                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar Filters */}
                <aside className="w-80 bg-white dark:bg-[#1a2c20] border-r border-gray-200 dark:border-gray-800 flex flex-col shrink-0 overflow-y-auto z-10 hidden lg:flex p-6">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full mb-8 flex items-center justify-center gap-2 bg-[#13ec5b] hover:bg-[#0eb545] text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all"
                    >
                        <span className="material-symbols-outlined">add</span>
                        <span>Nueva Cita</span>
                    </button>

                    <div className="mb-8 text-left">



                        <h3 className="font-bold dark:text-white mb-4">Veterinarios</h3>

                        <div className="space-y-3">
                            {veterinarios.map(vet => (
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={vetFiltrado === vet.id}
                                        onChange={() => filtrar_turnos_veterinario(vet.id)}
                                        className="rounded border-gray-300 text-[#13ec5b] h-5 w-5"
                                    />
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <span className="text-sm font-medium dark:text-gray-300 group-hover:text-[#13ec5b]">{vet.nombre} {vet.apellido}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content / Calendar */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2c20] shrink-0">
                        <div className="flex flex-col gap-1 text-left">
                            <h1 className="text-2xl font-black tracking-tight dark:text-white">Gestión de Citas</h1>
                            <div className="flex items-center gap-4 bg-gray-800 px-4 py-2 rounded">

                                {/* Flecha día anterior */}
                                <button
                                    onClick={() => cambiarDia(-1)}
                                    className="text-white text-xl font-bold px-2 hover:text-gray-300"
                                >
                                    ←
                                </button>

                                {/* Calendario */}
                                <input
                                    type="date"
                                    value={fechaSeleccionada}
                                    onChange={(e) => setFechaSeleccionada(e.target.value)}
                                    className="bg-white text-black px-3 py-1 rounded border"
                                />

                                {/* Texto bonito */}
                                <span className="text-white font-medium capitalize">
                                    {new Date(fechaSeleccionada + "T00:00:00").toLocaleDateString("es-AR", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    })}
                                </span>

                                {/* Flecha día siguiente */}
                                <button
                                    onClick={() => cambiarDia(1)}
                                    className="text-white text-xl font-bold px-2 hover:text-gray-300"
                                >
                                    →
                                </button>

                            </div>
                        </div>

                    </div>

                    <div className="flex-1 overflow-auto relative">
                        {/* Days Header */}
                        <div className="grid grid-cols-2 border-b">
                            <div className="w-16"></div>

                            <div className="p-3 text-center">
                                <p className="text-xs uppercase font-bold text-slate-400">
                                    {new Date(fechaSeleccionada + "T00:00:00")
                                        .toLocaleDateString("es-AR", { weekday: "long" })}
                                </p>
                                <p className="text-lg font-bold mt-1 dark:text-white">
                                    {new Date(fechaSeleccionada + "T00:00:00").getDate()}
                                </p>
                            </div>
                        </div>

                        {/* Calendar Body */}
                        <div className="relative min-w-[1000px] bg-white dark:bg-[#1a2c20]/50">
                            <div className="absolute w-full flex items-center z-20 pointer-events-none" style={{ top: '340px' }}>


                            </div>

                            <div className="relative min-w-[1000px] bg-white dark:bg-[#1a2c20]/50">
                                {horas.map(hora => (
                                    <TimeSlot key={hora} hour={`${hora}:00`}>
                                        {getTurnosParaHora(hora).map(turno => {
                                            // Lógica de fecha para bloquear botones si ya pasó
                                            const hoy = new Date();
                                            const fechaTurno = new Date(turno.fecha + "T" + turno.hora);
                                            const esPasado = fechaTurno < hoy;
                                            const esPendiente = turno.estado === "Pendiente";

                                            return (
                                                <div key={turno.id} className="relative p-1 w-full">
                                                    <AppointmentCard
                                                        patient={turno.nombre_animal}
                                                        reason={turno.motivo}
                                                        estado={turno.estado}
                                                        vet={`Dr. ${turno.veterinario_apellido}`}
                                                        time={turno.hora.slice(0, 5)}
                                                        color={turno.estado === "Confirmado" ? "green" : turno.estado === "Cancelado" ? "orange" : "blue"}
                                                        customStyle={{ top: '8px', bottom: '8px' }}
                                                        // Pasamos los botones como hijos o props para integrarlos
                                                        actions={
                                                            !esPasado && esPendiente && (
                                                                <div className="flex gap-2 mt-2 pt-2 border-t border-black/5">
                                                                    {canChange && (
                                                                        <>
                                                                            <button
                                                                                onClick={(e) => { e.stopPropagation(); confirmarTurno(turno.id); }}
                                                                                className="flex items-center justify-center size-8 rounded-lg bg-[#eefdf3] text-[#13ec5b] hover:bg-[#13ec5b] hover:text-white transition-all shadow-sm"
                                                                                title="Confirmar"
                                                                            >
                                                                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                                                            </button>
                                                                            <Link
                                                                                to={`/agenda/modificarturno/${turno.id}/`}
                                                                                className="flex items-center justify-center size-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                                                            >
                                                                                <span className="material-symbols-outlined text-lg">edit_calendar</span>
                                                                            </Link>
                                                                        </>
                                                                    )}
                                                                    {canDelete && (
                                                                        <button
                                                                            onClick={(e) => { e.stopPropagation(); cancelarTurno(turno.id); }}
                                                                            className="flex items-center justify-center size-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                                            title="Cancelar"
                                                                        >
                                                                            <span className="material-symbols-outlined text-lg">cancel</span>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )
                                                        }
                                                    />
                                                </div>
                                            );
                                        })}
                                    </TimeSlot>
                                ))}
                            </div>

                        </div>
                    </div>
                </main>
            </div>


            {/* Modal Nueva Cita */}

            {isModalOpen && canAdd && (

                <div className="fixed inset-0 z-50 bg-black/30 flex justify-end">
                    <div className="w-full max-w-md h-full bg-white dark:bg-[#1a2c20] shadow-2xl p-8 overflow-y-auto">

                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold dark:text-white">Nueva Cita</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form
                            className="space-y-6 text-left"
                            onSubmit={(e) => {
                                e.preventDefault();
                                guardarTurno();
                            }}
                        >

                            {/* ¿Cliente existente? */}
                            <div className="space-y-3">
                                <p className="font-bold dark:text-white">
                                    ¿El cliente ya fue atendido anteriormente?
                                </p>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setEsCliente(true)}
                                        className={`flex-1 py-2 rounded-xl font-bold ${esCliente === true
                                            ? "bg-[#13ec5b] text-white"
                                            : "bg-slate-200 dark:bg-gray-700"
                                            }`}
                                    >
                                        Sí
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setEsCliente(false)}
                                        className={`flex-1 py-2 rounded-xl font-bold ${esCliente === false
                                            ? "bg-[#13ec5b] text-white"
                                            : "bg-slate-200 dark:bg-gray-700"
                                            }`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>

                            {/* CLIENTE EXISTENTE */}
                            {esCliente === true && (
                                <>
                                    <div className="relative">
                                        <input
                                            value={dni}
                                            onChange={(e) => setDni(e.target.value)}
                                            className="w-full bg-slate-100 dark:bg-gray-800 rounded-xl py-3 px-4 pr-12 dark:text-white"
                                            placeholder="Buscar dueño por DNI"
                                            type="text"
                                        />

                                        <button
                                            type="button"
                                            onClick={filtrar_dni}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#13ec5b]"
                                        >
                                            <span className="material-symbols-outlined">search</span>
                                        </button>
                                    </div>

                                    {duenio && (
                                        <div className="p-3 rounded-lg bg-green-100 text-green-800 text-sm font-bold">
                                            Dueño encontrado: {duenio.nombre} {duenio.apellido}
                                        </div>
                                    )}

                                    {animales.length > 0 && (
                                        <select
                                            value={animal?.id || ""}
                                            onChange={(e) => {
                                                const mascota = animales.find(
                                                    (a) => a.id === Number(e.target.value)
                                                );
                                                setAnimal(mascota);
                                            }}
                                            className="w-full bg-slate-100 dark:bg-gray-800 rounded-xl py-3 px-4 dark:text-white"
                                        >
                                            <option value="">Seleccione una mascota</option>
                                            {animales.map((a) => (
                                                <option key={a.id} value={a.id}>
                                                    {a.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </>
                            )}

                            {/* CLIENTE NUEVO */}
                            {esCliente === false && (
                                <input
                                    type="text"
                                    placeholder="Nombre de la mascota"
                                    value={nombreAnimal}
                                    onChange={(e) => setNombreAnimal(e.target.value)}
                                    className="w-full bg-slate-100 dark:bg-gray-800 rounded-xl py-3 px-4 dark:text-white"
                                />
                            )}

                            {/* VETERINARIO */}
                            <select
                                value={veterinario}
                                onChange={(e) => setVeterinario(e.target.value)}
                                className="w-full bg-slate-100 dark:bg-gray-800 rounded-xl py-3 px-4 dark:text-white"
                            >
                                <option value="">Seleccione un veterinario</option>
                                {veterinarios.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.nombre} {v.apellido}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder="Motivo"
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                className="w-full bg-slate-100 dark:bg-gray-800 rounded-xl py-3 px-4 dark:text-white"
                            />

                            <div className="space-y-1">
                                <label className="text-sm font-bold dark:text-white">
                                    Fecha del turno
                                </label>
                                <input
                                    type="date"
                                    value={fechaSeleccionada}
                                    min={fechaLocal}
                                    onChange={(e) => setFechaSeleccionada(e.target.value)}
                                    className="w-full bg-slate-100 dark:bg-gray-800 rounded-xl py-3 px-4 dark:text-white"
                                />
                            </div>
                            <select
                                value={hora}
                                onChange={(e) => setHora(e.target.value)}
                                className="w-full bg-slate-100 dark:bg-gray-800 rounded-xl py-3 px-4 dark:text-white"
                            >
                                <option value="">Seleccione un horario</option>
                                {horariosDisponibles.map((h) => (
                                    <option key={h} value={h}>
                                        {h}
                                    </option>
                                ))}
                            </select>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 font-bold text-slate-500"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-[#13ec5b] text-white rounded-xl font-bold"
                                >
                                    Guardar
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div >
    );
};

export default Citas;