import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ✅ URL base — apunta a usuarios, no al endpoint completo
const API_BASE  = import.meta.env.VITE_API_URL || 'http://localhost:8080/apimoneyfly/v1';
const API_URL   = `${API_BASE}/usuarios`;
const TOKEN_KEY = 'mf_token';
const USER_KEY  = 'mf_user';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,            setUser]            = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading,         setLoading]         = useState(true);

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

  // ✅ normalizeUser incluye "contrasena" para que Perfil.jsx
  // pueda reenviarlo al backend sin perderlo al actualizar
  const normalizeUser = (apiUser) => ({
    id:              apiUser?.id              ?? null,
    name:            apiUser?.nombres         || '',
    email:           apiUser?.correo          || '',
    telefono:        apiUser?.telefono        || '',
    tipoDoc:         apiUser?.tipoDocumento   || '',
    documento:       apiUser?.documento       || '',
    edad:            apiUser?.edad            ?? null,
    genero:          apiUser?.genero          || '',
    ocupacion:       apiUser?.ocupacion       || '',
    // ✅ AGREGADO — se necesita para reenviar al backend en el update de perfil
    // El backend devuelve la contrasena en texto plano (no hay cifrado aun)
    contrasena:      apiUser?.contrasena      || apiUser?.['contraseña'] || '',
    createdAt:       apiUser?.createdAt       || '',
    totalGastos:     apiUser?.totalGastos     || 0,
    totalCategorias: apiUser?.totalCategorias || 0,
  });

  // Restaurar sesion al recargar
  useEffect(() => {
    try {
      const token    = localStorage.getItem(TOKEN_KEY);
      const userData = localStorage.getItem(USER_KEY);
      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── login ──────────────────────────────────────────────
  const login = useCallback(async (correo, contrasena) => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) return { success: false, message: 'Error al conectar con el servidor.' };

      const usuarios = await res.json();

      // Buscar por correo y contrasena
      // El campo del backend se llama "contraseña" con ñ
      const encontrado = usuarios.find(u =>
        u.correo === correo && (u.contraseña === contrasena || u.contrasena === contrasena)
      );

      if (!encontrado) {
        return { success: false, message: 'Correo o contrasena incorrectos.' };
      }

      const token = 'session_' + encontrado.id + '_' + Date.now();
      saveSession(token, normalizeUser(encontrado));
      return { success: true };

    } catch {
      return { success: false, message: 'No se pudo conectar con el servidor.' };
    }
  }, []);

  // ── register ───────────────────────────────────────────
  const register = useCallback(async (formData) => {
    try {
      const payload = {
        nombres:       formData.nombres    || '',
        correo:        formData.correo,
        // ✅ "contraseña" con ñ — nombre exacto del campo en Usuario.java
        contraseña:    formData.contrasena,
        tipoDocumento: formData.tipoDoc    || '',
        documento:     formData.documento  || '',
        edad:          parseInt(formData.edad, 10) || 0,
        genero:        formData.genero     || '',
        telefono:      formData.telefono   || '',
        ocupacion:     formData.ocupacion  || '',
      };

      const res = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return { success: false, message: data.message || data.error || `Error ${res.status}` };
      }

      // ✅ Login automatico con el usuario recien creado
      if (data?.id) {
        const token = 'session_' + data.id + '_' + Date.now();
        saveSession(token, normalizeUser(data));
      }

      return { success: true };

    } catch {
      return { success: false, message: 'No se pudo conectar con el servidor.' };
    }
  }, []);

  // ── logout ─────────────────────────────────────────────
  const logout = useCallback(() => {
    clearSession();
  }, []);

  // ── updateUser ─────────────────────────────────────────
  const updateUser = useCallback((newData) => {
    setUser(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getToken = useCallback(() => localStorage.getItem(TOKEN_KEY), []);

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated, loading,
      login, register, logout, updateUser, getToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
  return context;
}