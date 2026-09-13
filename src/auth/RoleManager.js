import { PERMISSIONS, ROLES } from '../utils/constants';

/**
 * SKTrack — RoleManager (Singleton)
 * Handles Role-Based Access Control (RBAC) permission checking.
 */
export class RoleManager {
  static _instance = null;

  constructor() {
    if (RoleManager._instance) {
      return RoleManager._instance;
    }
    this.permissions = PERMISSIONS;
    this.currentUser = null;
    RoleManager._instance = this;
  }

  /**
   * Get singleton instance
   * @returns {RoleManager}
   */
  static getInstance() {
    if (!RoleManager._instance) {
      RoleManager._instance = new RoleManager();
    }
    return RoleManager._instance;
  }

  /**
   * Set the current authenticated user
   * @param {import('../models/User').User | null} user
   */
  setCurrentUser(user) {
    this.currentUser = user;
  }

  /**
   * Check if current user has permission to perform an action on a resource.
   * Format for permission string is 'action:resource' (e.g. 'manage:projects')
   * @param {string} permission - The permission string to check
   * @returns {boolean}
   */
  hasPermission(permission) {
    if (!this.currentUser || !this.currentUser.role) return false;
    
    const userRole = this.currentUser.role;
    
    // Admin has full access to everything in our business rules? Let's check permissions matrix.
    // Actually, Admin has specific permissions in PERMISSIONS.
    const rolePermissions = this.permissions[userRole];
    if (!rolePermissions) return false;
    
    return !!rolePermissions[permission];
  }

  /**
   * Convenience check if user can manage a specific resource
   * @param {string} resource 
   */
  canManage(resource) {
    return this.hasPermission(`manage:${resource}`);
  }

  /**
   * Convenience check if user can view a specific resource
   * @param {string} resource 
   */
  canView(resource) {
    return this.hasPermission(`view:${resource}`);
  }

  /**
   * Get all permissions for a specific role
   * @param {string} role 
   */
  getRolePermissions(role) {
    return this.permissions[role] || {};
  }
}

export default RoleManager;
