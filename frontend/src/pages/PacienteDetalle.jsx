import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const PacienteDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({});

  const token = localStorage.getItem("token");

  const fetchPaciente = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/pacientes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPaciente(res.data);
      setForm(res.data);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/pacientes/${id}`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEditMode(false);
      fetchPaciente();

    } catch (error) {
      console.error("Error actualizando:", error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchPaciente();
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (!paciente) return <p>No encontrado</p>;

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)}>← Volver</button>

      <h2>Paciente #{paciente.id}</h2>

      {Object.keys(form).map((key) => (
        key !== "id" && (
          <p key={key}>
            <strong>{key}:</strong>{" "}
            {editMode ? (
              <input
                value={form[key] || ""}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
              />
            ) : (
              form[key] || "-"
            )}
          </p>
        )
      ))}

      {!editMode ? (
        <button onClick={() => setEditMode(true)}>Editar</button>
      ) : (
        <>
          <button onClick={handleUpdate}>Guardar</button>
          <button onClick={() => setEditMode(false)}>Cancelar</button>
        </>
      )}
    </div>
  );
};

export default PacienteDetalle;