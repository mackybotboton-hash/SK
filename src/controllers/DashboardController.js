import BaseController from './BaseController';

/**
 * SKTrack — DashboardController
 * Aggregates data from multiple services for the dashboard view.
 * Uses mock data for Loop 2; will be wired to actual services in later loops.
 */
export class DashboardController extends BaseController {
  constructor() {
    super(null); 
    this.stats = null;
    this.budgetData = [];
    this.projectData = [];
    this.recentActivities = [];
    this.upcomingActivities = [];
  }

  async initialize() {
    this.setLoading(true);
    try {
      // Mock data for Loop 2 Dashboard Shell
      await new Promise(resolve => setTimeout(resolve, 600));

      const stats = {
        totalProjects: 12,
        activeProjects: 5,
        totalBudget: 1500000,
        budgetUtilized: 450000,
        pendingProposals: 3
      };

      const budgetData = [
        { name: 'Infrastructure', allocated: 500000, spent: 300000 },
        { name: 'Sports', allocated: 300000, spent: 100000 },
        { name: 'Education', allocated: 400000, spent: 50000 },
        { name: 'Health', allocated: 300000, spent: 0 },
      ];

      const projectData = [
        { name: 'Proposed', value: 3 },
        { name: 'For Review', value: 2 },
        { name: 'Approved', value: 1 },
        { name: 'Ongoing', value: 4 },
        { name: 'Completed', value: 2 }
      ];

      const recentActivities = [
        { id: '1', action: 'Project Proposal Submitted', user: 'Maria Santos', time: '2 hours ago', icon: 'MdDescription', color: 'var(--primary)' },
        { id: '2', action: 'Budget Approved for Inter-Barangay Liga', user: 'SK Chairperson', time: '1 day ago', icon: 'MdAccountBalance', color: 'var(--success)' },
        { id: '3', action: 'Receipt uploaded for Clean & Green', user: 'Juan Dela Cruz', time: '2 days ago', icon: 'MdAttachFile', color: 'var(--info)' },
      ];

      const upcomingActivities = [
        { id: '1', title: 'Monthly SK Meeting', date: 'Oct 15, 2026', location: 'Barangay Hall' },
        { id: '2', title: 'Youth Assembly', date: 'Oct 20, 2026', location: 'Covered Court' },
      ];

      this.setData({ stats, budgetData, projectData, recentActivities, upcomingActivities });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }
}

export const dashboardController = new DashboardController();
export default dashboardController;
