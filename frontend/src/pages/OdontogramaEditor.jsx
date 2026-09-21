import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const API = import.meta.env.VITE_API_URL;

// Piezas dentales estándar ISO 3950
const PIEZAS_SUPERIORES = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const PIEZAS_INFERIORES = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
const TEMPORALES_SUPERIORES = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];
const TEMPORALES_INFERIORES = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75];

const ESTADOS = {
  SANO: { label: "Sano", color: "var(--bg-input)", border: "var(--border)" },
  CARIES: { label: "Caries", color: "rgba(255, 77, 109, 0.25)", border: "#ff4d6d" },
  RESTAURADO: { label: "Restaurado", color: "rgba(4, 151, 255, 0.25)", border: "#0497ff" },
  EXTRAIDO: { label: "Extraído", color: "rgba(100, 116, 139, 0.3)", border: "#64748b" },
  ENDODONCIA: { label: "Endodoncia", color: "rgba(245, 158, 11, 0.25)", border: "#f59e0b" },
};

const OdontogramaEditor = ({ modo = "crear" }) => {
  const { pacienteId, id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [dientesState, setDientesState] = useState({});
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("CARIES");
  const [doctor, setDoctor] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);

  const esSoloLectura = modo === "ver";

  useEffect(() => {
    if (modo !== "crear" && id) {
      fetchOdontograma();
    }
  }, [id, modo]);

  const fetchOdontograma = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/odontogramas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setDoctor(data.doctorResponsable || "");
      setObservaciones(data.observaciones || "");
      if (data.datosDientesJson) {
        setDientesState(JSON.parse(data.datosDientesJson));
      }
    } catch (err) {
      console.error("Error al cargar odontograma:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDienteClick = (numeroPieza) => {
    if (esSoloLectura) return;
    setDientesState((prev) => {
      const estadoActual = prev[numeroPieza]?.estado || "SANO";
      const nuevoEstado = estadoActual === estadoSeleccionado ? "SANO" : estadoSeleccionado;
      return {
        ...prev,
        [numeroPieza]: { ...prev[numeroPieza], estado: nuevoEstado },
      };
    });
  };

  const handleGuardar = async () => {
    try {
      setLoading(true);
      const payload = {
        doctorResponsable: doctor,
        observaciones: observaciones,
        datosDientesJson: JSON.stringify(dientesState),
      };

      if (modo === "editar") {
        await axios.put(`${API}/api/odontogramas/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API}/api/odontogramas/paciente/${pacienteId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate(-1);
    } catch (err) {
      console.error("Error al guardar odontograma:", err);
      alert("Error al guardar el odontograma.");
    } finally {
      setLoading(false);
    }
  };

  const renderDiente = (num) => {
    const info = dientesState[num] || { estado: "SANO" };
    const config = ESTADOS[info.estado] || ESTADOS.SANO;

    return (
      <div
        key={num}
        onClick={() => handleDienteClick(num)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          cursor: esSoloLectura ? "default" : "pointer",
          userSelect: "none",
        }}
      >
        <span style={{ fontSize: "11px", fontFamily: "DM Mono, monospace", color: "var(--text-muted)" }}>
          {num}
        </span>
        <div
          style={{
            width: "36px",
            height: "44px",
            borderRadius: "6px",
            background: config.color,
            border: `2px solid ${config.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: 700,
            color: "var(--text-primary)",
            transition: "all 0.15s ease",
          }}
        >
          {info.estado === "EXTRAIDO" ? "✕" : ""}
        </div>
      </div>
    );
  };

  return (
    <div className="app-shell" style={{ maxWidth: "100%", padding: "0 20px" }}>
      <Sidebar />
      <div className="main-content" style={{ width: "100%", maxWidth: "100%" }}>
        <div className="topbar">
          <span className="topbar-title">
            {modo === "ver" ? "Ver Odontograma" : modo === "editar" ? "Editar Odontograma" : "Nuevo Odontograma"}
          </span>
        </div>

        <div className="page-content" style={{ maxWidth: "100%", padding: "20px 0" }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: "16px" }}>
            ← Volver al Historial
          </button>

          {/* Barra de Herramientas de Estado */}
          {!esSoloLectura && (
            <div className="card" style={{ padding: "16px", marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", fontFamily: "DM Mono, monospace", color: "var(--text-muted)", marginBottom: "10px", textTransform: "uppercase" }}>
                Herramienta de Diagnóstico (Haz clic en la pieza dental)
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {Object.entries(ESTADOS).map(([key, config]) => (
                  <button
                    key={key}
                    type="button"
                    className={`btn btn-sm ${estadoSeleccionado === key ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => setEstadoSeleccionado(key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      border: `1px solid ${config.border}`,
                    }}
                  >
                    <span style={{ width: "12px", height: "12px", borderRadius: "3px", background: config.color, border: `1px solid ${config.border}` }} />
                    <span>{config.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Odontograma Visual */}
          <div className="card" style={{ padding: "24px", marginBottom: "20px", width: "100%" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px", color: "var(--text-primary)" }}>
              Piezas Permanentes
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "8px", overflowX: "auto", paddingBottom: "12px" }}>
              {PIEZAS_SUPERIORES.map(renderDiente)}
            </div>

            <div style={{ height: "1px", background: "var(--border)", margin: "20px 0" }} />

            <div style={{ display: "flex", justifyContent: "center", gap: "8px", overflowX: "auto", paddingBottom: "12px" }}>
              {PIEZAS_INFERIORES.map(renderDiente)}
            </div>

            <div style={{ fontSize: "14px", fontWeight: 600, margin: "24px 0 16px 0", color: "var(--text-primary)" }}>
              Piezas Temporales (Deciduas)
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "8px", overflowX: "auto", paddingBottom: "12px" }}>
              {TEMPORALES_SUPERIORES.map(renderDiente)}
            </div>

            <div style={{ height: "1px", background: "var(--border)", margin: "20px 0" }} />

            <div style={{ display: "flex", justifyContent: "center", gap: "8px", overflowX: "auto", paddingBottom: "12px" }}>
              {TEMPORALES_INFERIORES.map(renderDiente)}
            </div>
          </div>

          {/* Formulario de Observaciones */}
          <div className="card" style={{ padding: "20px" }}>
            <div className="form-grid" style={{ gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Doctor Responsable</label>
                <input
                  className="form-input"
                  placeholder="Dr. Nombre Apellido"
                  value={doctor}
                  disabled={esSoloLectura}
                  onChange={(e) => setDoctor(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label className="form-label">Observaciones y Hallazgos Clínicos</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Escribe detalles adicionales de la exploración bucal..."
                  value={observaciones}
                  disabled={esSoloLectura}
                  onChange={(e) => setObservaciones(e.target.value)}
                  style={{ resize: "vertical", paddingTop: "10px" }}
                />
              </div>
            </div>

            {!esSoloLectura && (
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleGuardar} disabled={loading}>
                  {loading ? "Guardando..." : "Guardar Odontograma"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OdontogramaEditor;