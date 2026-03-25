import { useNavigate, useLocation } from "react-router-dom";

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
        <div className="sidebar-logo-icon">🦷</div>
        <div>
          <div className="sidebar-logo-text">DentaFlow</div>
          <div className="sidebar-logo-sub">Sistema Clínico</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`sidebar-item ${isActive("/pacientes") ? "active" : ""}`}
          onClick={() => navigate("/pacientes")}
        >
          <span>👥</span> Pacientes
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
