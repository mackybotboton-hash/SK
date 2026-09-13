import BaseModel from './BaseModel';

export class AuditLog extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.user_id = data.user_id || null;
    this.action = data.action || '';
    this.resource = data.resource || '';
    this.resource_id = data.resource_id || null;
    this.details = data.details || '';
  }

  get validationRules() {
    return [
      { field: 'action', test: (v) => !!v, message: 'Action is required.' },
      { field: 'resource', test: (v) => !!v, message: 'Resource is required.' }
    ];
  }

  toJSON() {
    return {
      ...super.toJSON(),
      user_id: this.user_id,
      action: this.action,
      resource: this.resource,
      resource_id: this.resource_id,
      details: this.details
    };
  }
}

export default AuditLog;
