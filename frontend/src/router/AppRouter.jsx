import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Pacientes from "../pages/Pacientes";
import PrivateRoute from "../components/PrivateRoute";
import HistoriaClinica from "../pages/HistoriaClinica";
import CasoDetalle from "../pages/CasoDetalle";
import RegistroDetalle from "../pages/RegistroDetalle";
import PacienteDetalle from "../pages/PacienteDetalle";


function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pública */}
        <Route path="/login" element={<Login />} />

        {/* Protegidas */}
        <Route
          path="/pacientes"
          element={
            <PrivateRoute>
              <Pacientes />
            </PrivateRoute>
          }
        />

          <Route
          path="/pacientes/:id"
          element={
            <PrivateRoute>
              <PacienteDetalle />
            </PrivateRoute>
          }
        />

        <Route
          path="/historia/:id"
          element={
            <PrivateRoute>
              <HistoriaClinica />
            </PrivateRoute>
          }
        />

        <Route
          path="/casos/:id"
          element={
            <PrivateRoute>
              <CasoDetalle />
            </PrivateRoute>
          }
        />

        <Route
          path="/registros/:id"
          element={
            <PrivateRoute>
              <RegistroDetalle />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;