import BaseModel from './BaseModel';
import { PROPOSAL_STATUS } from '../utils/constants';

/**
 * SKTrack — Proposal Model
 * Represents a project proposal before it becomes an official Project.
 */
export class Proposal extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.title = data.title || '';
    this.objective = data.objective || '';
    this.target_date = data.target_date ? new Date(data.target_date) : null;
    this.estimated_budget = Number(data.estimated_budget) || 0;
    this.proponent_id = data.proponent_id || null;
    this.status = data.status || PROPOSAL_STATUS.DRAFT;
    this.feedback = data.feedback || '';
  }

  get validationRules() {
    return [
      { field: 'title', test: (v) => !!v && v.trim().length > 0, message: 'Proposal title is required.' },
      { field: 'objective', test: (v) => !!v && v.trim().length > 0, message: 'Objective is required.' },
      { field: 'estimated_budget', test: (v) => v > 0, message: 'Estimated budget must be greater than zero.' },
      { field: 'target_date', test: (v) => v instanceof Date, message: 'Target date is required.' }
    ];
  }

  toJSON() {
    return {
      ...super.toJSON(),
      title: this.title,
      objective: this.objective,
      target_date: this.target_date ? this.target_date.toISOString().split('T')[0] : null,
      estimated_budget: this.estimated_budget,
      proponent_id: this.proponent_id,
      status: this.status,
      feedback: this.feedback
    };
  }

  getDisplayName() {
    return this.title || 'Untitled Proposal';
  }

  canEdit() {
    return this.status === PROPOSAL_STATUS.DRAFT || this.status === PROPOSAL_STATUS.REJECTED;
  }
}

export default Proposal;
