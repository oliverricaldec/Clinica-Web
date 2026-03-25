import { useState } from "react";
import axios from "axios";

const CasoForm = ({ hcId, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    nombreCaso: "",
    diagnostico: "",
    planTratamiento: "",
    examenAuxiliar: "",
    proformaUrl: "",
    odontogramaUrl: "",
    costoTotal: "",
    fechaInicio: "",
    estado: "ACTIVO",
  });

  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:8080/api/casos/historiasClinicas/${hcId}/casos`,
        { ...form, costoTotal: Number(form.costoTotal) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({ nombreCaso: "", diagnostico: "", planTratamiento: "", examenAuxiliar: "", proformaUrl: "", odontogramaUrl: "", costoTotal: "", fechaInicio: "", estado: "ACTIVO" });
      onSuccess();
    } catch (error) {
      console.error("Error creando caso:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-section">
        <div className="form-section-title">Nuevo Caso Clínico</div>

        <div className="form-grid" style={{ marginBottom: "16px" }}>
          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label className="form-label">Nombre del Caso *</label>
            <input className="form-input" placeholder="Ej: Tratamiento de caries múltiple" value={form.nombreCaso} onChange={set("nombreCaso")} required />
          </div>
          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label className="form-label">Diagnóstico *</label>
            <input className="form-input" placeholder="Diagnóstico clínico" value={form.diagnostico} onChange={set("diagnostico")} required />
          </div>
          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label className="form-label">Plan de Tratamiento</label>
            <input className="form-input" placeholder="Plan detallado de tratamiento" value={form.planTratamiento} onChange={set("planTratamiento")} />
          </div>
          <div className="form-group">
            <label className="form-label">Examen Auxiliar</label>
            <input className="form-input" placeholder="Radiografías, análisis..." value={form.examenAuxiliar} onChange={set("examenAuxiliar")} />
          </div>
          <div className="form-group">
            <label className="form-label">Costo Total *</label>
            <input className="form-input" type="number" placeholder="0.00" value={form.costoTotal} onChange={set("costoTotal")} required />
          </div>
          <div className="form-group">
            <label className="form-label">URL Proforma</label>
            <input className="form-input" placeholder="https://..." value={form.proformaUrl} onChange={set("proformaUrl")} />
          </div>
          <div className="form-group">
            <label className="form-label">URL Odontograma</label>
            <input className="form-input" placeholder="https://..." value={form.odontogramaUrl} onChange={set("odontogramaUrl")} />
          </div>
          <div className="form-group">
            <label className="form-label">Fecha de Inicio *</label>
            <input className="form-input" type="date" value={form.fechaInicio} onChange={set("fechaInicio")} required />
          </div>
          <div className="form-group">
            <label className="form-label">Estado</label>
            <select className="form-input" value={form.estado} onChange={set("estado")}>
              <option value="ACTIVO">ACTIVO</option>
              <option value="CERRADO">CERRADO</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          {onCancel && (
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              Cancelar
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Guardando..." : "✓ Crear Caso"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CasoForm;
