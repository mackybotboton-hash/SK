import BaseModel from './BaseModel';

export class Activity extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.title = data.title || data.name || '';
    this.description = data.description || '';
    
    if (data.start_time) {
      this.start_time = new Date(data.start_time);
    } else if (data.date) {
      const timeStr = data.time ? data.time : '00:00:00';
      this.start_time = new Date(`${data.date}T${timeStr}`);
    } else {
      this.start_time = new Date();
    }

    this.end_time = data.end_time ? new Date(data.end_time) : new Date(this.start_time.getTime() + 60 * 60 * 1000);
    this.location = data.location || '';
    this.type = data.type || 'Event';
    this.project_id = data.project_id || null;
  }

  get validationRules() {
    return [
      { field: 'title', test: (v) => !!v && v.trim().length > 0, message: 'Activity title is required.' },
      { field: 'start_time', test: (v) => v instanceof Date && !isNaN(v), message: 'Valid start time is required.' }
    ];
  }

  toJSON() {
    let dbDate = null;
    let dbTime = null;
    if (this.start_time && !isNaN(this.start_time)) {
      dbDate = this.start_time.toISOString().split('T')[0];
      dbTime = this.start_time.toTimeString().split(' ')[0]; // HH:MM:SS
    }

    return {
      ...super.toJSON(),
      name: this.title,
      description: this.description,
      date: dbDate,
      time: dbTime,
      location: this.location,
      status: 'scheduled',
      project_id: this.project_id
    };
  }
}

export default Activity;
