

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function ActualizarPaciente() {
    const accessToken = localStorage.getItem("access");
    const { id } = useParams()
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/animales/${id}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,

            },
        })
            .then(response => response.json())
            .then(data => {
                setNombre(data.nombre)
                setEspecie(data.especie)
                setRaza(data.raza)
                setGenero(data.genero)
                setEdad(data.edad)
                setPeso(data.peso)
                setDuenio(data.duenio.id)
            })
    }, [id])



    const [nombre, setNombre] = useState("")
    const [especie, setEspecie] = useState("")
    const [raza, setRaza] = useState("")
    const [genero, setGenero] = useState("")
    const [edad, setEdad] = useState("")
    const [peso, setPeso] = useState("")
    const [duenio, setDuenio] = useState(null)
    const [dni, setDni] = useState("")
    const Navigate = useNavigate()



    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/animales/${id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,

                },
                body: JSON.stringify({
                    nombre,
                    especie,
                    raza,
                    genero,
                    edad,
                    peso,
                    duenio: duenio
                })
            })
            const data = await response.json()
            console.log(data.results ?? data)
            Navigate("/pacientes")
        } catch (error) {
            console.log(error)
        }
    }

    function filtrar_dni() {

        try {
            fetch(`${import.meta.env.VITE_API_URL}/animales/filtrar_dni/?dni=${dni}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,

                },
            })
                .then(response => response.json())
                .then(data => {
                    if (!Array.isArray(data) || data.length === 0) {
                        setDuenio(null)
                        alert("Propietario no encontrado")
                        return
                    }
                    setDuenio(data[0])
                })


                .catch(error => {
                    console.log(error)
                })
        } catch (error) {
            console.log(error)
        }
    }




    return (
        <div className="bg-[#f8fafc] text-[#1e293b] font-['Manrope',_sans-serif] min-h-screen flex flex-col">
            {/* Navbar / Breadcrumb */}
            <header className="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <Link to="/pacientes">
                        <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold text-slate-800 leading-tight">Gestión de Pacientes</h1>

                    </div>
                </div>

            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto">
                <div className="w-full max-w-4xl flex flex-col gap-8">

                    {/* Page Heading */}
                    <div className="flex flex-col gap-1 text-center md:text-left">
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Actualizar Mascota</h2>
                        <p className="text-slate-500 text-base">Complete el formulario para actualizar la información de la mascota.</p>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>

                        {/* Section 1: Patient Information */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 rounded-xl bg-[#eefdf3] text-[#13ec5b]">
                                    <span className="material-symbols-outlined text-[24px]">pets</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Información del Paciente</h3>
                            </div>

                            <div className="flex flex-col md:flex-row gap-10">
                                {/* Left Column: Photo Upload */}
                                {/*  <div className="w-full md:w-1/3 flex flex-col gap-4 items-center">
                                    <div className="group relative w-44 h-44 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#13ec5b] hover:bg-white transition-all overflow-hidden">
                                        <input accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" type="file" />
                                        <span className="material-symbols-outlined text-4xl text-slate-300 group-hover:text-[#13ec5b] mb-2 transition-colors">add_a_photo</span>
                                        <p className="text-[13px] text-slate-400 text-center px-6 font-medium group-hover:text-[#13ec5b]">Subir foto de perfil</p>
                                    </div>
                                    <p className="text-[11px] text-slate-400 text-center font-medium">Permitido: .jpg, .png (Max 2MB)</p>
                                </div> */}

                                {/* Right Column: Form Fields */}
                                <div className="w-full md:w-2/3 flex flex-col gap-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-bold text-slate-700">Nombre de la Mascota <span className="text-red-500">*</span></span>
                                            <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full rounded-xl border-slate-200 bg-white text-slate-900 focus:border-[#13ec5b] focus:ring-[#13ec5b]/20 h-12 px-4 placeholder:text-slate-300 text-sm transition-all" placeholder="Ej. Firulais" required type="text" />
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-bold text-slate-700">Especie <span className="text-red-500">*</span></span>
                                            <select value={especie} onChange={(e) => setEspecie(e.target.value)} className="w-full rounded-xl border-slate-200 bg-white text-slate-900 focus:border-[#13ec5b] focus:ring-[#13ec5b]/20 h-12 px-4 appearance-none text-sm text-slate-400 cursor-pointer transition-all">
                                                <option disabled value="">Seleccione...</option>
                                                <option value="perro">Canino</option>
                                                <option value="gato">Felino</option>
                                                <option value="">Otro</option>

                                            </select>
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-bold text-slate-700">Peso <span className="text-red-500">*</span></span>
                                            <input value={peso} onChange={(e) => setPeso(e.target.value)} className="w-full rounded-xl border-slate-200 bg-white text-slate-900 focus:border-[#13ec5b] focus:ring-[#13ec5b]/20 h-12 px-4 placeholder:text-slate-300 text-sm transition-all" placeholder="Ej. 5 kg" type="number" />
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-bold text-slate-700">Raza</span>
                                            <input value={raza} onChange={(e) => setRaza(e.target.value)} className="w-full rounded-xl border-slate-200 bg-white text-slate-900 focus:border-[#13ec5b] focus:ring-[#13ec5b]/20 h-12 px-4 placeholder:text-slate-300 text-sm transition-all" placeholder="Ej. Labrador, Siamés..." type="text" />
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-bold text-slate-700">Edad</span>
                                            <input value={edad} onChange={(e) => setEdad(e.target.value)} placeholder="Ingrese edad" className="w-full rounded-xl border-slate-200 bg-white text-slate-900 focus:border-[#13ec5b] focus:ring-[#13ec5b]/20 h-12 px-4 text-sm text-slate-400 transition-all" type="integer" />
                                        </label>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <span className="text-sm font-bold text-slate-700">Sexo <span className="text-red-500">*</span></span>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-3 p-3.5 border border-slate-200 rounded-xl cursor-pointer hover:border-[#13ec5b] hover:bg-[#eefdf3]/30 transition-all flex-1">
                                                <input type="radio" name="sex" value="macho" checked={genero === "macho"} onChange={(e) => setGenero(e.target.value)} className="w-4 h-4 text-[#13ec5b] border-slate-300 focus:ring-[#13ec5b]" />
                                                <span className="text-sm font-bold text-slate-600">Macho</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-3.5 border border-slate-200 rounded-xl cursor-pointer hover:border-[#13ec5b] hover:bg-[#eefdf3]/30 transition-all flex-1">
                                                <input checked={genero === "hembra"} onChange={(e) => setGenero(e.target.value)} className="w-4 h-4 text-[#13ec5b] border-slate-300 focus:ring-[#13ec5b]" name="sex" type="radio" value="hembra" />
                                                <span className="text-sm font-bold text-slate-600">Hembra</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Owner Information */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-[#eefdf3] text-[#13ec5b]">
                                        <span className="material-symbols-outlined text-[24px]">person</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">Propietario Asociado</h3>
                                </div>
                                <button className="text-[#13ec5b] hover:text-[#0fb847] text-sm font-bold flex items-center gap-1.5 transition-colors" type="button">
                                    <span className="material-symbols-outlined text-base">add</span> Nuevo Cliente
                                </button>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 mb-1">Buscar Propietario</label>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-[#13ec5b]">
                                        <span className="material-symbols-outlined text-[22px]">search</span>
                                    </span>
                                    <input value={dni} onChange={(e) => setDni(e.target.value)} className="w-full rounded-2xl border-slate-200 bg-white text-slate-900 focus:border-[#13ec5b] focus:ring-[#13ec5b]/20 h-14 pl-12 pr-4 placeholder:text-slate-300 text-sm transition-all" placeholder="Buscar por nombre, DNI o teléfono..." type="text" />
                                    <button type="button" onClick={filtrar_dni} className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 group-focus-within:text-[#13ec5b]">
                                        <span className="material-symbols-outlined text-[22px]">search</span>
                                    </button>
                                    {duenio && (
                                        <div className="absolute top-0 left-0 w-full h-full bg-white rounded-2xl p-4">
                                            <p>Propietario encontrado:  {duenio.duenio_nombre} {duenio.duenio_apellido} </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer / Actions */}
                        <div className="mt-4 pb-12 flex items-center justify-end gap-4">
                            <Link to="/pacientes">
                                <button className="px-8 py-3 rounded-2xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all" type="button">
                                    Cancelar
                                </button>
                            </Link>
                            <button className="px-10 py-3 rounded-2xl bg-[#13ec5b] text-white text-sm font-black hover:bg-[#0fb847] shadow-xl shadow-[#13ec5b]/20 transition-all transform active:scale-95" type="submit">
                                Guardar Mascota
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );

}

export default ActualizarPaciente