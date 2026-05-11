import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente visual del login.
 * La lógica de autenticación se delega al padre (LoginPage)
 * via la prop onLogin — mismo patrón que la red social.
 */
export default function Login({ onLogin = async () => ({ success: false, message: 'Sin handler' }) }) {
  const [formData, setFormData] = useState({ correo: '', contrasena: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.correo || !formData.contrasena) {
      setError('Por favor completa todos los campos.');
      return;
    }
    setLoading(true);
    const resultado = await onLogin(formData);
    setLoading(false);
    if (!resultado.success) {
      setError(resultado.message || 'Credenciales incorrectas.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0F1720', padding: '1rem', fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 448 }}>
        <div style={{
          background: '#1C2430', borderRadius: 16, padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
          border: '1px solid rgba(55,65,81,0.3)',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dycZkebkXSmjYcDAoiW0c6EQyppp8K.png"
              alt="MoneyFly"
              style={{ width: 128, height: 128, borderRadius: '50%', objectFit: 'contain' }}
            />
          </div>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.5rem' }}>Bienvenido</h1>
            <p style={{ color: '#94A3B8' }}>Inicia sesión en tu cuenta</p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
              borderRadius: 10, padding: '10px 14px', marginBottom: '1.25rem',
              color: '#FCA5A5', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <i className="ti ti-alert-circle"></i>{error}
            </div>
          )}

          {/* Correo */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#F8FAFC', marginBottom: '0.5rem' }}>
              Correo electrónico
            </label>
            <div style={{ position: 'relative' }}>
              <i className="ti ti-mail" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: 18 }}></i>
              <input
                type="email"
                name="correo"
                placeholder="tu@email.com"
                value={formData.correo}
                onChange={handleChange}
                style={{
                  width: '100%', padding: '0.75rem 1rem 0.75rem 3rem',
                  background: '#2D3748', border: '1px solid #374151', borderRadius: 12,
                  color: '#F8FAFC', fontSize: '1rem', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#F8FAFC', marginBottom: '0.5rem' }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <i className="ti ti-lock" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: 18 }}></i>
              <input
                type={showPass ? 'text' : 'password'}
                name="contrasena"
                placeholder="••••••••"
                value={formData.contrasena}
                onChange={handleChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                style={{
                  width: '100%', padding: '0.75rem 3rem 0.75rem 3rem',
                  background: '#2D3748', border: '1px solid #374151', borderRadius: 12,
                  color: '#F8FAFC', fontSize: '1rem', outline: 'none', boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 18 }}
              >
                <i className={`ti ${showPass ? 'ti-eye-off' : 'ti-eye'}`}></i>
              </button>
            </div>
          </div>

          {/* Recordarme / Olvidaste */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: 16, height: 16, accentColor: '#FF7A3D', cursor: 'pointer' }} />
              <span style={{ fontSize: '0.875rem', color: '#F8FAFC' }}>Recordarme</span>
            </label>
            <a href="#" style={{ fontSize: '0.875rem', color: '#3B82F6', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</a>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: '0.75rem 1rem',
              background: loading ? '#cc6230' : '#FF7A3D', color: '#fff',
              fontSize: '1rem', fontWeight: 600, border: 'none', borderRadius: 12,
              cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
              boxShadow: '0 10px 15px -3px rgba(255,122,61,0.25)',
              fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {loading
              ? <><i className="ti ti-loader-2" style={{ animation: 'spin 1s linear infinite' }}></i>Cargando...</>
              : 'Iniciar sesión'
            }
          </button>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
            ¿No tienes una cuenta?{' '}
            <Link to="/registro" style={{ color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>
              Regístrate gratis
            </Link>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#64748B', marginTop: '1.5rem' }}>
          © 2026 Gastos Hormiga. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}