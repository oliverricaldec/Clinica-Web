import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const API = import.meta.env.VITE_API_URL;

// Iconos SVG
const FileTextIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const ToothIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8 2 6 5 6 8c0 4 2 6 2 10 0 2 1 4 2 4s2-2 2-4c0-2 0-2 2-2s2 0 2 2c0 2 1 4 2 4s2-2 2-4c0-4 2-6 2-10 0-3-2-6-6-6z"></path>
  </svg>
);

const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const FIELD_LABELS = {
  dni: "DNI",
  nombres: "Nombres",
  apellidos: "Apellidos",
  fechaNacimiento: "Fecha de Nacimiento",
  sexo: "Sexo",
  telefono: "Teléfono",
  direccion: "Dirección",
  email: "Email",
  antecedentesMedicosUrl: "Antecedentes Médicos",
  antecedentesOdontologicosUrl: "Antecedentes Odontológicos",
  fechaRegistro: "Fecha de Registro",
};

const SEX_MAP = { M: "Masculino", F: "Femenino" };

const PacienteDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const token = localStorage.getItem("token");

  const fetchPaciente = async () => {
    try {
      const res = await axios.get(`${API}/api/pacientes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaciente(res.data);
      setForm(res.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API}/api/pacientes/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditMode(false);
      fetchPaciente();
    } catch (error) {
      console.error("Error actualizando:", error.response?.data || error);
    }
  };

  useEffect(() => { fetchPaciente(); }, [id]);

  if (loading) return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <div className="loading-spinner"><div className="spinner" /><span>Cargando paciente...</span></div>
      </div>
    </div>
  );

  if (!paciente) return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <div className="page-content"><p style={{ color: "var(--text-muted)" }}>Paciente no encontrado</p></div>
      </div>
    </div>
  );

  const initials = ((paciente.nombres?.[0] || "") + (paciente.apellidos?.[0] || "")).toUpperCase();

  const renderField = (key) => {
    if (key === "id") return null;
    const label = FIELD_LABELS[key] || key;
    const value = form[key];

    if (editMode) {
      if (key === "sexo") {
        return (
          <div className="form-group" key={key}>
            <label className="form-label">{label}</label>
            <select
              className="form-input"
              value={value || ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            >
              <option value="">Seleccionar</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
        );
      }
      if (key === "fechaNacimiento" || key === "fechaRegistro") {
        return (
          <div className="form-group" key={key}>
            <label className="form-label">{label}</label>
            <input
              className="form-input"
              type="date"
              value={value || ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        );
      }
      return (
        <div className="form-group" key={key}>
          <label className="form-label">{label}</label>
          <input
            className="form-input"
            value={value || ""}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        </div>
      );
    }

    // View mode
    const displayValue = key === "sexo"
      ? (SEX_MAP[value] || value || "—")
      : (value || "—");

    return (
      <div className="info-row" key={key}>
        <span className="info-label">{label}</span>
        <span className="info-value">
          {key === "antecedentesMedicosUrl" || key === "antecedentesOdontologicosUrl"
            ? value
            : displayValue
          }
        </span>
      </div>
    );
  };

  const fieldKeys = Object.keys(FIELD_LABELS);

  return (
    <div className="app-shell" style={{ maxWidth: "100%", padding: "0 20px" }}>
      <Sidebar />
      <div className="main-content" style={{ width: "100%", maxWidth: "100%" }}>
        <div className="topbar">
          <span className="topbar-title">Detalle del Paciente</span>
        </div>

        <div className="page-content" style={{ maxWidth: "100%", padding: "20px 0" }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: "16px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <ArrowLeftIcon />
            <span>Volver</span>
          </button>

          {/* HEADER */}
          <div className="detail-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div className="detail-avatar">{initials}</div>
              <div>
                <div className="detail-name" style={{ fontSize: "20px", fontWeight: 700 }}>{paciente.nombres} {paciente.apellidos}</div>
                <div className="detail-id" style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "DM Mono, monospace", marginTop: "2px" }}>
                  ID #{paciente.id} · DNI {paciente.dni}
                </div>
                <div style={{ marginTop: "8px" }}>
                  <span className={`badge ${paciente.sexo === "M" ? "badge-male" : "badge-female"}`} style={{ fontSize: "11px" }}>
                    {paciente.sexo === "M" ? "Masculino" : "Femenino"}
                  </span>
                </div>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN: Historia Clínica, Odontogramas y Editar */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              {!editMode ? (
                <>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ padding: "8px 14px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    onClick={() => navigate(`/historias-clinicas/${paciente.historiaClinicaId || paciente.id}`)}
                    title="Ver Historia Clínica"
                  >
                    <FileTextIcon />
                    <span>Historia Clínica</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ padding: "8px 14px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    onClick={() => navigate(`/pacientes/${paciente.id}/odontogramas`)}
                    title="Ver Historial de Odontogramas"
                  >
                    <ToothIcon />
                    <span>Odontogramas</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ padding: "8px 14px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    onClick={() => setEditMode(true)}
                  >
                    <EditIcon />
                    <span>Editar</span>
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-primary btn-sm" onClick={handleUpdate}>Guardar</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setEditMode(false); setForm(paciente); }}>Cancelar</button>
                </>
              )}
            </div>
          </div>

          {/* DATA */}
          <div className="card" style={{ padding: "24px" }}>
            <div className="card-body">
              {editMode ? (
                <div className="form-grid">
                  {fieldKeys.map(renderField)}
                </div>
              ) : (
                <div>
                  {fieldKeys.map(renderField)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PacienteDetalle;