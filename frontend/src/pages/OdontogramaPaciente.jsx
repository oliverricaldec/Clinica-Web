import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const API = import.meta.env.VITE_API_URL;

// Iconos SVG
const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const OdontogramaPaciente = () => {
  const { pacienteId } = useParams();
  const navigate = useNavigate();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paciente, setPaciente] = useState(null);
  const token = localStorage.getItem("token");

  const fetchHistorial = async () => {
    try {
      setLoading(true);
      const [resPac, resOdonto] = await Promise.all([
        axios.get(`${API}/api/pacientes/${pacienteId}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/api/odontogramas/paciente/${pacienteId}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setPaciente(resPac.data);
      setHistorial(Array.isArray(resOdonto.data) ? resOdonto.data : []);
    } catch (err) {
      console.error("Error al cargar odontogramas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pacienteId) fetchHistorial();
  }, [pacienteId]);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este odontograma del historial?")) return;
    try {
      await axios.delete(`${API}/api/odontogramas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchHistorial();
    } catch (err) {
      console.error("Error eliminando odontograma:", err);
    }
  };

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return "-";
    const [fecha, hora] = fechaStr.split("T");
    const [y, m, d] = fecha.split("-");
    return `${d}/${m}/${y} ${hora ? hora.substring(0, 5) : ""}`;
  };

  return (
    <div className="app-shell" style={{ maxWidth: "100%", padding: "0 20px" }}>
      <Sidebar />
      <div className="main-content" style={{ width: "100%", maxWidth: "100%" }}>
        <div className="topbar">
          <span className="topbar-title">Odontogramas del Paciente</span>
        </div>

        <div className="page-content" style={{ maxWidth: "100%", padding: "20px 0" }}>
          
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: "16px" }}>
            ← Volver al Paciente
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h2 className="section-title" style={{ margin: 0, fontSize: "22px" }}>
                <span className="dot" />
                Historial de Odontogramas
              </h2>
              {paciente && (
                <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                  Paciente: <strong>{paciente.nombres} {paciente.apellidos}</strong> (DNI: {paciente.dni})
                </div>
              )}
            </div>

            <button
              className="btn btn-primary"
              onClick={() => navigate(`/pacientes/${pacienteId}/odontogramas/nuevo`)}
            >
              + Nuevo Odontograma
            </button>
          </div>

          <div className="card" style={{ padding: "0", width: "100%", overflow: "hidden" }}>
            {loading ? (
              <div className="loading-spinner" style={{ padding: "40px" }}>
                <div className="spinner" />
                <span>Cargando historial de odontogramas...</span>
              </div>
            ) : historial.length === 0 ? (
              <div className="empty-state" style={{ padding: "40px 10px" }}>
                <p className="empty-state-text" style={{ fontSize: "14px" }}>
                  No hay odontogramas registrados para este paciente.
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
                      <th style={{ padding: "14px 16px" }}>ID</th>
                      <th style={{ padding: "14px 16px" }}>Fecha de Registro</th>
                      <th style={{ padding: "14px 16px" }}>Doctor Responsable</th>
                      <th style={{ padding: "14px 16px" }}>Observaciones</th>
                      <th style={{ padding: "14px 16px", textAlign: "right" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((o) => (
                      <tr key={o.id} style={{ borderBottom: "1px solid var(--border)" }} className="table-row-hover">
                        <td style={{ padding: "14px 16px", fontFamily: "DM Mono, monospace", fontWeight: 600, color: "var(--accent)" }}>
                          #{o.id}
                        </td>
                        <td style={{ padding: "14px 16px", fontFamily: "DM Mono, monospace", fontWeight: 600, color: "var(--text-primary)" }}>
                          {formatFecha(o.fechaCreacion)}
                        </td>
                        <td style={{ padding: "14px 16px", color: "var(--text-secondary)" }}>
                          {o.doctorResponsable ? `Dr. ${o.doctorResponsable}` : "-"}
                        </td>
                        <td style={{ padding: "14px 16px", color: "var(--text-muted)", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {o.observaciones || "-"}
                        </td>
                        <td style={{ padding: "14px 16px", textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end", alignItems: "center" }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ padding: "6px 10px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "5px" }}
                              onClick={() => navigate(`/odontogramas/${o.id}`)}
                              title="Ver Odontograma"
                            >
                              <EyeIcon />
                              <span>Ver</span>
                            </button>

                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ padding: "6px 10px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "5px" }}
                              onClick={() => navigate(`/odontogramas/${o.id}/editar`)}
                              title="Editar Odontograma"
                            >
                              <EditIcon />
                              <span>Editar</span>
                            </button>

                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              style={{ padding: "6px 10px", fontSize: "12px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                              onClick={() => handleEliminar(o.id)}
                              title="Eliminar Odontograma"
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

export default OdontogramaPaciente;