import AppLayout from '../components/AppLayout';

export default function Reportes() {
  return (
    <AppLayout activePage="reportes">
      <div className="page-header">
        <div>
          <div className="page-title">Reportes</div>
          <div className="page-subtitle">Análisis financiero · Enero — Mayo 2025</div>
        </div>
        <button className="btn-secondary"><i className="ti ti-download"></i>Exportar PDF</button>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 24 }}>
        <div className="kpi-card">
          <div className="kpi-top"><div className="kpi-icon green"><i className="ti ti-arrow-up-circle"></i></div><span className="kpi-mini-badge">+5%</span></div>
          <div className="kpi-label">Total ingresos</div>
          <div className="kpi-value green">$28.500.000</div>
          <div className="kpi-trend up"><i className="ti ti-trending-up"></i>Acumulado 2025</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top"><div className="kpi-icon red"><i className="ti ti-arrow-down-circle"></i></div><span className="kpi-mini-badge down">+3%</span></div>
          <div className="kpi-label">Total gastos</div>
          <div className="kpi-value red">$11.240.000</div>
          <div className="kpi-trend down"><i className="ti ti-trending-up"></i>Acumulado 2025</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top"><div className="kpi-icon yellow"><i className="ti ti-piggy-bank"></i></div><span className="kpi-mini-badge">60%</span></div>
          <div className="kpi-label">Ahorro neto</div>
          <div className="kpi-value yellow">$17.260.000</div>
          <div className="kpi-trend up"><i className="ti ti-trending-up"></i>Acumulado 2025</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top"><div className="kpi-icon blue"><i className="ti ti-chart-line"></i></div></div>
          <div className="kpi-label">Tasa de ahorro</div>
          <div className="kpi-value blue">60,6%</div>
          <div className="kpi-trend up"><i className="ti ti-trending-up"></i>Promedio mensual</div>
        </div>
      </div>

      {/* Chart placeholder */}
      <div className="section-card" style={{ marginBottom: 20 }}>
        <div className="section-head"><h2>Gastos mensuales</h2><a href="#">Detalle</a></div>
        <div style={{ padding: '18px 22px' }}>
          {/* Simple bar chart with inline styles */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 160, padding: '10px 0' }}>
            {[
              { mes: 'Ene', val: 1800000, max: 3000000 },
              { mes: 'Feb', val: 2100000, max: 3000000 },
              { mes: 'Mar', val: 1600000, max: 3000000 },
              { mes: 'Abr', val: 2400000, max: 3000000 },
              { mes: 'May', val: 2850000, max: 3000000 },
            ].map(b => (
              <div key={b.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 11, color: 'var(--gray2)', fontWeight: 600 }}>
                  ${(b.val / 1000000).toFixed(1)}M
                </div>
                <div style={{
                  width: '100%', borderRadius: '6px 6px 0 0',
                  height: `${(b.val / b.max) * 120}px`,
                  background: b.mes === 'May'
                    ? 'linear-gradient(180deg, var(--orange), rgba(255,122,61,0.4))'
                    : 'linear-gradient(180deg, var(--blue), rgba(79,142,247,0.3))',
                  transition: 'all 0.3s',
                }}></div>
                <div style={{ fontSize: 12, color: 'var(--gray)', fontWeight: 500 }}>{b.mes}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gastos por categoría */}
      <div className="section-card">
        <div className="section-head"><h2>Distribución por categoría</h2></div>
        <div style={{ padding: '14px 22px' }}>
          {[
            { nombre: 'Comida', emoji: '🍔', pct: 38, color: 'var(--orange)' },
            { nombre: 'Mercado', emoji: '🛒', pct: 28, color: 'var(--yellow)' },
            { nombre: 'Entretenimiento', emoji: '🎮', pct: 20, color: 'var(--purple)' },
            { nombre: 'Transporte', emoji: '🚗', pct: 9, color: 'var(--blue)' },
            { nombre: 'Salud', emoji: '💊', pct: 5, color: 'var(--green)' },
          ].map(c => (
            <div key={c.nombre} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                <span>{c.emoji} {c.nombre}</span>
                <span style={{ fontWeight: 700, color: c.color }}>{c.pct}%</span>
              </div>
              <div className="bar-bg">
                <div style={{ height: '100%', borderRadius: 3, background: c.color, width: `${c.pct}%`, transition: 'width 1s ease' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}