import BaseService from './BaseService';
import User from '../models/User';

export class UserService extends BaseService {
  constructor() {
    super('profiles', User);
  }
}

export const userService = new UserService();
export default userService;
