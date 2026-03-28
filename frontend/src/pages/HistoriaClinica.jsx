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
  const [abonosPorCaso, setAbonosPorCaso] = useState({});

  const fetchCasos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8080/api/casos/historiasClinicas/${id}?page=${page}&size=5`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCasos(res.data);

      if (res.data?.data) {
        fetchAbonos(res.data.data);
      }
    } catch (error) {
      console.error(error);
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
            const res = await axios.get(
              `http://localhost:8080/api/registros/caso/${caso.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            const registros = res.data.data || [];

            const totalAbonado = registros.reduce(
              (sum, r) => sum + (r.montoAbonado || 0),
              0
            );

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
    if (estado === "FINALIZADO")
      return (
        <span
          className="badge"
          style={{
            background: "rgba(59,130,246,0.1)",
            color: "#60a5fa",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          ✓ Finalizado
        </span>
      );
    return <span className="badge badge-inactive">{estado}</span>;
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <span className="topbar-title">Historia Clínica</span>
          {casos && (
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                fontFamily: "DM Mono, monospace",
              }}
            >
              {casos.totalElements || (casos.data?.length ?? 0)} caso(s)
            </span>
          )}
        </div>

        <div className="page-content">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Volver al Paciente
          </button>

          <div className="section-header">
            <h2 className="section-title">
              <span className="dot" />
              Tratamientos dentales
            </h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "✕ Cancelar" : "+ Nuevo tratamiento dental"}
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

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner" />
              <span>Cargando tratamientos dentales...</span>
            </div>
          ) : !casos ? (
            <div className="empty-state">
              <div className="empty-state-icon">🦷</div>
              <p className="empty-state-text">No hay datos disponibles</p>
            </div>
          ) : (
            <>
              {Array.isArray(casos.data) && casos.data.length > 0 ? (
                <div className="casos-grid">
                  {casos.data.map((caso, i) => {
                    const abonado = abonosPorCaso[caso.id] || 0;
                    const total = caso.costoTotal || 0;
                    const restante = total - abonado;
                    const progreso = calcularProgreso(abonado, total);

                    return (
                      <div key={caso.id} className={`caso-card stagger-${Math.min(i + 1, 5)}`}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                          <div>
                            <div className="caso-number">Tratamiento dental #{caso.id}</div>
                            <div className="caso-title">{caso.nombreCaso || caso.diagnostico}</div>
                          </div>
                          {estadoBadge(caso.estado)}
                        </div>

                        <div style={{ marginBottom: "12px" }}>
                          <p>Diagnóstico: {caso.diagnostico}</p>
                          <p>Inicio: {caso.fechaInicio || "—"}</p>
                          <p>
                            Costo: <strong>S/ {total.toFixed(2)}</strong>
                          </p>
                        </div>

                        {/* 💰 PAGOS */}
                        <div style={{ marginBottom: "12px" }}>
                          <p>Abonado: S/ {abonado.toFixed(2)}</p>

                          <div style={{ height: "8px", background: "#1a2a40", borderRadius: "5px" }}>
                            <div
                              style={{
                                width: `${progreso}%`,
                                height: "100%",
                                background:
                                  progreso === 100
                                    ? "#00c896"
                                    : "linear-gradient(90deg, #0497ff, #fc5ba7)",
                              }}
                            />
                          </div>

                          <p style={{ fontSize: "12px" }}>
                            {progreso === 100
                              ? "Pagado"
                              : `Falta: S/ ${restante.toFixed(2)}`}
                          </p>
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
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No hay casos registrados</p>
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