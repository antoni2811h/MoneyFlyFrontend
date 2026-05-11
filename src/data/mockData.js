// ─────────────────────────────────────────────
//  mockData.js — Data de prueba para MoneyFly
// ─────────────────────────────────────────────

// ── Helpers ──────────────────────────────────

/** Formatea número como string con separadores de miles (COP) */
export const fmt = (n) => n.toLocaleString('es-CO');

/** Clase CSS de la barra de progreso según porcentaje */
export const pctClass = (pct) => {
  if (pct >= 100) return 'danger';
  if (pct >= 80)  return 'warn';
  return 'ok';
};

/** Clase CSS del badge según porcentaje */
export const pctBadgeClass = (pct) => {
  if (pct >= 100) return 'red';
  if (pct >= 80)  return 'orange';
  return 'green';
};

// ── Categorías ────────────────────────────────

export const CATEGORIAS = [
  {
    id: 1,
    nombre: 'Comida',
    desc: 'Restaurantes, domicilios y cafeterías',
    emoji: '🍔',
    colorHex: 'rgba(255,122,61,0.15)',
    gasto: 520000,
    limite: 400000,
    pct: 130,
  },
  {
    id: 2,
    nombre: 'Mercado',
    desc: 'Supermercados y tiendas',
    emoji: '🛒',
    colorHex: 'rgba(255,190,61,0.15)',
    gasto: 280000,
    limite: 400000,
    pct: 70,
  },
  {
    id: 3,
    nombre: 'Entretenimiento',
    desc: 'Streaming, juegos y salidas',
    emoji: '🎮',
    colorHex: 'rgba(155,114,247,0.15)',
    gasto: 170000,
    limite: 200000,
    pct: 85,
  },
  {
    id: 4,
    nombre: 'Transporte',
    desc: 'Metro, gasolina y taxis',
    emoji: '🚗',
    colorHex: 'rgba(79,142,247,0.15)',
    gasto: 90000,
    limite: 250000,
    pct: 36,
  },
  {
    id: 5,
    nombre: 'Salud',
    desc: 'Medicamentos y consultas',
    emoji: '💊',
    colorHex: 'rgba(52,211,153,0.15)',
    gasto: 45000,
    limite: 200000,
    pct: 22,
  },
  {
    id: 6,
    nombre: 'Ropa',
    desc: 'Prendas y accesorios',
    emoji: '👗',
    colorHex: 'rgba(244,114,182,0.15)',
    gasto: 180000,
    limite: 300000,
    pct: 60,
  },
];

// ── Medios de pago ────────────────────────────

export const MEDIOS = [
  {
    id: 1,
    nombre: 'Visa Débito',
    franq: 'VISA',
    num: '4521 •••• •••• 4521',
    titular: 'Carlos Ramírez',
    banco: 'Bancolombia',
    clase: 'visa-card',
    activo: true,
    medioIcon: 'ti-credit-card',
  },
  {
    id: 2,
    nombre: 'Mastercard Crédito',
    franq: 'MC',
    num: '5412 •••• •••• 7890',
    titular: 'Carlos Ramírez',
    banco: 'Davivienda',
    clase: 'mc-card',
    activo: true,
    medioIcon: 'ti-credit-card',
  },
  {
    id: 3,
    nombre: 'PSE / Nequi',
    franq: 'PSE',
    num: '3114 •••• •••• 2233',
    titular: 'Carlos Ramírez',
    banco: 'Nequi',
    clase: 'pse-card',
    activo: true,
    medioIcon: 'ti-device-mobile',
  },
  {
    id: 4,
    nombre: 'Visa Crédito',
    franq: 'VISA',
    num: '4916 •••• •••• 1144',
    titular: 'Carlos Ramírez',
    banco: 'BBVA',
    clase: 'visa-card',
    activo: false,
    medioIcon: 'ti-credit-card',
  },
];

// ── Gastos ────────────────────────────────────

export const GASTOS = [
  {
    id: 1,
    nombre: 'Éxito',
    sub: 'Mercado semanal',
    cat: 'Mercado',
    catClass: 'yellow',
    fecha: '08 may 2025',
    valor: 87400,
    medio: 'Visa •4521',
    medioIcon: 'ti-credit-card',
    icono: '🛒',
  },
  {
    id: 2,
    nombre: 'Rappi',
    sub: 'Domicilio comida',
    cat: 'Comida',
    catClass: 'orange',
    fecha: '07 may 2025',
    valor: 34900,
    medio: 'Nequi',
    medioIcon: 'ti-device-mobile',
    icono: '🍔',
  },
  {
    id: 3,
    nombre: 'Netflix',
    sub: 'Suscripción mensual',
    cat: 'Entretenimiento',
    catClass: 'purple',
    fecha: '06 may 2025',
    valor: 22900,
    medio: 'MC •7890',
    medioIcon: 'ti-credit-card',
    icono: '🎮',
  },
  {
    id: 4,
    nombre: 'Metro Medellín',
    sub: 'Recarga tarjeta cívica',
    cat: 'Transporte',
    catClass: 'blue',
    fecha: '06 may 2025',
    valor: 30000,
    medio: 'Nequi',
    medioIcon: 'ti-device-mobile',
    icono: '🚗',
  },
  {
    id: 5,
    nombre: 'El Corral',
    sub: 'Almuerzo con amigos',
    cat: 'Comida',
    catClass: 'orange',
    fecha: '05 may 2025',
    valor: 56800,
    medio: 'Visa •4521',
    medioIcon: 'ti-credit-card',
    icono: '🍔',
  },
  {
    id: 6,
    nombre: 'Drogas La Rebaja',
    sub: 'Medicamentos',
    cat: 'Salud',
    catClass: 'green',
    fecha: '04 may 2025',
    valor: 45000,
    medio: 'MC •7890',
    medioIcon: 'ti-credit-card',
    icono: '💊',
  },
  {
    id: 7,
    nombre: 'Zara',
    sub: 'Ropa temporada',
    cat: 'Ropa',
    catClass: 'pink',
    fecha: '03 may 2025',
    valor: 180000,
    medio: 'Visa •4521',
    medioIcon: 'ti-credit-card',
    icono: '👗',
  },
  {
    id: 8,
    nombre: 'Spotify',
    sub: 'Suscripción mensual',
    cat: 'Entretenimiento',
    catClass: 'purple',
    fecha: '02 may 2025',
    valor: 17900,
    medio: 'MC •7890',
    medioIcon: 'ti-credit-card',
    icono: '🎮',
  },
  {
    id: 9,
    nombre: 'Carulla',
    sub: 'Mercado quincenal',
    cat: 'Mercado',
    catClass: 'yellow',
    fecha: '01 may 2025',
    valor: 192600,
    medio: 'Visa •4521',
    medioIcon: 'ti-credit-card',
    icono: '🛒',
  },
  {
    id: 10,
    nombre: 'Uber',
    sub: 'Viaje al aeropuerto',
    cat: 'Transporte',
    catClass: 'blue',
    fecha: '30 abr 2025',
    valor: 60000,
    medio: 'Nequi',
    medioIcon: 'ti-device-mobile',
    icono: '🚗',
  },
  {
    id: 11,
    nombre: 'McDonald\'s',
    sub: 'Cena rápida',
    cat: 'Comida',
    catClass: 'orange',
    fecha: '29 abr 2025',
    valor: 28500,
    medio: 'Visa •4521',
    medioIcon: 'ti-credit-card',
    icono: '🍔',
  },
  {
    id: 12,
    nombre: 'Steam',
    sub: 'Videojuego',
    cat: 'Entretenimiento',
    catClass: 'purple',
    fecha: '28 abr 2025',
    valor: 129500,
    medio: 'MC •7890',
    medioIcon: 'ti-credit-card',
    icono: '🎮',
  },
];