import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CasoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caso, setCaso] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);

  // ================= CASO STATES =================
  const [nombreCaso, setNombreCaso] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [planTratamiento, setPlanTratamiento] = useState("");
  const [examenAuxiliar, setExamenAuxiliar] = useState("");
  const [proformaUrl, setProforma] = useState("");
  const [odontogramaUrl, setOdontograma] = useState("");
  const [costoTotal, setCostoTotal] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estado, setEstado] = useState("ACTIVO");

  // ================= REGISTROS =================
  const [registros, setRegistros] = useState([]);

  // ================= FORM REGISTRO =================
  const [showForm, setShowForm] = useState(false);
  const [evolucion, setEvolucion] = useState("");
  const [procedimiento, setProcedimiento] = useState("");
  const [fechaAtencion, setFechaAtencion] = useState("");
  const [doctor, setDoctor] = useState("");
  const [abono, setAbono] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const token = localStorage.getItem("token");

  // ================= FORMATO FECHA =================
  const formatFecha = (fecha) => {
    if (!fecha) return "Sin fecha";
    const [y, m, d] = fecha.split("-");
    return `${d}/${m}/${y}`;
  };

  // ================= FETCH CASO =================
  const fetchCaso = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:8080/api/casos/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = res.data;

      setCaso(data);

      // llenar estados
      setNombreCaso(data.nombreCaso || "");
      setDiagnostico(data.diagnostico || "");
      setPlanTratamiento(data.planTratamiento || "");
      setExamenAuxiliar(data.examenAuxiliar || "");
      setProforma(data.proformaUrl || "");
      setOdontograma(data.odontogramaUrl || "");
      setCostoTotal(data.costoTotal || "");
      setFechaInicio(data.fechaInicio || "");
      setFechaFin(data.fechaFin || "");
      setEstado(data.estado || "ACTIVO");

    } catch (error) {
      console.error("Error cargando caso:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH REGISTROS =================
  const fetchRegistros = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/registros/caso/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRegistros(Array.isArray(res.data.data) ? res.data.data : []);

    } catch (error) {
      console.error("Error cargando registros:", error.response?.data || error);
      setRegistros([]);
    }
  };

  // ================= UPDATE CASO =================
  const handleUpdate = async () => {
    try {
      if (!diagnostico.trim()) {
        alert("El diagnóstico no puede estar vacío");
        return;
      }

      await axios.put(
        `http://localhost:8080/api/casos/${id}`,
        {
          nombreCaso,
          diagnostico,
          planTratamiento,
          examenAuxiliar,
          proformaUrl,
          odontogramaUrl,
          costoTotal: Number(costoTotal),
          fechaInicio,
          fechaFin,
          estado,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEditMode(false);
      fetchCaso();

    } catch (error) {
      console.error("Error actualizando caso:", error.response?.data || error);
    }
  };

  // ================= CREATE REGISTRO =================
  const handleCreateRegistro = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/registros/casos/${id}/registros`,
        {
          fechaAtencion,
          evolucion,
          procedimientoRealizado: procedimiento,
          doctorResponsable: doctor,
          montoAbonado: Number(abono),
          observaciones,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Registro creado:", res.data);

      setEvolucion("");
      setProcedimiento("");
      setDoctor("");
      setAbono("");
      setObservaciones("");
      setFechaAtencion("");

      setShowForm(false);

      await fetchRegistros();

    } catch (error) {
      console.error("Error creando registro:", error.response?.data || error);
    }
  };

  // ================= DELETE REGISTRO =================
  const handleDeleteRegistro = async (registroId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/registros/${registroId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchRegistros();

    } catch (error) {
      console.error("Error eliminando registro:", error.response?.data || error);
    }
  };

  // ================= INIT =================
  useEffect(() => {
    if (id) {
      fetchCaso();
      fetchRegistros();
    }
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (!caso) return <p>No se encontró el caso</p>;

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)}>← Volver</button>

      <h2>Detalle del Caso #{caso.id}</h2>

      {/* ================= CASO ================= */}
      <div style={{ border: "1px solid #ddd", padding: "15px", marginTop: "15px" }}>

        <p>
          <strong>Nombre:</strong>{" "}
          {editMode ? (
            <input value={nombreCaso} onChange={(e) => setNombreCaso(e.target.value)} />
          ) : (
            caso.nombreCaso
          )}
        </p>

        <p>
          <strong>Diagnóstico:</strong>{" "}
          {editMode ? (
            <input value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} />
          ) : (
            caso.diagnostico
          )}
        </p>

        <p>
          <strong>Plan:</strong>{" "}
          {editMode ? (
            <input value={planTratamiento} onChange={(e) => setPlanTratamiento(e.target.value)} />
          ) : (
            caso.planTratamiento
          )}
        </p>

        <p>
          <strong>Examen:</strong>{" "}
          {editMode ? (
            <input value={examenAuxiliar} onChange={(e) => setExamenAuxiliar(e.target.value)} />
          ) : (
            caso.examenAuxiliar
          )}
        </p>

        <p>
          <strong>Proforma:</strong>{" "}
          {editMode ? (
            <input value={proformaUrl} onChange={(e) => setProforma(e.target.value)} />
          ) : (
            caso.proformaUrl
          )}
        </p>

        <p>
          <strong>Odontograma:</strong>{" "}
          {editMode ? (
            <input value={odontogramaUrl} onChange={(e) => setOdontograma(e.target.value)} />
          ) : (
            caso.odontogramaUrl
          )}
        </p>

        <p>
          <strong>Costo:</strong>{" "}
          {editMode ? (
            <input type="number" value={costoTotal} onChange={(e) => setCostoTotal(e.target.value)} />
          ) : (
            caso.costoTotal
          )}
        </p>

        <p>
          <strong>Fecha inicio:</strong>{" "}
          {editMode ? (
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          ) : (
            formatFecha(caso.fechaInicio)
          )}
        </p>

        <p>
          <strong>Fecha fin:</strong>{" "}
          {editMode ? (
            <input type="date" value={fechaFin || ""} onChange={(e) => setFechaFin(e.target.value)} />
          ) : (
            caso.fechaFin ? formatFecha(caso.fechaFin) : "Sin fecha"
          )}
        </p>

        <p>
          <strong>Estado:</strong>{" "}
          {editMode ? (
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="ACTIVO">ACTIVO</option>
              <option value="FINALIZADO">FINALIZADO</option>
            </select>
          ) : (
            caso.estado
          )}
        </p>

        {!editMode ? (
          <button onClick={() => setEditMode(true)}>Editar</button>
        ) : (
          <>
            <button onClick={handleUpdate}>Guardar</button>
            <button onClick={() => setEditMode(false)}>Cancelar</button>
          </>
        )}
      </div>

      {/* ================= REGISTROS ================= */}
      <h3 style={{ marginTop: "30px" }}>Registros</h3>

      <button onClick={() => setShowForm(true)}>+ Nuevo Registro</button>

      {showForm && (
        <div style={{ marginTop: "10px" }}>
          <input type="date" value={fechaAtencion} onChange={(e) => setFechaAtencion(e.target.value)} />
          <input placeholder="Evolución" value={evolucion} onChange={(e) => setEvolucion(e.target.value)} />
          <input placeholder="Procedimiento" value={procedimiento} onChange={(e) => setProcedimiento(e.target.value)} />
          <input placeholder="Doctor" value={doctor} onChange={(e) => setDoctor(e.target.value)} />
          <input type="number" placeholder="Abono" value={abono} onChange={(e) => setAbono(e.target.value)} />
          <input placeholder="Observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />

          <button onClick={handleCreateRegistro}>Guardar</button>
          <button onClick={() => setShowForm(false)}>Cancelar</button>
        </div>
      )}

      {registros.length === 0 ? (
        <p>No hay registros</p>
      ) : (
        registros.map((r) => (
          <div key={r.id} style={{ border: "1px solid #ccc", marginTop: "10px", padding: "10px" }}>
            <p><strong>Fecha:</strong> {formatFecha(r.fechaAtencion)}</p>
            <p><strong>Evolución:</strong> {r.evolucion}</p>
            <p><strong>Procedimiento:</strong> {r.procedimientoRealizado}</p>
            <p><strong>Doctor:</strong> {r.doctorResponsable}</p>
            <p><strong>Abono:</strong> {r.montoAbonado}</p>

            <button onClick={() => handleDeleteRegistro(r.id)}>Eliminar</button>
            <button
              onClick={() => navigate(`/registros/${r.id}`)}
              style={{
                marginTop: "10px",
                marginRight: "10px",
              }}
            >
              Ver detalle
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default CasoDetalle;