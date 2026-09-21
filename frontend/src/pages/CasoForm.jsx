import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// Componentes de Íconos SVG
const UploadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

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

  // Imágenes por tipo (Odontograma removido)
  const [imagenes, setImagenes] = useState({
    EXAMEN_AUXILIAR: [],
    PLAN_TRATAMIENTO: [],
    PROFORMA: [],
  });

  const [uploading, setUploading] = useState({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // Subida a Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "odontogramas");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dgwjbpviy/image/upload",
      { method: "POST", body: formData }
    );
    const data = await res.json();
    return data.secure_url;
  };

  // Manejar múltiples imágenes por tipo
  const handleFileChange = async (e, tipo) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading((prev) => ({ ...prev, [tipo]: true }));
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
    } finally {
      setUploading((prev) => ({ ...prev, [tipo]: false }));
      e.target.value = "";
    }
  };

  const handleEliminarImagen = (tipo, index) => {
    setImagenes((prev) => ({
      ...prev,
      [tipo]: prev[tipo].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Transformar imágenes al formato que requiere el backend
      const imagenesPayload = Object.entries(imagenes).flatMap(
        ([tipo, urls]) =>
          urls.map((url) => ({
            url,
            tipo,
          }))
      );

      await axios.post(
        `${API}/api/casos/historiasClinicas/${hcId}/casos`,
        {
          ...form,
          costoTotal: Number(form.costoTotal),
          imagenes: imagenesPayload,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Limpiar formulario al completar
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
        EXAMEN_AUXILIAR: [],
        PLAN_TRATAMIENTO: [],
        PROFORMA: [],
      });
      onSuccess();
    } catch (error) {
      console.error("Error creando caso:", error.response?.data || error);
      alert("Error al guardar el tratamiento dental.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card" style={{ padding: "24px", background: "var(--bg-surface)" }}>
        <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="dot" />
          Nuevo Tratamiento Dental
        </div>

        <div className="form-grid" style={{ gap: "16px" }}>
          {/* Nombre y Diagnóstico */}
          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label className="form-label">Nombre del Tratamiento *</label>
            <input
              className="form-input"
              placeholder="Ej. Curación y Resina Diente 24"
              value={form.nombreCaso}
              onChange={set("nombreCaso")}
              required
            />
          </div>

          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label className="form-label">Diagnóstico *</label>
            <input
              className="form-input"
              placeholder="Ej. Caries de esmalte y dentina profunda"
              value={form.diagnostico}
              onChange={set("diagnostico")}
              required
            />
          </div>

          {/* Plan de Tratamiento */}
          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label className="form-label" style={{ margin: 0 }}>Plan de Tratamiento</label>
              <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "12px", color: "var(--accent)" }}>
                <UploadIcon />
                <span>{uploading.PLAN_TRATAMIENTO ? "Subiendo..." : "Adjuntar imágenes"}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: "none" }}
                  disabled={uploading.PLAN_TRATAMIENTO}
                  onChange={(e) => handleFileChange(e, "PLAN_TRATAMIENTO")}
                />
              </label>
            </div>
            <input
              className="form-input"
              placeholder="Detalles del procedimiento o plan..."
              value={form.planTratamiento}
              onChange={set("planTratamiento")}
            />
            {imagenes.PLAN_TRATAMIENTO.length > 0 && (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
                {imagenes.PLAN_TRATAMIENTO.map((url, i) => (
                  <div key={i} style={{ position: "relative", width: "60px", height: "60px" }}>
                    <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border)" }} />
                    <button
                      type="button"
                      onClick={() => handleEliminarImagen("PLAN_TRATAMIENTO", i)}
                      style={{ position: "absolute", top: "-4px", right: "-4px", background: "rgba(255,77,109,0.9)", color: "#fff", border: "none", borderRadius: "50%", width: "18px", height: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Examen Auxiliar */}
          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label className="form-label" style={{ margin: 0 }}>Examen Auxiliar</label>
              <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "12px", color: "var(--accent)" }}>
                <UploadIcon />
                <span>{uploading.EXAMEN_AUXILIAR ? "Subiendo..." : "Adjuntar radiografías/exámenes"}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: "none" }}
                  disabled={uploading.EXAMEN_AUXILIAR}
                  onChange={(e) => handleFileChange(e, "EXAMEN_AUXILIAR")}
                />
              </label>
            </div>
            <input
              className="form-input"
              placeholder="Ej. Radiografía Periapical"
              value={form.examenAuxiliar}
              onChange={set("examenAuxiliar")}
            />
            {imagenes.EXAMEN_AUXILIAR.length > 0 && (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
                {imagenes.EXAMEN_AUXILIAR.map((url, i) => (
                  <div key={i} style={{ position: "relative", width: "60px", height: "60px" }}>
                    <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border)" }} />
                    <button
                      type="button"
                      onClick={() => handleEliminarImagen("EXAMEN_AUXILIAR", i)}
                      style={{ position: "absolute", top: "-4px", right: "-4px", background: "rgba(255,77,109,0.9)", color: "#fff", border: "none", borderRadius: "50%", width: "18px", height: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Presupuesto / Proforma */}
          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label className="form-label" style={{ margin: 0 }}>Presupuesto / Proforma</label>
              <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "12px", color: "var(--accent)" }}>
                <UploadIcon />
                <span>{uploading.PROFORMA ? "Subiendo..." : "Adjuntar archivo proforma"}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: "none" }}
                  disabled={uploading.PROFORMA}
                  onChange={(e) => handleFileChange(e, "PROFORMA")}
                />
              </label>
            </div>
            <input
              className="form-input"
              placeholder="Notas sobre el presupuesto o enlace"
              value={form.proformaUrl}
              onChange={set("proformaUrl")}
            />
            {imagenes.PROFORMA.length > 0 && (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
                {imagenes.PROFORMA.map((url, i) => (
                  <div key={i} style={{ position: "relative", width: "60px", height: "60px" }}>
                    <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border)" }} />
                    <button
                      type="button"
                      onClick={() => handleEliminarImagen("PROFORMA", i)}
                      style={{ position: "absolute", top: "-4px", right: "-4px", background: "rgba(255,77,109,0.9)", color: "#fff", border: "none", borderRadius: "50%", width: "18px", height: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Costo Total y Fecha de Inicio */}
          <div className="form-group">
            <label className="form-label">Costo Total (S/) *</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              placeholder="0.00"
              value={form.costoTotal}
              onChange={set("costoTotal")}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Fecha de Inicio *</label>
            <input
              type="date"
              className="form-input"
              value={form.fechaInicio}
              onChange={set("fechaInicio")}
              required
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "24px" }}>
          {onCancel && (
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              Cancelar
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Guardando..." : "Crear Tratamiento"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CasoForm;