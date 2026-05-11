import { useState } from 'react';
import AppLayout from '../components/AppLayout';

const TABS = [
  { key: 'general',       icon: 'ti-settings', label: 'General' },
  { key: 'privacy',       icon: 'ti-shield',   label: 'Privacidad' },
  { key: 'notifications', icon: 'ti-bell',     label: 'Notificaciones' },
  { key: 'appearance',    icon: 'ti-palette',  label: 'Apariencia' },
];

function Toggle({ on }) {
  const [active, setActive] = useState(on);
  return (
    <div className={`toggle${active ? ' on' : ''}`} onClick={() => setActive(!active)}>
      <div className="toggle-circle"></div>
    </div>
  );
}

export default function Ajustes() {
  const [tab, setTab] = useState('general');

  return (
    <AppLayout activePage="ajustes">
      <div className="page-header">
        <div>
          <div className="page-title">Ajustes</div>
          <div className="page-subtitle">Personaliza tu experiencia en MoneyFly</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Nav */}
        <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          {TABS.map(t => (
            <div key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '12px 14px', fontSize: 12.5, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                transition: 'all 0.2s',
                borderLeft: `3px solid ${tab === t.key ? 'var(--blue)' : 'transparent'}`,
                color: tab === t.key ? 'var(--white)' : 'var(--gray2)',
                background: tab === t.key ? 'var(--blue)' : 'transparent',
              }}
            >
              <i className={`ti ${t.icon}`}></i>{t.label}
            </div>
          ))}
        </div>

        {/* Panel */}
        <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>

          {tab === 'general' && (
            <>
              <Section title="Localización" icon="ti-globe">
                <SettingsRow label="Idioma" value="Español (Colombia)" />
                <SettingsRow label="Moneda" value="Pesos Colombianos (COP)" />
              </Section>
              <Section title="Preferencias" icon="ti-calendar">
                <SettingsRow label="Primer día de la semana" value="Lunes" />
              </Section>
            </>
          )}

          {tab === 'privacy' && (
            <>
              <Section title="Seguridad" icon="ti-key">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>Contraseña</div>
                    <div style={{ fontSize: 12, color: 'var(--gray2)' }}>Última actualización hace 3 meses</div>
                  </div>
                  <button className="btn-secondary" style={{ fontSize: 11 }}><i className="ti ti-edit"></i>Cambiar</button>
                </div>
              </Section>
              <Section title="Autenticación de dos factores" icon="ti-lock">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>2FA</div>
                    <div style={{ fontSize: 12, color: 'var(--gray2)' }}>Deshabilitada</div>
                  </div>
                  <button className="btn-primary" style={{ fontSize: 11 }}>Habilitar</button>
                </div>
              </Section>
            </>
          )}

          {tab === 'notifications' && (
            <>
              <Section title="Email" icon="ti-mail">
                <ToggleRow label="Resumen semanal" on={true} />
                <ToggleRow label="Alertas de limite" on={true} />
              </Section>
              <Section title="Push" icon="ti-device-mobile">
                <ToggleRow label="Transacciones importantes" on={true} />
                <ToggleRow label="Nuevas alertas" on={false} />
              </Section>
            </>
          )}

          {tab === 'appearance' && (
            <>
              <Section title="Tema" icon="ti-palette">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>Tema oscuro</div>
                    <div style={{ fontSize: 12, color: 'var(--gray2)' }}>Actual</div>
                  </div>
                  <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 600, color: 'var(--blue)' }}>Activo</span>
                </div>
              </Section>
              <Section title="Colores principales" icon="ti-brush">
                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                  {[
                    'linear-gradient(135deg,#3B82F6,#1E40AF)',
                    'linear-gradient(135deg,#8B5CF6,#5B21B6)',
                    'linear-gradient(135deg,#EC4899,#9F1239)',
                    'linear-gradient(135deg,#06B6D4,#0E7490)',
                  ].map((bg, i) => (
                    <div key={i} style={{
                      width: 32, height: 32, borderRadius: 10, background: bg, cursor: 'pointer',
                      border: i === 0 ? '2px solid var(--white)' : '2px solid transparent',
                      boxShadow: i === 0 ? '0 0 0 3px rgba(255,255,255,0.1)' : 'none',
                      transition: 'all 0.2s',
                    }}></div>
                  ))}
                </div>
              </Section>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={{ padding: 22, borderBottom: '1px solid var(--border)' }}>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 7 }}>
        <i className={`ti ${icon}`}></i>{title}
      </div>
      {children}
    </div>
  );
}

function SettingsRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--gray2)' }}>{value}</div>
      </div>
      <button className="btn-ghost" style={{ fontSize: 11 }}><i className="ti ti-chevron-right"></i></button>
    </div>
  );
}

function ToggleRow({ label, on }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
      <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
      <Toggle on={on} />
    </div>
  );
}