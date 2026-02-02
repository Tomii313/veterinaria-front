import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import RutasLogin from "./login/rutas.jsx"
import { BrowserRouter } from 'react-router-dom'
import RutasInicio from "./inicio/rutas.jsx"
import RutasPacientes from "./pacientes/rutas.jsx"
import RutasAgendas from "./agendas/rutas.jsx"
import RutasDueños from "./dueños/rutas.jsx"
import RutasPersonal from "./personal/rutas.jsx"
import RutasInternacion from "./internacion/rutas.jsx"
import RutasInventario from "./inventario/rutas.jsx"
import RutasEstudios from "./estudios/rutas.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <RutasLogin />
      <RutasInicio />
      <RutasPacientes />
      <RutasAgendas />
      <RutasDueños />
      <RutasPersonal />
      <RutasInternacion />
      <RutasInventario />
      <RutasEstudios />
    </BrowserRouter>
  </StrictMode>
)
