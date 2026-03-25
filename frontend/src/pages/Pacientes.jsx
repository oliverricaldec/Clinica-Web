import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PacienteForm from "./PacienteForm";

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchPacientes = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/pacientes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPacientes(Array.isArray(res.data.data) ? res.data.data : res.data);
    } catch (error) {
      console.error("Error cargando pacientes:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar paciente?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/pacientes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchPacientes();
    } catch (error) {
      console.error("Error eliminando paciente:", error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pacientes</h2>

      {/* SOLO CREAR */}
      <PacienteForm onSuccess={fetchPacientes} />

      {/* LISTA */}
      {pacientes.length === 0 ? (
        <p>No hay pacientes</p>
      ) : (
        pacientes.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ccc",
              marginTop: "10px",
              padding: "10px",
            }}
          >
            <p><strong>{p.nombres} {p.apellidos}</strong></p>
            <p>DNI: {p.dni}</p>
            <p>Teléfono: {p.telefono}</p>

            <button onClick={() => navigate(`/pacientes/${p.id}`)}>
              Ver detalle
            </button>

            <button onClick={() => navigate(`/historia/${p.id}`)}>
              Ver historia clinica
            </button>

            <button
              onClick={() => handleDelete(p.id)}
              style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
            >
              Eliminar
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Pacientes;