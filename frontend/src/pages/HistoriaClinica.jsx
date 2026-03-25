import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CasoForm from "./CasoForm";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const HistoriaClinica = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [casos, setCasos] = useState(null);
  const [page, setPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const fetchCasos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8080/api/casos/historiasClinicas/${id}?page=${page}&size=5`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCasos(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (casoId) => {
    if (!window.confirm("¿Eliminar este caso?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/casos/${casoId}`, {
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
    if (estado === "ACTIVO") return <span className="badge badge-active">● Activo</span>;
    if (estado === "FINALIZADO") return <span className="badge" style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }}>✓ Finalizado</span>;
    return <span className="badge badge-inactive">{estado}</span>;
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <span className="topbar-title">Historia Clínica</span>
          {casos && (
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "DM Mono, monospace" }}>
              {casos.totalElements || (casos.data?.length ?? 0)} caso(s)
            </span>
          )}
        </div>

        <div className="page-content">
          <button className="back-btn" onClick={() => navigate(-1)}>← Volver al Paciente</button>

          {/* SECTION HEADER */}
          <div className="section-header">
            <h2 className="section-title">
              <span className="dot" />
              Casos Clínicos
            </h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "✕ Cancelar" : "+ Nuevo Caso"}
            </button>
          </div>

          {/* FORM */}
          {showForm && (
            <div style={{ marginBottom: "24px" }}>
              <CasoForm
                hcId={id}
                onSuccess={() => { fetchCasos(); setShowForm(false); }}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          {/* LOADING */}
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner" />
              <span>Cargando casos...</span>
            </div>
          ) : !casos ? (
            <div className="empty-state">
              <div className="empty-state-icon">🦷</div>
              <p className="empty-state-text">No hay datos disponibles</p>
            </div>
          ) : (
            <>
              {/* CASES GRID */}
              {Array.isArray(casos.data) && casos.data.length > 0 ? (
                <div className="casos-grid">
                  {casos.data.map((caso, i) => (
                    <div key={caso.id} className={`caso-card stagger-${Math.min(i + 1, 5)}`}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                        <div>
                          <div className="caso-number">Caso #{caso.id}</div>
                          <div className="caso-title">{caso.nombreCaso || caso.diagnostico}</div>
                        </div>
                        {estadoBadge(caso.estado)}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
                        <div style={{ display: "flex", gap: "8px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
                          <span style={{ color: "var(--text-muted)", minWidth: "90px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.3px", fontFamily: "DM Mono, monospace", paddingTop: "2px" }}>Diagnóstico</span>
                          {caso.diagnostico}
                        </div>
                        <div style={{ display: "flex", gap: "8px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
                          <span style={{ color: "var(--text-muted)", minWidth: "90px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.3px", fontFamily: "DM Mono, monospace", paddingTop: "2px" }}>Inicio</span>
                          {caso.fechaInicio || "—"}
                        </div>
                        {caso.costoTotal && (
                          <div style={{ display: "flex", gap: "8px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
                            <span style={{ color: "var(--text-muted)", minWidth: "90px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.3px", fontFamily: "DM Mono, monospace", paddingTop: "2px" }}>Costo</span>
                            <span style={{ color: "var(--accent)", fontFamily: "DM Mono, monospace", fontWeight: 600 }}>
                              S/ {Number(caso.costoTotal).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ flex: 1 }}
                          onClick={() => navigate(`/casos/${caso.id}`)}
                        >
                          Ver Detalles →
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(caso.id)}
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <p className="empty-state-text">No hay casos registrados</p>
                </div>
              )}

              {/* PAGINATION */}
              {casos.totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-ghost btn-sm"
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                  >
                    ← Anterior
                  </button>
                  <span className="page-info">
                    Página {page + 1} / {casos.totalPages}
                  </span>
                  <button
                    className="btn btn-ghost btn-sm"
                    disabled={page + 1 >= casos.totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoriaClinica;
