import BaseController from './BaseController';
import userService from '../services/UserService';
import NotificationSystem from '../engines/NotificationSystem';

export class UserController extends BaseController {
  constructor() {
    super(userService);
  }

  async loadUsers(filters = {}) {
    this.setLoading(true);
    try {
      const result = await this.service.getAll({ filters, orderBy: 'created_at', orderAsc: false });
      this.setData({ users: result.data || [] });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }

  async updateUserRole(id, role) {
    this.setLoading(true);
    try {
      await this.update(id, { role }, 'user');
      NotificationSystem.getInstance().success('User role updated successfully.');
      await this.loadUsers();
      return true;
    } catch (error) {
      this.handleError(error);
      NotificationSystem.getInstance().error(error.message);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  async updateUserStatus(id, status) {
    this.setLoading(true);
    try {
      await this.update(id, { status }, 'user');
      NotificationSystem.getInstance().success(`User status changed to ${status}.`);
      await this.loadUsers();
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

export const userController = new UserController();
export default userController;
