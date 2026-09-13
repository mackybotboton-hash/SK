import BaseController from './BaseController';
import ReportEngine from '../engines/ReportEngine';

export class ReportController extends BaseController {
  constructor() {
    super(null); 
    this.currentReport = null;
  }

  async generateReport(type, startDate, endDate) {
    this.setLoading(true);
    this.clearError();
    try {
      let reportData = null;
      if (type === 'financial') {
        reportData = await ReportEngine.generateFinancialReport(startDate, endDate);
      } else if (type === 'projects') {
        reportData = await ReportEngine.generateProjectReport();
      } else {
        throw new Error('Unknown report type');
      }
      
      this.currentReport = reportData;
      this.setData({ currentReport: this.currentReport });
      return reportData;
    } catch (error) {
      this.handleError(error);
      return null;
    } finally {
      this.setLoading(false);
    }
  }

  clearReport() {
    this.currentReport = null;
    this.setData({ currentReport: null });
  }
}

export const reportController = new ReportController();
export default reportController;
