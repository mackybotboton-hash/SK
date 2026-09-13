import projectService from '../services/ProjectService';
import { expenseService, budgetService } from '../services/FinanceService';

export class ReportEngine {
  
  static async generateFinancialReport(startDate, endDate) {
    const [budgetsRes, expensesRes] = await Promise.all([
      budgetService.getAll(),
      expenseService.getAll({
        // In a real app with Supabase, we would pass filters here.
        // For the mock service or if filters aren't fully implemented in BaseService,
        // we'll fetch all and filter in memory just to be safe.
      })
    ]);

    const budgets = budgetsRes.data || [];
    let expenses = expensesRes.data || [];

    if (startDate && endDate) {
      expenses = expenses.filter(e => {
        const d = new Date(e.date).getTime();
        return d >= new Date(startDate).getTime() && d <= new Date(endDate).getTime();
      });
    }

    const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated_amount, 0);
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    const breakdown = budgets.map(budget => {
      const spent = expenses
        .filter(e => e.budget_category === budget.category)
        .reduce((sum, e) => sum + e.amount, 0);
      return {
        category: budget.category,
        allocated: budget.allocated_amount,
        spent: spent,
        remaining: budget.allocated_amount - spent,
        utilization: budget.allocated_amount > 0 ? (spent / budget.allocated_amount) * 100 : 0
      };
    });

    return {
      type: 'Financial Report',
      period: startDate && endDate ? `${startDate} to ${endDate}` : 'All Time',
      generatedAt: new Date().toISOString(),
      summary: { totalAllocated, totalSpent, remaining: totalAllocated - totalSpent },
      breakdown,
      transactions: expenses
    };
  }

  static async generateProjectReport() {
    const projectsRes = await projectService.getAll();
    const projects = projectsRes.data || [];

    const statusCounts = projects.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});

    return {
      type: 'Project Status Report',
      period: 'All Time',
      generatedAt: new Date().toISOString(),
      summary: {
        totalProjects: projects.length,
        statusCounts
      },
      projects: projects.map(p => ({
        name: p.name,
        status: p.status,
        budget: p.approved_budget || p.proposed_budget,
        timeline: `${p.start_date} to ${p.end_date || 'TBD'}`
      }))
    };
  }
}

export default ReportEngine;
