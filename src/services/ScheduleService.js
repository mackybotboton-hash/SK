import BaseService from './BaseService';
import Activity from '../models/Activity';

export class ScheduleService extends BaseService {
  constructor() {
    super('activities', Activity);
  }

  async getAllWithDetails(options = {}) {
    const select = options.select || '*, projects(name)';
    return super.getAll({ ...options, select });
  }
}

export const scheduleService = new ScheduleService();
export default scheduleService;
