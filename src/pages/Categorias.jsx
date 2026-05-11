import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Modal from '../components/Modal';
import { CATEGORIAS, pctClass, pctBadgeClass } from '../data/mockData';

export default function Categorias() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <AppLayout activePage="categorias">
      <div className="page-header">
        <div>
          <div className="page-title">Categorías</div>
          <div className="page-subtitle">Gestiona tus categorías y límites de gasto</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost"><i className="ti ti-adjustments-horizontal"></i>Ordenar</button>
          <button className="btn-primary" onClick={() => setModalOpen(true)}>
            <i className="ti ti-plus"></i>Nueva categoría
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14, marginBottom: 24 }}>
        {CATEGORIAS.map(c => {
          const cls = pctClass(c.pct);
          const badge = pctBadgeClass(c.pct);
          return (
            <div key={c.id} style={{
              background: 'var(--card)', borderRadius: 'var(--radius)',
              border: '1px solid var(--border)', padding: 20,
              transition: 'all 0.25s', position: 'relative', overflow: 'hidden',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--border2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: c.colorHex, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {c.emoji}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="action-icon-btn" title="Editar"><i className="ti ti-edit"></i></button>
                  <button className="action-icon-btn danger" title="Eliminar"><i className="ti ti-trash"></i></button>
                </div>
              </div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 3 }}>{c.nombre}</div>
              <div style={{ fontSize: 12, color: 'var(--gray2)', marginBottom: 14 }}>{c.desc}</div>
              <div className="bar-bg">
                <div className={`bar-fill ${cls}`} style={{ width: `${Math.min(c.pct, 100)}%` }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--gray)', marginTop: 4 }}>
                <span>${c.gasto.toLocaleString('es-CO')}</span>
                <span className={`badge ${badge}`} style={{ fontSize: 11.5, fontWeight: 700 }}>{c.pct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nueva categoría"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button className="btn-primary"><i className="ti ti-check"></i>Crear categoría</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Nombre</label>
          <input className="form-input" type="text" placeholder="Ej: Educación, Mascota..." />
        </div>
        <div className="form-group">
          <label className="form-label">Descripción</label>
          <input className="form-input" type="text" placeholder="Breve descripción..." />
        </div>
        <div className="form-group">
          <label className="form-label">Emoji / Ícono</label>
          <input className="form-input" type="text" placeholder="🎓" />
        </div>
        <div className="form-group">
          <label className="form-label">Límite mensual (COP)</label>
          <input className="form-input" type="number" placeholder="500000" />
        </div>
      </Modal>
    </AppLayout>
  );
}