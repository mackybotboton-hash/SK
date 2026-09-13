import BaseModel from './BaseModel';

export class Activity extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.title = data.title || '';
    this.description = data.description || '';
    this.start_time = data.start_time ? new Date(data.start_time) : new Date();
    this.end_time = data.end_time ? new Date(data.end_time) : new Date(new Date().getTime() + 60 * 60 * 1000); // +1 hour
    this.location = data.location || '';
    this.type = data.type || 'Event';
    this.project_id = data.project_id || null;
  }

  get validationRules() {
    return [
      { field: 'title', test: (v) => !!v && v.trim().length > 0, message: 'Activity title is required.' },
      { field: 'start_time', test: (v) => v instanceof Date && !isNaN(v), message: 'Valid start time is required.' },
      { field: 'end_time', test: (v) => v instanceof Date && !isNaN(v), message: 'Valid end time is required.' },
      { field: 'time_logic', test: () => this.end_time >= this.start_time, message: 'End time cannot be before start time.' }
    ];
  }

  toJSON() {
    return {
      ...super.toJSON(),
      title: this.title,
      description: this.description,
      start_time: this.start_time ? this.start_time.toISOString() : null,
      end_time: this.end_time ? this.end_time.toISOString() : null,
      location: this.location,
      type: this.type,
      project_id: this.project_id
    };
  }
}

export default Activity;
