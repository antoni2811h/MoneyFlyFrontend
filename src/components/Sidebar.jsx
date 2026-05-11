import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar({ activePage, onNuevoGasto, badges = {} }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="sidebar">
      {/* ── Principal ── */}
      <div className="sidebar-section">Principal</div>
      <Link to="/" className={`sidebar-item${activePage === 'dashboard' ? ' active' : ''}`}>
        <i className="ti ti-layout-dashboard"></i>Dashboard
      </Link>
      <Link to="/gastos" className={`sidebar-item${activePage === 'gastos' ? ' active' : ''}`}>
        <i className="ti ti-receipt"></i>Todos los gastos
        {badges.gastos && <span className="sidebar-badge orange">{badges.gastos}</span>}
      </Link>
      <button className="sidebar-item" onClick={onNuevoGasto}>
        <i className="ti ti-plus-circle"></i>Agregar gasto
      </button>

      {/* ── Configuración ── */}
      <div className="sidebar-section">Configuración</div>
      <Link to="/categorias" className={`sidebar-item${activePage === 'categorias' ? ' active' : ''}`}>
        <i className="ti ti-tag"></i>Categorías
        {badges.categorias && <span className="sidebar-badge red">{badges.categorias}</span>}
      </Link>
      <Link to="/medios" className={`sidebar-item${activePage === 'medios' ? ' active' : ''}`}>
        <i className="ti ti-credit-card"></i>Medios de pago
      </Link>
      <Link to="/alertas" className={`sidebar-item${activePage === 'alertas' ? ' active' : ''}`}>
        <i className="ti ti-bell"></i>Alertas
        <span className="sidebar-badge red">1</span>
      </Link>

      {/* ── Cuenta ── */}
      <div className="sidebar-section">Cuenta</div>
      <Link to="/perfil" className={`sidebar-item${activePage === 'perfil' ? ' active' : ''}`}>
        <i className="ti ti-user"></i>Mi perfil
      </Link>
      <Link to="/reportes" className={`sidebar-item${activePage === 'reportes' ? ' active' : ''}`}>
        <i className="ti ti-chart-pie"></i>Reportes
      </Link>
      <Link to="/ajustes" className={`sidebar-item${activePage === 'ajustes' ? ' active' : ''}`}>
        <i className="ti ti-settings"></i>Ajustes
      </Link>

      {/* ── Cerrar sesión (siempre al final) ── */}
      <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0 0 8px 0' }} />
        <button
          className="sidebar-item"
          onClick={handleLogout}
          style={{
            width: '100%',
            textAlign: 'left',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: 'var(--red, #e24b4a)',
          }}
        >
          <i className="ti ti-logout"></i>Cerrar sesión
        </button>
      </div>
    </aside>
  );
}