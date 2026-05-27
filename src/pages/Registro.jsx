import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const inputStyle = {
  width: '100%', padding: 10, border: '1px solid #2D4A63',
  borderRadius: 6, background: '#1C2430', color: '#F9FAFB',
  fontSize: '1rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
};

export default function Registro() {
  const { register, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombres: '', correo: '', contrasena: '',
    tipoDoc: '', documento: '', edad: '',
    genero: '', telefono: '', ocupacion: '',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombres || !form.correo || !form.contrasena) {
      setError('Por favor completa los campos obligatorios.');
      return;
    }
    setLoading(true);

    // 1️⃣ Registrar el usuario en el backend
    const resultado = await register(form);

    if (!resultado.success) {
      setLoading(false);
      setError(resultado.message || 'Error al registrarse. Intenta de nuevo.');
      return;
    }

    // ✅ CORRECCIÓN: después de registrar, hacer login automático
    // Así el usuario queda con sesión activa y puede entrar al Dashboard
    const loginResultado = await login(form.correo, form.contrasena);
    setLoading(false);

    if (loginResultado.success) {
      navigate('/', { replace: true });
    } else {
      // El registro fue exitoso pero el login automático falló
      // Se manda al login para que entre manualmente
      navigate('/login', { replace: true });
    }
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#0F1720', color: '#F9FAFB', minHeight: '100vh' }}>

      {/* Header */}
      <header style={{ background: '#2D4A63', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dycZkebkXSmjYcDAoiW0c6EQyppp8K.png"
            alt="Logo" style={{ height: 50, borderRadius: 8 }}
          />
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#FFC857' }}>MoneyFly</span>
        </div>
        <Link to="/login">
          <button style={{ background: '#FF7A3D', color: '#F9FAFB', padding: '10px 20px', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '1rem', fontFamily: 'inherit' }}>
            Iniciar sesión
          </button>
        </Link>
      </header>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dycZkebkXSmjYcDAoiW0c6EQyppp8K.png"
          alt="MoneyFly" style={{ width: 200, borderRadius: 16, marginBottom: '2rem' }}
        />
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          Controla tus <span style={{ color: '#FFC857' }}>Gastos Hormiga</span>
        </h1>
        <p style={{ color: '#9CA3AF', marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
          Registra tus gastos diarios y descubre dónde se va tu dinero. Simple, rápido y gratis.
        </p>
        <a href="#registro">
          <button style={{ background: '#FF7A3D', color: '#F9FAFB', padding: '10px 24px', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '1rem', fontFamily: 'inherit' }}>
            Comenzar
          </button>
        </a>
      </section>

      {/* Formulario */}
      <section style={{ background: '#1C2430', padding: '3rem 2rem' }} id="registro">
        <div style={{ maxWidth: 500, margin: '0 auto', background: '#0F1720', padding: '2rem', borderRadius: 12 }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Crear cuenta</h2>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
              borderRadius: 8, padding: '10px 14px', marginBottom: '1.25rem',
              color: '#FCA5A5', fontSize: '0.875rem',
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 5, fontSize: '0.9rem' }}>Nombres *</label>
            <input name="nombres" type="text" placeholder="Tu nombre completo" value={form.nombres} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 5, fontSize: '0.9rem' }}>Correo *</label>
            <input name="correo" type="email" placeholder="correo@ejemplo.com" value={form.correo} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 5, fontSize: '0.9rem' }}>Contraseña *</label>
            <input name="contrasena" type="password" placeholder="Mínimo 8 caracteres" value={form.contrasena} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 5, fontSize: '0.9rem' }}>Tipo documento</label>
              {/* ✅ CORRECCIÓN: valores corregidos para coincidir exactamente con el enum TipoDocumento.java */}
              <select name="tipoDoc" value={form.tipoDoc} onChange={handleChange} style={inputStyle}>
                <option value="">Seleccionar</option>
                <option value="cedula">Cédula</option>
                <option value="tarjeta_Identidad">Tarjeta de Identidad</option>
                <option value="pasaporte">Pasaporte</option>
                <option value="permiso_Permanecia">Permiso de Permanencia</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 5, fontSize: '0.9rem' }}>Documento</label>
              <input name="documento" type="text" placeholder="Número" value={form.documento} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 5, fontSize: '0.9rem' }}>Edad</label>
              <input name="edad" type="number" placeholder="25" min="18" value={form.edad} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 5, fontSize: '0.9rem' }}>Género</label>
              {/* ✅ CORRECCIÓN: valores corregidos para coincidir exactamente con el enum Genero.java */}
              <select name="genero" value={form.genero} onChange={handleChange} style={inputStyle}>
                <option value="">Seleccionar</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="prefieroNoDecirlo">Prefiero no decirlo</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 5, fontSize: '0.9rem' }}>Teléfono</label>
              <input name="telefono" type="tel" placeholder="3001234567" value={form.telefono} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 5, fontSize: '0.9rem' }}>Ocupación</label>
              <input name="ocupacion" type="text" placeholder="Estudiante" value={form.ocupacion} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: 12,
              background: loading ? '#cc6230' : '#FF7A3D',
              color: '#F9FAFB', border: 'none', borderRadius: 6,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem', fontFamily: 'inherit',
            }}
          >
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1rem', color: '#9CA3AF', fontSize: '0.9rem' }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{ color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </section>

      <footer style={{ background: '#2D4A63', textAlign: 'center', padding: '1.5rem', color: '#9CA3AF', fontSize: '0.9rem' }}>
        © 2026 Gastos Hormiga — MoneyFly
      </footer>
    </div>
  );
}