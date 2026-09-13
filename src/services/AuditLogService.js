import BaseService from './BaseService';
import AuditLog from '../models/AuditLog';

export class AuditLogService extends BaseService {
  constructor() {
    super('audit_logs', AuditLog);
  }

  async getAllWithDetails(options = {}) {
    const select = options.select || '*, profiles:user_id(full_name, role)';
    return super.getAll({ ...options, select });
  }

  async log(action, resource, resourceId, details = '') {
    try {
      // In a real app we'd get the auth context via Supabase or a global auth store
      // Here we assume it's stored in localStorage for the mock
      const sessionStr = localStorage.getItem('sk_auth_session');
      const session = sessionStr ? JSON.parse(sessionStr) : null;
      const userId = session?.user?.id || null;

      const logEntry = new AuditLog({
        user_id: userId,
        action,
        resource,
        resource_id: resourceId,
        details: typeof details === 'object' ? JSON.stringify(details) : details
      });
      await this.create(logEntry);
    } catch (err) {
      console.error('Failed to write audit log:', err);
    }
  }
}

export const auditLogService = new AuditLogService();
export default auditLogService;
