import { useState } from "react";
import axios from "axios";

const CasoForm = ({ hcId, onSuccess }) => {

  const [nombreCaso, setNombreCaso] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [planTratamiento, setPlanTratamiento] = useState("");
  const [examenAuxiliar, setExamenAuxiliar] = useState("");
  const [proformaUrl, setProforma] = useState("");
  const [odontogramaUrl, setOdontograma] = useState("");
  const [costoTotal, setCostoTotal] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [estado, setEstado] = useState("ACTIVO");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:8080/api/casos/historiasClinicas/${hcId}/casos`,
        {
          nombreCaso,
          diagnostico,
          planTratamiento,
          examenAuxiliar,
          proformaUrl,
          odontogramaUrl,
          costoTotal: Number(costoTotal),
          fechaInicio,
          estado
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Caso creado:", res.data);

      // limpiar form
      setNombreCaso("");
      setDiagnostico("");
      setPlanTratamiento("");
      setExamenAuxiliar("");
      setProforma("");
      setOdontograma("");
      setCostoTotal("");
      setFechaInicio("");
      setEstado("ACTIVO");

      onSuccess();

    } catch (error) {
      console.error("Error creando caso:", error.response?.data || error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h3>Crear Caso</h3>

      <input
        type="text"
        placeholder="Nombre del caso"
        value={nombreCaso}
        onChange={(e) => setNombreCaso(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Diagnóstico"
        value={diagnostico}
        onChange={(e) => setDiagnostico(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Plan de tratamiento"
        value={planTratamiento}
        onChange={(e) => setPlanTratamiento(e.target.value)}
      />

      <input
        type="text"
        placeholder="Examen auxiliar"
        value={examenAuxiliar}
        onChange={(e) => setExamenAuxiliar(e.target.value)}
      />

      <input
        type="text"
        placeholder="URL Proforma"
        value={proformaUrl}
        onChange={(e) => setProforma(e.target.value)}
      />

      <input
        type="text"
        placeholder="URL Odontograma"
        value={odontogramaUrl}
        onChange={(e) => setOdontograma(e.target.value)}
      />

      <input
        type="number"
        placeholder="Costo total"
        value={costoTotal}
        onChange={(e) => setCostoTotal(e.target.value)}
        required
      />

      <label>Fecha inicio:</label>
      <input
        type="date"
        value={fechaInicio}
        onChange={(e) => setFechaInicio(e.target.value)}
        required
      />

      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
      >
        <option value="ACTIVO">ACTIVO</option>
        <option value="CERRADO">CERRADO</option>
      </select>

      <button type="submit">Guardar</button>
    </form>
  );
};

export default CasoForm;