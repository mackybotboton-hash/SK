import { useEffect } from 'react';
import useController from './useController';
import { auditLogController } from '../controllers/AuditLogController';

export function useAuditLogs(autoLoad = true, filters = {}) {
  const state = useController(auditLogController);
  const data = state.data || {};

  useEffect(() => {
    if (autoLoad) {
      auditLogController.loadLogs(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad, JSON.stringify(filters)]);

  return {
    ...state,
    logs: data.logs || [],
    loadLogs: (f) => auditLogController.loadLogs(f)
  };
}

export default useAuditLogs;
