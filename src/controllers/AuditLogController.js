import BaseController from './BaseController';
import auditLogService from '../services/AuditLogService';

export class AuditLogController extends BaseController {
  constructor() {
    super(auditLogService);
  }

  async loadLogs(filters = {}) {
    this.setLoading(true);
    try {
      const result = await this.service.getAllWithDetails({ filters, orderBy: 'created_at', orderAsc: false });
      this.setData({ logs: result.data || [] });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }
}

export const auditLogController = new AuditLogController();
export default auditLogController;
