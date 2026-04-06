import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const API = import.meta.env.VITE_API_URL;

// ─── Cloudinary upload ────────────────────────────────
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

// ─── Constantes — alineadas con enum TipoImagen Java ──
const TIPOS = ["ODONTOGRAMA", "EXAMEN_AUXILIAR", "PLAN_TRATAMIENTO", "PROFORMA"];

const TIPO_LABEL = {
  ODONTOGRAMA:      "Odontograma",
  EXAMEN_AUXILIAR:  "Examen Auxiliar",
  PLAN_TRATAMIENTO: "Plan de Tratamiento",
  PROFORMA: "Proforma"
};

const TIPO_COLOR = {
  ODONTOGRAMA:      { bg: "rgba(4,151,255,0.10)",  color: "#0497ff", border: "rgba(4,151,255,0.25)" },
  EXAMEN_AUXILIAR:  { bg: "rgba(252,91,167,0.10)", color: "#fc5ba7", border: "rgba(252,91,167,0.25)" },
  PLAN_TRATAMIENTO: { bg: "rgba(0,200,150,0.10)",  color: "#00c896", border: "rgba(0,200,150,0.25)" },
  PROFORMA:         { bg: "rgba(0,200,150,0.10)",  color: "#3500c8", border: "rgba(160, 0, 200, 0.25)" }
};

// ─── Galería solo lectura: miniatura + link ───────────
const ImagenGallery = ({ imagenes }) => {
  const [preview, setPreview] = useState(null);
  if (!imagenes || imagenes.length === 0) return null;

  const porTipo = TIPOS.reduce((acc, tipo) => {
    acc[tipo] = imagenes.filter((img) => img.tipo === tipo);
    return acc;
  }, {});

  return (
    <>
      {/* Modal fullscreen */}
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
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: "90vw", maxHeight: "85vh",
                borderRadius: "12px",
                boxShadow: "0 0 80px rgba(0,0,0,0.8)",
              }}
            />
            {/* Botón abrir en Cloudinary */}
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
                fontFamily: "Sora, sans-serif",
              }}
            >
              🔗 Abrir original
            </a>
            {/* Cerrar */}
            <button
              onClick={() => setPreview(null)}
              style={{
                position: "absolute", top: "-12px", right: "-12px",
                width: "28px", height: "28px", borderRadius: "50%",
                background: "rgba(255,77,109,0.9)", color: "#fff",
                border: "none", cursor: "pointer", fontSize: "13px",
                fontWeight: 700, display: "flex", alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {TIPOS.map((tipo) => {
        const imgs = porTipo[tipo];
        if (!imgs || imgs.length === 0) return null;
        const c = TIPO_COLOR[tipo];

        return (
          <div key={tipo} style={{ marginBottom: "24px" }}>
            {/* Badge tipo */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <span style={{
                fontSize: "11px", fontFamily: "DM Mono, monospace",
                textTransform: "uppercase", letterSpacing: "0.5px",
                padding: "3px 10px", borderRadius: "20px",
                background: c.bg, color: c.color, border: `1px solid ${c.border}`,
              }}>
                {TIPO_LABEL[tipo]}
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "DM Mono, monospace" }}>
                {imgs.length} imagen{imgs.length !== 1 ? "es" : ""}
              </span>
            </div>

            {/* Grid de imágenes */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {imgs.map((img, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex", flexDirection: "column", gap: "6px",
                    width: "110px",
                  }}
                >
                  {/* Miniatura clickeable → modal */}
                  <div
                    onClick={() => setPreview(img.url)}
                    style={{
                      width: "110px", height: "110px", borderRadius: "10px",
                      overflow: "hidden", cursor: "zoom-in",
                      border: `1px solid ${c.border}`,
                      transition: "transform 0.18s ease, box-shadow 0.18s ease",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = `0 4px 16px ${c.border}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <img
                      src={img.url}
                      alt={`${TIPO_LABEL[tipo]} ${i + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  {/* Link debajo */}
                  <a
                    href={img.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: "11px", color: c.color,
                      textDecoration: "none", fontFamily: "DM Mono, monospace",
                      textAlign: "center", lineHeight: 1.3,
                      overflow: "hidden", textOverflow: "ellipsis",
                      whiteSpace: "nowrap", display: "block",
                      padding: "2px 4px", borderRadius: "4px",
                      background: c.bg, border: `1px solid ${c.border}`,
                      transition: "opacity 0.15s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.75"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                    title={img.url}
                  >
                    🔗 Ver imagen {i + 1}
                  </a>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};

// ─── Editor de imágenes (modo editar) ────────────────
const ImagenEditor = ({ imagenesActuales, onChange }) => {
  const [imagenesLocales, setImagenesLocales] = useState(
    imagenesActuales?.map((img) => ({ url: img.url, tipo: img.tipo })) || []
  );
  const [uploading, setUploading] = useState({});
  const [preview, setPreview] = useState(null);

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
          <img src={preview} alt="Preview"
            style={{ maxWidth: "90vw", maxHeight: "85vh", borderRadius: "12px" }}
          />
        </div>
      )}

      {TIPOS.map((tipo) => {
        const imgs = porTipo[tipo];
        const c = TIPO_COLOR[tipo];
        const isUploading = uploading[tipo];

        return (
          <div key={tipo} style={{ marginBottom: "24px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{
                  fontSize: "11px", fontFamily: "DM Mono, monospace",
                  textTransform: "uppercase", letterSpacing: "0.5px",
                  padding: "3px 10px", borderRadius: "20px",
                  background: c.bg, color: c.color, border: `1px solid ${c.border}`,
                }}>
                  {TIPO_LABEL[tipo]}
                </span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "DM Mono, monospace" }}>
                  {imgs.length} imagen{imgs.length !== 1 ? "es" : ""}
                </span>
              </div>

              <label style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "5px 12px", borderRadius: "6px",
                cursor: isUploading ? "not-allowed" : "pointer",
                background: c.bg, color: c.color, border: `1px solid ${c.border}`,
                fontSize: "12px", fontWeight: 600, fontFamily: "Sora, sans-serif",
                opacity: isUploading ? 0.6 : 1, transition: "all 0.18s ease",
              }}>
                {isUploading ? "⏳ Subiendo..." : "+ Agregar"}
                <input
                  type="file" multiple accept="image/*"
                  style={{ display: "none" }}
                  disabled={isUploading}
                  onChange={(e) => handleAgregar(e, tipo)}
                />
              </label>
            </div>

            {/* Grid */}
            {imgs.length === 0 ? (
              <div style={{
                border: `1px dashed ${c.border}`, borderRadius: "10px",
                padding: "18px", textAlign: "center",
                color: "var(--text-muted)", fontSize: "13px",
              }}>
                Sin imágenes · presiona "+ Agregar" para subir
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {imgs.map((img, i) => (
                  <div key={img.url + i} style={{ display: "flex", flexDirection: "column", gap: "6px", width: "110px" }}>
                    {/* Miniatura */}
                    <div style={{ position: "relative", width: "110px", height: "110px" }}>
                      <img
                        src={img.url}
                        alt=""
                        onClick={() => setPreview(img.url)}
                        style={{
                          width: "100%", height: "100%", objectFit: "cover",
                          borderRadius: "10px", cursor: "zoom-in",
                          border: `1px solid ${c.border}`,
                        }}
                      />
                      {/* X eliminar */}
                      <button
                        onClick={() => handleEliminar(img.url)}
                        title="Eliminar imagen"
                        style={{
                          position: "absolute", top: "4px", right: "4px",
                          width: "22px", height: "22px", borderRadius: "50%",
                          background: "rgba(255,77,109,0.92)", color: "white",
                          border: "none", cursor: "pointer",
                          fontSize: "11px", fontWeight: 700,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                          transition: "transform 0.15s ease",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.2)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Link debajo */}
                    <a
                      href={img.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: "11px", color: c.color,
                        textDecoration: "none", fontFamily: "DM Mono, monospace",
                        textAlign: "center",
                        overflow: "hidden", textOverflow: "ellipsis",
                        whiteSpace: "nowrap", display: "block",
                        padding: "2px 4px", borderRadius: "4px",
                        background: c.bg, border: `1px solid ${c.border}`,
                      }}
                      title={img.url}
                    >
                      🔗 Ver imagen {i + 1}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

// ─── Componente principal ─────────────────────────────
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
    if (!fecha) return "Sin fecha";
    const [y, m, d] = fecha.split("-");
    return `${d}/${m}/${y}`;
  };

 const fetchCaso = async () => {
  try {
    setLoading(true);
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/casos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = res.data;

    // 🔍 DEBUG REAL
    console.log("CASO COMPLETO:", data);
    console.log("IMAGENES:", data.imagenes);

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
    if (!window.confirm("¿Eliminar este registro?")) return;
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
        <div className="loading-spinner"><div className="spinner" /><span>Cargando caso...</span></div>
      </div>
    </div>
  );

  if (!caso) return (
    <div className="app-shell"><Sidebar /><div className="main-content"><p>No se encontró el caso</p></div></div>
  );

  const estadoBadge = (estado) => {
    if (estado === "ACTIVO") return <span className="badge badge-active">● Activo</span>;
    return (
      <span className="badge" style={{ background: "rgba(4,151,255,0.1)", color: "#60a5fa", border: "1px solid rgba(4,151,255,0.2)" }}>
        ✓ Finalizado
      </span>
    );
  };

  const setReg = (field) => (e) => setRegForm((prev) => ({ ...prev, [field]: e.target.value }));
  const setF   = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <span className="topbar-title">Caso Clínico</span>
        </div>

        <div className="page-content">
          <button className="back-btn" onClick={() => navigate(-1)}>← Volver a Historia</button>

          {/* ── HEADER ── */}
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
                  <button className="btn btn-ghost btn-sm" onClick={handleCancelar}>Cancelar</button>
                </>
              )}
            </div>
          </div>

          {/* ── DATOS ── */}
          <div className="card" style={{ marginBottom: "28px" }}>
            <div className="card-body">
              {editMode ? (
                <>
                  <div className="form-grid" style={{ marginBottom: "28px" }}>
                    {[
                      { key: "nombreCaso",      label: "Nombre del Caso",     span: 2 },
                      { key: "diagnostico",     label: "Diagnóstico",         span: 2 },
                      { key: "planTratamiento", label: "Plan de Tratamiento", span: 2 },
                      { key: "examenAuxiliar",  label: "Examen Auxiliar" },
                      { key: "costoTotal",      label: "Costo Total",         type: "number" },
                      { key: "proformaUrl",     label: "Proforma",        span: 2 },
                      { key: "fechaInicio",     label: "Fecha Inicio",        type: "date" },
                      { key: "fechaFin",        label: "Fecha Fin",           type: "date" },
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

                  {/* Editor imágenes */}
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "24px" }}>
                    <div style={{
                      fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase",
                      letterSpacing: "0.5px", fontFamily: "DM Mono, monospace", marginBottom: "20px",
                      display: "flex", alignItems: "center", gap: "8px",
                    }}>
                      <span style={{
                        width: "3px", height: "14px", display: "inline-block", borderRadius: "2px",
                        background: "linear-gradient(180deg, var(--accent), var(--accent-secondary))",
                      }} />
                      Imágenes del Caso
                    </div>
                    <ImagenEditor imagenesActuales={caso.imagenes || []} onChange={setImagenesEdit} />
                  </div>
                </>
              ) : (
                <>
                  {/* Vista datos */}
                  <div style={{ marginBottom: caso.imagenes?.length > 0 ? "24px" : 0 }}>
                    {[
                      { label: "Diagnóstico",         value: caso.diagnostico },
                      { label: "Plan de Tratamiento", value: caso.planTratamiento },
                      { label: "Examen Auxiliar",     value: caso.examenAuxiliar },
                      { label: "Proforma",            value: caso.proformaUrl},
                      { label: "Fecha Inicio",        value: formatFecha(caso.fechaInicio) },
                      { label: "Fecha Fin",           value: caso.fechaFin ? formatFecha(caso.fechaFin) : "Sin fecha" },
                      { label: "Costo Total",         value: caso.costoTotal ? `S/ ${Number(caso.costoTotal).toLocaleString("es-PE", { minimumFractionDigits: 2 })}` : "—" },
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

                  {/* Galería solo lectura */}
                  {caso.imagenes?.length > 0 && (
                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
                      <div style={{
                        fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase",
                        letterSpacing: "0.5px", fontFamily: "DM Mono, monospace", marginBottom: "16px",
                        display: "flex", alignItems: "center", gap: "8px",
                      }}>
                        <span style={{
                          width: "3px", height: "14px", display: "inline-block", borderRadius: "2px",
                          background: "linear-gradient(180deg, var(--accent), var(--accent-secondary))",
                        }} />
                        Imágenes del Caso
                      </div>
                      <ImagenGallery imagenes={caso.imagenes} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── REGISTROS ── */}
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
