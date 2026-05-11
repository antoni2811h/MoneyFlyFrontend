import { useContext } from 'react';
import AppLayout from '../components/AppLayout';
import { AuthContext } from '../context/AuthContext';

export default function Perfil() {
  const { user } = useContext(AuthContext);

  // Iniciales para el avatar
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  // Datos personales desde el contexto, con fallbacks
  const infoRows = [
    { label: 'Nombres',            value: user?.name      || '—', icon: 'ti-user' },
    { label: 'Correo electrónico', value: user?.email     || '—', icon: 'ti-mail' },
    { label: 'Teléfono',           value: user?.telefono  || '—', icon: 'ti-phone' },
    { label: 'Documento',          value: user?.documento ? `${user.tipoDoc} · ${user.documento}` : '—', icon: 'ti-id-badge' },
    { label: 'Ocupación',          value: user?.ocupacion || '—', icon: 'ti-briefcase' },
  ];

  return (
    <AppLayout activePage="perfil">
      <div className="page-header">
        <div>
          <div className="page-title">Mi perfil</div>
          <div className="page-subtitle">Gestiona tu información personal</div>
        </div>
        <button className="btn-primary"><i className="ti ti-edit"></i>Editar perfil</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20 }}>

        {/* Avatar card */}
        <div style={{
          background: 'var(--card)', borderRadius: 'var(--radius)',
          border: '1px solid var(--border)', padding: 24, textAlign: 'center',
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', margin: '0 auto 14px',
            background: 'linear-gradient(135deg, var(--blue), var(--purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#fff',
          }}>
            {initials}
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 800, marginBottom: 4 }}>
            {user?.name || 'Usuario'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--gray2)', marginBottom: 16 }}>
            {user?.email || ''}
          </div>
          <span className="badge green">Cuenta activa</span>

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            {[
              { label: 'Miembro desde', value: user?.createdAt || 'Enero 2025' },
              { label: 'Gastos registrados', value: user?.totalGastos ?? '—' },
              { label: 'Categorías', value: user?.totalCategorias ?? '—' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 12 }}>
                <span style={{ color: 'var(--gray)' }}>{s.label}</span>
                <span style={{ fontWeight: 600 }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Información personal */}
          <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7 }}>
              <i className="ti ti-user"></i>Información personal
            </div>
            <div style={{ padding: '6px 0' }}>
              {infoRows.map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: 12, color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className={`ti ${r.icon}`}></i>{r.label}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen financiero — datos estáticos por ahora, conectar a API */}
          <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7 }}>
              <i className="ti ti-chart-pie"></i>Resumen financiero
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
              {[
                { label: 'Gasto este mes',   value: '$2.850.400',  color: 'var(--orange)' },
                { label: 'Ahorro acumulado', value: '$17.260.000', color: 'var(--green)' },
                { label: 'Tasa de ahorro',   value: '60.6%',       color: 'var(--blue)' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '18px 20px', borderRight: i < 2 ? '1px solid var(--border)' : 'none', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--gray)', marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}