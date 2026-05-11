import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Modal from '../components/Modal';
import { GASTOS, CATEGORIAS, fmt } from '../data/mockData';

export default function Gastos() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');

  const filtered = GASTOS.filter(g => {
    const matchSearch = g.nombre.toLowerCase().includes(search.toLowerCase()) || g.sub.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter ? g.cat === catFilter : true;
    return matchSearch && matchCat;
  });

  return (
    <AppLayout activePage="gastos" onNuevoGasto={() => setModalOpen(true)}>
      <div className="page-header">
        <div>
          <div className="page-title">Todos los gastos</div>
          <div className="page-subtitle">24 transacciones registradas · Mayo 2025</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary"><i className="ti ti-download"></i>Exportar CSV</button>
          <button className="btn-primary" onClick={() => setModalOpen(true)}>
            <i className="ti ti-plus"></i>Nuevo gasto
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 20 }}>
        <div className="kpi-card">
          <div className="kpi-top"><div className="kpi-icon red"><i className="ti ti-arrow-down-circle"></i></div><span className="kpi-mini-badge down">+8%</span></div>
          <div className="kpi-label">Total gastado</div>
          <div className="kpi-value red">$2.380.000</div>
          <div className="kpi-trend down"><i className="ti ti-calendar"></i>Mayo 2025</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top"><div className="kpi-icon purple"><i className="ti ti-receipt"></i></div><span className="kpi-mini-badge" style={{ background: 'rgba(255,255,255,0.07)', color: 'var(--gray2)' }}>24</span></div>
          <div className="kpi-label">Transacciones</div>
          <div className="kpi-value purple">24</div>
          <div className="kpi-trend" style={{ color: 'var(--gray2)' }}><i className="ti ti-calendar"></i>Este mes</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top"><div className="kpi-icon yellow"><i className="ti ti-calculator"></i></div></div>
          <div className="kpi-label">Promedio por gasto</div>
          <div className="kpi-value yellow">$99.167</div>
          <div className="kpi-trend" style={{ color: 'var(--gray2)' }}><i className="ti ti-math-function"></i>Promedio simple</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top"><div className="kpi-icon blue"><i className="ti ti-tag"></i></div><span className="kpi-mini-badge" style={{ background: 'rgba(255,255,255,0.07)', color: 'var(--gray2)' }}>5</span></div>
          <div className="kpi-label">Categorías activas</div>
          <div className="kpi-value blue">5</div>
          <div className="kpi-trend" style={{ color: 'var(--gray2)' }}><i className="ti ti-folder"></i>Con registros</div>
        </div>
      </div>

      {/* Tab pills */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--card2)', borderRadius: 10, padding: 4, marginBottom: 20, width: 'fit-content' }}>
        {['Todos (24)', 'Gastos (22)', 'Ingresos (2)', 'Pendientes (1)'].map((t, i) => (
          <button key={i} style={{
            padding: '7px 16px', borderRadius: 7, fontSize: 13,
            fontWeight: i === 0 ? 600 : 500,
            color: i === 0 ? '#fff' : 'var(--gray2)',
            background: i === 0 ? 'var(--orange)' : 'none',
            border: 'none', cursor: 'pointer',
          }}>{t}</button>
        ))}
      </div>

      {/* Table */}
      <div className="section-card">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '14px 22px 0', flexWrap: 'wrap', marginBottom: 14 }}>
          <div className="search-box" style={{ flex: 1, maxWidth: 340 }}>
            <i className="ti ti-search"></i>
            <input
              type="text"
              placeholder="Buscar comercio, descripción..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="select-filter" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            <option value="">Todas las categorías</option>
            {CATEGORIAS.map(c => <option key={c.id} value={c.nombre}>{c.emoji} {c.nombre}</option>)}
          </select>
          <button className="filter-btn"><i className="ti ti-calendar"></i>Mayo 2025</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: 28 }}><input type="checkbox" style={{ accentColor: 'var(--orange)', width: 14, height: 14, cursor: 'pointer' }} /></th>
                <th>Comercio / Descripción</th>
                <th>Categoría</th>
                <th>Fecha</th>
                <th>Medio de pago</th>
                <th style={{ textAlign: 'right' }}>Valor</th>
                <th style={{ textAlign: 'center', width: 80 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(g => (
                <tr key={g.id}>
                  <td><input type="checkbox" style={{ accentColor: 'var(--orange)', width: 14, height: 14, cursor: 'pointer' }} /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="tx-row-icon" style={{ background: 'rgba(155,114,247,0.1)' }}>{g.icono}</div>
                      <div>
                        <div className="tx-row-name">{g.nombre}</div>
                        <div className="tx-row-sub">{g.sub}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`badge ${g.catClass}`}>{g.cat}</span></td>
                  <td style={{ color: 'var(--gray2)', fontSize: 12.5, fontWeight: 500 }}>{g.fecha}</td>
                  <td>
                    <div className="medio-tag">
                      <i className={`ti ${g.medioIcon}`}></i>{g.medio}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="amount neg">${fmt(g.valor)}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                      <button className="action-icon-btn" title="Editar"><i className="ti ti-edit"></i></button>
                      <button className="action-icon-btn danger" title="Eliminar"><i className="ti ti-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Registrar gasto"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button className="btn-primary"><i className="ti ti-check"></i>Guardar gasto</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Comercio / Descripción</label>
          <input className="form-input" type="text" placeholder="Ej: Éxito, Netflix, Metro..." />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Valor</label>
            <input className="form-input" type="text" placeholder="$0" />
          </div>
          <div className="form-group">
            <label className="form-label">Fecha</label>
            <input className="form-input" type="date" defaultValue="2025-05-08" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Categoría</label>
          <select className="form-input">
            <option>-- Selecciona --</option>
            {CATEGORIAS.map(c => <option key={c.id}>{c.emoji} {c.nombre}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Medio de pago</label>
          <select className="form-input">
            <option>-- Selecciona --</option>
            <option>Visa •4521</option>
            <option>MC •7890</option>
            <option>Nequi</option>
          </select>
        </div>
      </Modal>
    </AppLayout>
  );
}