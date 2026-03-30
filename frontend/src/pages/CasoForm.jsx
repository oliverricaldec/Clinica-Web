import { useState } from "react";
import axios from "axios";

const CasoForm = ({ hcId, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    nombreCaso: "",
    diagnostico: "",
    planTratamiento: "",
    examenAuxiliar: "",
    proformaUrl: "",
    costoTotal: "",
    fechaInicio: "",
    estado: "ACTIVO",
  });

  // 🔥 imágenes separadas por tipo
  const [imagenes, setImagenes] = useState({
    ODONTOGRAMA: [],
    EXAMEN_AUXILIAR: [],
    PLAN_TRATAMIENTO: [],
    PROFORMA: []
  });

  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // ☁️ subir a cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "odontogramas");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dgwjbpviy/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  };

  // 📸 manejar múltiples imágenes
  const handleFileChange = async (e, tipo) => {
    const files = Array.from(e.target.files);

    try {
      const urls = await Promise.all(
        files.map((file) => uploadToCloudinary(file))
      );

      setImagenes((prev) => ({
        ...prev,
        [tipo]: [...prev[tipo], ...urls],
      }));
    } catch (error) {
      console.error("Error subiendo imágenes:", error);
    }
  };

  // 🚀 submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔥 transformar imágenes al formato backend
      const imagenesPayload = Object.entries(imagenes).flatMap(
        ([tipo, urls]) =>
          urls.map((url) => ({
            url,
            tipo,
          }))
      );

      await axios.post(
        `http://localhost:8080/api/casos/historiasClinicas/${hcId}/casos`,
        {
          ...form,
          costoTotal: Number(form.costoTotal),
          imagenes: imagenesPayload,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // reset
      setForm({
        nombreCaso: "",
        diagnostico: "",
        planTratamiento: "",
        examenAuxiliar: "",
        proformaUrl: "",
        costoTotal: "",
        fechaInicio: "",
        estado: "ACTIVO",
      });

      setImagenes({
        ODONTOGRAMA: [],
        EXAMEN_AUXILIAR: [],
        PLAN_TRATAMIENTO: [],
        PROFORMA: []
      });

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
          
          {/* BASICO */}
          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label className="form-label">Nombre del Caso *</label>
            <input className="form-input" value={form.nombreCaso} onChange={set("nombreCaso")} required />
          </div>

          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label className="form-label">Diagnóstico *</label>
            <input className="form-input" value={form.diagnostico} onChange={set("diagnostico")} required />
          </div>

          {/* PLAN */}
          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label className="form-label">Plan de Tratamiento</label>
            <input className="form-input" value={form.planTratamiento} onChange={set("planTratamiento")} />
            <input type="file" multiple accept="image/*" onChange={(e) => handleFileChange(e, "PLAN_TRATAMIENTO")} />
          </div>

          {/* EXAMEN */}
          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label className="form-label">Examen Auxiliar</label>
            <input className="form-input" value={form.examenAuxiliar} onChange={set("examenAuxiliar")} />
            <input type="file" multiple accept="image/*" onChange={(e) => handleFileChange(e, "EXAMEN_AUXILIAR")} />
          </div>

          {/* ODONTOGRAMA */}
          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label className="form-label">Odontograma</label>
            <input type="file" multiple accept="image/*" onChange={(e) => handleFileChange(e, "ODONTOGRAMA")} />
          </div>

          <div className="form-group" style={{ gridColumn: "span 2" }}>
  <label className="form-label">Presupuesto</label>
  
  {/* input texto */}
  <input
    className="form-input"
    value={form.proformaUrl}
    onChange={set("proformaUrl")}
  />

  {/* input imágenes */}
  <input
    type="file"
    multiple
    accept="image/*"
    onChange={(e) => handleFileChange(e, "PROFORMA")}
  />
</div>

          {/* PREVIEWS */}
          <div style={{ gridColumn: "span 2" }}>
            {Object.entries(imagenes).map(([tipo, urls]) =>
              urls.map((url, i) => (
                <img
                  key={tipo + i}
                  src={url}
                  alt=""
                  style={{ width: "100px", margin: "5px" }}
                />
              ))
            )}
          </div>

          {/* OTROS */}
          <div className="form-group">
            <label className="form-label">Costo Total *</label>
            <input type="number" className="form-input" value={form.costoTotal} onChange={set("costoTotal")} required />
          </div>

          <div className="form-group">
            <label className="form-label">Fecha de Inicio *</label>
            <input type="date" className="form-input" value={form.fechaInicio} onChange={set("fechaInicio")} required />
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