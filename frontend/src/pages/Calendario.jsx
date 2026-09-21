import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const API = import.meta.env.VITE_API_URL;

const ESTADO_BADGE = {
  POR_CONFIRMAR: { label: "Por Confirmar", bg: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "rgba(245,158,11,0.25)" },
  CONFIRMADA:    { label: "Confirmada",    bg: "rgba(0,200,150,0.12)", color: "#00c896", border: "rgba(0,200,150,0.25)" },
  COMPLETADA:    { label: "Completada",    bg: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "rgba(59,130,246,0.25)" },
  CANCELADA:     { label: "Cancelada",     bg: "rgba(255,77,109,0.12)", color: "#ff4d6d", border: "rgba(255,77,109,0.25)" },
  NO_ASISTIO:    { label: "No Asistió",    bg: "rgba(100,116,139,0.12)", color: "#64748b", border: "rgba(100,116,139,0.25)" },
};

const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const HORAS_DIA = [];
for (let h = 8; h <= 20; h++) {
  const horaStr = String(h).padStart(2, "0");
  HORAS_DIA.push(`${horaStr}:00`);
  if (h < 20) HORAS_DIA.push(`${horaStr}:30`);
}

const Calendario = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [vista, setVista] = useState("semana"); // "mes" | "semana"
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [loading, setLoading] = useState(true);
  const [pacientes, setPacientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("TODOS"); // Filtro de estado para el panel lateral

  const [form, setForm] = useState({
    pacienteId: "",
    fecha: "",
    hora: "09:00",
    motivo: "",
    doctorResponsable: "",
    observaciones: "",
  });

  const token = localStorage.getItem("token");
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const fetchPacientes = async () => {
    try {
      const res = await axios.get(`${API}/api/pacientes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPacientes(Array.isArray(res.data.data) ? res.data.data : res.data);
    } catch (err) {
      console.error("Error al cargar pacientes:", err);
    }
  };

  const fetchCitasMes = async () => {
    try {
      setLoading(true);
      const mStr = String(month + 1).padStart(2, "0");
      const ultimoDiaNum = new Date(year, month + 1, 0).getDate();
      const dStr = String(ultimoDiaNum).padStart(2, "0");

      const primerDia = `${year}-${mStr}-01T00:00:00Z`;
      const ultimoDia = `${year}-${mStr}-${dStr}T23:59:59Z`;

      const res = await axios.get(
        `${API}/api/citas/rango?inicio=${encodeURIComponent(primerDia)}&fin=${encodeURIComponent(ultimoDia)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const citas = res.data || [];
      const eventMap = {};

      citas.forEach((cita) => {
        const fechaKey = cita.fechaHora.split("T")[0];
        if (!eventMap[fechaKey]) {
          eventMap[fechaKey] = [];
        }
        eventMap[fechaKey].push(cita);
      });

      setEvents(eventMap);
    } catch (error) {
      console.error("Error al cargar citas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  useEffect(() => {
    fetchCitasMes();
  }, [currentDate]);

  const handleCrearCita = async (e) => {
    e.preventDefault();
    try {
      if (!form.pacienteId) {
        alert("Selecciona un paciente");
        return;
      }

      const horaFormateada = form.hora.length === 5 ? `${form.hora}:00` : form.hora;
      const fechaHoraConcat = `${form.fecha}T${horaFormateada}`;

      await axios.post(
        `${API}/api/citas`,
        {
          pacienteId: Number(form.pacienteId),
          fechaHora: fechaHoraConcat,
          motivo: form.motivo,
          doctorResponsable: form.doctorResponsable,
          observaciones: form.observaciones,
          estado: "POR_CONFIRMAR",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowModal(false);
      setForm({
        pacienteId: "",
        fecha: selectedDate || getLocalDateString(),
        hora: "09:00",
        motivo: "",
        doctorResponsable: "",
        observaciones: "",
      });
      fetchCitasMes();
    } catch (error) {
      console.error("Error al agendar cita:", error.response?.data || error);
      alert(error.response?.data?.message || "Error al agendar cita");
    }
  };

  const handleCambiarEstado = async (citaId, nuevoEstado) => {
    try {
      await axios.patch(
        `${API}/api/citas/${citaId}/estado?estado=${nuevoEstado}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCitasMes();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const handleEliminarCita = async (citaId) => {
    if (!window.confirm("¿Estás seguro de eliminar esta cita?")) return;
    try {
      await axios.delete(`${API}/api/citas/${citaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCitasMes();
    } catch (error) {
      console.error("Error al eliminar cita:", error);
    }
  };

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => {
    let day = new Date(y, m, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevPeriod = () => {
    if (vista === "mes") {
      setCurrentDate(new Date(year, month - 1, 1));
    } else {
      const prevWeek = new Date(currentDate);
      prevWeek.setDate(prevWeek.getDate() - 7);
      setCurrentDate(prevWeek);
    }
  };

  const nextPeriod = () => {
    if (vista === "mes") {
      setCurrentDate(new Date(year, month + 1, 1));
    } else {
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      setCurrentDate(nextWeek);
    }
  };

  const formatFechaDisplay = (fechaStr) => {
    if (!fechaStr) return "";
    const [y, m, d] = fechaStr.split("-");
    return `${d}/${m}/${y}`;
  };

  const formatHora = (fechaHoraStr) => {
    if (!fechaHoraStr) return "";
    const hora = fechaHoraStr.split("T")[1]?.substring(0, 5);
    return hora || "";
  };

  const todayLocalStr = getLocalDateString();

  const getWeekDays = (baseDate) => {
    const d = new Date(baseDate);
    const dayOfWeek = d.getDay();
    const diffToMonday = d.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);

    const monday = new Date(d.setDate(diffToMonday));
    const week = [];

    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      week.push(nextDay);
    }
    return week;
  };

  const weekDays = getWeekDays(currentDate);

  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(
      <div key={`empty-${i}`} style={{ background: "rgba(255,255,255,0.01)", borderRadius: "10px", height: "100px", border: "1px solid var(--border)", opacity: 0.3 }} />
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const mStr = String(month + 1).padStart(2, "0");
    const dStr = String(day).padStart(2, "0");
    const dateKey = `${year}-${mStr}-${dStr}`;
    const dayEvents = events[dateKey] || [];
    const isSelected = selectedDate === dateKey;
    const isToday = todayLocalStr === dateKey;

    calendarCells.push(
      <div
        key={dateKey}
        onClick={() => setSelectedDate(dateKey)}
        style={{
          background: isSelected ? "var(--bg-card-hover)" : "var(--bg-card)",
          border: isSelected ? "1.5px solid var(--accent)" : "1px solid var(--border)",
          borderRadius: "10px",
          padding: "10px",
          height: "100px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          transition: "all 0.18s ease",
          position: "relative",
          boxShadow: isSelected ? "var(--shadow-glow)" : "none",
        }}
      >
        <span
          style={{
            fontSize: "14px",
            fontFamily: "DM Mono, monospace",
            fontWeight: isToday ? "700" : "500",
            color: isToday ? "var(--accent)" : "var(--text-primary)",
            background: isToday ? "var(--accent-dim)" : "transparent",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {day}
        </span>

        {dayEvents.length > 0 ? (
          <span
            style={{
              fontSize: "11px",
              fontFamily: "DM Mono, monospace",
              background: "var(--accent-dim)",
              color: "var(--accent)",
              padding: "3px 10px",
              borderRadius: "12px",
              border: "1px solid var(--border-active)",
              fontWeight: 600,
            }}
          >
            {dayEvents.length} cita{dayEvents.length !== 1 ? "s" : ""}
          </span>
        ) : (
          <div style={{ height: "18px" }} />
        )}
      </div>
    );
  }

  // Filtrado dinámico de citas por el combobox de la derecha
  const selectedDayEvents = (selectedDate ? (events[selectedDate] || []) : []).filter(
    (c) => filtroEstado === "TODOS" || c.estado === filtroEstado
  );

  return (
    <div className="app-shell" style={{ maxWidth: "100%", padding: "0 20px" }}>
      <Sidebar />
      <div className="main-content" style={{ width: "100%", maxWidth: "100%" }}>
        <div className="topbar">
          <span className="topbar-title">Calendario de Citas</span>
          <div className="topbar-right">
            <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "DM Mono, monospace" }}>
              {monthNames[month]} {year}
            </span>
          </div>
        </div>

        <div className="page-content" style={{ maxWidth: "100%", padding: "20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 className="section-title" style={{ margin: 0, fontSize: "22px" }}>
              <span className="dot" />
              {monthNames[month]} {year}
            </h2>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{ display: "flex", background: "var(--bg-input)", padding: "4px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <button
                  className={`btn btn-sm ${vista === "mes" ? "btn-primary" : "btn-ghost"}`}
                  style={{ padding: "6px 16px", fontSize: "13px" }}
                  onClick={() => setVista("mes")}
                >
                  Mes
                </button>
                <button
                  className={`btn btn-sm ${vista === "semana" ? "btn-primary" : "btn-ghost"}`}
                  style={{ padding: "6px 16px", fontSize: "13px" }}
                  onClick={() => setVista("semana")}
                >
                  Semana
                </button>
              </div>

              <button
                className="btn btn-primary"
                style={{ padding: "8px 16px", fontSize: "13px" }}
                onClick={() => {
                  setForm((prev) => ({ ...prev, fecha: selectedDate || getLocalDateString() }));
                  setShowModal(true);
                }}
              >
                + Agendar Cita
              </button>
              <button className="btn btn-secondary" onClick={prevPeriod}>← Anterior</button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  const now = new Date();
                  setCurrentDate(now);
                  setSelectedDate(getLocalDateString(now));
                }}
              >
                Hoy
              </button>
              <button className="btn btn-secondary" onClick={nextPeriod}>Siguiente →</button>
            </div>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner" />
              <span>Cargando citas...</span>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "24px", alignItems: "start", width: "100%" }}>

              {/* Vista Mensual */}
              {vista === "mes" && (
                <div className="card" style={{ padding: "24px", width: "100%" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "10px", marginBottom: "14px", textAlign: "center" }}>
                    {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
                      <div key={d} style={{ fontSize: "13px", fontFamily: "DM Mono, monospace", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                        {d}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "10px" }}>
                    {calendarCells}
                  </div>
                </div>
              )}

              {/* Vista Semanal */}
              {vista === "semana" && (
                <div className="card" style={{ padding: "20px", width: "100%" }}>
                  <div style={{ width: "100%" }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "70px repeat(7, 1fr)",
                        borderBottom: "1px solid var(--border)",
                        paddingBottom: "12px",
                        textAlign: "center",
                        gap: "6px"
                      }}
                    >
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "DM Mono, monospace", alignSelf: "center" }}>
                        Hora
                      </div>
                      {weekDays.map((dateObj) => {
                        const dateStr = getLocalDateString(dateObj);
                        const isSelected = selectedDate === dateStr;
                        const isToday = todayLocalStr === dateStr;
                        const diaNombre = dateObj.toLocaleDateString("es-ES", { weekday: "short" });
                        const numDia = dateObj.getDate();

                        return (
                          <div
                            key={dateStr}
                            onClick={() => setSelectedDate(dateStr)}
                            style={{
                              cursor: "pointer",
                              padding: "8px 4px",
                              borderRadius: "8px",
                              background: isSelected ? "var(--bg-card-hover)" : "transparent",
                              border: isSelected ? "1.5px solid var(--accent)" : "1px solid transparent",
                              transition: "all 0.15s ease"
                            }}
                          >
                            <div style={{ fontSize: "12px", textTransform: "capitalize", color: isToday ? "var(--accent)" : "var(--text-muted)", fontWeight: isToday ? 700 : 500 }}>
                              {diaNombre}
                            </div>
                            <div style={{ fontSize: "16px", fontWeight: 700, color: isToday ? "var(--accent)" : "var(--text-primary)", fontFamily: "DM Mono, monospace", marginTop: "2px" }}>
                              {numDia}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ maxHeight: "680px", overflowY: "auto", paddingRight: "4px" }}>
                      {HORAS_DIA.map((horaSlot) => (
                        <div
                          key={horaSlot}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "70px repeat(7, 1fr)",
                            borderBottom: "1px dashed var(--border)",
                            minHeight: "60px",
                            alignItems: "stretch",
                            gap: "6px"
                          }}
                        >
                          <div
                            style={{
                              fontSize: "12px",
                              fontFamily: "DM Mono, monospace",
                              color: "var(--text-muted)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRight: "1px solid var(--border)",
                              background: "rgba(255,255,255,0.01)"
                            }}
                          >
                            {horaSlot}
                          </div>

                          {weekDays.map((dateObj) => {
                            const dateStr = getLocalDateString(dateObj);
                            const citasDelDia = events[dateStr] || [];
                            const citasEnHora = citasDelDia.filter((c) => formatHora(c.fechaHora) === horaSlot);

                            return (
                              <div
                                key={`${dateStr}-${horaSlot}`}
                                onClick={() => setSelectedDate(dateStr)}
                                style={{
                                  borderRight: "1px solid var(--border)",
                                  padding: "4px",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "4px",
                                  background: selectedDate === dateStr ? "rgba(4,151,255,0.03)" : "transparent",
                                  minWidth: 0
                                }}
                              >
                                {citasEnHora.map((c) => {
                                  const badge = ESTADO_BADGE[c.estado] || ESTADO_BADGE.POR_CONFIRMAR;
                                  return (
                                    <div
                                      key={c.id}
                                      style={{
                                        background: badge.bg,
                                        borderLeft: `4px solid ${badge.color}`,
                                        borderRadius: "6px",
                                        padding: "6px 8px",
                                        fontSize: "11px",
                                        color: "var(--text-primary)",
                                        cursor: "pointer",
                                        overflow: "hidden",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.15)"
                                      }}
                                      title={`${c.nombrePaciente} - ${c.motivo}`}
                                    >
                                      <div style={{ fontWeight: 600, color: badge.color, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {formatHora(c.fechaHora)} {c.nombrePaciente}
                                      </div>
                                      {c.motivo && (
                                        <div style={{ fontSize: "10px", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "2px" }}>
                                          {c.motivo}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Panel lateral derecho con filtro de estado y acceso al perfil del paciente */}
              <div className="card" style={{ padding: "24px", position: "sticky", top: "88px", width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "14px", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontFamily: "DM Mono, monospace", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Citas para el día
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>
                      {selectedDate ? formatFechaDisplay(selectedDate) : "Selecciona un día"}
                    </div>
                  </div>
                  <span className="badge badge-active" style={{ fontSize: "12px", padding: "4px 10px" }}>
                    {selectedDayEvents.length} cita{selectedDayEvents.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Filtro por estado para la lista de citas */}
                <div style={{ marginBottom: "16px" }}>
                  <select
                    className="form-input"
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    style={{ fontSize: "12px", padding: "6px 10px", height: "36px", width: "100%", cursor: "pointer" }}
                  >
                    <option value="TODOS">🔍 Todos los estados</option>
                    <option value="POR_CONFIRMAR">Por Confirmar</option>
                    <option value="CONFIRMADA">Confirmada</option>
                    <option value="COMPLETADA">Completada</option>
                    <option value="CANCELADA">Cancelada</option>
                    <option value="NO_ASISTIO">No Asistió</option>
                  </select>
                </div>

                {selectedDayEvents.length === 0 ? (
                  <div className="empty-state" style={{ padding: "30px 10px" }}>
                    <div className="empty-state-icon" style={{ fontSize: "36px" }}>📅</div>
                    <p className="empty-state-text" style={{ fontSize: "14px" }}>No hay citas encontradas.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxHeight: "calc(100vh - 310px)", overflowY: "auto", paddingRight: "4px" }}>
                    {selectedDayEvents.map((cita) => {
                      const badge = ESTADO_BADGE[cita.estado] || ESTADO_BADGE.POR_CONFIRMAR;
                      return (
                        <div
                          key={cita.id}
                          style={{
                            background: "var(--bg-input)",
                            border: "1px solid var(--border)",
                            borderRadius: "10px",
                            padding: "16px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)" }}>
                                  {cita.nombrePaciente}
                                </div>
                                {/* Botón directo a la vista del paciente */}
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-sm"
                                  style={{ padding: "2px 6px", fontSize: "12px", borderRadius: "4px" }}
                                  title="Ver información del paciente"
                                  onClick={() => navigate(`/pacientes/${cita.pacienteId}`)}
                                >
                                  👤
                                </button>
                              </div>
                              <div style={{ fontSize: "13px", color: "var(--accent)", fontFamily: "DM Mono, monospace", marginTop: "3px" }}>
                                ⏰ {formatHora(cita.fechaHora)} hrs
                              </div>
                            </div>
                            <span
                              style={{
                                fontSize: "11px",
                                fontFamily: "DM Mono, monospace",
                                padding: "3px 10px",
                                borderRadius: "12px",
                                background: badge.bg,
                                color: badge.color,
                                border: `1px solid ${badge.border}`,
                                textTransform: "uppercase",
                              }}
                            >
                              {badge.label}
                            </span>
                          </div>

                          <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                            <strong>Motivo:</strong> {cita.motivo}
                          </div>

                          {cita.doctorResponsable && (
                            <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                              <strong>Doctor:</strong> {cita.doctorResponsable}
                            </div>
                          )}

                          {cita.observaciones && (
                            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                              <em>{cita.observaciones}</em>
                            </div>
                          )}

                          <div style={{ display: "flex", gap: "10px", marginTop: "8px", alignItems: "center" }}>
                            <select
                              className="form-input"
                              value={cita.estado || "POR_CONFIRMAR"}
                              onChange={(e) => handleCambiarEstado(cita.id, e.target.value)}
                              style={{
                                flex: 1,
                                fontSize: "13px",
                                padding: "6px 10px",
                                height: "36px",
                                cursor: "pointer",
                              }}
                            >
                              <option value="POR_CONFIRMAR">Por Confirmar</option>
                              <option value="CONFIRMADA">Confirmada</option>
                              <option value="COMPLETADA">Completada</option>
                              <option value="CANCELADA">Cancelada</option>
                              <option value="NO_ASISTIO">No Asistió</option>
                            </select>

                            <button
                              className="btn btn-danger btn-sm"
                              style={{ fontSize: "12px", padding: "6px 12px", height: "36px" }}
                              onClick={() => handleEliminarCita(cita.id)}
                              title="Eliminar cita"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal para agendar nueva cita */}
          {showModal && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                background: "rgba(0,0,0,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="card"
                style={{ width: "100%", maxWidth: "520px", padding: "28px", background: "var(--bg-surface)" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: 600, color: "var(--text-primary)" }}>Agendar Nueva Cita</h3>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowModal(false)}
                    style={{ borderRadius: "50%", padding: "4px 8px" }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCrearCita} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div className="form-group">
                    <label className="form-label">Paciente *</label>
                    <select
                      className="form-input"
                      value={form.pacienteId}
                      onChange={(e) => setForm({ ...form, pacienteId: e.target.value })}
                      required
                    >
                      <option value="">Seleccionar Paciente</option>
                      {pacientes.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombres} {p.apellidos} (DNI: {p.dni})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div className="form-group">
                      <label className="form-label">Fecha *</label>
                      <input
                        className="form-input"
                        type="date"
                        value={form.fecha}
                        onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Hora *</label>
                      <input
                        className="form-input"
                        type="time"
                        value={form.hora}
                        onChange={(e) => setForm({ ...form, hora: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Motivo de Consulta *</label>
                    <input
                      className="form-input"
                      placeholder="Ej. Calza, Limpieza, Dolor muela..."
                      value={form.motivo}
                      onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Doctor Responsable</label>
                    <input
                      className="form-input"
                      placeholder="Dr. Nombre"
                      value={form.doctorResponsable}
                      onChange={(e) => setForm({ ...form, doctorResponsable: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Observaciones</label>
                    <input
                      className="form-input"
                      placeholder="Notas adicionales"
                      value={form.observaciones}
                      onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                    <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Guardar Cita
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendario;