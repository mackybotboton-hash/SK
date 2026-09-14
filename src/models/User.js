import BaseModel from './BaseModel';
import { ROLES } from '../utils/constants';

export class User extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.email = data.email || '';
    this.full_name = data.full_name || '';
    this.role = data.role || ROLES.KAGAWAD;
    this.status = data.status || 'active';
  }

  get validationRules() {
    return [
      { field: 'email', test: (v) => !!v && v.includes('@'), message: 'Valid email is required.' },
      { field: 'full_name', test: (v) => !!v && v.trim().length > 0, message: 'Full name is required.' },
      { field: 'role', test: (v) => Object.values(ROLES).includes(v), message: 'Invalid role.' }
    ];
  }

  toJSON() {
    return {
      ...super.toJSON(),
      full_name: this.full_name,
      role: this.role,
      status: this.status
    };
  }
}

export default User;
