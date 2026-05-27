import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import Modal from '../components/Modal';
import { fmt } from '../data/mockData';
import { gastosApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

// ✅ Todo en minuscula — coincide exactamente con Gastos.java
const FORM_VACIO = {
  descripcion: '', valor: '', fecha: '', comercio: '',
  medioPago: '', ubicacion: '', imagen: '', maximo: '', minimo: '',
};

// ✅ fecha puede llegar como array [2026,5,26] o string "2026-05-26"
const formatearFecha = (fecha) => {
  if (!fecha) return '';
  if (Array.isArray(fecha)) {
    const [a, m, d] = fecha;
    return `${a}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  }
  if (typeof fecha === 'string' && fecha.includes('-')) return fecha;
  if (typeof fecha === 'string' && fecha.includes('/')) {
    const [d, m, a] = fecha.split('/');
    return `${a}-${m}-${d}`;
  }
  return String(fecha);
};

const mapearGasto = (g) => ({
  id:          g.id,
  descripcion: g.descripcion || '',
  valor:       g.valor       || 0,
  fecha:       formatearFecha(g.fecha),
  // ✅ backend devuelve "comercio" en minuscula
  comercio:    g.comercio    || '',
  medioPago:   g.medioPago   || '',
  ubicacion:   g.ubicacion   || '',
  imagen:      g.imagen      || null,
  maximo:      g.maximo      || 0,
  minimo:      g.minimo      || '0',
});

const construirPayload = (form) => ({
  descripcion: form.descripcion,
  valor:       parseInt(form.valor, 10) || 0,
  fecha:       form.fecha,
  // ✅ "comercio" en minuscula — nombre exacto del campo en Gastos.java
  comercio:    (!form.comercio || form.comercio === '') ? 'Sin comercio' : form.comercio,
  medioPago:   form.medioPago  || 'Efectivo',
  ubicacion:   form.ubicacion  || 'Sin ubicacion',
  imagen:      form.imagen     || null,
  maximo:      parseInt(form.maximo, 10) || 0,
  minimo:      form.minimo     || '0',
});

export default function Gastos() {
  const { user } = useAuth();

  const [gastos,        setGastos]        = useState([]);
  const [cargando,      setCargando]      = useState(true);
  const [error,         setError]         = useState('');
  const [search,        setSearch]        = useState('');

  const [modalCrear,    setModalCrear]    = useState(false);
  const [formCrear,     setFormCrear]     = useState(FORM_VACIO);
  const [guardando,     setGuardando]     = useState(false);
  const [msgCrear,      setMsgCrear]      = useState('');

  const [modalEditar,   setModalEditar]   = useState(false);
  const [gastoEdit,     setGastoEdit]     = useState(null);
  const [formEditar,    setFormEditar]    = useState(FORM_VACIO);
  const [actualizando,  setActualizando]  = useState(false);
  const [msgEditar,     setMsgEditar]     = useState('');

  const [modalEliminar,  setModalEliminar]  = useState(false);
  const [gastoAEliminar, setGastoAEliminar] = useState(null);
  const [eliminando,     setEliminando]     = useState(false);

  // ── Cargar gastos ──────────────────────────────────────
  const cargarGastos = async () => {
    if (!user?.id) return;
    setCargando(true);
    setError('');
    try {
      const data = await gastosApi.getAll(user.id);
      setGastos(data.map(mapearGasto));
    } catch {
      setError('No se pudieron cargar los gastos. Verifica que el backend este activo.');
    } finally {
      setCargando(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { cargarGastos(); }, [user?.id]);
  const filtrados = gastos.filter(g =>
    g.descripcion.toLowerCase().includes(search.toLowerCase()) ||
    g.comercio.toLowerCase().includes(search.toLowerCase())
  );

  // ── CREAR ──────────────────────────────────────────────
  const handleChangeCrear = (e) => {
    setFormCrear({ ...formCrear, [e.target.name]: e.target.value });
    setMsgCrear('');
  };

  const handleCrear = async () => {
    if (!formCrear.descripcion || !formCrear.valor || !formCrear.fecha) {
      setMsgCrear('Descripcion, valor y fecha son obligatorios.');
      return;
    }
    setGuardando(true);
    try {
      await gastosApi.create(user.id, construirPayload(formCrear));
      setMsgCrear('Gasto creado correctamente.');
      setFormCrear(FORM_VACIO);
      await cargarGastos();
      setTimeout(() => { setModalCrear(false); setMsgCrear(''); }, 1200);
    } catch (err) {
      setMsgCrear('Error: ' + err.message);
    } finally {
      setGuardando(false);
    }
  };

  const cerrarModalCrear = () => {
    setModalCrear(false);
    setFormCrear(FORM_VACIO);
    setMsgCrear('');
  };

  // ── EDITAR ─────────────────────────────────────────────
  const abrirEditar = (g) => {
    setGastoEdit(g);
    setFormEditar({
      descripcion: g.descripcion,
      valor:       String(g.valor),
      fecha:       g.fecha,
      // ✅ minuscula
      comercio:    g.comercio   || '',
      medioPago:   g.medioPago  || '',
      ubicacion:   g.ubicacion  || '',
      imagen:      g.imagen     || '',
      maximo:      String(g.maximo || 0),
      minimo:      g.minimo     || '0',
    });
    setMsgEditar('');
    setModalEditar(true);
  };

  const handleChangeEditar = (e) => {
    setFormEditar({ ...formEditar, [e.target.name]: e.target.value });
    setMsgEditar('');
  };

  const handleActualizar = async () => {
    if (!formEditar.descripcion || !formEditar.valor || !formEditar.fecha) {
      setMsgEditar('Descripcion, valor y fecha son obligatorios.');
      return;
    }
    setActualizando(true);
    try {
      await gastosApi.update(gastoEdit.id, construirPayload(formEditar));
      setMsgEditar('Gasto actualizado correctamente.');
      await cargarGastos();
      setTimeout(() => { setModalEditar(false); setMsgEditar(''); }, 1200);
    } catch (err) {
      setMsgEditar('Error: ' + err.message);
    } finally {
      setActualizando(false);
    }
  };

  const cerrarModalEditar = () => {
    setModalEditar(false);
    setMsgEditar('');
  };

  // ── ELIMINAR ───────────────────────────────────────────
  const abrirEliminar = (g) => {
    setGastoAEliminar(g);
    setModalEliminar(true);
  };

  const handleEliminar = async () => {
    if (!gastoAEliminar) return;
    setEliminando(true);
    try {
      await gastosApi.delete(gastoAEliminar.id);
      await cargarGastos();
      setModalEliminar(false);
      setGastoAEliminar(null);
    } catch {
      alert('No se pudo eliminar el gasto.');
    } finally {
      setEliminando(false);
    }
  };

  const cerrarModalEliminar = () => {
    setModalEliminar(false);
    setGastoAEliminar(null);
  };

  // ── RENDER ─────────────────────────────────────────────
  return (
    <AppLayout activePage="gastos" onNuevoGasto={() => setModalCrear(true)}>

      <div className="page-header">
        <div>
          <div className="page-title">Todos los gastos</div>
          <div className="page-subtitle">{gastos.length} gastos registrados</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-primary" onClick={() => setModalCrear(true)}>
            <i className="ti ti-plus"></i>Nuevo gasto
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 20 }}>
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon red"><i className="ti ti-arrow-down-circle"></i></div>
          </div>
          <div className="kpi-label">Total gastado</div>
          <div className="kpi-value red">
            ${fmt(gastos.reduce((a, g) => a + (g.valor || 0), 0))}
          </div>
          <div className="kpi-trend" style={{ color: 'var(--gray2)' }}>
            <i className="ti ti-calendar"></i>Todos los registros
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon purple"><i className="ti ti-receipt"></i></div>
          </div>
          <div className="kpi-label">Transacciones</div>
          <div className="kpi-value purple">{gastos.length}</div>
          <div className="kpi-trend" style={{ color: 'var(--gray2)' }}>
            <i className="ti ti-database"></i>Total registros
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon yellow"><i className="ti ti-calculator"></i></div>
          </div>
          <div className="kpi-label">Promedio por gasto</div>
          <div className="kpi-value yellow">
            ${gastos.length
              ? fmt(Math.round(gastos.reduce((a, g) => a + (g.valor || 0), 0) / gastos.length))
              : 0}
          </div>
          <div className="kpi-trend" style={{ color: 'var(--gray2)' }}>
            <i className="ti ti-math-function"></i>Promedio simple
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="section-card">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '14px 22px 0', marginBottom: 14 }}>
          <div className="search-box" style={{ flex: 1, maxWidth: 340 }}>
            <i className="ti ti-search"></i>
            <input
              type="text"
              placeholder="Buscar por descripcion o comercio..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-secondary" onClick={cargarGastos}>
            <i className="ti ti-refresh"></i>Actualizar
          </button>
        </div>

        {cargando && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--gray2)' }}>
            <i className="ti ti-loader-2" style={{ fontSize: 28, display: 'block', marginBottom: 8 }}></i>
            Cargando gastos...
          </div>
        )}

        {!cargando && error && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--red)', fontSize: 13 }}>
            <i className="ti ti-alert-circle" style={{ fontSize: 28, display: 'block', marginBottom: 8 }}></i>
            {error}
          </div>
        )}

        {!cargando && !error && (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Descripcion</th>
                  <th>Comercio</th>
                  <th>Fecha</th>
                  <th>Medio de pago</th>
                  <th>Ubicacion</th>
                  <th style={{ textAlign: 'right' }}>Valor</th>
                  <th style={{ textAlign: 'center', width: 80 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--gray2)' }}>
                      No hay gastos registrados.
                    </td>
                  </tr>
                ) : filtrados.map(g => (
                  <tr key={g.id}>
                    <td>
                      <div className="tx-row-name">{g.descripcion || 'Sin descripcion'}</div>
                    </td>
                    {/* ✅ minuscula */}
                    <td style={{ color: 'var(--gray2)', fontSize: 12.5 }}>
                      {g.comercio || 'Sin comercio'}
                    </td>
                    <td style={{ color: 'var(--gray2)', fontSize: 12.5 }}>{g.fecha}</td>
                    <td>
                      <div className="medio-tag">
                        <i className="ti ti-credit-card"></i>
                        {g.medioPago || 'Sin medio'}
                      </div>
                    </td>
                    <td style={{ color: 'var(--gray2)', fontSize: 12.5 }}>
                      {g.ubicacion || 'Sin ubicacion'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="amount neg">${fmt(g.valor || 0)}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <button className="action-icon-btn" title="Editar" onClick={() => abrirEditar(g)}>
                          <i className="ti ti-edit"></i>
                        </button>
                        <button className="action-icon-btn danger" title="Eliminar" onClick={() => abrirEliminar(g)}>
                          <i className="ti ti-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal CREAR */}
      <Modal
        open={modalCrear}
        onClose={cerrarModalCrear}
        title="Registrar nuevo gasto"
        footer={
          <>
            <button className="btn-ghost" onClick={cerrarModalCrear}>Cancelar</button>
            <button className="btn-primary" onClick={handleCrear} disabled={guardando}>
              <i className="ti ti-check"></i>
              {guardando ? 'Guardando...' : 'Guardar gasto'}
            </button>
          </>
        }
      >
        <MensajeModal msg={msgCrear} />
        <FormGasto form={formCrear} onChange={handleChangeCrear} />
      </Modal>

      {/* Modal EDITAR */}
      <Modal
        open={modalEditar}
        onClose={cerrarModalEditar}
        title="Editar gasto"
        footer={
          <>
            <button className="btn-ghost" onClick={cerrarModalEditar}>Cancelar</button>
            <button className="btn-primary" onClick={handleActualizar} disabled={actualizando}>
              <i className="ti ti-check"></i>
              {actualizando ? 'Actualizando...' : 'Actualizar gasto'}
            </button>
          </>
        }
      >
        <MensajeModal msg={msgEditar} />
        <FormGasto form={formEditar} onChange={handleChangeEditar} />
      </Modal>

      {/* Modal ELIMINAR */}
      <Modal
        open={modalEliminar}
        onClose={cerrarModalEliminar}
        title="Confirmar eliminacion"
        footer={
          <>
            <button className="btn-ghost" onClick={cerrarModalEliminar}>Cancelar</button>
            <button
              onClick={handleEliminar}
              disabled={eliminando}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', background: 'var(--red)', color: '#fff',
                border: 'none', borderRadius: 9, fontSize: 12.5, fontWeight: 600,
                cursor: eliminando ? 'not-allowed' : 'pointer',
              }}
            >
              <i className="ti ti-trash"></i>
              {eliminando ? 'Eliminando...' : 'Si, eliminar'}
            </button>
          </>
        }
      >
        <p style={{ fontSize: 13, color: 'var(--gray2)', textAlign: 'center', padding: '12px 0' }}>
          Estas seguro de que deseas eliminar el gasto{' '}
          <strong style={{ color: 'var(--white)' }}>
            "{gastoAEliminar?.descripcion}"
          </strong>{' '}
          por valor de{' '}
          <strong style={{ color: 'var(--red)' }}>
            ${gastoAEliminar ? fmt(gastoAEliminar.valor) : 0}
          </strong>?
          <br /><br />
          <span style={{ color: 'var(--red)', fontSize: 12 }}>
            Esta accion no se puede deshacer.
          </span>
        </p>
      </Modal>

    </AppLayout>
  );
}

// ── Mensaje feedback ───────────────────────────────────
function MensajeModal({ msg }) {
  if (!msg) return null;
  const esExito = msg.toLowerCase().startsWith('gasto');
  return (
    <div style={{
      padding: '8px 12px', borderRadius: 8, marginBottom: 12, fontSize: 13,
      background: esExito ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
      color:      esExito ? 'var(--green)'          : 'var(--red)',
      border:     esExito
        ? '1px solid rgba(52,211,153,0.3)'
        : '1px solid rgba(248,113,113,0.3)',
    }}>
      {msg}
    </div>
  );
}

// ── Formulario reutilizable ────────────────────────────
function FormGasto({ form, onChange }) {
  return (
    <>
      <div className="form-group">
        <label className="form-label">Descripcion *</label>
        <input
          className="form-input"
          name="descripcion"
          type="text"
          placeholder="Que compraste?"
          value={form.descripcion}
          onChange={onChange}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Valor (COP) *</label>
          <input
            className="form-input"
            name="valor"
            type="number"
            placeholder="0"
            value={form.valor}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Fecha *</label>
          <input
            className="form-input"
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Comercio</label>
        {/* ✅ name="comercio" en minuscula */}
        <input
          className="form-input"
          name="comercio"
          type="text"
          placeholder="Ej: Exito, Netflix..."
          value={form.comercio}
          onChange={onChange}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Medio de pago</label>
          <select className="form-input" name="medioPago" value={form.medioPago} onChange={onChange}>
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
            className="form-input"
            name="ubicacion"
            type="text"
            placeholder="Ej: Medellin"
            value={form.ubicacion}
            onChange={onChange}
          />
        </div>
      </div>
    </>
  );
}