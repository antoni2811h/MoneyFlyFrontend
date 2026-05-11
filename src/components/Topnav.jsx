import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Topnav({ activePage }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
    setMenuOpen(false);
  };

  // Iniciales del usuario para el avatar pill
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const links = [
    { to: '/',           icon: 'ti-layout-dashboard', label: 'Dashboard',      key: 'dashboard' },
    { to: '/gastos',     icon: 'ti-receipt',           label: 'Gastos',         key: 'gastos' },
    { to: '/categorias', icon: 'ti-tag',               label: 'Categorías',     key: 'categorias' },
    { to: '/medios',     icon: 'ti-credit-card',       label: 'Medios de pago', key: 'medios' },
    { to: '/reportes',   icon: 'ti-chart-bar',         label: 'Reportes',       key: 'reportes' },
    { to: '/perfil',     icon: 'ti-user',              label: 'Perfil',         key: 'perfil' },
  ];

  return (
    <nav className="topnav">
      {/* Brand */}
      <div className="brand">
        <div className="brand-logo-wrap">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dycZkebkXSmjYcDAoiW0c6EQyppp8K.png"
            alt="MoneyFly Logo"
          />
        </div>
        <div className="brand-text">
          <div className="brand-name">MoneyFly</div>
          <div className="brand-sub">Gastos Hormiga</div>
        </div>
      </div>

      {/* Links de navegación — desktop */}
      <div className="nav-links">
        {links.map((l) => (
          <Link
            key={l.key}
            to={l.to}
            className={`nav-link${activePage === l.key ? ' active' : ''}`}
          >
            <i className={`ti ${l.icon}`}></i>{l.label}
          </Link>
        ))}
      </div>

      {/* Zona derecha */}
      <div className="nav-right">
        {/* Notificaciones */}
        <Link to="/alertas">
          <button className="icon-btn" aria-label="Alertas"
            style={{ color: activePage === 'alertas' ? 'var(--blue)' : undefined }}>
            <i className="ti ti-bell"></i>
            <div className="notif-dot"></div>
          </button>
        </Link>

        {/* Ajustes */}
        <Link to="/ajustes">
          <button className="icon-btn" aria-label="Ajustes"
            style={{ color: activePage === 'ajustes' ? 'var(--blue)' : undefined }}>
            <i className="ti ti-settings"></i>
          </button>
        </Link>

        {/* Usuario + dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="user-pill"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú de usuario"
          >
            <div className="user-avatar">{initials}</div>
            <span className="user-name">{user?.name ?? 'Usuario'}</span>
            <i className="ti ti-chevron-down" style={{ fontSize: 13, color: 'var(--gray)', marginLeft: 2 }}></i>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                background: 'var(--white)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                minWidth: 180,
                zIndex: 999,
                overflow: 'hidden',
              }}
            >
              <Link
                to="/perfil"
                className="sidebar-item"
                onClick={() => setMenuOpen(false)}
                style={{ borderRadius: 0 }}
              >
                <i className="ti ti-user"></i>Mi perfil
              </Link>
              <Link
                to="/ajustes"
                className="sidebar-item"
                onClick={() => setMenuOpen(false)}
                style={{ borderRadius: 0 }}
              >
                <i className="ti ti-settings"></i>Ajustes
              </Link>
              <hr style={{ margin: 0, border: 'none', borderTop: '1px solid var(--border)' }} />
              <button
                onClick={handleLogout}
                className="sidebar-item"
                style={{
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: 'var(--red, #e24b4a)',
                  borderRadius: 0,
                }}
              >
                <i className="ti ti-logout"></i>Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}