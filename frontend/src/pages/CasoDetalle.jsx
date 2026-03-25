import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const CasoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caso, setCaso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    nombreCaso: "", diagnostico: "", planTratamiento: "", examenAuxiliar: "",
    proformaUrl: "", odontogramaUrl: "", costoTotal: "", fechaInicio: "", fechaFin: "", estado: "ACTIVO",
  });

  const [regForm, setRegForm] = useState({
    fechaAtencion: "", evolucion: "", procedimiento: "", doctor: "", abono: "", observaciones: "",
  });

  const token = localStorage.getItem("token");

  const formatFecha = (fecha) => {
    if (!fecha) return "Sin fecha";
    const [y, m, d] = fecha.split("-");
    return `${d}/${m}/${y}`;
  };

  const fetchCaso = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/api/casos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setCaso(data);
      setForm({
        nombreCaso: data.nombreCaso || "", diagnostico: data.diagnostico || "",
        planTratamiento: data.planTratamiento || "", examenAuxiliar: data.examenAuxiliar || "",
        proformaUrl: data.proformaUrl || "", odontogramaUrl: data.odontogramaUrl || "",
        costoTotal: data.costoTotal || "", fechaInicio: data.fechaInicio || "",
        fechaFin: data.fechaFin || "", estado: data.estado || "ACTIVO",
      });
    } catch (error) {
      console.error("Error cargando caso:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistros = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/registros/caso/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegistros(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      console.error("Error cargando registros:", error);
      setRegistros([]);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!form.diagnostico.trim()) { alert("El diagnóstico no puede estar vacío"); return; }
      await axios.put(`http://localhost:8080/api/casos/${id}`,
        { ...form, costoTotal: Number(form.costoTotal) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditMode(false);
      fetchCaso();
    } catch (error) {
      console.error("Error actualizando caso:", error);
    }
  };

  const handleCreateRegistro = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/registros/casos/${id}/registros`,
        {
          fechaAtencion: regForm.fechaAtencion,
          evolucion: regForm.evolucion,
          procedimientoRealizado: regForm.procedimiento,
          doctorResponsable: regForm.doctor,
          montoAbonado: Number(regForm.abono),
          observaciones: regForm.observaciones,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRegForm({ fechaAtencion: "", evolucion: "", procedimiento: "", doctor: "", abono: "", observaciones: "" });
      setShowForm(false);
      fetchRegistros();
    } catch (error) {
      console.error("Error creando registro:", error);
    }
  };

  const handleDeleteRegistro = async (registroId) => {
    if (!window.confirm("¿Eliminar este registro?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/registros/${registroId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRegistros();
    } catch (error) {
      console.error("Error eliminando registro:", error);
    }
  };

  useEffect(() => {
    if (id) { fetchCaso(); fetchRegistros(); }
  }, [id]);

  if (loading) return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <div className="loading-spinner"><div className="spinner" /><span>Cargando caso...</span></div>
      </div>
    </div>
  );

  if (!caso) return (
    <div className="app-shell"><Sidebar /><div className="main-content"><p>No se encontró el caso</p></div></div>
  );

  const estadoBadge = (estado) => {
    if (estado === "ACTIVO") return <span className="badge badge-active">● Activo</span>;
    return <span className="badge" style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }}>✓ Finalizado</span>;
  };

  const setReg = (field) => (e) => setRegForm((prev) => ({ ...prev, [field]: e.target.value }));
  const setF = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <span className="topbar-title">Caso Clínico</span>
        </div>

        <div className="page-content">
          <button className="back-btn" onClick={() => navigate(-1)}>← Volver a Historia</button>

          {/* CASO HEADER */}
          <div className="detail-header">
            <div className="detail-avatar" style={{ fontSize: "20px" }}>📋</div>
            <div style={{ flex: 1 }}>
              <div className="detail-name">{caso.nombreCaso || `Caso #${caso.id}`}</div>
              <div className="detail-id">ID #{caso.id}</div>
              <div style={{ marginTop: "10px", display: "flex", gap: "10px", alignItems: "center" }}>
                {estadoBadge(caso.estado)}
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "DM Mono, monospace" }}>
                  Inicio: {formatFecha(caso.fechaInicio)}
                </span>
                {caso.costoTotal > 0 && (
                  <span style={{ fontSize: "13px", color: "var(--accent)", fontFamily: "DM Mono, monospace", fontWeight: 600 }}>
                    S/ {Number(caso.costoTotal).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              {!editMode ? (
                <button className="btn btn-ghost btn-sm" onClick={() => setEditMode(true)}>✏ Editar</button>
              ) : (
                <>
                  <button className="btn btn-primary btn-sm" onClick={handleUpdate}>✓ Guardar</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setEditMode(false); fetchCaso(); }}>Cancelar</button>
                </>
              )}
            </div>
          </div>

          {/* CASO DATA */}
          <div className="card" style={{ marginBottom: "28px" }}>
            <div className="card-body">
              {editMode ? (
                <div className="form-grid">
                  {[
                    { key: "nombreCaso", label: "Nombre del Caso", span: 2 },
                    { key: "diagnostico", label: "Diagnóstico", span: 2 },
                    { key: "planTratamiento", label: "Plan de Tratamiento", span: 2 },
                    { key: "examenAuxiliar", label: "Examen Auxiliar" },
                    { key: "costoTotal", label: "Costo Total", type: "number" },
                    { key: "proformaUrl", label: "URL Proforma" },
                    { key: "odontogramaUrl", label: "URL Odontograma" },
                    { key: "fechaInicio", label: "Fecha Inicio", type: "date" },
                    { key: "fechaFin", label: "Fecha Fin", type: "date" },
                  ].map(({ key, label, type = "text", span }) => (
                    <div className="form-group" key={key} style={span ? { gridColumn: `span ${span}` } : {}}>
                      <label className="form-label">{label}</label>
                      <input className="form-input" type={type} value={form[key] || ""} onChange={setF(key)} />
                    </div>
                  ))}
                  <div className="form-group">
                    <label className="form-label">Estado</label>
                    <select className="form-input" value={form.estado} onChange={setF("estado")}>
                      <option value="ACTIVO">ACTIVO</option>
                      <option value="FINALIZADO">FINALIZADO</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  {[
                    { label: "Diagnóstico", value: caso.diagnostico },
                    { label: "Plan de Tratamiento", value: caso.planTratamiento },
                    { label: "Examen Auxiliar", value: caso.examenAuxiliar },
                    { label: "Proforma", value: caso.proformaUrl, isUrl: true },
                    { label: "Odontograma", value: caso.odontogramaUrl, isUrl: true },
                    { label: "Fecha Inicio", value: formatFecha(caso.fechaInicio) },
                    { label: "Fecha Fin", value: caso.fechaFin ? formatFecha(caso.fechaFin) : "Sin fecha" },
                    { label: "Costo Total", value: caso.costoTotal ? `S/ ${Number(caso.costoTotal).toLocaleString("es-PE", { minimumFractionDigits: 2 })}` : "—" },
                  ].map(({ label, value, isUrl }) => (
                    <div className="info-row" key={label}>
                      <span className="info-label">{label}</span>
                      <span className="info-value">
                        {isUrl && value
                          ? <a href={value} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>🔗 Ver</a>
                          : (value || "—")
                        }
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* REGISTROS */}
          <div className="section-header">
            <h3 className="section-title" style={{ fontSize: "17px" }}>
              <span className="dot" />
              Registros de Atención
              <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "DM Mono, monospace", fontWeight: 400 }}>
                ({registros.length})
              </span>
            </h3>
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
              {showForm ? "✕ Cancelar" : "+ Nuevo Registro"}
            </button>
          </div>

          {/* REGISTRO FORM */}
          {showForm && (
            <div className="form-section" style={{ marginBottom: "20px" }}>
              <div className="form-section-title" style={{ fontSize: "14px" }}>Nuevo Registro de Atención</div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Fecha de Atención</label>
                  <input className="form-input" type="date" value={regForm.fechaAtencion} onChange={setReg("fechaAtencion")} />
                </div>
                <div className="form-group">
                  <label className="form-label">Doctor Responsable</label>
                  <input className="form-input" placeholder="Dr. Nombre Apellido" value={regForm.doctor} onChange={setReg("doctor")} />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label className="form-label">Evolución</label>
                  <input className="form-input" placeholder="Descripción de la evolución" value={regForm.evolucion} onChange={setReg("evolucion")} />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label className="form-label">Procedimiento Realizado</label>
                  <input className="form-input" placeholder="Procedimiento clínico realizado" value={regForm.procedimiento} onChange={setReg("procedimiento")} />
                </div>
                <div className="form-group">
                  <label className="form-label">Monto Abonado</label>
                  <input className="form-input" type="number" placeholder="0.00" value={regForm.abono} onChange={setReg("abono")} />
                </div>
                <div className="form-group">
                  <label className="form-label">Observaciones</label>
                  <input className="form-input" placeholder="Observaciones adicionales" value={regForm.observaciones} onChange={setReg("observaciones")} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancelar</button>
                <button className="btn btn-primary btn-sm" onClick={handleCreateRegistro}>✓ Guardar Registro</button>
              </div>
            </div>
          )}

          {/* REGISTROS LIST */}
          {registros.length === 0 ? (
            <div className="empty-state" style={{ padding: "40px" }}>
              <div className="empty-state-icon">📝</div>
              <p className="empty-state-text">No hay registros de atención</p>
            </div>
          ) : (
            registros.map((r) => (
              <div key={r.id} className="registro-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "DM Mono, monospace", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                      Registro #{r.id}
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {formatFecha(r.fechaAtencion)}
                      {r.doctorResponsable && (
                        <span style={{ marginLeft: "12px", fontSize: "13px", fontWeight: 400, color: "var(--text-secondary)" }}>
                          Dr. {r.doctorResponsable}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/registros/${r.id}`)}>
                      Ver Detalle
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRegistro(r.id)}>
                      🗑
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {r.evolucion && (
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.3px", fontFamily: "DM Mono, monospace", marginBottom: "3px" }}>Evolución</div>
                      <div style={{ fontSize: "13.5px", color: "var(--text-secondary)" }}>{r.evolucion}</div>
                    </div>
                  )}
                  {r.procedimientoRealizado && (
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.3px", fontFamily: "DM Mono, monospace", marginBottom: "3px" }}>Procedimiento</div>
                      <div style={{ fontSize: "13.5px", color: "var(--text-secondary)" }}>{r.procedimientoRealizado}</div>
                    </div>
                  )}
                  {r.montoAbonado > 0 && (
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.3px", fontFamily: "DM Mono, monospace", marginBottom: "3px" }}>Abono</div>
                      <div style={{ fontSize: "13.5px", color: "var(--accent)", fontFamily: "DM Mono, monospace", fontWeight: 600 }}>
                        S/ {Number(r.montoAbonado).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  )}
                  {r.observaciones && (
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.3px", fontFamily: "DM Mono, monospace", marginBottom: "3px" }}>Observaciones</div>
                      <div style={{ fontSize: "13.5px", color: "var(--text-secondary)" }}>{r.observaciones}</div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CasoDetalle;
