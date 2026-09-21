import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Pacientes from "./pages/Pacientes";
import PacienteDetalle from "./pages/PacienteDetalle";
import HistoriaClinica from "./pages/HistoriaClinica";
import CasoDetalle from "./pages/CasoDetalle";
import RegistroDetalle from "./pages/RegistroDetalle";
import Calendario from "./pages/Calendario";
import OdontogramaPaciente from "./pages/OdontogramaPaciente";
import OdontogramaEditor from "./pages/OdontogramaEditor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/pacientes/:id" element={<PacienteDetalle />} />
        <Route path="/historias-clinicas/:id" element={<HistoriaClinica />} />
        <Route path="/casos/:id" element={<CasoDetalle />} />
        <Route path="/registros/:id" element={<RegistroDetalle />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="*" element={<Navigate to="/pacientes" replace />} />
        <Route path="/pacientes/:pacienteId/odontogramas" element={<OdontogramaPaciente />} />
        <Route path="/pacientes/:pacienteId/odontogramas/nuevo" element={<OdontogramaEditor />} />
        <Route path="/odontogramas/:id" element={<OdontogramaEditor modo="ver" />} />
        <Route path="/odontogramas/:id/editar" element={<OdontogramaEditor modo="editar" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;