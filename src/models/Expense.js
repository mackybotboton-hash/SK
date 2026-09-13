import BaseModel from './BaseModel';

export class Expense extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.project_id = data.project_id || null;
    this.budget_category = data.budget_category || '';
    this.amount = Number(data.amount) || 0;
    this.description = data.description || '';
    this.date = data.date ? new Date(data.date) : new Date();
    this.receipt_url = data.receipt_url || '';
    this.status = data.status || 'Cleared';
  }

  get validationRules() {
    return [
      { field: 'budget_category', test: (v) => !!v, message: 'Budget category is required.' },
      { field: 'amount', test: (v) => v > 0, message: 'Expense amount must be greater than zero.' },
      { field: 'date', test: (v) => v instanceof Date, message: 'Date is required.' },
      { field: 'description', test: (v) => !!v && v.trim().length > 0, message: 'Description is required.' }
    ];
  }

  toJSON() {
    return {
      ...super.toJSON(),
      project_id: this.project_id,
      budget_category: this.budget_category,
      amount: this.amount,
      description: this.description,
      date: this.date ? this.date.toISOString().split('T')[0] : null,
      receipt_url: this.receipt_url,
      status: this.status
    };
  }
}

export default Expense;
