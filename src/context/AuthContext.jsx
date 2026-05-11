import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
//  AuthContext — MoneyFly
//
//  Endpoints reales de la API:
//    GET  http://localhost/loginApi/            → verificar que la API está viva
//    POST http://localhost/loginApi/login       → { correo, contrasena }
//    POST http://localhost/loginApi/register    → { nombre, correo, contrasena }
//
//  Provee a toda la app:
//    user            → datos del usuario autenticado (ver estructura abajo)
//    isAuthenticated → boolean
//    loading         → true mientras se verifica la sesión al arrancar
//    login()         → inicia sesión
//    register()      → crea cuenta nueva
//    logout()        → cierra sesión
//    updateUser()    → actualiza datos locales sin hacer logout
//    getToken()      → JWT para peticiones protegidas
//
//  Estructura de `user` que usan los componentes:
//    {
//      id:              string | number,
//      name:            string,   ← Topnav (iniciales), Sidebar, Perfil
//      email:           string,   ← Perfil
//      telefono:        string,   ← Perfil
//      tipoDoc:         string,   ← Perfil  ('CC' | 'CE' | 'TI' | 'PP')
//      documento:       string,   ← Perfil
//      edad:            number,
//      genero:          string,
//      ocupacion:       string,   ← Perfil
//      createdAt:       string,   ← Perfil  (ej. 'Enero 2025')
//      totalGastos:     number,   ← Perfil
//      totalCategorias: number,   ← Perfil
//    }
//
//  NOTA: Tu API actual maneja { nombre, correo, contrasena }.
//  Los campos extra del formulario de Registro.jsx se mapean aquí y el backend
//  los ignorará hasta que los implementes. No necesitas tocar ningún page.
//
//  Para cambiar la URL, crea .env en la raíz:
//    VITE_API_URL=http://localhost/loginApi
// ─────────────────────────────────────────────────────────────────────────────

const API_URL   = import.meta.env.VITE_API_URL || 'http://localhost/loginApi';
const TOKEN_KEY = 'mf_token';
const USER_KEY  = 'mf_user';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,            setUser]            = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading,         setLoading]         = useState(true);

  // ── Helpers internos ──────────────────────────────────────────────────────

  const saveSession = (token, userData) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Normaliza la respuesta de la API al formato que usan los componentes.
  // Tu API devuelve { nombre, correo } → los componentes esperan { name, email }
  const normalizeUser = (apiUser, extras = {}) => ({
    id:              apiUser?.id              || null,
    name:            apiUser?.nombre          || apiUser?.name  || extras.nombre || '',
    email:           apiUser?.correo          || apiUser?.email || extras.correo || '',
    telefono:        apiUser?.telefono        || extras.telefono   || '',
    tipoDoc:         apiUser?.tipoDoc         || extras.tipoDoc    || '',
    documento:       apiUser?.documento       || extras.documento  || '',
    edad:            apiUser?.edad            || extras.edad       || null,
    genero:          apiUser?.genero          || extras.genero     || '',
    ocupacion:       apiUser?.ocupacion       || extras.ocupacion  || '',
    createdAt:       apiUser?.createdAt       || '',
    totalGastos:     apiUser?.totalGastos     || 0,
    totalCategorias: apiUser?.totalCategorias || 0,
  });

  // ── Restaurar sesión al recargar la página ────────────────────────────────
  useEffect(() => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userData = localStorage.getItem(USER_KEY);

    if (token && userData) {
      const parsedUser = JSON.parse(userData);

      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  } catch (error) {
    console.error(error);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } finally {
    setLoading(false);
  }
}, []);

  // ── login(correo, contrasena) ─────────────────────────────────────────────
  //  Endpoint: POST /login
  //  Body:     { correo, contrasena }
  //  Respuesta esperada: { token, user } o { token, usuario } o { token, data }
  //
  //  Si tu API no devuelve un objeto user (solo devuelve el token),
  //  el nombre se mostrará vacío en Topnav/Perfil hasta que hagas otra llamada
  //  para obtener el perfil. Puedes añadir ese fetch aquí cuando lo necesites.
  const login = useCallback(async (correo, contrasena) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ correo, contrasena }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || data.error || 'Credenciales incorrectas.',
        };
      }

      // Tu API devuelve el usuario directamente sin token:
      // { id, nombre, correo, contrasena }
      // Usamos "session_{id}" como identificador hasta que implementes JWT.
      // Cuando tu backend devuelva token, esto sigue funcionando sin cambios.
      const token   = data.token || data.access_token || data.jwt || ('session_' + data.id);
      const apiUser = data.user  || data.usuario      || data.data || data;

      if (!apiUser.id && !data.id) {
        return { success: false, message: 'Credenciales incorrectas.' };
      }

      saveSession(token, normalizeUser(apiUser, { correo }));
      return { success: true };

    } catch (err) {
      console.error('[AuthContext] login error:', err);
      return { success: false, message: 'No se pudo conectar con el servidor.' };
    }
  }, []);

  // ── register(formData) ────────────────────────────────────────────────────
  //  Endpoint: POST /register
  //  Body mínimo que espera tu API: { nombre, correo, contrasena }
  //  Se envían también los campos extra de Registro.jsx — el backend
  //  los ignorará hasta que los implementes en tu API.
  const register = useCallback(async (formData) => {
    try {
      const payload = {
        nombre:     formData.nombres    || formData.nombre || '',  // Registro.jsx usa "nombres"
        correo:     formData.correo,
        contrasena: formData.contrasena,
        // Campos extra — el backend los ignora si no los procesa:
        tipoDoc:    formData.tipoDoc    || '',
        documento:  formData.documento  || '',
        edad:       formData.edad       || null,
        genero:     formData.genero     || '',
        telefono:   formData.telefono   || '',
        ocupacion:  formData.ocupacion  || '',
      };

      const res = await fetch(`${API_URL}/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || data.error || 'Error al crear la cuenta.',
        };
      }

      // Si la API devuelve token al registrarse → sesión automática
      const token   = data.token || data.access_token || data.jwt;
      const apiUser = data.user  || data.usuario      || data.data || {};

      if (token) {
        saveSession(token, normalizeUser(apiUser, payload));
      }

      return { success: true };

    } catch (err) {
      console.error('[AuthContext] register error:', err);
      return { success: false, message: 'No se pudo conectar con el servidor.' };
    }
  }, []);

  // ── logout() ──────────────────────────────────────────────────────────────
  //  Usado en: Sidebar.jsx → handleLogout()
  //            Topnav.jsx  → handleLogout()
  const logout = useCallback(() => {
    clearSession();
  }, []);

  // ── updateUser(newData) ───────────────────────────────────────────────────
  //  Para Ajustes.jsx cuando implementes edición de perfil:
  //    const { updateUser } = useAuth();
  //    updateUser({ name: 'Nuevo nombre', telefono: '3001234567' });
  const updateUser = useCallback((newData) => {
    setUser(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // ── getToken() ────────────────────────────────────────────────────────────
  //  Para cualquier petición protegida en tus pages:
  //    const { getToken } = useAuth();
  //    const res = await fetch('http://localhost/loginApi/gastos', {
  //      headers: { Authorization: `Bearer ${getToken()}` }
  //    });
  const getToken = useCallback(() => localStorage.getItem(TOKEN_KEY), []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      register,
      logout,
      updateUser,
      getToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook de conveniencia ──────────────────────────────────────────────────────
//  import { useAuth } from '../context/AuthContext';
//  const { user, login, logout, getToken } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>. Revisa main.jsx.');
  }
  return context;
}