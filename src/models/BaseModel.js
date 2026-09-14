/**
 * SKTrack — BaseModel
 * Abstract base class for all domain models.
 * Provides validation, serialization, and common computed properties.
 * 
 * ============================================================================
 * ⚠️ FIELD-MAPPING PATTERN ⚠️
 * All models MUST explicitly map between frontend state and database columns.
 * 
 * 1. constructor(data): Map DB columns -> Frontend fields
 *    Example: this.title = data.title || data.project_name || '';
 * 
 * 2. toJSON(): Map Frontend fields -> DB columns
 *    Example: { project_name: this.title }
 * 
 * 3. Validation: Rules evaluate against FRONTEND fields (e.g. 'title'), 
 *    and must run BEFORE toJSON() translation.
 * ============================================================================
 */

export class BaseModel {
  /**
   * @param {object} data - Raw data from database or form
   */
  constructor(data = {}) {
    this.id = data.id || null;
    this.created_at = data.created_at ? new Date(data.created_at) : null;
    this.updated_at = data.updated_at ? new Date(data.updated_at) : null;
  }

  /**
   * Validation rules to be overridden by subclasses.
   * Each rule: { field, test: (value, allData) => boolean, message: string }
   * @returns {Array}
   */
  get validationRules() {
    return [];
  }

  /**
   * Validate the model instance against its validation rules.
   * @returns {boolean}
   */
  validate() {
    return this.getValidationErrors().length === 0;
  }

  /**
   * Get all validation error messages.
   * @returns {{ field: string, message: string }[]}
   */
  getValidationErrors() {
    const errors = [];

    for (const rule of this.validationRules) {
      if (!rule.test(this[rule.field], this)) {
        errors.push({ field: rule.field, message: rule.message });
      }
    }

    return errors;
  }

  /**
   * Get validation errors grouped by field name.
   * @returns {object} - { fieldName: errorMessage }
   */
  getFieldErrors() {
    const errors = {};
    for (const err of this.getValidationErrors()) {
      if (!errors[err.field]) {
        errors[err.field] = err.message;
      }
    }
    return errors;
  }

  /**
   * Serialize the model to a plain object for API calls.
   * Subclasses should override and call super.toJSON().
   * @returns {object}
   */
  toJSON() {
    const json = {};
    if (this.id) json.id = this.id;
    return json;
  }

  /**
   * Create a model instance from raw JSON data.
   * @param {object} data
   * @returns {BaseModel}
   */
  static fromJSON(data) {
    return new this(data);
  }

  /**
   * Create an array of model instances from an array of raw data.
   * @param {Array} dataArray
   * @returns {BaseModel[]}
   */
  static fromArray(dataArray) {
    if (!Array.isArray(dataArray)) return [];
    return dataArray.map((item) => this.fromJSON(item));
  }

  /**
   * Get a human-readable display name. Override in subclasses.
   * @returns {string}
   */
  getDisplayName() {
    return this.id || 'Unknown';
  }

  /**
   * Check if this is a new (unsaved) record.
   * @returns {boolean}
   */
  isNew() {
    return !this.id;
  }

  /**
   * Clone this model instance.
   * @returns {BaseModel}
   */
  clone() {
    return this.constructor.fromJSON(this.toJSON());
  }
}

export default BaseModel;
