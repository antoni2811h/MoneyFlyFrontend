import { useState, useEffect, useContext } from 'react';
import AppLayout from '../components/AppLayout';
import Modal from '../components/Modal';
import { AuthContext } from '../context/AuthContext';
import { gastosApi } from '../services/api';

import lineasMayores50    from '../assets/graficos/lineas_mayores_50.png';
import barrasTipoDoc      from '../assets/graficos/barras_tipoDocumento.png';
import tortaTipoDoc       from '../assets/graficos/torta_tipoDocumento.png';
import lineasComercioTec  from '../assets/graficos/lineas_comercio_tecnologico.png';
import barrasComercioUbic from '../assets/graficos/barras_comercio_ubicacion.png';
import mapaCalor          from '../assets/graficos/calor_sector_ubicacion.png';

// ✅ "comercio" en minuscula — coincide con Gastos.java
const FORM_INICIAL = {
  descripcion: '', valor: '', fecha: '', comercio: '',
  medioPago: '', ubicacion: '', imagen: '', maximo: '', minimo: '',
};

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const [totalUsuarios,  setTotalUsuarios]  = useState(null);
  const [totalComercios, setTotalComercios] = useState(null);
  const [gruposEdad,     setGruposEdad]     = useState(null);

  const [modalOpen,  setModalOpen]  = useState(false);
  const [form,       setForm]       = useState(FORM_INICIAL);
  const [guardando,  setGuardando]  = useState(false);
  const [msgGuardar, setMsgGuardar] = useState('');

  useEffect(() => {
    fetch('/resultados/usuarios_por_tipo_doc.json')
      .then(r => r.json())
      .then(data => setTotalUsuarios(data.reduce((acc, d) => acc + (d.cantidad || 0), 0)))
      .catch(() => setTotalUsuarios(50));

    fetch('/resultados/comercios_alto_gasto.json')
      .then(r => r.json())
      .then(data => setTotalComercios(data.reduce((acc, d) => acc + (d.conteo || 0), 0)))
      .catch(() => setTotalComercios(32));

    fetch('/resultados/usuarios_por_grupo_edad.json')
      .then(r => r.json())
      .then(data => setGruposEdad(data.length))
      .catch(() => setGruposEdad(4));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMsgGuardar('');
  };

  const handleGuardar = async () => {
    if (!form.descripcion || !form.valor || !form.fecha) {
      setMsgGuardar('Descripcion, valor y fecha son obligatorios.');
      return;
    }
    if (!user?.id) {
      setMsgGuardar('No hay sesion activa. Inicia sesion nuevamente.');
      return;
    }
    setGuardando(true);
    setMsgGuardar('');

    // ✅ Todos los campos en minuscula — coinciden exactamente con Gastos.java
    const payload = {
      descripcion: form.descripcion,
      valor:       parseInt(form.valor, 10) || 0,
      fecha:       form.fecha,
      comercio:    form.comercio  || 'Sin comercio',
      medioPago:   form.medioPago || 'Efectivo',
      ubicacion:   form.ubicacion || 'Sin ubicacion',
      imagen:      form.imagen    || null,
      maximo:      parseInt(form.maximo, 10) || 0,
      minimo:      form.minimo    || '0',
    };

    try {
      await gastosApi.create(user.id, payload);
      setMsgGuardar('Gasto registrado correctamente.');
      setForm(FORM_INICIAL);
      setTimeout(() => { setModalOpen(false); setMsgGuardar(''); }, 1200);
    } catch (err) {
      setMsgGuardar('Error: ' + err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setForm(FORM_INICIAL);
    setMsgGuardar('');
  };

  return (
    <AppLayout activePage="dashboard" onNuevoGasto={() => setModalOpen(true)}>

      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">
            Bienvenido, {user?.name || 'Usuario'} - Analisis de datos MoneyFly
          </div>
        </div>
        <button className="btn-primary" onClick={() => setModalOpen(true)}>
          <i className="ti ti-plus"></i>Nuevo gasto
        </button>
      </div>

      {/* KPIs */}
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon blue"><i className="ti ti-users"></i></div>
          </div>
          <div className="kpi-label">Total usuarios</div>
          <div className="kpi-value blue">{totalUsuarios ?? '-'}</div>
          <div className="kpi-trend"><i className="ti ti-database"></i>Registrados</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon orange"><i className="ti ti-building-store"></i></div>
          </div>
          <div className="kpi-label">Comercios alto gasto</div>
          <div className="kpi-value orange">{totalComercios ?? '-'}</div>
          <div className="kpi-trend"><i className="ti ti-trending-up"></i>Total mayor $25.000</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon green"><i className="ti ti-chart-bar"></i></div>
          </div>
          <div className="kpi-label">Grupos de edad</div>
          <div className="kpi-value green">{gruposEdad ?? '-'}</div>
          <div className="kpi-trend"><i className="ti ti-users"></i>Segmentos</div>
        </div>
      </div>

      {/* Graficas fila 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="section-card" style={{ padding: 20 }}>
          <div className="section-head"><h2>Usuarios mayores de 50 por genero</h2></div>
          <img
            src={lineasMayores50}
            alt="Usuarios mayores de 50"
            style={{ width: '100%', height: 'auto', borderRadius: 8 }}
          />
          <p style={{ fontSize: 11, color: 'var(--gray)', marginTop: 8 }}>
            Distribucion de usuarios mayores de 50 por genero.
          </p>
        </div>
        <div className="section-card" style={{ padding: 20 }}>
          <div className="section-head"><h2>Usuarios por tipo de documento</h2></div>
          <img
            src={barrasTipoDoc}
            alt="Tipo de documento"
            style={{ width: '100%', height: 'auto', borderRadius: 8 }}
          />
          <p style={{ fontSize: 11, color: 'var(--gray)', marginTop: 8 }}>
            Distribucion de usuarios segun su tipo de documento.
          </p>
        </div>
      </div>

      {/* Graficas fila 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="section-card" style={{ padding: 20 }}>
          <div className="section-head"><h2>Proporcion por tipo de documento</h2></div>
          <img
            src={tortaTipoDoc}
            alt="Proporcion documentos"
            style={{ width: '100%', height: 'auto', borderRadius: 8 }}
          />
          <p style={{ fontSize: 11, color: 'var(--gray)', marginTop: 8 }}>
            Proporcion de cada tipo de documento.
          </p>
        </div>
        <div className="section-card" style={{ padding: 20 }}>
          <div className="section-head"><h2>Comercios tecnologicos por fecha</h2></div>
          <img
            src={lineasComercioTec}
            alt="Comercios tecnologicos"
            style={{ width: '100%', height: 'auto', borderRadius: 8 }}
          />
          <p style={{ fontSize: 11, color: 'var(--gray)', marginTop: 8 }}>
            Actividad en el sector tecnologico por fecha.
          </p>
        </div>
      </div>

      {/* Graficas fila 3 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="section-card" style={{ padding: 20 }}>
          <div className="section-head"><h2>Comercios con alto gasto por ciudad</h2></div>
          <img
            src={barrasComercioUbic}
            alt="Alto gasto por ciudad"
            style={{ width: '100%', height: 'auto', borderRadius: 8 }}
          />
          <p style={{ fontSize: 11, color: 'var(--gray)', marginTop: 8 }}>
            Ciudades con mayor concentracion de comercios con alto gasto.
          </p>
        </div>
        <div className="section-card" style={{ padding: 20 }}>
          <div className="section-head"><h2>Sector comercial vs Ubicacion</h2></div>
          <img
            src={mapaCalor}
            alt="Mapa de calor"
            style={{ width: '100%', height: 'auto', borderRadius: 8 }}
          />
          <p style={{ fontSize: 11, color: 'var(--gray)', marginTop: 8 }}>
            Intensidad de actividad por sector y ciudad.
          </p>
        </div>
      </div>

      {/* Modal nuevo gasto */}
      <Modal
        open={modalOpen}
        onClose={handleCerrarModal}
        title="Registrar gasto"
        footer={
          <>
            <button className="btn-ghost" onClick={handleCerrarModal}>Cancelar</button>
            <button className="btn-primary" onClick={handleGuardar} disabled={guardando}>
              <i className="ti ti-check"></i>
              {guardando ? 'Guardando...' : 'Guardar gasto'}
            </button>
          </>
        }
      >
        {msgGuardar && (
          <div style={{
            padding: '8px 12px', borderRadius: 8, marginBottom: 12, fontSize: 13,
            background: msgGuardar.startsWith('Gasto') ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
            color:      msgGuardar.startsWith('Gasto') ? 'var(--green)'          : 'var(--red)',
            border:     msgGuardar.startsWith('Gasto')
              ? '1px solid rgba(52,211,153,0.3)'
              : '1px solid rgba(248,113,113,0.3)',
          }}>
            {msgGuardar}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Descripcion *</label>
          <input
            className="form-input" name="descripcion" type="text"
            placeholder="Que compraste?" value={form.descripcion} onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Valor (COP) *</label>
            <input
              className="form-input" name="valor" type="number"
              placeholder="0" value={form.valor} onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Fecha *</label>
            <input
              className="form-input" name="fecha" type="date"
              value={form.fecha} onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Comercio</label>
          {/* ✅ name="comercio" en minuscula */}
          <input
            className="form-input" name="comercio" type="text"
            placeholder="Ej: Exito, Netflix..." value={form.comercio} onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Medio de pago</label>
            <select className="form-input" name="medioPago" value={form.medioPago} onChange={handleChange}>
              <option value="">-- Selecciona --</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta Debito">Tarjeta Debito</option>
              <option value="Tarjeta Credito">Tarjeta Credito</option>
              <option value="Nequi">Nequi</option>
              <option value="Daviplata">Daviplata</option>
              <option value="PSE">PSE</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Ubicacion</label>
            <input
              className="form-input" name="ubicacion" type="text"
              placeholder="Ej: Medellin" value={form.ubicacion} onChange={handleChange}
            />
          </div>
        </div>
      </Modal>

    </AppLayout>
  );
}