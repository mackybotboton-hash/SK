import BaseModel from './BaseModel';
import { PROJECT_STATUS } from '../utils/constants';

/**
 * SKTrack — Project Model
 * Represents an SK Project or Program.
 */
export class Project extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.name = data.name || '';
    this.description = data.description || '';
    this.category = data.category || '';
    this.proposed_budget = Number(data.proposed_budget) || 0;
    this.approved_budget = data.approved_budget ? Number(data.approved_budget) : null;
    this.project_head_id = data.project_head_id || null;
    this.start_date = data.start_date ? new Date(data.start_date) : null;
    this.end_date = data.end_date ? new Date(data.end_date) : null;
    this.beneficiaries = data.beneficiaries || '';
    this.status = data.status || PROJECT_STATUS.PROPOSED;
  }

  get validationRules() {
    return [
      { field: 'name', test: (v) => !!v && v.trim().length > 0, message: 'Project name is required.' },
      { field: 'category', test: (v) => !!v && v.trim().length > 0, message: 'Category is required.' },
      { field: 'proposed_budget', test: (v) => v >= 0, message: 'Proposed budget must be a positive number.' },
      { field: 'start_date', test: (v) => v instanceof Date, message: 'Start date is required.' },
      { field: 'end_date', test: (v, data) => v instanceof Date && (!data.start_date || v >= data.start_date), message: 'End date must be after start date.' }
    ];
  }

  toJSON() {
    return {
      ...super.toJSON(),
      name: this.name,
      description: this.description,
      category: this.category,
      proposed_budget: this.proposed_budget,
      approved_budget: this.approved_budget,
      project_head_id: this.project_head_id,
      start_date: this.start_date ? this.start_date.toISOString().split('T')[0] : null,
      end_date: this.end_date ? this.end_date.toISOString().split('T')[0] : null,
      beneficiaries: this.beneficiaries,
      status: this.status,
    };
  }

  getDisplayName() {
    return this.name || 'Untitled Project';
  }

  isOngoing() {
    return this.status === PROJECT_STATUS.ONGOING;
  }

  isCompleted() {
    return this.status === PROJECT_STATUS.COMPLETED;
  }
}

export default Project;
