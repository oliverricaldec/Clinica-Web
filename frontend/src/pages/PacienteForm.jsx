import { useState } from "react";
import axios from "axios";

const PacienteForm = ({ onSuccess }) => {
  const [dni, setDni] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [sexo, setSexo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [email, setEmail] = useState("");
  const [antecedentesMedicosUrl, setAntecedentesMedicosUrl] = useState("");
  const [antecedentesOdontologicosUrl, setAntecedentesOdontologicosUrl] = useState("");
  const [fechaRegistro, setFechaRegistro] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8080/api/pacientes",
        {
          dni,
          nombres,
          apellidos,
          fechaNacimiento,
          sexo,
          telefono,
          direccion,
          email,
          antecedentesMedicosUrl,
          antecedentesOdontologicosUrl,
          fechaRegistro,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // limpiar
      setDni("");
      setNombres("");
      setApellidos("");
      setFechaNacimiento("");
      setSexo("");
      setTelefono("");
      setDireccion("");
      setEmail("");
      setAntecedentesMedicosUrl("");
      setAntecedentesOdontologicosUrl("");
      setFechaRegistro("");

      onSuccess();
    } catch (error) {
      console.error("Error creando paciente:", error.response?.data || error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h3>Crear Paciente</h3>

      <input placeholder="DNI" value={dni} onChange={(e) => setDni(e.target.value)} required />
      <input placeholder="Nombres" value={nombres} onChange={(e) => setNombres(e.target.value)} required />
      <input placeholder="Apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />
      <label>fecha nacimiento</label>
      <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />

      <select value={sexo} onChange={(e) => setSexo(e.target.value)} required>
        <option value="">Sexo</option>
        <option value="M">Masculino</option>
        <option value="F">Femenino</option>
      </select>
      <label>fecha de registro</label>
      <input type="date" value={fechaRegistro} onChange={(e) => setFechaRegistro(e.target.value)} required />
      <input placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
      <input placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

      <input placeholder="URL Antecedentes Médicos" value={antecedentesMedicosUrl} onChange={(e) => setAntecedentesMedicosUrl(e.target.value)} />
      <input placeholder="URL Antecedentes Odontológicos" value={antecedentesOdontologicosUrl} onChange={(e) => setAntecedentesOdontologicosUrl(e.target.value)} />

      <button type="submit">Guardar</button>
    </form>
  );
};

export default PacienteForm;