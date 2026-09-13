/**
 * SKTrack — BaseController
 * Abstract base class for all controllers.
 * Manages loading/error state, orchestrates service calls, and audit logging.
 */

export class BaseController {
  /**
   * @param {import('../services/BaseService').BaseService} service
   */
  constructor(service) {
    this.service = service;
    this._auditService = null; // Set lazily to avoid circular deps
    this.loading = false;
    this.error = null;
    this.data = null;
    this._listeners = new Set();
  }

  // ─── State Management ────────────────────────────────

  /**
   * Subscribe to state changes.
   * @param {Function} listener
   * @returns {Function} unsubscribe
   */
  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  /**
   * Notify all subscribers of a state change.
   */
  _notify() {
    for (const listener of this._listeners) {
      listener({
        loading: this.loading,
        error: this.error,
        data: this.data,
      });
    }
  }

  /**
   * Set loading state.
   * @param {boolean} state
   */
  setLoading(state) {
    this.loading = state;
    this._notify();
  }

  /**
   * Set error state.
   * @param {string|null} error
   */
  setError(error) {
    this.error = error;
    this.loading = false;
    this._notify();
  }

  /**
   * Clear the current error.
   */
  clearError() {
    this.error = null;
    this._notify();
  }

  /**
   * Set data and clear loading/error.
   * @param {*} data
   */
  setData(data) {
    this.data = data;
    this.loading = false;
    this.error = null;
    this._notify();
  }

  // ─── Error Handling ──────────────────────────────────

  /**
   * Handle an error consistently.
   * @param {Error|string} error
   */
  handleError(error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[${this.constructor.name}]`, message);
    this.setError(message);
  }

  // ─── Audit Logging ──────────────────────────────────

  /**
   * Set the audit service (called after initialization to avoid circular deps).
   * @param {import('../services/AuditService').AuditService} auditService
   */
  setAuditService(auditService) {
    this._auditService = auditService;
  }

  /**
   * Log an action to the audit trail.
   * @param {string} action - e.g., 'created', 'updated', 'deleted'
   * @param {string} entityType - e.g., 'project', 'expense'
   * @param {string} entityId - ID of the affected record
   * @param {object} details - Additional context
   */
  async logAction(action, entityType, entityId, details = {}) {
    if (!this._auditService) return;
    try {
      await this._auditService.log(action, entityType, entityId, details);
    } catch (err) {
      // Audit logging should never break the main flow
      console.warn('Audit log failed:', err);
    }
  }

  // ─── Common Operations ──────────────────────────────

  /**
   * Wrap an async operation with loading/error handling.
   * @param {Function} operation - async function to execute
   * @returns {Promise<*>}
   */
  async execute(operation) {
    this.setLoading(true);
    this.clearError();
    try {
      const result = await operation();
      this.setLoading(false);
      return result;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  /**
   * Fetch all records with standard error handling.
   * @param {object} options
   * @returns {Promise<{ data: Array, count: number }|null>}
   */
  async fetchAll(options = {}) {
    return this.execute(async () => {
      const result = await this.service.getAll(options);
      this.setData(result.data);
      return result;
    });
  }

  /**
   * Fetch a single record by ID.
   * @param {string} id
   * @returns {Promise<*>}
   */
  async fetchById(id) {
    return this.execute(async () => {
      const result = await this.service.getById(id);
      return result;
    });
  }

  /**
   * Create a new record.
   * @param {object} data
   * @param {string} entityType - For audit logging
   * @returns {Promise<*>}
   */
  async create(data, entityType) {
    return this.execute(async () => {
      const result = await this.service.create(data);
      if (entityType) {
        await this.logAction('created', entityType, result.id, {
          name: result.getDisplayName ? result.getDisplayName() : result.name,
        });
      }
      return result;
    });
  }

  /**
   * Update a record.
   * @param {string} id
   * @param {object} updates
   * @param {string} entityType - For audit logging
   * @returns {Promise<*>}
   */
  async update(id, updates, entityType) {
    return this.execute(async () => {
      const result = await this.service.update(id, updates);
      if (entityType) {
        await this.logAction('updated', entityType, id, {
          changes: Object.keys(updates),
        });
      }
      return result;
    });
  }

  /**
   * Delete a record.
   * @param {string} id
   * @param {string} entityType - For audit logging
   * @param {string} displayName - For audit log detail
   * @returns {Promise<boolean>}
   */
  async remove(id, entityType, displayName) {
    return this.execute(async () => {
      const result = await this.service.delete(id);
      if (entityType) {
        await this.logAction('deleted', entityType, id, { name: displayName });
      }
      return result;
    });
  }
}

export default BaseController;
