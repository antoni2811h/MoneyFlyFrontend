import { useState } from 'react';
import AppLayout from '../components/AppLayout';

const ALERTAS_INIT = [
  { id: 1, type: 'error', icon: 'ti-alert-triangle', title: '⚠️ Límite excedido', desc: 'Has superado el límite mensual de 🍔 Comida (130%)', time: 'Hace 2 horas' },
  { id: 2, type: 'warn',  icon: 'ti-alert-circle',   title: '🎮 Acercándose al límite', desc: 'Entretenimiento: 85% del límite mensual', time: 'Ayer' },
  { id: 3, type: 'info',  icon: 'ti-info-circle',    title: '✓ Transacción confirmada', desc: 'Visa MasterCard · $87.400 en Éxito', time: '14 de mayo' },
];

const CONFIG_ALERTAS = [
  { icon: 'ti-alert-triangle', title: 'Límite excedido',       desc: 'Notificación cuando superes un límite', channels: ['Email', 'Push', 'SMS'],    active: ['Email'] },
  { icon: 'ti-alert-circle',   title: 'Acercándose al límite', desc: 'Notificación al 80% del límite',         channels: ['Email', 'Push'],           active: ['Email'] },
  { icon: 'ti-circle-check',   title: 'Resumen diario',        desc: 'Resumen de gastos del día',              channels: ['Email'],                   active: ['Email'] },
  { icon: 'ti-receipt',        title: 'Transacciones',         desc: 'Confirmación de cada transacción',       channels: ['Email', 'Push'],           active: [] },
];

const channelIcons = { Email: 'ti-mail', Push: 'ti-bell', SMS: 'ti-message-circle' };

export default function Alertas() {
  const [alertas, setAlertas] = useState(ALERTAS_INIT);

  const dismiss = (id) => setAlertas(a => a.filter(x => x.id !== id));

  return (
    <AppLayout activePage="alertas">
      <div className="page-header">
        <div>
          <div className="page-title">Alertas</div>
          <div className="page-subtitle">Gestiona tus notificaciones y límites de gasto</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary"><i className="ti ti-refresh"></i>Actualizar</button>
          <button className="btn-ghost"><i className="ti ti-check"></i>Marcar como leído</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
        {/* Alertas activas */}
        <div>
          <div style={{ marginBottom: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray)' }}>ALERTAS ACTIVAS</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {alertas.map(a => (
              <div key={a.id} style={{
                background: 'var(--card)', borderRadius: 'var(--radius)',
                border: '1px solid var(--border)', padding: '18px 20px',
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                  background: a.type === 'error' ? 'rgba(248,113,113,0.15)' : a.type === 'warn' ? 'rgba(255,190,61,0.15)' : 'rgba(79,142,247,0.15)',
                  color: a.type === 'error' ? 'var(--red)' : a.type === 'warn' ? 'var(--yellow)' : 'var(--blue)',
                }}>
                  <i className={`ti ${a.icon}`}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray2)', marginTop: 2 }}>{a.desc}</div>
                  <div style={{ fontSize: 10, color: 'var(--gray)', marginTop: 6 }}>{a.time}</div>
                </div>
                <button onClick={() => dismiss(a.id)} style={{
                  width: 24, height: 24, borderRadius: 6, background: 'transparent',
                  border: 'none', color: 'var(--gray)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 12, cursor: 'pointer', flexShrink: 0,
                }}>
                  <i className="ti ti-x"></i>
                </button>
              </div>
            ))}
            {alertas.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--gray2)', fontSize: 13 }}>
                <i className="ti ti-check" style={{ fontSize: 32, display: 'block', marginBottom: 8, color: 'var(--green)' }}></i>
                Sin alertas activas
              </div>
            )}
          </div>
        </div>

        {/* Configuración */}
        <div>
          <div style={{ marginBottom: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray)' }}>CONFIGURACIÓN DE ALERTAS</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CONFIG_ALERTAS.map((cfg, i) => (
              <div key={i} style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '18px 20px' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <i className={`ti ${cfg.icon}`}></i>{cfg.title}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--gray2)', marginBottom: 10 }}>{cfg.desc}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {cfg.channels.map(ch => (
                    <div key={ch} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '7px 12px',
                      background: cfg.active.includes(ch) ? 'var(--blue)' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${cfg.active.includes(ch) ? 'var(--blue)' : 'var(--border)'}`,
                      borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                      color: cfg.active.includes(ch) ? '#fff' : 'var(--gray2)',
                    }}>
                      <i className={`ti ${channelIcons[ch]}`}></i>{ch}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}