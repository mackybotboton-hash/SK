import { useEffect } from 'react';
import useController from './useController';
import { reportController } from '../controllers/ReportController';

export function useReports() {
  const state = useController(reportController);
  const data = state.data || {};

  return {
    ...state,
    currentReport: data.currentReport || null,
    generateReport: (type, start, end) => reportController.generateReport(type, start, end),
    clearReport: () => reportController.clearReport(),
  };
}

export default useReports;
