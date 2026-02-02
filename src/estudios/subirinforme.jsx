import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

function SubirInforme() {
    const navigate = useNavigate();


    // Estados del formulario
    const [mascota, setMascota] = useState('');
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [tipo, setTipo] = useState('');
    const [informe, setInforme] = useState('');
    const [archivos, setArchivos] = useState([]);
    const [texto, setTexto] = useState("")
    const [resultados, setResultados] = useState([])
    const [animalSeleccionado, setAnimalSeleccionado] = useState(null)
    const accessToken = localStorage.getItem("access");
    const [estudios, setEstudios] = useState([])
    const [tipos, setTipos] = useState([])


    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/estudios/`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
        })
            .then(response => response.json())
            .then(data => setEstudios(data.results ?? data))
            .catch(error => console.error("Error al cargar estudios:", error));
    }, [accessToken]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/estudios/tipos/`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
        })
            .then(response => response.json())
            .then(data => setTipos(data.results ?? data))
            .catch(error => console.error("Error al cargar tipos de estudios:", error));
    }, [accessToken]);





    const buscarAnimales = async (texto) => {
        if (texto.length < 2) {
            setResultados([]);
            return;
        }

        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/animales/?search=${texto}`,
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
            }
        );

        const data = await res.json();
        setResultados(data.results ?? data);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!animalSeleccionado) {
            Swal.fire({
                icon: "warning",
                title: "Atención",
                text: "Seleccioná una mascota antes de continuar"
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append("animal", animalSeleccionado.id);
            formData.append("fecha", fecha);
            formData.append("tipo", tipo);
            formData.append("informe", informe);

            if (archivos && archivos.length > 0) {
                formData.append("archivo", archivos[0]);
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/estudios/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            Swal.fire({
                icon: "success",
                title: "Estudio creado",
                text: "El estudio se registró correctamente",
                confirmButtonText: "Aceptar"
            }).then(() => {
                navigate("/estudios");
            });

        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo crear el estudio. Verificá los datos."
            });
        }
    };
    return (
        <div className="flex flex-col min-h-screen font-['Manrope'] bg-[#f8fafc] text-slate-900">
            <div className="flex flex-1 overflow-hidden">

                {/* SideNavBar (Igual al de la foto) */}
                <aside className="w-64 border-r border-[#dbe6df] bg-white p-4 hidden lg:flex flex-col justify-between">
                    <div className="flex flex-col gap-6">
                        <Link to="/inicio">
                            <div className="flex flex-col px-3 text-left">
                                <h1 className="text-[#111813] text-base font-bold">VetManager</h1>

                            </div>
                        </Link>
                        <div className="flex flex-col gap-1">
                            <Link to="/inicio" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-[#f6f8f6] rounded-lg transition-all">
                                <span className="material-symbols-outlined">dashboard</span>
                                <p className="text-sm font-medium">Inicio</p>
                            </Link>

                            <Link to="/estudios" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#13ec5b]/10 text-[#13ec5b] border border-[#13ec5b]/20">
                                <span className="material-symbols-outlined font-fill">description</span>
                                <p className="text-sm font-bold">Informes Médicos</p>
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
                    <div className="max-w-4xl mx-auto py-8 px-6 text-left">

                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 mb-4 text-sm font-medium">
                            <Link to="/inicio" className="text-gray-500 hover:text-[#13ec5b]">Inicio</Link>
                            <span className="material-symbols-outlined text-gray-400 text-xs">chevron_right</span>
                            <Link to="/estudios" className="text-gray-500 hover:text-[#13ec5b]">Informes</Link>
                            <span className="material-symbols-outlined text-gray-400 text-xs">chevron_right</span>
                            <span className="text-[#111813] font-bold">Nuevo Informe</span>
                        </div>

                        {/* Page Heading */}
                        <div className="mb-8">
                            <h1 className="text-[#111813] text-3xl font-black tracking-tight">Agregar Nuevo Informe Médico</h1>
                            <p className="text-gray-600 text-base mt-1">Complete los datos del estudio realizado a la mascota para guardarlo en su historial clínico.</p>
                        </div>

                        {/* Form Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-[#dbe6df] overflow-hidden">
                            <form className="p-8 flex flex-col gap-8" onSubmit={handleSubmit}>

                                {/* Section 1: Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[#111813] text-sm font-bold">Mascota (Paciente) <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={texto}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setTexto(value);
                                                buscarAnimales(value);
                                            }}
                                            placeholder="Buscar mascota por nombre o dueño..."
                                            className="w-full border rounded-xl px-4 py-2"
                                        />
                                        {resultados.length > 0 && (
                                            <div className="mt-2 bg-white border rounded-xl shadow-md overflow-hidden">
                                                {resultados.map(animal => (
                                                    <div
                                                        key={animal.id}
                                                        onClick={() => {
                                                            setAnimalSeleccionado(animal);
                                                            setTexto(animal.nombre);
                                                            setResultados([]);
                                                        }}
                                                        className="px-4 py-3 hover:bg-slate-100 cursor-pointer text-sm"
                                                    >
                                                        <p className="font-bold">
                                                            {animal.nombre}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {animal.duenio_nombre} {animal.duenio_apellido} • {animal.raza}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[#111813] text-sm font-bold">Fecha del Estudio <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            required
                                            value={fecha}
                                            onChange={(e) => setFecha(e.target.value)}
                                            className="w-full rounded-xl border-[#dbe6df] bg-slate-50 text-[#111813] focus:border-[#13ec5b] focus:ring-[#13ec5b] h-12 text-sm px-4"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-[#111813] text-sm font-bold">Tipo de Informe / Estudio <span className="text-red-500">*</span></label>
                                        <select
                                            required
                                            value={tipo}
                                            onChange={(e) => setTipo(e.target.value)}
                                            className="w-full rounded-xl border-[#dbe6df] bg-slate-50 text-[#111813] focus:border-[#13ec5b] focus:ring-[#13ec5b] h-12 text-sm px-4"
                                        >
                                            <option disabled selected value="">
                                                Seleccionar tipo de estudio
                                            </option>
                                            {tipos.map(tipos => (
                                                <option key={tipos.value} value={tipos.value}>
                                                    {tipos.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Section 2: Description */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[#111813] text-sm font-bold">Descripción Detallada y Observaciones</label>
                                    <textarea
                                        rows="5"
                                        value={informe}
                                        onChange={(e) => setInforme(e.target.value)}

                                        className="w-full rounded-xl border-[#dbe6df] bg-slate-50 text-[#111813] focus:border-[#13ec5b] focus:ring-[#13ec5b] text-sm p-4 placeholder:text-gray-400"
                                        placeholder="Escriba los resultados y hallazgos..."
                                    ></textarea>
                                </div>



                                {/* Preview de archivos seleccionados */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[#111813] text-sm font-bold">
                                        Adjuntar Archivos (PDF o Imágenes)
                                    </label>

                                    <label
                                        htmlFor="archivos"
                                        className="border-2 border-dashed border-[#dbe6df] rounded-2xl p-10
                   flex flex-col items-center justify-center bg-slate-50
                   hover:bg-[#13ec5b]/5 hover:border-[#13ec5b]
                   transition-all cursor-pointer group"
                                    >
                                        <div className="bg-[#13ec5b]/20 p-4 rounded-full mb-3">
                                            <span className="material-symbols-outlined text-[#13ec5b] text-3xl">
                                                cloud_upload
                                            </span>
                                        </div>
                                        <p className="text-sm font-bold">Haga clic para subir archivos</p>
                                        <p className="text-xs text-gray-500">PDF, JPG, PNG (máx. 10MB)</p>

                                        <input
                                            id="archivos"
                                            type="file"
                                            multiple
                                            accept=".pdf,image/*"
                                            className="hidden"
                                            onChange={(e) => setArchivos(Array.from(e.target.files))}
                                        />
                                    </label>
                                </div>
                                {archivos.length > 0 && (
                                    <div className="flex flex-wrap gap-3 mt-4">
                                        {archivos.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 bg-white px-3 py-2
                           rounded-xl border shadow-sm"
                                            >
                                                <span className="text-xs font-bold">{file.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setArchivos(archivos.filter((_, i) => i !== index))
                                                    }
                                                    className="text-red-500"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#dbe6df]">

                                    <button
                                        type="button"
                                        onClick={() => navigate('/estudios')}
                                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-8 py-3 bg-[#13ec5b] rounded-xl text-sm font-black text-white hover:shadow-lg hover:shadow-[#13ec5b]/30 active:scale-95 transition-all"
                                    >
                                        Guardar Informe
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SubirInforme;

