import BaseController from './BaseController';
import projectService from '../services/ProjectService';
import NotificationSystem from '../engines/NotificationSystem';
import Project from '../models/Project';

/**
 * SKTrack — ProjectController
 * State management for Projects module.
 */
export class ProjectController extends BaseController {
  constructor() {
    super(projectService);
    this.projects = [];
    this.currentProject = null;
  }

  /**
   * Load all projects.
   */
  async loadProjects(filters = {}) {
    this.setLoading(true);
    try {
      // Use getAllWithDetails to fetch related project head data if possible
      const result = await this.service.getAllWithDetails({ filters, orderBy: 'created_at' });
      this.projects = result.data;
      this.setData({ projects: this.projects, currentProject: this.currentProject });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Load a single project.
   */
  async loadProject(id) {
    this.setLoading(true);
    try {
      this.currentProject = await this.service.getById(id, '*, profiles:project_head_id(full_name, avatar_url)');
      this.setData({ projects: this.projects, currentProject: this.currentProject });
      return this.currentProject;
    } catch (error) {
      this.handleError(error);
      return null;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Save a project (create or update).
   * @param {Project} project 
   */
  async saveProject(project) {
    this.setLoading(true);
    this.clearError();
    try {
      if (!project.validate()) {
        const errorMsg = project.getValidationErrors()[0]?.message || 'Validation failed';
        throw new Error(errorMsg);
      }

      let savedProject;
      if (project.isNew()) {
        savedProject = await this.create(project, 'project');
        NotificationSystem.getInstance().success('Project created successfully.');
      } else {
        savedProject = await this.update(project.id, project, 'project');
        NotificationSystem.getInstance().success('Project updated successfully.');
      }
      
      // Reload list to get updated relationships
      await this.loadProjects();
      return savedProject;
    } catch (error) {
      this.handleError(error);
      NotificationSystem.getInstance().error(error.message);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Delete a project.
   */
  async deleteProject(id, name) {
    this.setLoading(true);
    try {
      await this.remove(id, 'project', name);
      NotificationSystem.getInstance().success('Project deleted.');
      await this.loadProjects();
      return true;
    } catch (error) {
      this.handleError(error);
      NotificationSystem.getInstance().error(error.message);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Change status.
   */
  async updateStatus(id, newStatus) {
    this.setLoading(true);
    try {
      await this.service.changeStatus(id, newStatus);
      await this.logAction('status_changed', 'project', id, { new_status: newStatus });
      NotificationSystem.getInstance().success(`Status updated to ${newStatus}.`);
      await this.loadProjects();
      if (this.currentProject && this.currentProject.id === id) {
        await this.loadProject(id);
      }
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

export const projectController = new ProjectController();
export default projectController;
