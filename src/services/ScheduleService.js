import BaseService from './BaseService';
import Activity from '../models/Activity';

export class ScheduleService extends BaseService {
  constructor() {
    super('schedules', Activity);
  }

  async getAllWithDetails(options = {}) {
    const select = options.select || '*, projects:project_id(name)';
    return super.getAll({ ...options, select });
  }
}

export const scheduleService = new ScheduleService();
export default scheduleService;
