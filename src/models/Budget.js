import BaseModel from './BaseModel';

export class Budget extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.category = data.category || '';
    this.allocated_amount = Number(data.allocated_amount) || 0;
    this.fiscal_year = data.fiscal_year || new Date().getFullYear();
  }

  get validationRules() {
    return [
      { field: 'category', test: (v) => !!v, message: 'Category is required.' },
      { field: 'allocated_amount', test: (v) => v >= 0, message: 'Allocated amount must be positive.' },
      { field: 'fiscal_year', test: (v) => v >= 2020, message: 'Invalid fiscal year.' }
    ];
  }

  toJSON() {
    return {
      ...super.toJSON(),
      category: this.category,
      allocated_amount: this.allocated_amount,
      fiscal_year: this.fiscal_year
    };
  }
}

export default Budget;
