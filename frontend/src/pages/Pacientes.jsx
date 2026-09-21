import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import PacienteForm from "./PacienteForm";

const API = import.meta.env.VITE_API_URL;

// Componentes de Íconos SVG
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const UserPlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="8" x2="20" y2="14"></line>
    <line x1="23" y1="11" x2="17" y2="11"></line>
  </svg>
);

const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const FileTextIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const UserIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const Pacientes = () => {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem("token");

  const fetchPacientes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/pacientes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
      setPacientes(data);
    } catch (err) {
      console.error("Error al cargar pacientes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleEliminarPaciente = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar al paciente ${nombre}?`)) return;
    try {
      await axios.delete(`${API}/api/pacientes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPacientes();
    } catch (err) {
      console.error("Error al eliminar paciente:", err);
      alert("No se pudo eliminar el paciente.");
    }
  };

  const pacientesFiltrados = pacientes.filter((p) => {
    const termino = busqueda.toLowerCase();
    const nombreCompleto = `${p.nombres} ${p.apellidos}`.toLowerCase();
    return (
      nombreCompleto.includes(termino) ||
      p.dni?.includes(termino) ||
      p.telefono?.includes(termino) ||
      p.email?.toLowerCase().includes(termino)
    );
  });

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return "-";
    const [y, m, d] = fechaStr.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="app-shell" style={{ maxWidth: "100%", padding: "0 20px" }}>
      <Sidebar />
      <div className="main-content" style={{ width: "100%", maxWidth: "100%" }}>
        <div className="topbar">
          <span className="topbar-title">Gestión de Pacientes</span>
          <div className="topbar-right">
            <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "DM Mono, monospace" }}>
              Total: {pacientes.length} pacientes
            </span>
          </div>
        </div>

        <div className="page-content" style={{ maxWidth: "100%", padding: "20px 0" }}>
          {/* Encabezado con buscador y toggle para nuevo paciente */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <h2 className="section-title" style={{ margin: 0, fontSize: "22px" }}>
              <span className="dot" />
              Directorio de Pacientes
            </h2>

            <div style={{ display: "flex", gap: "12px", alignItems: "center", flex: 1, maxWidth: "520px" }}>
              <div style={{ position: "relative", width: "100%" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Buscar por DNI, Nombre, Teléfono o Email..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  style={{ fontSize: "13px", height: "40px", paddingLeft: "36px" }}
                />
              </div>

              <button
                className="btn btn-primary"
                style={{ padding: "0 18px", height: "40px", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "8px" }}
                onClick={() => setShowForm(!showForm)}
              >
                <UserPlusIcon />
                <span>{showForm ? "Cancelar" : "Nuevo Paciente"}</span>
              </button>
            </div>
          </div>

          {/* Formulario de creación desplegable */}
          {showForm && (
            <div style={{ marginBottom: "24px" }}>
              <PacienteForm
                onSuccess={() => {
                  fetchPacientes();
                  setShowForm(false);
                }}
              />
            </div>
          )}

          {/* Tabla de Pacientes */}
          <div className="card" style={{ padding: "0", width: "100%", overflow: "hidden" }}>
            {loading ? (
              <div className="loading-spinner" style={{ padding: "40px" }}>
                <div className="spinner" />
                <span>Cargando pacientes...</span>
              </div>
            ) : pacientesFiltrados.length === 0 ? (
              <div className="empty-state" style={{ padding: "40px 10px" }}>
                <div className="empty-state-icon" style={{ color: "var(--text-muted)", display: "flex", justifyContent: "center" }}>
                  <UserIcon />
                </div>
                <p className="empty-state-text" style={{ fontSize: "14px", marginTop: "10px" }}>
                  No se encontraron pacientes registrados.
                </p>
              </div>
            ) : (
              <div style={{ width: "100%", overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                    fontSize: "13px",
                  }}
                >
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
                      <th style={{ padding: "14px 16px" }}>DNI</th>
                      <th style={{ padding: "14px 16px" }}>Paciente</th>
                      <th style={{ padding: "14px 16px" }}>Teléfono</th>
                      <th style={{ padding: "14px 16px" }}>Email</th>
                      <th style={{ padding: "14px 16px" }}>F. Nacimiento</th>
                      <th style={{ padding: "14px 16px" }}>F. Registro</th>
                      <th style={{ padding: "14px 16px", textAlign: "right" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pacientesFiltrados.map((p) => (
                      <tr
                        key={p.id}
                        style={{
                          borderBottom: "1px solid var(--border)",
                          transition: "background 0.15s ease",
                        }}
                        className="table-row-hover"
                      >
                        <td style={{ padding: "14px 16px", fontFamily: "DM Mono, monospace", fontWeight: 600, color: "var(--accent)" }}>
                          {p.dni}
                        </td>
                        <td style={{ padding: "14px 16px", fontWeight: 600, color: "var(--text-primary)" }}>
                          {p.nombres} {p.apellidos}
                        </td>
                        <td style={{ padding: "14px 16px", color: "var(--text-secondary)" }}>
                          {p.telefono || "-"}
                        </td>
                        <td style={{ padding: "14px 16px", color: "var(--text-secondary)" }}>
                          {p.email || "-"}
                        </td>
                        <td style={{ padding: "14px 16px", color: "var(--text-muted)", fontFamily: "DM Mono, monospace" }}>
                          {formatFecha(p.fechaNacimiento)}
                        </td>
                        <td style={{ padding: "14px 16px", color: "var(--text-muted)", fontFamily: "DM Mono, monospace" }}>
                          {formatFecha(p.fechaRegistro)}
                        </td>
                        <td style={{ padding: "14px 16px", textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end", alignItems: "center" }}>
                            {/* Botón Ver Detalles */}
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ padding: "6px 10px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "5px" }}
                              onClick={() => navigate(`/pacientes/${p.id}`)}
                              title="Ver Detalles del Paciente"
                            >
                              <EyeIcon />
                              <span>Detalles</span>
                            </button>

                            {/* Botón Ver Historia Clínica */}
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ padding: "6px 10px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "5px" }}
                              onClick={() => navigate(`/historias-clinicas/${p.historiaClinicaId || p.id}`)}
                              title="Ver Historia Clínica"
                            >
                              <FileTextIcon />
                              <span>Historia</span>
                            </button>

                            {/* Botón Eliminar Paciente */}
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              style={{ padding: "6px 10px", fontSize: "12px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                              onClick={() => handleEliminarPaciente(p.id, `${p.nombres} ${p.apellidos}`)}
                              title="Eliminar Paciente"
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

export default Pacientes;