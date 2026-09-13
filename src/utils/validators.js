/**
 * SKTrack — Validators
 * Reusable validation functions for forms and model data.
 */

/**
 * Check if a value is not empty (string, array, or object).
 * @param {*} value
 * @returns {boolean}
 */
export function isRequired(value) {
  if (value == null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * Check if a string is a valid email.
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Check if a number is positive.
 * @param {number} value
 * @returns {boolean}
 */
export function isPositiveNumber(value) {
  return typeof value === 'number' && value > 0;
}

/**
 * Check if a number is non-negative.
 * @param {number} value
 * @returns {boolean}
 */
export function isNonNegative(value) {
  return typeof value === 'number' && value >= 0;
}

/**
 * Check if a string meets minimum length.
 * @param {string} value
 * @param {number} min
 * @returns {boolean}
 */
export function minLength(value, min) {
  if (!value) return false;
  return value.trim().length >= min;
}

/**
 * Check if a string doesn't exceed maximum length.
 * @param {string} value
 * @param {number} max
 * @returns {boolean}
 */
export function maxLength(value, max) {
  if (!value) return true;
  return value.trim().length <= max;
}

/**
 * Check if a date string is valid.
 * @param {string} dateStr
 * @returns {boolean}
 */
export function isValidDate(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

/**
 * Check if end date is after start date.
 * @param {string} startDate
 * @param {string} endDate
 * @returns {boolean}
 */
export function isEndAfterStart(startDate, endDate) {
  if (!startDate || !endDate) return true; // Don't validate if either is missing
  return new Date(endDate) >= new Date(startDate);
}

/**
 * Check if file size is within limit.
 * @param {number} sizeInBytes
 * @param {number} maxBytes
 * @returns {boolean}
 */
export function isValidFileSize(sizeInBytes, maxBytes = 10 * 1024 * 1024) {
  return sizeInBytes > 0 && sizeInBytes <= maxBytes;
}

/**
 * Check if file type is allowed.
 * @param {string} fileName
 * @param {string[]} allowedExtensions
 * @returns {boolean}
 */
export function isAllowedFileType(fileName, allowedExtensions) {
  if (!fileName) return false;
  const ext = '.' + fileName.split('.').pop().toLowerCase();
  return allowedExtensions.includes(ext);
}

/**
 * Run a set of validation rules against a data object.
 * Returns an object of field → error message, or empty object if valid.
 *
 * @param {object} data - The data to validate
 * @param {object} rules - { fieldName: [{ test: fn, message: string }] }
 * @returns {object} errors - { fieldName: string }
 */
export function validateFields(data, rules) {
  const errors = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    for (const rule of fieldRules) {
      if (!rule.test(data[field], data)) {
        errors[field] = rule.message;
        break; // Stop at first failure per field
      }
    }
  }

  return errors;
}
