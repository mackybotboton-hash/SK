import BaseModel from './BaseModel';
import { PROPOSAL_STATUS } from '../utils/constants';

/**
 * SKTrack — Proposal Model
 * Represents a project proposal before it becomes an official Project.
 */
export class Proposal extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.title = data.title || data.project_name || '';
    this.objective = data.objective || data.objectives || '';
    this.target_date = data.target_date ? new Date(data.target_date) : (data.proposed_start ? new Date(data.proposed_start) : null);
    this.estimated_budget = Number(data.estimated_budget) || Number(data.proposed_budget) || 0;
    this.proponent_id = data.proponent_id || data.submitted_by || null;
    this.status = data.status || PROPOSAL_STATUS.DRAFT;
    this.feedback = data.feedback || data.review_notes || '';
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
      project_name: this.title,
      objectives: this.objective,
      proposed_start: this.target_date ? this.target_date.toISOString().split('T')[0] : null,
      proposed_budget: this.estimated_budget,
      submitted_by: this.proponent_id,
      status: this.status,
      review_notes: this.feedback
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
