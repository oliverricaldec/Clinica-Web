import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const API = import.meta.env.VITE_API_URL;

// Subida a Cloudinary
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "odontogramas");
  const res = await fetch("https://api.cloudinary.com/v1_1/dgwjbpviy/image/upload", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return data.secure_url;
};

// Componentes de Íconos SVG
const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const TIPOS = ["EXAMEN_AUXILIAR", "PLAN_TRATAMIENTO", "PROFORMA"];
const TIPO_LABEL = {
  EXAMEN_AUXILIAR: "Examen Auxiliar",
  PLAN_TRATAMIENTO: "Plan de Tratamiento",
  PROFORMA: "Proforma",
};
const TIPO_COLOR = {
  EXAMEN_AUXILIAR: { bg: "rgba(252,91,167,0.10)", color: "#fc5ba7", border: "rgba(252,91,167,0.25)" },
  PLAN_TRATAMIENTO: { bg: "rgba(0,200,150,0.10)", color: "#00c896", border: "rgba(0,200,150,0.25)" },
  PROFORMA: { bg: "rgba(4,151,255,0.10)", color: "#0497ff", border: "rgba(4,151,255,0.25)" },
};

// Galería de imágenes en modo lectura
const ImagenGallery = ({ imagenes }) => {
  const [preview, setPreview] = useState(null);
  if (!imagenes || imagenes.length === 0) return null;

  const porTipo = TIPOS.reduce((acc, tipo) => {
    acc[tipo] = imagenes.filter((img) => img.tipo === tipo);
    return acc;
  }, {});

  return (
    <>
      {preview && (
        <div
          onClick={() => setPreview(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.90)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <div style={{ position: "relative" }}>
            <img src={preview} alt="Preview" style={{ maxWidth: "90vw", maxHeight: "85vh", borderRadius: "12px" }} />
            <a
              href={preview}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute", bottom: "12px", right: "12px",
                background: "rgba(4,151,255,0.9)", color: "#fff",
                padding: "6px 14px", borderRadius: "8px",
                fontSize: "12px", fontWeight: 600, textDecoration: "none",
              }}
            >
              Abrir original
            </a>
          </div>
        </div>
      )}
      {TIPOS.map((tipo) => {
        const imgs = porTipo[tipo];
        if (!imgs || imgs.length === 0) return null;
        const c = TIPO_COLOR[tipo];
        return (
          <div key={tipo} style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span style={{ fontSize: "11px", fontFamily: "DM Mono, monospace", textTransform: "uppercase", padding: "3px 10px", borderRadius: "20px", background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
                {TIPO_LABEL[tipo]}
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "DM Mono, monospace" }}>
                {imgs.length} imagen{imgs.length !== 1 ? "es" : ""}
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {imgs.map((img, i) => (
                <div key={i} style={{ width: "100px", height: "100px", borderRadius: "8px", overflow: "hidden", cursor: "zoom-in", border: `1px solid ${c.border}` }} onClick={() => setPreview(img.url)}>
                  <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};

// Editor de imágenes en modo edición
const ImagenEditor = ({ imagenesActuales, onChange }) => {
  const [imagenesLocales, setImagenesLocales] = useState(
    imagenesActuales?.map((img) => ({ url: img.url, tipo: img.tipo })) || []
  );
  const [uploading, setUploading] = useState({});

  useEffect(() => {
    onChange(imagenesLocales);
  }, [imagenesLocales]);

  const handleEliminar = (url) => {
    setImagenesLocales((prev) => prev.filter((img) => img.url !== url));
  };

  const handleAgregar = async (e, tipo) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading((prev) => ({ ...prev, [tipo]: true }));
    try {
      const urls = await Promise.all(files.map(uploadToCloudinary));
      setImagenesLocales((prev) => [...prev, ...urls.map((url) => ({ url, tipo }))]);
    } catch (err) {
      console.error("Error subiendo imágenes:", err);
    } finally {
      setUploading((prev) => ({ ...prev, [tipo]: false }));
      e.target.value = "";
    }
  };

  const porTipo = TIPOS.reduce((acc, tipo) => {
    acc[tipo] = imagenesLocales.filter((img) => img.tipo === tipo);
    return acc;
  }, {});

  return (
    <>
      {TIPOS.map((tipo) => {
        const imgs = porTipo[tipo];
        const c = TIPO_COLOR[tipo];
        const isUploading = uploading[tipo];
        return (
          <div key={tipo} style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "11px", fontFamily: "DM Mono, monospace", textTransform: "uppercase", padding: "3px 10px", borderRadius: "20px", background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
                {TIPO_LABEL[tipo]} ({imgs.length})
              </span>
              <label style={{ cursor: isUploading ? "not-allowed" : "pointer", padding: "4px 10px", borderRadius: "6px", background: c.bg, color: c.color, border: `1px solid ${c.border}`, fontSize: "12px", fontWeight: 600 }}>
                {isUploading ? "Subiendo..." : "+ Agregar"}
                <input type="file" multiple accept="image/*" style={{ display: "none" }} disabled={isUploading} onChange={(e) => handleAgregar(e, tipo)} />
              </label>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {imgs.map((img, i) => (
                <div key={i} style={{ position: "relative", width: "80px", height: "80px" }}>
                  <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px", border: `1px solid ${c.border}` }} />
                  <button onClick={() => handleEliminar(img.url)} style={{ position: "absolute", top: "-4px", right: "-4px", width: "20px", height: "20px", borderRadius: "50%", background: "rgba(255,77,109,0.9)", color: "#fff", border: "none", cursor: "pointer", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};

// Componente Principal
const CasoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caso, setCaso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [imagenesEdit, setImagenesEdit] = useState([]);

  const [form, setForm] = useState({
    nombreCaso: "", diagnostico: "", planTratamiento: "", examenAuxiliar: "",
    proformaUrl: "", costoTotal: "", fechaInicio: "", fechaFin: "", estado: "ACTIVO",
  });

  const [regForm, setRegForm] = useState({
    fechaAtencion: "", evolucion: "", procedimiento: "", doctor: "", abono: "", observaciones: "",
  });

  const token = localStorage.getItem("token");

  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    const [y, m, d] = fecha.split("T")[0].split("-");
    return `${d}/${m}/${y}`;
  };

  const fetchCaso = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/casos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setCaso(data);
      setForm({
        nombreCaso: data.nombreCaso || "",
        diagnostico: data.diagnostico || "",
        planTratamiento: data.planTratamiento || "",
        examenAuxiliar: data.examenAuxiliar || "",
        proformaUrl: data.proformaUrl || "",
        costoTotal: data.costoTotal || "",
        fechaInicio: data.fechaInicio || "",
        fechaFin: data.fechaFin || "",
        estado: data.estado || "ACTIVO",
      });
    } catch (error) {
      console.error("Error cargando caso:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistros = async () => {
    try {
      const res = await axios.get(`${API}/api/registros/caso/${id}`, {
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
      await axios.put(
        `${API}/api/casos/${id}`,
        {
          ...form,
          costoTotal: Number(form.costoTotal),
          imagenes: imagenesEdit.map((img) => ({ url: img.url, tipo: img.tipo })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditMode(false);
      fetchCaso();
    } catch (error) {
      console.error("Error actualizando caso:", error);
    }
  };

  const handleCancelar = () => {
    setEditMode(false);
    setForm({
      nombreCaso: caso.nombreCaso || "", diagnostico: caso.diagnostico || "",
      planTratamiento: caso.planTratamiento || "", examenAuxiliar: caso.examenAuxiliar || "",
      proformaUrl: caso.proformaUrl || "", costoTotal: caso.costoTotal || "",
      fechaInicio: caso.fechaInicio || "", fechaFin: caso.fechaFin || "",
      estado: caso.estado || "ACTIVO",
    });
  };

  const handleCreateRegistro = async () => {
    try {
      await axios.post(
        `${API}/api/registros/casos/${id}/registros`,
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
    if (!window.confirm("¿Estás seguro de eliminar este registro de atención?")) return;
    try {
      await axios.delete(`${API}/api/registros/${registroId}`, {
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
        <div className="loading-spinner"><div className="spinner" /><span>Cargando tratamiento dental...</span></div>
      </div>
    </div>
  );

  if (!caso) return (
    <div className="app-shell"><Sidebar /><div className="main-content"><p>No se encontró el tratamiento</p></div></div>
  );

  const setReg = (field) => (e) => setRegForm((prev) => ({ ...prev, [field]: e.target.value }));
  const setF = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="app-shell" style={{ maxWidth: "100%", padding: "0 20px" }}>
      <Sidebar />
      <div className="main-content" style={{ width: "100%", maxWidth: "100%" }}>
        <div className="topbar">
          <span className="topbar-title">Detalle de Tratamiento Dental</span>
        </div>
        <div className="page-content" style={{ maxWidth: "100%", padding: "20px 0" }}>
          
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: "16px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <ArrowLeftIcon />
            <span>Volver a la Historia Clínica</span>
          </button>

          {/* HEADER TRATAMIENTO */}
          <div className="card" style={{ padding: "20px", marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {caso.nombreCaso || `Tratamiento #${caso.id}`}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "DM Mono, monospace", marginTop: "4px" }}>
                  ID #{caso.id} | Fecha de Inicio: {formatFecha(caso.fechaInicio)}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span className={`badge ${caso.estado === "ACTIVO" ? "badge-active" : ""}`} style={{ fontSize: "11px", padding: "4px 12px" }}>
                  {caso.estado}
                </span>
                {!editMode ? (
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditMode(true)}>Editar Tratamiento</button>
                ) : (
                  <>
                    <button className="btn btn-primary btn-sm" onClick={handleUpdate}>Guardar Cambios</button>
                    <button className="btn btn-ghost btn-sm" onClick={handleCancelar}>Cancelar</button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* DATOS GENERALES E IMÁGENES */}
          <div className="card" style={{ padding: "24px", marginBottom: "28px" }}>
            {editMode ? (
              <>
                <div className="form-grid" style={{ marginBottom: "20px" }}>
                  {[
                    { key: "nombreCaso", label: "Nombre del Tratamiento", span: 2 },
                    { key: "diagnostico", label: "Diagnóstico", span: 2 },
                    { key: "planTratamiento", label: "Plan de Tratamiento", span: 2 },
                    { key: "examenAuxiliar", label: "Examen Auxiliar" },
                    { key: "costoTotal", label: "Costo Total (S/)", type: "number" },
                    { key: "proformaUrl", label: "Proforma", span: 2 },
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

                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
                  <ImagenEditor imagenesActuales={caso.imagenes || []} onChange={setImagenesEdit} />
                </div>
              </>
            ) : (
              <div>
                <div className="info-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                  <div><strong>Diagnóstico:</strong> <p style={{ margin: "4px 0", color: "var(--text-secondary)" }}>{caso.diagnostico || "-"}</p></div>
                  <div><strong>Plan de Tratamiento:</strong> <p style={{ margin: "4px 0", color: "var(--text-secondary)" }}>{caso.planTratamiento || "-"}</p></div>
                  <div><strong>Examen Auxiliar:</strong> <p style={{ margin: "4px 0", color: "var(--text-secondary)" }}>{caso.examenAuxiliar || "-"}</p></div>
                  <div><strong>Costo Total:</strong> <p style={{ margin: "4px 0", color: "var(--accent)", fontFamily: "DM Mono, monospace", fontWeight: 600 }}>S/ {Number(caso.costoTotal || 0).toFixed(2)}</p></div>
                </div>

                {caso.imagenes?.length > 0 && (
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
                    <ImagenGallery imagenes={caso.imagenes} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECCIÓN DE REGISTROS DE ATENCIÓN EN TABLA DE ANCHO COMPLETO */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 className="section-title" style={{ margin: 0, fontSize: "18px" }}>
              <span className="dot" />
              Registros de Atención ({registros.length})
            </h3>
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancelar" : "+ Nuevo Registro"}
            </button>
          </div>

          {/* Formulario para agregar nuevo registro */}
          {showForm && (
            <div className="card" style={{ padding: "20px", marginBottom: "20px", background: "var(--bg-surface)" }}>
              <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "14px" }}>Nuevo Registro de Atención</div>
              <div className="form-grid" style={{ gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Fecha de Atención *</label>
                  <input className="form-input" type="date" value={regForm.fechaAtencion} onChange={setReg("fechaAtencion")} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Doctor Responsable</label>
                  <input className="form-input" placeholder="Dr. Nombre" value={regForm.doctor} onChange={setReg("doctor")} />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label className="form-label">Evolución *</label>
                  <input className="form-input" placeholder="Descripción de la evolución del tratamiento" value={regForm.evolucion} onChange={setReg("evolucion")} required />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label className="form-label">Procedimiento Realizado</label>
                  <input className="form-input" placeholder="Procedimiento odontológico realizado" value={regForm.procedimiento} onChange={setReg("procedimiento")} />
                </div>
                <div className="form-group">
                  <label className="form-label">Monto Abonado (S/)</label>
                  <input className="form-input" type="number" step="0.01" placeholder="0.00" value={regForm.abono} onChange={setReg("abono")} />
                </div>
                <div className="form-group">
                  <label className="form-label">Observaciones</label>
                  <input className="form-input" placeholder="Notas adicionales" value={regForm.observaciones} onChange={setReg("observaciones")} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="button" className="btn btn-primary btn-sm" onClick={handleCreateRegistro}>Guardar Registro</button>
              </div>
            </div>
          )}

          {/* Tabla de Registros de Atención */}
          <div className="card" style={{ padding: "0", width: "100%", overflow: "hidden" }}>
            {registros.length === 0 ? (
              <div className="empty-state" style={{ padding: "40px 10px" }}>
                <p className="empty-state-text" style={{ fontSize: "14px" }}>
                  No hay registros de atención registrados para este tratamiento.
                </p>
              </div>
            ) : (
              <div style={{ width: "100%", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                  <thead>
                    <tr
                      style={{
                        background: "var(--bg-input)",
                        borderBottom: "1px solid var(--border)",
                        color: "var(--text-muted)",
                        fontFamily: "DM Mono, monospace",
                        fontSize: "11px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      <th style={{ padding: "14px 16px" }}>F. Atención</th>
                      <th style={{ padding: "14px 16px" }}>Doctor</th>
                      <th style={{ padding: "14px 16px" }}>Evolución</th>
                      <th style={{ padding: "14px 16px" }}>Procedimiento</th>
                      <th style={{ padding: "14px 16px" }}>Abono</th>
                      <th style={{ padding: "14px 16px" }}>Observaciones</th>
                      <th style={{ padding: "14px 16px", textAlign: "right" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registros.map((r) => (
                      <tr key={r.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s ease" }} className="table-row-hover">
                        <td style={{ padding: "14px 16px", fontFamily: "DM Mono, monospace", fontWeight: 600, color: "var(--text-primary)" }}>
                          {formatFecha(r.fechaAtencion)}
                        </td>

                        <td style={{ padding: "14px 16px", color: "var(--text-secondary)" }}>
                          {r.doctorResponsable ? `Dr. ${r.doctorResponsable}` : "-"}
                        </td>

                        <td style={{ padding: "14px 16px", color: "var(--text-secondary)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {r.evolucion || "-"}
                        </td>

                        <td style={{ padding: "14px 16px", color: "var(--text-secondary)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {r.procedimientoRealizado || "-"}
                        </td>

                        <td style={{ padding: "14px 16px", fontFamily: "DM Mono, monospace", fontWeight: 600, color: "var(--accent)" }}>
                          {r.montoAbonado > 0 ? `S/ ${Number(r.montoAbonado).toFixed(2)}` : "-"}
                        </td>

                        <td style={{ padding: "14px 16px", color: "var(--text-muted)", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {r.observaciones || "-"}
                        </td>

                        {/* Botones de acción: Ver Detalle y Eliminar */}
                        <td style={{ padding: "14px 16px", textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end", alignItems: "center" }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ padding: "6px 10px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "5px" }}
                              onClick={() => navigate(`/registros/${r.id}`)}
                              title="Ver Detalle del Registro"
                            >
                              <EyeIcon />
                              <span>Detalle</span>
                            </button>

                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              style={{ padding: "6px 10px", fontSize: "12px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                              onClick={() => handleDeleteRegistro(r.id)}
                              title="Eliminar Registro"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CasoDetalle;