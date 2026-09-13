/**
 * SKTrack — NotificationSystem (Singleton)
 * Global toast notification system.
 */

let nextId = 1;

class NotificationSystem {
  static _instance = null;

  constructor() {
    if (NotificationSystem._instance) {
      return NotificationSystem._instance;
    }
    this._toasts = [];
    this._listeners = new Set();
    NotificationSystem._instance = this;
  }

  static getInstance() {
    if (!NotificationSystem._instance) {
      new NotificationSystem();
    }
    return NotificationSystem._instance;
  }

  _notify() {
    for (const listener of this._listeners) {
      listener([...this._toasts]);
    }
  }

  _addToast(type, message, duration = 5000) {
    const id = nextId++;
    const toast = { id, type, message, timestamp: Date.now() };
    this._toasts.push(toast);
    this._notify();

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }

    return id;
  }

  success(message, duration) {
    return this._addToast('success', message, duration);
  }

  error(message, duration = 8000) {
    return this._addToast('error', message, duration);
  }

  warning(message, duration) {
    return this._addToast('warning', message, duration);
  }

  info(message, duration) {
    return this._addToast('info', message, duration);
  }

  dismiss(id) {
    this._toasts = this._toasts.filter((t) => t.id !== id);
    this._notify();
  }

  dismissAll() {
    this._toasts = [];
    this._notify();
  }

  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  getToasts() {
    return [...this._toasts];
  }
}

export default NotificationSystem;
