import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0F1720', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#F8FAFC',
      padding: '2rem',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{
          fontSize: 96, fontWeight: 800, fontFamily: 'Syne, sans-serif',
          background: 'linear-gradient(135deg, #FF7A3D, #3B82F6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          lineHeight: 1, marginBottom: 16,
        }}>
          404
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 10 }}>Página no encontrada</h2>
        <p style={{ color: '#94A3B8', marginBottom: 32 }}>
          La página que buscas no existe o fue movida.
        </p>
        <Link to="/">
          <button style={{
            background: '#FF7A3D', color: '#fff', border: 'none',
            padding: '12px 28px', borderRadius: 10, fontSize: '1rem',
            fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            <i className="ti ti-home"></i>Volver al Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}