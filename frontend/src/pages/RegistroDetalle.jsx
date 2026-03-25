import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const RegistroDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [registro, setRegistro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    fechaAtencion: "", evolucion: "", procedimiento: "",
    doctor: "", abono: "", observaciones: "",
  });

  const token = localStorage.getItem("token");

  const formatFecha = (fecha) => {
    if (!fecha) return "Sin fecha";
    const [y, m, d] = fecha.split("-");
    return `${d}/${m}/${y}`;
  };

  const fetchRegistro = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/api/registros/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setRegistro(data);
      setForm({
        fechaAtencion: data.fechaAtencion || "",
        evolucion: data.evolucion || "",
        procedimiento: data.procedimientoRealizado || "",
        doctor: data.doctorResponsable || "",
        abono: data.montoAbonado || "",
        observaciones: data.observaciones || "",
      });
    } catch (error) {
      console.error("Error cargando registro:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!form.evolucion.trim()) { alert("La evolución es obligatoria"); return; }
      await axios.put(
        `http://localhost:8080/api/registros/${id}`,
        {
          fechaAtencion: form.fechaAtencion,
          evolucion: form.evolucion,
          procedimientoRealizado: form.procedimiento,
          doctorResponsable: form.doctor,
          montoAbonado: Number(form.abono),
          observaciones: form.observaciones,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditMode(false);
      fetchRegistro();
    } catch (error) {
      console.error("Error actualizando registro:", error);
    }
  };

  useEffect(() => { if (id) fetchRegistro(); }, [id]);

  if (loading) return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <div className="loading-spinner"><div className="spinner" /><span>Cargando registro...</span></div>
      </div>
    </div>
  );

  if (!registro) return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <div className="page-content"><p style={{ color: "var(--text-muted)" }}>Registro no encontrado</p></div>
      </div>
    </div>
  );

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const fields = [
    { key: "fechaAtencion", label: "Fecha de Atención", type: "date", display: formatFecha(registro.fechaAtencion) },
    { key: "evolucion", label: "Evolución", display: registro.evolucion },
    { key: "procedimiento", label: "Procedimiento Realizado", display: registro.procedimientoRealizado },
    { key: "doctor", label: "Doctor Responsable", display: registro.doctorResponsable },
    { key: "abono", label: "Monto Abonado", type: "number", display: registro.montoAbonado ? `S/ ${Number(registro.montoAbonado).toLocaleString("es-PE", { minimumFractionDigits: 2 })}` : "—" },
    { key: "observaciones", label: "Observaciones", display: registro.observaciones },
  ];

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <span className="topbar-title">Registro de Atención</span>
        </div>

        <div className="page-content">
          <button className="back-btn" onClick={() => navigate(-1)}>← Volver al Caso</button>

          {/* HEADER */}
          <div className="detail-header">
            <div className="detail-avatar" style={{ fontSize: "20px" }}>📝</div>
            <div style={{ flex: 1 }}>
              <div className="detail-name">Registro #{registro.id}</div>
              <div className="detail-id">{formatFecha(registro.fechaAtencion)}</div>
              {registro.doctorResponsable && (
                <div style={{ marginTop: "6px", fontSize: "13px", color: "var(--text-secondary)" }}>
                  Dr. {registro.doctorResponsable}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              {!editMode ? (
                <button className="btn btn-ghost btn-sm" onClick={() => setEditMode(true)}>✏ Editar</button>
              ) : (
                <>
                  <button className="btn btn-primary btn-sm" onClick={handleUpdate}>✓ Guardar</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setEditMode(false); fetchRegistro(); }}>Cancelar</button>
                </>
              )}
            </div>
          </div>

          {/* DATA */}
          <div className="card">
            <div className="card-body">
              {editMode ? (
                <div className="form-grid">
                  {fields.map(({ key, label, type = "text" }) => (
                    <div className="form-group" key={key} style={key === "evolucion" || key === "procedimiento" || key === "observaciones" ? { gridColumn: "span 2" } : {}}>
                      <label className="form-label">{label}</label>
                      <input
                        className="form-input"
                        type={type}
                        value={form[key] || ""}
                        onChange={set(key)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  {fields.map(({ label, display }) => (
                    <div className="info-row" key={label}>
                      <span className="info-label">{label}</span>
                      <span className="info-value">{display || "—"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroDetalle;
