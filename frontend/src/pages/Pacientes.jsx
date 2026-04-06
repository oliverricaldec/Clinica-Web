import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PacienteForm from "./PacienteForm";
import Sidebar from "../components/Sidebar";

const API = import.meta.env.VITE_API_URL;

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchPacientes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/pacientes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPacientes(Array.isArray(res.data.data) ? res.data.data : res.data);
    } catch (error) {
      console.error("Error cargando pacientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("¿Eliminar paciente?")) return;
    try {
      await axios.delete(`${API}/api/pacientes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPacientes();
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  useEffect(() => { fetchPacientes(); }, []);

  const filtered = pacientes.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.nombres?.toLowerCase().includes(q) ||
      p.apellidos?.toLowerCase().includes(q) ||
      p.dni?.toLowerCase().includes(q) ||
      p.telefono?.toLowerCase().includes(q)
    );
  });

  const getInitials = (nombres, apellidos) => {
    const n = nombres?.[0] || "";
    const a = apellidos?.[0] || "";
    return (n + a).toUpperCase();
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-content">
        {/* TOPBAR */}
        <div className="topbar">
          <span className="topbar-title">Gestión de Pacientes</span>
          <div className="topbar-right">
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--mono)" }}>
              {filtered.length} paciente{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="page-content">

          {/* STATS */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{pacientes.length}</div>
              <div className="stat-label">Total Pacientes</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{pacientes.filter(p => p.sexo === "M").length}</div>
              <div className="stat-label">Masculino</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{pacientes.filter(p => p.sexo === "F").length}</div>
              <div className="stat-label">Femenino</div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="section-header">
            <h2 className="section-title">
              <span className="dot" />
              Pacientes
            </h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "✕ Cancelar" : "+ Nuevo Paciente"}
            </button>
          </div>

          {/* FORM */}
          {showForm && (
            <div style={{ marginBottom: "24px" }}>
              <PacienteForm
                onSuccess={() => { fetchPacientes(); setShowForm(false); }}
              />
            </div>
          )}

          {/* SEARCH */}
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o DNI..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* LIST */}
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner" />
              <span>Cargando pacientes...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🦷</div>
              <p className="empty-state-text">
                {search ? "No se encontraron coincidencias" : "No hay pacientes registrados aún"}
              </p>
            </div>
          ) : (
            <div className="patients-grid">
              {filtered.map((p, i) => (
                <div
                  key={p.id}
                  className={`patient-card stagger-${Math.min(i + 1, 5)}`}
                  onClick={() => navigate(`/pacientes/${p.id}`)}
                >
                  {/* TOP ROW */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "14px" }}>
                    <div className="patient-avatar">{getInitials(p.nombres, p.apellidos)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="patient-name">{p.nombres} {p.apellidos}</div>
                      <div className="patient-meta">DNI {p.dni}</div>
                    </div>
                    <span className={`badge ${p.sexo === "M" ? "badge-male" : "badge-female"}`}>
                      {p.sexo === "M" ? "♂ Masc" : "♀ Fem"}
                    </span>
                  </div>

                  {/* META */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
                    {p.telefono && (
                      <div style={{ display: "flex", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                        <span style={{ color: "var(--text-muted)" }}>📞</span>
                        {p.telefono}
                      </div>
                    )}
                    {p.email && (
                      <div style={{ display: "flex", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                        <span style={{ color: "var(--text-muted)" }}>✉️</span>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.email}</span>
                      </div>
                    )}
                    {p.fechaRegistro && (
                      <div style={{ display: "flex", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                        <span style={{ color: "var(--text-muted)" }}>📅</span>
                        Registrado: {p.fechaRegistro}
                      </div>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div style={{ display: "flex", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => navigate(`/pacientes/${p.id}`)}
                    >
                      Ver Detalle
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => navigate(`/historia/${p.historiaClinicaId}`)}
                    >
                      🗂 Historia
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={(e) => handleDelete(p.id, e)}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pacientes;
