import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { categoriasApi } from '../services/api';

const FORM_VACIO = {
  nombre: '', fechaCreacion: '', responsable: '', justificacion: '',
  limiteGastos: '', gastosActuales: '', frecuencia: '', alertGastos: '',
  metodoPagoPreferido: '',
};

const COLORES = [
  'rgba(255,122,61,0.15)', 'rgba(255,190,61,0.15)', 'rgba(155,114,247,0.15)',
  'rgba(79,142,247,0.15)', 'rgba(52,211,153,0.15)',  'rgba(244,114,182,0.15)',
  'rgba(248,113,113,0.15)','rgba(6,182,212,0.15)',
];
const EMOJIS = ['F','C','G','A','M','R','H','P','V','E'];

const pctClass      = (pct) => pct >= 100 ? 'warn' : pct >= 80 ? 'mid' : 'ok';
const pctBadgeClass = (pct) => pct >= 100 ? 'red'  : pct >= 80 ? 'orange' : 'green';

// ✅ Normaliza la fecha sin importar como llegue del backend
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

const mapearCategoria = (c, index) => {
  const limite   = c.limiteGastos   || 0;
  const actuales = c.gastosActuales || 0;
  const pct = limite > 0 ? Math.round((actuales / limite) * 100) : 0;
  return {
    id:                  c.id,
    nombre:              c.nombre              || 'Sin nombre',
    // ✅ fecha normalizada
    fechaCreacion:       formatearFecha(c.fechaCreacion),
    responsable:         c.responsable         || '',
    justificacion:       c.justificacion       || '',
    limiteGastos:        limite,
    gastosActuales:      actuales,
    frecuencia:          c.frecuencia          || '',
    alertGastos:         c.alertGastos         || '',
    metodoPagoPreferido: c.metodoPagoPreferido || '',
    pct,
    colorHex: COLORES[index % COLORES.length],
    emoji:    EMOJIS[index  % EMOJIS.length],
  };
};

const construirPayload = (form) => ({
  nombre:              form.nombre              || 'Sin nombre',
  fechaCreacion:       form.fechaCreacion       || null,
  responsable:         form.responsable         || '',
  justificacion:       form.justificacion       || null,
  limiteGastos:        parseInt(form.limiteGastos,   10) || 0,
  gastosActuales:      parseInt(form.gastosActuales, 10) || 0,
  frecuencia:          form.frecuencia          || '',
  alertGastos:         form.alertGastos         || '',
  metodoPagoPreferido: form.metodoPagoPreferido || '',
});

export default function Categorias() {
  const { user } = useAuth();

  const [categorias,   setCategorias]   = useState([]);
  const [cargando,     setCargando]     = useState(true);
  const [error,        setError]        = useState('');

  const [modalCrear,   setModalCrear]   = useState(false);
  const [formCrear,    setFormCrear]    = useState(FORM_VACIO);
  const [guardando,    setGuardando]    = useState(false);
  const [msgCrear,     setMsgCrear]     = useState('');

  const [modalEditar,  setModalEditar]  = useState(false);
  const [catEdit,      setCatEdit]      = useState(null);
  const [formEditar,   setFormEditar]   = useState(FORM_VACIO);
  const [actualizando, setActualizando] = useState(false);
  const [msgEditar,    setMsgEditar]    = useState('');

  const [modalEliminar, setModalEliminar] = useState(false);
  const [catAEliminar,  setCatAEliminar]  = useState(null);
  const [eliminando,    setEliminando]    = useState(false);

  // ── Cargar categorias del usuario ──────────────────────
  const cargarCategorias = async () => {
    if (!user?.id) return;
    setCargando(true);
    setError('');
    try {
      const data = await categoriasApi.getAll(user.id);
      setCategorias(data.map(mapearCategoria));
    } catch {
      setError('No se pudieron cargar las categorias. Verifica que el backend este activo.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarCategorias(); }, [user?.id]);

  // ── CREAR ──────────────────────────────────────────────
  const handleChangeCrear = (e) => {
    setFormCrear({ ...formCrear, [e.target.name]: e.target.value });
    setMsgCrear('');
  };

  const handleCrear = async () => {
    if (!formCrear.nombre) {
      setMsgCrear('El nombre de la categoria es obligatorio.');
      return;
    }
    if (!formCrear.limiteGastos || parseInt(formCrear.limiteGastos, 10) <= 0) {
      setMsgCrear('El limite de gastos debe ser mayor a 0.');
      return;
    }
    setGuardando(true);
    try {
      await categoriasApi.create(user.id, construirPayload(formCrear));
      setMsgCrear('Categoria creada correctamente.');
      setFormCrear(FORM_VACIO);
      await cargarCategorias();
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
  const abrirEditar = (c) => {
    setCatEdit(c);
    setFormEditar({
      nombre:              c.nombre,
      fechaCreacion:       c.fechaCreacion       || '',
      responsable:         c.responsable         || '',
      justificacion:       c.justificacion       || '',
      limiteGastos:        String(c.limiteGastos),
      gastosActuales:      String(c.gastosActuales),
      frecuencia:          c.frecuencia          || '',
      alertGastos:         c.alertGastos         || '',
      metodoPagoPreferido: c.metodoPagoPreferido || '',
    });
    setMsgEditar('');
    setModalEditar(true);
  };

  const handleChangeEditar = (e) => {
    setFormEditar({ ...formEditar, [e.target.name]: e.target.value });
    setMsgEditar('');
  };

  const handleActualizar = async () => {
    if (!formEditar.nombre) {
      setMsgEditar('El nombre de la categoria es obligatorio.');
      return;
    }
    setActualizando(true);
    try {
      await categoriasApi.update(catEdit.id, construirPayload(formEditar));
      setMsgEditar('Categoria actualizada correctamente.');
      await cargarCategorias();
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
  const abrirEliminar = (c) => {
    setCatAEliminar(c);
    setModalEliminar(true);
  };

  const handleEliminar = async () => {
    if (!catAEliminar) return;
    setEliminando(true);
    try {
      await categoriasApi.delete(catAEliminar.id);
      await cargarCategorias();
      setModalEliminar(false);
      setCatAEliminar(null);
    } catch {
      alert('No se pudo eliminar la categoria.');
    } finally {
      setEliminando(false);
    }
  };

  const cerrarModalEliminar = () => {
    setModalEliminar(false);
    setCatAEliminar(null);
  };

  // ── RENDER ─────────────────────────────────────────────
  return (
    <AppLayout activePage="categorias">
      <div className="page-header">
        <div>
          <div className="page-title">Categorias</div>
          <div className="page-subtitle">{categorias.length} categorias registradas</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" onClick={cargarCategorias}>
            <i className="ti ti-refresh"></i>Actualizar
          </button>
          <button className="btn-primary" onClick={() => setModalCrear(true)}>
            <i className="ti ti-plus"></i>Nueva categoria
          </button>
        </div>
      </div>

      {cargando && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--gray2)' }}>
          <i className="ti ti-loader-2" style={{ fontSize: 32, display: 'block', marginBottom: 10 }}></i>
          Cargando categorias...
        </div>
      )}

      {!cargando && error && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--red)', fontSize: 13 }}>
          <i className="ti ti-alert-circle" style={{ fontSize: 32, display: 'block', marginBottom: 10 }}></i>
          {error}
        </div>
      )}

      {!cargando && !error && (
        <>
          {categorias.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--gray2)', fontSize: 13 }}>
              <i className="ti ti-tag" style={{ fontSize: 32, display: 'block', marginBottom: 10 }}></i>
              No hay categorias registradas. Crea la primera.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14, marginBottom: 24 }}>
              {categorias.map(c => (
                <div
                  key={c.id}
                  style={{
                    background: 'var(--card)', borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)', padding: 20,
                    transition: 'all 0.25s', position: 'relative',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = 'var(--border2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div style={{
                      width: 46, height: 46, borderRadius: 12,
                      background: c.colorHex,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, fontWeight: 700, color: 'var(--white)',
                    }}>
                      {c.emoji}
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="action-icon-btn" title="Editar" onClick={() => abrirEditar(c)}>
                        <i className="ti ti-edit"></i>
                      </button>
                      <button className="action-icon-btn danger" title="Eliminar" onClick={() => abrirEliminar(c)}>
                        <i className="ti ti-trash"></i>
                      </button>
                    </div>
                  </div>

                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 3 }}>
                    {c.nombre}
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--gray2)', marginBottom: 6 }}>
                    {c.responsable && <span>Resp: {c.responsable}</span>}
                    {c.frecuencia  && <span style={{ marginLeft: 8 }}>· {c.frecuencia}</span>}
                  </div>

                  {c.metodoPagoPreferido && (
                    <div style={{ marginBottom: 10 }}>
                      <span className="medio-tag">
                        <i className="ti ti-credit-card"></i>
                        {c.metodoPagoPreferido}
                      </span>
                    </div>
                  )}

                  <div className="bar-bg">
                    <div
                      className={'bar-fill ' + pctClass(c.pct)}
                      style={{ width: Math.min(c.pct, 100) + '%' }}
                    ></div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--gray)', marginTop: 4 }}>
                    <span>${c.gastosActuales.toLocaleString('es-CO')} gastado</span>
                    <span className={'badge ' + pctBadgeClass(c.pct)} style={{ fontSize: 11.5, fontWeight: 700 }}>
                      {c.pct}%
                    </span>
                  </div>
                  <div style={{ fontSize: 10.5, color: 'var(--gray)', marginTop: 2 }}>
                    Limite: ${c.limiteGastos.toLocaleString('es-CO')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal CREAR */}
      <Modal
        open={modalCrear}
        onClose={cerrarModalCrear}
        title="Nueva categoria"
        footer={
          <>
            <button className="btn-ghost" onClick={cerrarModalCrear}>Cancelar</button>
            <button className="btn-primary" onClick={handleCrear} disabled={guardando}>
              <i className="ti ti-check"></i>
              {guardando ? 'Guardando...' : 'Crear categoria'}
            </button>
          </>
        }
      >
        <MensajeModal msg={msgCrear} />
        <FormCategoria form={formCrear} onChange={handleChangeCrear} />
      </Modal>

      {/* Modal EDITAR */}
      <Modal
        open={modalEditar}
        onClose={cerrarModalEditar}
        title="Editar categoria"
        footer={
          <>
            <button className="btn-ghost" onClick={cerrarModalEditar}>Cancelar</button>
            <button className="btn-primary" onClick={handleActualizar} disabled={actualizando}>
              <i className="ti ti-check"></i>
              {actualizando ? 'Actualizando...' : 'Actualizar categoria'}
            </button>
          </>
        }
      >
        <MensajeModal msg={msgEditar} />
        <FormCategoria form={formEditar} onChange={handleChangeEditar} />
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
          Estas seguro de que deseas eliminar la categoria{' '}
          <strong style={{ color: 'var(--white)' }}>"{catAEliminar?.nombre}"</strong>?
          <br /><br />
          <span style={{ color: 'var(--red)', fontSize: 12 }}>Esta accion no se puede deshacer.</span>
        </p>
      </Modal>

    </AppLayout>
  );
}

// ── Mensaje feedback ───────────────────────────────────
function MensajeModal({ msg }) {
  if (!msg) return null;
  const esExito = msg.toLowerCase().startsWith('categoria');
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
function FormCategoria({ form, onChange }) {
  return (
    <>
      <div className="form-group">
        <label className="form-label">Nombre *</label>
        <input
          className="form-input" name="nombre" type="text"
          placeholder="Ej: Alimentacion, Transporte..."
          value={form.nombre} onChange={onChange}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Limite de gastos (COP) *</label>
          <input
            className="form-input" name="limiteGastos" type="number"
            placeholder="500000" value={form.limiteGastos} onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Gastos actuales (COP)</label>
          <input
            className="form-input" name="gastosActuales" type="number"
            placeholder="0" value={form.gastosActuales} onChange={onChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Responsable</label>
          <input
            className="form-input" name="responsable" type="text"
            placeholder="Nombre del responsable"
            value={form.responsable} onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Frecuencia</label>
          <select className="form-input" name="frecuencia" value={form.frecuencia} onChange={onChange}>
            <option value="">-- Selecciona --</option>
            <option value="Diaria">Diaria</option>
            <option value="Semanal">Semanal</option>
            <option value="Quincenal">Quincenal</option>
            <option value="Mensual">Mensual</option>
            <option value="Anual">Anual</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Alerta de gasto</label>
          <select className="form-input" name="alertGastos" value={form.alertGastos} onChange={onChange}>
            <option value="">-- Selecciona --</option>
            <option value="50%">50%</option>
            <option value="70%">70%</option>
            <option value="80%">80%</option>
            <option value="90%">90%</option>
            <option value="100%">100%</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Metodo de pago preferido</label>
          <select className="form-input" name="metodoPagoPreferido" value={form.metodoPagoPreferido} onChange={onChange}>
            <option value="">-- Selecciona --</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta Debito">Tarjeta Debito</option>
            <option value="Tarjeta Credito">Tarjeta Credito</option>
            <option value="Nequi">Nequi</option>
            <option value="Daviplata">Daviplata</option>
            <option value="PSE">PSE</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Justificacion</label>
        <input
          className="form-input" name="justificacion" type="text"
          placeholder="Opcional" value={form.justificacion} onChange={onChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Fecha de creacion</label>
        <input
          className="form-input" name="fechaCreacion" type="date"
          value={form.fechaCreacion} onChange={onChange}
        />
      </div>
    </>
  );
}