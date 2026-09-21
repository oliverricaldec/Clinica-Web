import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CasoForm from "./CasoForm";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// Iconos SVG profesionales
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

const HistoriaClinica = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [casos, setCasos] = useState(null);
  const [page] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [abonosPorCaso, setAbonosPorCaso] = useState({});

  const fetchCasos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API}/api/casos/historiasClinicas/${id}?page=${page}&size=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCasos(res.data);
      if (res.data?.data) {
        fetchAbonos(res.data.data);
      }
    } catch (error) {
      console.error("Error al cargar casos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAbonos = async (casosList) => {
    try {
      const token = localStorage.getItem("token");
      const resultados = await Promise.all(
        casosList.map(async (caso) => {
          try {
            const res = await axios.get(`${API}/api/registros/caso/${caso.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const registros = res.data.data || [];
            const totalAbonado = registros.reduce((sum, r) => sum + (r.montoAbonado || 0), 0);
            return { casoId: caso.id, totalAbonado };
          } catch {
            return { casoId: caso.id, totalAbonado: 0 };
          }
        })
      );
      const mapa = {};
      resultados.forEach((r) => {
        mapa[r.casoId] = r.totalAbonado;
      });
      setAbonosPorCaso(mapa);
    } catch (error) {
      console.error("Error calculando abonos:", error);
    }
  };

  const calcularProgreso = (abonado, total) => {
    if (!total || total === 0) return 0;
    return Math.min((abonado / total) * 100, 100);
  };

  const handleDelete = async (casoId) => {
    if (!window.confirm("¿Estás seguro de eliminar este tratamiento dental?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/casos/${casoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCasos();
    } catch (error) {
      console.error("Error eliminando caso:", error);
    }
  };

  useEffect(() => {
    if (id) fetchCasos();
  }, [id, page]);

  const estadoBadge = (estado) => {
    const isActivo = estado === "ACTIVO";
    return (
      <span
        style={{
          fontSize: "10px",
          fontFamily: "DM Mono, monospace",
          padding: "3px 10px",
          borderRadius: "12px",
          background: isActivo ? "rgba(0,200,150,0.12)" : "rgba(59,130,246,0.12)",
          color: isActivo ? "#00c896" : "#60a5fa",
          border: isActivo ? "1px solid rgba(0,200,150,0.25)" : "1px solid rgba(59,130,246,0.25)",
          textTransform: "uppercase",
        }}
      >
        {estado}
      </span>
    );
  };

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
          <span className="topbar-title">Historia Clínica</span>
          {casos && (
            <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "DM Mono, monospace" }}>
              {casos.totalElements || (casos.data?.length ?? 0)} tratamiento(s)
            </span>
          )}
        </div>

        <div className="page-content" style={{ maxWidth: "100%", padding: "20px 0" }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(-1)}
            style={{ marginBottom: "16px", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <ArrowLeftIcon />
            <span>Volver al Paciente</span>
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 className="section-title" style={{ margin: 0, fontSize: "22px" }}>
              <span className="dot" />
              Tratamientos Dentales
            </h2>
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancelar" : "+ Nuevo Tratamiento Dental"}
            </button>
          </div>

          {showForm && (
            <div style={{ marginBottom: "24px" }}>
              <CasoForm
                hcId={id}
                onSuccess={() => {
                  fetchCasos();
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          <div className="card" style={{ padding: "0", width: "100%", overflow: "hidden" }}>
            {loading ? (
              <div className="loading-spinner" style={{ padding: "40px" }}>
                <div className="spinner" />
                <span>Cargando tratamientos dentales...</span>
              </div>
            ) : !casos || !Array.isArray(casos.data) || casos.data.length === 0 ? (
              <div className="empty-state" style={{ padding: "40px 10px" }}>
                <p className="empty-state-text" style={{ fontSize: "14px" }}>
                  No hay tratamientos registrados para esta historia clínica.
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
                      <th style={{ padding: "14px 16px" }}>Nombre del Tratamiento</th>
                      <th style={{ padding: "14px 16px" }}>Diagnóstico</th>
                      <th style={{ padding: "14px 16px" }}>Estado</th>
                      <th style={{ padding: "14px 16px", minWidth: "200px" }}>Abonado / Costo Total</th>
                      <th style={{ padding: "14px 16px" }}>F. Inicio</th>
                      <th style={{ padding: "14px 16px", textAlign: "right" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {casos.data.map((caso) => {
                      const abonado = abonosPorCaso[caso.id] || 0;
                      const total = caso.costoTotal || 0;
                      const restante = total - abonado;
                      const progreso = calcularProgreso(abonado, total);

                      return (
                        <tr key={caso.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s ease" }} className="table-row-hover">
                          <td style={{ padding: "14px 16px", fontFamily: "DM Mono, monospace", fontWeight: 600, color: "var(--accent)" }}>
                            #{caso.id}
                          </td>

                          <td style={{ padding: "14px 16px", fontWeight: 600, color: "var(--text-primary)" }}>
                            {caso.nombreCaso || `Tratamiento #${caso.id}`}
                          </td>

                          <td style={{ padding: "14px 16px", color: "var(--text-secondary)" }}>
                            {caso.diagnostico}
                          </td>

                          <td style={{ padding: "14px 16px" }}>
                            {estadoBadge(caso.estado)}
                          </td>

                          {/* Barrita de Progreso de Abonos */}
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontFamily: "DM Mono, monospace", marginBottom: "4px" }}>
                              <span style={{ color: "var(--accent)", fontWeight: 600 }}>S/ {abonado.toFixed(2)}</span>
                              <span style={{ color: "var(--text-muted)" }}>
                                S/ {total.toFixed(2)} ({progreso.toFixed(0)}%)
                              </span>
                            </div>
                            <div style={{ height: "6px", width: "100%", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                              <div
                                style={{
                                  height: "100%",
                                  width: `${progreso}%`,
                                  background: progreso === 100 ? "#00c896" : "var(--accent)",
                                  borderRadius: "3px",
                                  transition: "width 0.3s ease",
                                }}
                              />
                            </div>
                            <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px", textAlign: "right" }}>
                              {progreso === 100 ? "Pagado" : `Falta: S/ ${restante.toFixed(2)}`}
                            </div>
                          </td>

                          <td style={{ padding: "14px 16px", color: "var(--text-muted)", fontFamily: "DM Mono, monospace" }}>
                            {formatFecha(caso.fechaInicio)}
                          </td>

                          {/* Acciones conectadas a CasoDetalle.jsx */}
                          <td style={{ padding: "14px 16px", textAlign: "right" }}>
                            <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end", alignItems: "center" }}>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ padding: "6px 10px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "5px" }}
                                onClick={() => navigate(`/casos/${caso.id}`)}
                                title="Ver Detalles del Tratamiento"
                              >
                                <EyeIcon />
                                <span>Detalles</span>
                              </button>

                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                style={{ padding: "6px 10px", fontSize: "12px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                onClick={() => handleDelete(caso.id)}
                                title="Eliminar Tratamiento"
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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

export default HistoriaClinica;