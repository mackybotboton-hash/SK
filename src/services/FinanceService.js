import BaseService from './BaseService';
import Budget from '../models/Budget';
import Expense from '../models/Expense';

export class BudgetService extends BaseService {
  constructor() {
    super('budgets', Budget);
  }
}

export class ExpenseService extends BaseService {
  constructor() {
    super('expenses', Expense);
  }
  
  async getAllWithDetails(options = {}) {
    const select = options.select || '*, projects:project_id(name)';
    return super.getAll({ ...options, select });
  }
}

export const budgetService = new BudgetService();
export const expenseService = new ExpenseService();
