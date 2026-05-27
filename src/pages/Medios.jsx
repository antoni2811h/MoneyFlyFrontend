import { useState, useContext } from 'react';
import AppLayout from '../components/AppLayout';
import Modal from '../components/Modal';
import { MEDIOS } from '../data/mockData';
import { AuthContext } from '../context/AuthContext';

const cardStyles = {
  'visa-card': 'linear-gradient(135deg,#1a2f5e 0%,#2563a8 60%,#3b82f6 100%)',
  'mc-card':   'linear-gradient(135deg,#4a1a0a 0%,#b45309 60%,#f59e0b 100%)',
  'pse-card':  'linear-gradient(135deg,#0a3d2e 0%,#065f46 60%,#10b981 100%)',
};

export default function Medios() {
  const [modalOpen, setModalOpen] = useState(false);

  // ✅ CORRECCIÓN: obtener el nombre del usuario logueado desde el contexto
  const { user } = useContext(AuthContext);
  const nombreTitular = user?.name || 'Usuario';

  return (
    <AppLayout activePage="medios">
      <div className="page-header">
        <div>
          <div className="page-title">Medios de pago</div>
          <div className="page-subtitle">4 medios vinculados · 3 activos</div>
        </div>
        <button className="btn-primary" onClick={() => setModalOpen(true)}>
          <i className="ti ti-plus"></i>Vincular medio
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14, marginBottom: 24 }}>
        {MEDIOS.map(m => (
          <div key={m.id}>
            {/* Card Visual */}
            <div style={{
              background: cardStyles[m.clase] || cardStyles['visa-card'],
              borderRadius: 16, padding: 22, position: 'relative', overflow: 'hidden',
              aspectRatio: '1.6/1', display: 'flex', flexDirection: 'column',
              justifyContent: 'space-between', marginBottom: 12,
              transition: 'transform 0.25s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 38, height: 28, borderRadius: 6, background: 'linear-gradient(135deg,#d4af37,#f5e066)', opacity: 0.9 }}></div>
                {!m.activo && (
                  <span style={{ background: 'rgba(248,113,113,0.25)', color: '#FCA5A5', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 5 }}>INACTIVO</span>
                )}
              </div>

              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.9)' }}>
                {m.num}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, color: 'rgba(255,255,255,0.7)' }}>TITULAR</div>
                  {/* ✅ CORRECCIÓN: muestra el nombre del usuario logueado en lugar del hardcodeado */}
                  <div style={{ fontSize: 13, color: '#fff', letterSpacing: 0.5, marginTop: 2, fontWeight: 600 }}>
                    {nombreTitular}
                  </div>
                </div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, color: 'rgba(255,255,255,0.85)' }}>{m.franq}</div>
              </div>
            </div>

            {/* Info Panel */}
            <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              {[
                { icon: 'ti-building-bank', label: 'Banco',   value: m.banco  },
                { icon: 'ti-credit-card',   label: 'Nombre',  value: m.nombre },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 18px', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: 7 }}>
                    <i className={`ti ${row.icon}`}></i>{row.label}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 18px' }}>
                <span style={{ fontSize: 12, color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: 7 }}>
                  <i className="ti ti-circle-dot"></i>Estado
                </span>
                <span className={`badge ${m.activo ? 'green' : 'gray'}`}>{m.activo ? 'Activo' : 'Inactivo'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Vincular medio de pago"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button className="btn-primary"><i className="ti ti-link"></i>Vincular</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Nombre del banco / entidad</label>
          <input className="form-input" type="text" placeholder="Ej: Bancolombia, Nequi..." />
        </div>
        <div className="form-group">
          <label className="form-label">Número de tarjeta</label>
          <input className="form-input" type="text" placeholder="•••• •••• •••• 0000" />
        </div>
        <div className="form-group">
          <label className="form-label">Franquicia</label>
          <select className="form-input">
            <option>VISA</option>
            <option>MC</option>
            <option>PSE</option>
          </select>
        </div>
      </Modal>
    </AppLayout>
  );
}