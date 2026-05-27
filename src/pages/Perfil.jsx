import { useContext, useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import Modal from '../components/Modal';
import { AuthContext } from '../context/AuthContext';
import { usuariosApi } from '../services/api';

export default function Perfil() {
  const { user, updateUser } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [msg,       setMsg]       = useState('');

  const [formData, setFormData] = useState({
    nombres:   '',
    correo:    '',
    telefono:  '',
    ocupacion: '',
    edad:      '',
  });

  // ✅ Sincroniza el form cuando el user carga desde el contexto
  useEffect(() => {
    if (user) {
      setFormData({
        nombres:   user.name      || '',
        correo:    user.email     || '',
        telefono:  user.telefono  || '',
        ocupacion: user.ocupacion || '',
        edad:      user.edad      || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMsg('');
  };

  const handleUpdate = async () => {
    if (!formData.nombres || !formData.correo) {
      setMsg('Nombres y correo son obligatorios.');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      // ✅ Incluye todos los campos que el backend requiere como nullable=false
      // Los campos que no se editan en el form se toman del user actual
      const payload = {
        nombres:       formData.nombres,
        correo:        formData.correo,
        telefono:      formData.telefono   || user?.telefono  || '',
        ocupacion:     formData.ocupacion  || user?.ocupacion || '',
        edad:          parseInt(formData.edad, 10) || user?.edad || 0,
        // ✅ Campos obligatorios en BD que no se editan — se mantienen del usuario actual
        tipoDocumento: user?.tipoDoc       || 'cedula',
        documento:     user?.documento     || '',
        genero:        user?.genero        || 'prefieroNoDecirlo',
        // ✅ La contrasena se mantiene igual — no se cambia desde este form
        contrasena:    user?.contrasena    || '',
      };

      await usuariosApi.update(user.id, payload);

      // ✅ Actualizar el contexto con los nuevos datos
      updateUser({
        name:      formData.nombres,
        email:     formData.correo,
        telefono:  formData.telefono,
        ocupacion: formData.ocupacion,
        edad:      parseInt(formData.edad, 10) || user?.edad,
      });

      setMsg('Perfil actualizado correctamente.');
      setTimeout(() => { setModalOpen(false); setMsg(''); }, 1200);

    } catch (error) {
      setMsg('Error al actualizar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  return (
    <AppLayout activePage="perfil">
      <div className="page-header">
        <div>
          <div className="page-title">Mi perfil</div>
          <div className="page-subtitle">Gestiona tu informacion personal</div>
        </div>
        <button className="btn-primary" onClick={() => setModalOpen(true)}>
          <i className="ti ti-edit"></i>Editar perfil
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20 }}>

        {/* Tarjeta avatar */}
        <div className="section-card" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            margin: '0 auto 14px',
            background: 'linear-gradient(135deg, var(--blue), var(--purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 700,
          }}>
            {initials}
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 800 }}>
            {user?.name || 'Usuario'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--gray2)', marginBottom: 16 }}>
            {user?.email || ''}
          </div>
          <span className="badge green">Cuenta activa</span>
        </div>

        {/* Info personal */}
        <div className="section-card">
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border)',
            fontFamily: 'Syne, sans-serif',
            fontSize: 13, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <i className="ti ti-user"></i>Informacion personal
          </div>
          <div style={{ padding: '6px 0' }}>
            {[
              { label: 'Nombres',    value: user?.name,      icon: 'ti-user'      },
              { label: 'Correo',     value: user?.email,     icon: 'ti-mail'      },
              { label: 'Telefono',   value: user?.telefono,  icon: 'ti-phone'     },
              { label: 'Documento',  value: user?.documento
                  ? `${user?.tipoDoc || ''} - ${user?.documento}`
                  : '-',                                     icon: 'ti-id-badge'  },
              { label: 'Edad',       value: user?.edad,      icon: 'ti-cake'      },
              { label: 'Genero',     value: user?.genero,    icon: 'ti-gender-bigender' },
              { label: 'Ocupacion',  value: user?.ocupacion, icon: 'ti-briefcase' },
            ].map(r => (
              <div
                key={r.label}
                style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '11px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <span style={{ fontSize: 12, color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className={`ti ${r.icon}`}></i>{r.label}
                </span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{r.value || '-'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal editar */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setMsg(''); }}
        title="Editar perfil"
        footer={
          <>
            <button className="btn-ghost" onClick={() => { setModalOpen(false); setMsg(''); }}>
              Cancelar
            </button>
            <button className="btn-primary" onClick={handleUpdate} disabled={loading}>
              <i className="ti ti-check"></i>
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </>
        }
      >
        {/* Mensaje feedback */}
        {msg && (
          <div style={{
            padding: '8px 12px', borderRadius: 8, marginBottom: 12, fontSize: 13,
            background: msg.startsWith('Perfil') ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
            color:      msg.startsWith('Perfil') ? 'var(--green)'          : 'var(--red)',
            border:     msg.startsWith('Perfil')
              ? '1px solid rgba(52,211,153,0.3)'
              : '1px solid rgba(248,113,113,0.3)',
          }}>
            {msg}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Nombres</label>
          <input
            className="form-input"
            name="nombres"
            type="text"
            value={formData.nombres}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Correo</label>
          <input
            className="form-input"
            name="correo"
            type="email"
            value={formData.correo}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Telefono</label>
            <input
              className="form-input"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Edad</label>
            <input
              className="form-input"
              name="edad"
              type="number"
              value={formData.edad}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Ocupacion</label>
          <input
            className="form-input"
            name="ocupacion"
            type="text"
            value={formData.ocupacion}
            onChange={handleChange}
          />
        </div>

        {/* Nota informativa */}
        <p style={{ fontSize: 11, color: 'var(--gray2)', marginTop: 8 }}>
          Documento, genero y contrasena no se pueden cambiar desde aqui.
        </p>
      </Modal>

    </AppLayout>
  );
}