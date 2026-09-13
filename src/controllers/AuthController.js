import BaseController from './BaseController';
import authService from '../services/AuthService';
import RoleManager from '../auth/RoleManager';
import NotificationSystem from '../engines/NotificationSystem';

/**
 * SKTrack — AuthController
 * Manages authentication state and logic.
 */
export class AuthController extends BaseController {
  constructor() {
    super(authService);
    this.user = null;
    this.isAuthenticated = false;
    this.authListener = null;
  }

  /**
   * Override _notify to include auth-specific state
   */
  _notify() {
    for (const listener of this._listeners) {
      listener({
        loading: this.loading,
        error: this.error,
        user: this.user,
        isAuthenticated: this.isAuthenticated,
        data: this.data,
      });
    }
  }

  /**
   * Initialize controller and subscribe to auth changes
   */
  async initialize() {
    this.setLoading(true);
    try {
      this.user = await this.service.getCurrentUser();
      this.isAuthenticated = !!this.user;
      RoleManager.getInstance().setCurrentUser(this.user);
      
      // Setup listener for subsequent auth changes
      this.authListener = this.service.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
           this.user = await this.service.getCurrentUser();
           this.isAuthenticated = !!this.user;
           RoleManager.getInstance().setCurrentUser(this.user);
        } else if (event === 'SIGNED_OUT') {
           this.user = null;
           this.isAuthenticated = false;
           RoleManager.getInstance().setCurrentUser(null);
        }
        this._notify();
      });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Clean up listener
   */
  destroy() {
    if (this.authListener) {
      this.authListener.unsubscribe();
    }
  }

  /**
   * Login user
   */
  async login(email, password) {
    this.setLoading(true);
    this.clearError();
    try {
      this.user = await this.service.login(email, password);
      this.isAuthenticated = !!this.user;
      RoleManager.getInstance().setCurrentUser(this.user);
      NotificationSystem.getInstance().success('Successfully logged in.');
      // NOTE: Audit logging will be implemented in Loop 9, but we would call it here.
    } catch (error) {
      this.handleError(error);
      NotificationSystem.getInstance().error(error.message || 'Login failed.');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Sign up user
   */
  async signup(email, password, fullName) {
    this.setLoading(true);
    this.clearError();
    try {
      this.user = await this.service.signup(email, password, fullName);
      this.isAuthenticated = !!this.user;
      RoleManager.getInstance().setCurrentUser(this.user);
      NotificationSystem.getInstance().success('Successfully registered and logged in.');
    } catch (error) {
      this.handleError(error);
      NotificationSystem.getInstance().error(error.message || 'Registration failed.');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Logout user
   */
  async logout() {
    this.setLoading(true);
    this.clearError();
    try {
      await this.service.logout();
    } catch (error) {
      console.warn("Server logout failed, clearing local state anyway:", error);
    } finally {
      this.user = null;
      this.isAuthenticated = false;
      RoleManager.getInstance().setCurrentUser(null);
      NotificationSystem.getInstance().info('Logged out.');
      this.setLoading(false);
      this._notify();
    }
  }
}

// Export singleton instance for the app
export const authController = new AuthController();
export default authController;
