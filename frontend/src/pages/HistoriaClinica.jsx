import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CasoForm from "./CasoForm";

import axios from "axios";

const HistoriaClinica = () => {

  const { id } = useParams(); // ✅ SIEMPRE ARRIBA
  const [loading, setLoading] = useState(true);
  const [casos, setCasos] = useState(null);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const handleReload = () => {
  fetchCasos();
};

  const fetchCasos = async () => {
  try {
    setLoading(true); // 👈 empieza carga

    const token = localStorage.getItem("token");

    const res = await axios.get(
      `http://localhost:8080/api/casos/historiasClinicas/${id}?page=${page}&size=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCasos(res.data);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false); // 👈 termina carga SIEMPRE
  }
};

const handleDelete = async (casoId) => {
  const confirmDelete = window.confirm("¿Eliminar este caso?");

  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `http://localhost:8080/api/casos/${casoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchCasos(); // recargar lista
  } catch (error) {
    console.error("Error eliminando caso:", error);
  }
};

  useEffect(() => {
    if (id) fetchCasos();
  }, [id, page]);

  if (loading) return <p>Cargando casos...</p>;

  if (!casos) return <p>No hay datos</p>;

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)}>← Volver</button>
      <h2>Casos Clínicos</h2>

      <CasoForm hcId={id} onSuccess={handleReload} />

      {/* LISTA */}
      <div style={{ display: "grid", gap: "15px" }}>
        {Array.isArray(casos.data) && casos.data.length > 0 ? (
          casos.data.map((caso) => (
            <div
              key={caso.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <h3>Caso #{caso.id}</h3>

              <p><strong>Diagnóstico:</strong> {caso.diagnostico}</p>
              <p><strong>Estado:</strong> {caso.estado}</p>
              <p><strong>Fecha:</strong> {caso.fechaInicio}</p>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>

                <button
                  onClick={() => navigate(`/casos/${caso.id}`)}
                >
                  Ver más detalles
                </button>

                <button
                  onClick={() => handleDelete(caso.id)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  Eliminar
                </button>

              </div>
            </div>
          ))
        ) : (
          <p>No hay casos registrados</p>
        )}
      </div>

      {/* PAGINACIÓN */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          Anterior
        </button>

        <span>
          Página {page + 1} de {casos.totalPages}
        </span>

        <button
          disabled={page + 1 >= casos.totalPages}
          onClick={() => setPage(page + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default HistoriaClinica;