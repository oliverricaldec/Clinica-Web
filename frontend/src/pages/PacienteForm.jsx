import { useState } from "react";
import axios from "axios";

const PacienteForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    dni: "",
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    sexo: "",
    telefono: "",
    direccion: "",
    email: "",
    antecedentesMedicosUrl: "",
    antecedentesOdontologicosUrl: "",
    fechaRegistro: "",
  });

  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/pacientes", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({
        dni: "", nombres: "", apellidos: "", fechaNacimiento: "",
        sexo: "", telefono: "", direccion: "", email: "",
        antecedentesMedicosUrl: "", antecedentesOdontologicosUrl: "", fechaRegistro: "",
      });
      onSuccess();
    } catch (error) {
      console.error("Error creando paciente:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-section">
        <div className="form-section-title">Nuevo Paciente</div>

        {/* PERSONAL */}
        <div style={{ marginBottom: "8px", fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "DM Mono, monospace", marginBottom: "12px" }}>
          Datos personales
        </div>
        <div className="form-grid" style={{ marginBottom: "20px" }}>
          <div className="form-group">
            <label className="form-label">DNI *</label>
            <input className="form-input" placeholder="12345678" value={form.dni} onChange={set("dni")} required />
          </div>
          <div className="form-group">
            <label className="form-label">Nombres *</label>
            <input className="form-input" placeholder="Juan Carlos" value={form.nombres} onChange={set("nombres")} required />
          </div>
          <div className="form-group">
            <label className="form-label">Apellidos *</label>
            <input className="form-input" placeholder="Pérez García" value={form.apellidos} onChange={set("apellidos")} required />
          </div>
          <div className="form-group">
            <label className="form-label">Fecha Nacimiento *</label>
            <input className="form-input" type="date" value={form.fechaNacimiento} onChange={set("fechaNacimiento")} required />
          </div>
          <div className="form-group">
            <label className="form-label">Sexo *</label>
            <select className="form-input" value={form.sexo} onChange={set("sexo")} required>
              <option value="">Seleccionar</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Fecha de Registro *</label>
            <input className="form-input" type="date" value={form.fechaRegistro} onChange={set("fechaRegistro")} required />
          </div>
        </div>

        {/* CONTACTO */}
        <div style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "DM Mono, monospace", marginBottom: "12px" }}>
          Contacto
        </div>
        <div className="form-grid" style={{ marginBottom: "20px" }}>
          <div className="form-group">
            <label className="form-label">Teléfono *</label>
            <input className="form-input" placeholder="987654321" value={form.telefono} onChange={set("telefono")} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={set("email")} />
          </div>
          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label className="form-label">Dirección</label>
            <input className="form-input" placeholder="Av. Principal 123" value={form.direccion} onChange={set("direccion")} />
          </div>
        </div>

        {/* ANTECEDENTES */}
        <div style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "DM Mono, monospace", marginBottom: "12px" }}>
          Antecedentes (URL)
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Médicos</label>
            <input className="form-input" placeholder="https://..." value={form.antecedentesMedicosUrl} onChange={set("antecedentesMedicosUrl")} />
          </div>
          <div className="form-group">
            <label className="form-label">Odontológicos</label>
            <input className="form-input" placeholder="https://..." value={form.antecedentesOdontologicosUrl} onChange={set("antecedentesOdontologicosUrl")} />
          </div>
        </div>

        <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Guardando..." : "✓ Guardar Paciente"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PacienteForm;
