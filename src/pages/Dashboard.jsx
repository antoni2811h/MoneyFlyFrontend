import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Modal from '../components/Modal';
import { GASTOS, CATEGORIAS, MEDIOS, fmt, pctBadgeClass } from '../data/mockData';

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <AppLayout activePage="dashboard" onNuevoGasto={() => setModalOpen(true)}>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Resumen de tus gastos de este mes</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary"><i className="ti ti-filter"></i>Filtrar por mes</button>
          <button className="btn-primary" onClick={() => setModalOpen(true)}>
            <i className="ti ti-plus"></i>Nuevo gasto
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon blue"><i className="ti ti-cash"></i></div>
            <span className="kpi-mini-badge">+12%</span>
          </div>
          <div className="kpi-label">Saldo disponible</div>
          <div className="kpi-value blue">$16.200.000</div>
          <div className="kpi-trend up"><i className="ti ti-trending-up"></i>Última actualización hoy</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon orange"><i className="ti ti-receipt"></i></div>
            <span className="kpi-mini-badge red">+8%</span>
          </div>
          <div className="kpi-label">Gasto del mes</div>
          <div className="kpi-value orange">$2.850.400</div>
          <div className="kpi-trend up"><i className="ti ti-trending-up"></i>Comparado con mes anterior</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon green"><i className="ti ti-piggy-bank"></i></div>
            <span className="kpi-mini-badge">65%</span>
          </div>
          <div className="kpi-label">Límite de categorías</div>
          <div className="kpi-value green">3 alertas</div>
          <div className="kpi-trend down"><i className="ti ti-alert-triangle"></i>🍔 Comida al 130%</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon red"><i className="ti ti-alert-circle"></i></div>
          </div>
          <div className="kpi-label">Recomendaciones</div>
          <div className="kpi-value red">2 nuevas</div>
          <div className="kpi-trend"><i className="ti ti-info-circle"></i>Revisa tus ajustes</div>
        </div>
      </div>

      {/* Gastos recientes */}
      <div className="section-card" style={{ marginBottom: 24 }}>
        <div className="section-head">
          <h2>Gastos recientes</h2>
          <Link to="/gastos">Ver todo</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="gasto-table">
            <thead>
              <tr>
                <th>Concepto</th>
                <th>Categoría</th>
                <th>Medio de pago</th>
                <th>Fecha</th>
                <th className="text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {GASTOS.slice(0, 5).map(g => (
                <tr key={g.id}>
                  <td><strong>{g.nombre}</strong></td>
                  <td><span className={`badge ${g.catClass}`}>{g.cat}</span></td>
                  <td><span style={{ fontSize: 11, color: 'var(--gray)' }}>{g.icono} {g.medio}</span></td>
                  <td><span style={{ fontSize: 11, color: 'var(--gray)' }}>{g.fecha}</span></td>
                  <td className="text-right" style={{ color: 'var(--orange)', fontWeight: 700, fontSize: 13 }}>
                    ${fmt(g.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Categorías y medios */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="section-card">
          <div className="section-head">
            <h2>Categorías</h2>
            <Link to="/categorias">Administrar</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {CATEGORIAS.slice(0, 3).map(c => (
              <div key={c.id} style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', fontSize: 12.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{c.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{c.nombre}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray)' }}>${c.gasto.toLocaleString('es-CO')}</div>
                  </div>
                </div>
                <span className={`badge ${pctBadgeClass(c.pct)}`}>{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card">
          <div className="section-head">
            <h2>Medios de pago</h2>
            <Link to="/medios">Todos</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {MEDIOS.slice(0, 3).map(m => (
              <div key={m.id} style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                  <span style={{ fontWeight: 800, minWidth: 40, textTransform: 'uppercase', fontSize: 10, color: 'var(--gray)' }}>{m.franq}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{m.nombre}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray)' }}>•••• {m.num.slice(-4)}</div>
                  </div>
                </div>
                <span className={`badge ${m.activo ? 'green' : 'gray'}`}>{m.activo ? 'Activo' : 'Inactivo'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Gasto */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Registrar gasto"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button className="btn-primary"><i className="ti ti-check"></i>Registrar gasto</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Valor</label>
          <input className="form-input" type="number" placeholder="$0" />
        </div>
        <div className="form-group">
          <label className="form-label">Concepto</label>
          <input className="form-input" type="text" placeholder="¿Qué compraste?" />
        </div>
        <div className="form-group">
          <label className="form-label">Categoría</label>
          <select className="form-input">
            <option>-- Selecciona categoría --</option>
            {CATEGORIAS.map(c => <option key={c.id}>{c.emoji} {c.nombre}</option>)}
          </select>
        </div>
      </Modal>
    </AppLayout>
  );
}