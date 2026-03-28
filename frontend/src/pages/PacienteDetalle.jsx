import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const FIELD_LABELS = {
  dni: "DNI",
  nombres: "Nombres",
  apellidos: "Apellidos",
  fechaNacimiento: "Fecha de Nacimiento",
  sexo: "Sexo",
  telefono: "Teléfono",
  direccion: "Dirección",
  email: "Email",
  antecedentesMedicosUrl: "Antecedentes Médicos (URL)",
  antecedentesOdontologicosUrl: "Antecedentes Odontológicos (URL)",
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
      const res = await axios.get(`http://localhost:8080/api/pacientes/${id}`, {
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
      await axios.put(`http://localhost:8080/api/pacientes/${id}`, form, {
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
              ? <a href={value} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>🔗 Ver documento</a>
              : "—"
            : displayValue
          }
        </span>
      </div>
    );
  };

  const fieldKeys = Object.keys(FIELD_LABELS);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <span className="topbar-title">Detalle del Paciente</span>
        </div>

        <div className="page-content">
          <button className="back-btn" onClick={() => navigate(-1)}>← Volver</button>

          {/* HEADER */}
          <div className="detail-header">
            <div className="detail-avatar">{initials}</div>
            <div style={{ flex: 1 }}>
              <div className="detail-name">{paciente.nombres} {paciente.apellidos}</div>
              <div className="detail-id">ID #{paciente.id} · DNI {paciente.dni}</div>
              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <span className={`badge ${paciente.sexo === "M" ? "badge-male" : "badge-female"}`}>
                  {paciente.sexo === "M" ? "♂ Masculino" : "♀ Femenino"}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              {/* boton a historia clinica */}
              {!editMode ? (
                <button className="btn btn-ghost btn-sm" onClick={() => setEditMode(true)}>
                  ✏ Editar
                </button>
              ) : (
                <>
                  <button className="btn btn-primary btn-sm" onClick={handleUpdate}>✓ Guardar</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setEditMode(false); setForm(paciente); }}>Cancelar</button>
                </>
              )}
            </div>
          </div>

          {/* DATA */}
          <div className="card">
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
