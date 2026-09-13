import BaseService from './BaseService';
import Project from '../models/Project';

/**
 * SKTrack — ProjectService
 * Handles database operations for Projects.
 */
export class ProjectService extends BaseService {
  constructor() {
    super('projects', Project);
  }

  /**
   * Overriding getAll to include project head profile if needed,
   * though BaseService allows custom select clauses.
   */
  async getAllWithDetails(options = {}) {
    // For Loop 3, we fetch basic projects. 
    // Join with profiles for project_head_id will be useful.
    const select = options.select || '*, profiles:project_head_id(full_name, avatar_url)';
    return super.getAll({ ...options, select });
  }

  /**
   * Change project status and log to history (if we had a history table).
   */
  async changeStatus(id, newStatus) {
    return this.update(id, { status: newStatus });
  }
}

export const projectService = new ProjectService();
export default projectService;
