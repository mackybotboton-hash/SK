import BaseController from './BaseController';
import { budgetService, expenseService } from '../services/FinanceService';
import BudgetAlertEngine from '../engines/BudgetAlertEngine';
import NotificationSystem from '../engines/NotificationSystem';

export class FinanceController extends BaseController {
  constructor() {
    super(null); 
  }

  async loadFinanceData(filters = {}) {
    this.setLoading(true);
    try {
      const [budgetsRes, expensesRes] = await Promise.all([
        budgetService.getAll(),
        expenseService.getAllWithDetails({ filters, orderBy: 'date', orderAsc: false })
      ]);

      const budgets = budgetsRes.data || [];
      const expenses = expensesRes.data || [];

      const alerts = BudgetAlertEngine.generateAlerts(budgets, expenses);

      this.setData({ budgets, expenses, alerts });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }

  async saveExpense(expense) {
    this.setLoading(true);
    this.clearError();
    try {
      if (!expense.validate()) {
        throw new Error(expense.getValidationErrors()[0]?.message);
      }

      let saved;
      if (expense.isNew()) {
        saved = await expenseService.create(expense);
        NotificationSystem.getInstance().success('Expense logged successfully.');
      } else {
        saved = await expenseService.update(expense.id, expense);
        NotificationSystem.getInstance().success('Expense updated.');
      }
      
      await this.loadFinanceData();
      return saved;
    } catch (error) {
      this.handleError(error);
      NotificationSystem.getInstance().error(error.message);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  async deleteExpense(id) {
    this.setLoading(true);
    try {
      await expenseService.delete(id);
      NotificationSystem.getInstance().success('Expense deleted.');
      await this.loadFinanceData();
      return true;
    } catch (error) {
      this.handleError(error);
      NotificationSystem.getInstance().error(error.message);
      return false;
    } finally {
      this.setLoading(false);
    }
  }
}

export const financeController = new FinanceController();
export default financeController;
