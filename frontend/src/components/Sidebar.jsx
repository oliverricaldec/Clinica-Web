import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <img src={logo} alt="Logo" className="sidebar-logo-img" />
        </div>
        <div style={{textAlign: "center"}}>
          <div className="sidebar-logo-text">¿Que haremos hoy?</div>
          <div className="sidebar-logo-sub">Sistema Clínico</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`sidebar-item ${isActive("/pacientes") ? "active" : ""}`}
          onClick={() => navigate("/pacientes")}
        >
          <span>👤</span> Pacientes
        </button>
        
        {/* NUEVO ITEM */}
        <button
          className={`sidebar-item ${isActive("/calendario") ? "active" : ""}`}
          onClick={() => navigate("/calendario")}
        >
          <span>📅</span> Calendario
        </button>
      </nav>

      <div className="sidebar-bottom">
        <button className="sidebar-item" onClick={handleLogout}>
          <span>🚪</span> Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;