/**
 * SKTrack — BudgetAlertEngine
 * Evaluates budget and expense data to generate warnings and critical alerts.
 */
export class BudgetAlertEngine {
  static WARNING_THRESHOLD = 0.8; // 80%
  static CRITICAL_THRESHOLD = 1.0; // 100%

  /**
   * Generates alerts based on current spend vs allocation.
   * @param {Array} budgets
   * @param {Array} expenses 
   * @returns {Array} List of alerts { category, type, message }
   */
  static generateAlerts(budgets, expenses) {
    const alerts = [];

    // Calculate spend per category
    const spendByCategory = expenses.reduce((acc, exp) => {
      acc[exp.budget_category] = (acc[exp.budget_category] || 0) + exp.amount;
      return acc;
    }, {});

    for (const budget of budgets) {
      const spent = spendByCategory[budget.category] || 0;
      const utilization = spent / budget.allocated_amount;

      if (utilization >= this.CRITICAL_THRESHOLD) {
        alerts.push({
          category: budget.category,
          type: 'critical',
          message: `Budget for ${budget.category} is exhausted or overdrawn (${(utilization * 100).toFixed(1)}%).`
        });
      } else if (utilization >= this.WARNING_THRESHOLD) {
        alerts.push({
          category: budget.category,
          type: 'warning',
          message: `${budget.category} budget is running low (${(utilization * 100).toFixed(1)}% utilized).`
        });
      }
    }

    return alerts;
  }
}

export default BudgetAlertEngine;
