/**
 * SKTrack — Helpers
 * General-purpose utility functions.
 */

/**
 * Generate a simple unique ID (not UUID, just for UI keys).
 * @returns {string}
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Debounce a function.
 * @param {Function} fn
 * @param {number} delay - milliseconds
 * @returns {Function}
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Deep clone an object (simple JSON-safe).
 * @param {object} obj
 * @returns {object}
 */
export function deepClone(obj) {
  if (obj == null || typeof obj !== 'object') return obj;
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Sort an array of objects by a key.
 * @param {Array} arr
 * @param {string} key
 * @param {'asc'|'desc'} direction
 * @returns {Array}
 */
export function sortByKey(arr, key, direction = 'asc') {
  return [...arr].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];
    if (valA == null) return 1;
    if (valB == null) return -1;
    const compare = valA < valB ? -1 : valA > valB ? 1 : 0;
    return direction === 'asc' ? compare : -compare;
  });
}

/**
 * Filter an array by a search query across multiple fields.
 * @param {Array} arr
 * @param {string} query
 * @param {string[]} fields
 * @returns {Array}
 */
export function searchFilter(arr, query, fields) {
  if (!query || !query.trim()) return arr;
  const lowerQuery = query.toLowerCase().trim();
  return arr.filter((item) =>
    fields.some((field) => {
      const val = item[field];
      return val && String(val).toLowerCase().includes(lowerQuery);
    })
  );
}

/**
 * Group an array of objects by a key.
 * @param {Array} arr
 * @param {string} key
 * @returns {object} - { groupValue: [...items] }
 */
export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = item[key] || 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
}

/**
 * Pick specific keys from an object.
 * @param {object} obj
 * @param {string[]} keys
 * @returns {object}
 */
export function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {});
}

/**
 * Omit specific keys from an object.
 * @param {object} obj
 * @param {string[]} keys
 * @returns {object}
 */
export function omit(obj, keys) {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));
}

/**
 * Paginate an array.
 * @param {Array} arr
 * @param {number} page - 1-indexed
 * @param {number} perPage
 * @returns {{ data: Array, total: number, totalPages: number, page: number }}
 */
export function paginate(arr, page = 1, perPage = 10) {
  const total = arr.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const data = arr.slice(start, start + perPage);
  return { data, total, totalPages, page };
}

/**
 * Wait for a specified number of milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safely parse JSON, returning a default value on failure.
 * @param {string} str
 * @param {*} defaultValue
 * @returns {*}
 */
export function safeJsonParse(str, defaultValue = null) {
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
}

/**
 * Check if two dates are the same day.
 * @param {Date} date1
 * @param {Date} date2
 * @returns {boolean}
 */
export function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Clamp a number between min and max.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
