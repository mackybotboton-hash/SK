import BaseController from './BaseController';
import scheduleService from '../services/ScheduleService';
import NotificationSystem from '../engines/NotificationSystem';

export class ScheduleController extends BaseController {
  constructor() {
    super(scheduleService);
  }

  async loadActivities(filters = {}) {
    this.setLoading(true);
    try {
      const result = await this.service.getAllWithDetails({ filters, orderBy: 'date', orderAsc: true });
      this.setData({ activities: result.data || [] });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }

  async saveActivity(activity) {
    this.setLoading(true);
    this.clearError();
    try {
      if (!activity.validate()) {
        throw new Error(activity.getValidationErrors()[0]?.message);
      }

      let saved;
      if (activity.isNew()) {
        saved = await this.create(activity, 'activity');
        NotificationSystem.getInstance().success('Activity added successfully.');
      } else {
        saved = await this.update(activity.id, activity, 'activity');
        NotificationSystem.getInstance().success('Activity updated successfully.');
      }
      
      await this.loadActivities();
      return saved;
    } catch (error) {
      this.handleError(error);
      NotificationSystem.getInstance().error(error.message);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  async deleteActivity(id, name) {
    this.setLoading(true);
    try {
      await this.remove(id, 'activity', name);
      NotificationSystem.getInstance().success('Activity removed.');
      await this.loadActivities();
      return true;
    } catch (error) {
      this.handleError(error);
      NotificationSystem.getInstance().error(error.message);
      return false;
    } finally {
      this.setLoading(false);
    }
  }
}

export const scheduleController = new ScheduleController();
export default scheduleController;
