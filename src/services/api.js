const API_BASE        = import.meta.env.VITE_API_URL        || 'http://localhost:8080/apimoneyfly/v1';
const PYTHON_API_BASE = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:5000/api';

const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json();
};

// ========== USUARIOS ==========
export const usuariosApi = {

  getAll: async () => {
    const res = await fetch(`${API_BASE}/usuarios`);
    return handleResponse(res);
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE}/usuarios/${id}`);
    return handleResponse(res);
  },

  // ✅ AGREGADO — faltaba el create para el registro
  create: async (usuario) => {
    const res = await fetch(`${API_BASE}/usuarios`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(usuario),
    });
    return handleResponse(res);
  },

  update: async (id, data) => {
    const res = await fetch(`${API_BASE}/usuarios/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });
    return handleResponse(res);
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE}/usuarios/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },
};

// ========== GASTOS ==========
export const gastosApi = {

  getAll: async (usuarioId) => {
    const res = await fetch(`${API_BASE}/gastos/usuario/${usuarioId}`);
    return handleResponse(res);
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE}/gastos/${id}`);
    return handleResponse(res);
  },

  create: async (usuarioId, gasto) => {
    const res = await fetch(`${API_BASE}/gastos/usuario/${usuarioId}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(gasto),
    });
    return handleResponse(res);
  },

  update: async (id, gasto) => {
    const res = await fetch(`${API_BASE}/gastos/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(gasto),
    });
    return handleResponse(res);
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE}/gastos/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },
};

// ========== CATEGORIAS ==========
export const categoriasApi = {

  getAll: async (usuarioId) => {
    const res = await fetch(`${API_BASE}/categorias/usuario/${usuarioId}`);
    return handleResponse(res);
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE}/categorias/${id}`);
    return handleResponse(res);
  },

  create: async (usuarioId, categoria) => {
    const res = await fetch(`${API_BASE}/categorias/usuario/${usuarioId}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(categoria),
    });
    return handleResponse(res);
  },

  update: async (id, categoria) => {
    const res = await fetch(`${API_BASE}/categorias/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(categoria),
    });
    return handleResponse(res);
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE}/categorias/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },
};

// ========== COMERCIOS ==========
export const comerciosApi = {

  getAll: async () => {
    const res = await fetch(`${API_BASE}/comercio`);
    return handleResponse(res);
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE}/comercio/${id}`);
    return handleResponse(res);
  },

  create: async (comercio) => {
    const res = await fetch(`${API_BASE}/comercio`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(comercio),
    });
    return handleResponse(res);
  },

  update: async (id, comercio) => {
    const res = await fetch(`${API_BASE}/comercio/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(comercio),
    });
    return handleResponse(res);
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE}/comercio/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },
};

// ========== API PYTHON ==========
export const pythonApi = {

  predecirGastos: async (data) => {
    const res = await fetch(`${PYTHON_API_BASE}/predecir`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });
    return handleResponse(res);
  },

  analizarGastos: async (userId) => {
    const res = await fetch(`${PYTHON_API_BASE}/analizar/${userId}`);
    return handleResponse(res);
  },
};