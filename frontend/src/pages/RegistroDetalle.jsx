import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const RegistroDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [registro, setRegistro] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);

  // ================= STATES =================
  const [fechaAtencion, setFechaAtencion] = useState("");
  const [evolucion, setEvolucion] = useState("");
  const [procedimiento, setProcedimiento] = useState("");
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

  // ================= FETCH =================
  const fetchRegistro = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:8080/api/registros/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = res.data;

      setRegistro(data);

      // cargar en form
      setFechaAtencion(data.fechaAtencion || "");
      setEvolucion(data.evolucion || "");
      setProcedimiento(data.procedimientoRealizado || "");
      setDoctor(data.doctorResponsable || "");
      setAbono(data.montoAbonado || "");
      setObservaciones(data.observaciones || "");

    } catch (error) {
      console.error("Error cargando registro:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      if (!evolucion.trim()) {
        alert("La evolución es obligatoria");
        return;
      }

      await axios.put(
        `http://localhost:8080/api/registros/${id}`,
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

      setEditMode(false);
      fetchRegistro();

    } catch (error) {
      console.error("Error actualizando registro:", error.response?.data || error);
    }
  };

  useEffect(() => {
    if (id) fetchRegistro();
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (!registro) return <p>No se encontró el registro</p>;

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)}>← Volver</button>

      <h2>Detalle del Registro #{registro.id}</h2>

      <div style={{ border: "1px solid #ddd", padding: "15px", marginTop: "15px" }}>

        {/* FECHA */}
        <p>
          <strong>Fecha:</strong>{" "}
          {editMode ? (
            <input
              type="date"
              value={fechaAtencion}
              onChange={(e) => setFechaAtencion(e.target.value)}
            />
          ) : (
            formatFecha(registro.fechaAtencion)
          )}
        </p>

        {/* EVOLUCION */}
        <p>
          <strong>Evolución:</strong>{" "}
          {editMode ? (
            <input
              value={evolucion}
              onChange={(e) => setEvolucion(e.target.value)}
            />
          ) : (
            registro.evolucion
          )}
        </p>

        {/* PROCEDIMIENTO */}
        <p>
          <strong>Procedimiento:</strong>{" "}
          {editMode ? (
            <input
              value={procedimiento}
              onChange={(e) => setProcedimiento(e.target.value)}
            />
          ) : (
            registro.procedimientoRealizado
          )}
        </p>

        {/* DOCTOR */}
        <p>
          <strong>Doctor:</strong>{" "}
          {editMode ? (
            <input
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
            />
          ) : (
            registro.doctorResponsable
          )}
        </p>

        {/* ABONO */}
        <p>
          <strong>Abono:</strong>{" "}
          {editMode ? (
            <input
              type="number"
              value={abono}
              onChange={(e) => setAbono(e.target.value)}
            />
          ) : (
            registro.montoAbonado
          )}
        </p>

        {/* OBSERVACIONES */}
        <p>
          <strong>Observaciones:</strong>{" "}
          {editMode ? (
            <input
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          ) : (
            registro.observaciones
          )}
        </p>

        {/* BOTONES */}
        {!editMode ? (
          <button onClick={() => setEditMode(true)}>Editar</button>
        ) : (
          <>
            <button onClick={handleUpdate}>Guardar</button>
            <button
              onClick={() => {
                setEditMode(false);
                fetchRegistro();
              }}
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RegistroDetalle;