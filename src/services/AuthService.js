import BaseService from './BaseService';
import { User } from '../models/User';
import supabase from './supabase';

/**
 * SKTrack — AuthService
 * Handles authentication (Supabase Auth) and user profiles (DB).
 */
export class AuthService extends BaseService {
  constructor() {
    super('profiles', User);
  }

  /**
   * Log in a user with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<User>}
   */
  async login(email, password) {
    const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) this._handleError(authError);

    // Fetch or auto-create profile
    const profile = await this._ensureProfile(authData.user);
    return profile;
  }

  /**
   * Sign up a new user
   * @param {string} email 
   * @param {string} password 
   * @param {string} fullName
   * @returns {Promise<User>}
   */
  async signup(email, password, fullName) {
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (authError) this._handleError(authError);

    // After signup, they are logged in automatically. Fetch or create profile.
    const profile = await this._ensureProfile(authData.user);
    
    // Check if they are the first user in the entire system
    let isFirstUser = false;
    try {
      isFirstUser = (await this.count()) <= 1; // Count is 1 since they just signed up
    } catch(e) {}

    if (isFirstUser) {
      // Auto-approve the first user as Admin so the system has an owner
      try {
        await this.update(profile.id, { full_name: fullName, status: 'active', role: 'admin' });
        profile.full_name = fullName;
        profile.status = 'active';
        profile.role = 'admin';
      } catch (err) {
        console.warn("Could not upgrade first user to admin due to RLS.");
      }
    } else {
      // For all subsequent users, ensure they are pending
      if (profile.full_name !== fullName || profile.status !== 'pending') {
        try {
          await this.update(profile.id, { full_name: fullName, status: 'pending', role: 'viewer' });
          profile.full_name = fullName;
          profile.status = 'pending';
          profile.role = 'viewer';
        } catch (err) {
          console.warn("Could not update full name or status due to RLS.");
        }
      }
    }

    return profile;
  }

  /**
   * Helper to fetch a profile and auto-create if missing (e.g., if SQL trigger failed)
   */
  async _ensureProfile(authUser) {
    let profile = await this.getById(authUser.id);
    if (!profile) {
      try {
        const count = await this.count();
        profile = await this.create({
          id: authUser.id,
          full_name: authUser.email.split('@')[0], // fallback name
          role: count === 0 ? 'admin' : 'viewer',
          status: 'active'
        });
      } catch (err) {
        let isFirstUser = false;
        try {
          // If we can read the count, check if it's 0
          isFirstUser = (await this.count()) === 0;
        } catch (countErr) {
          // Ignore error, assume not first user if RLS blocks counting
        }
        
        // Fallback to an in-memory profile so the developer isn't completely locked out
        profile = new User({
          id: authUser.id,
          full_name: authUser.email.split('@')[0],
          role: isFirstUser ? 'admin' : 'viewer', 
          status: isFirstUser ? 'active' : 'pending'
        });
      }
    }
    return profile;
  }

  /**
   * Log out the current user
   */
  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) this._handleError(error);
  }

  /**
   * Get the currently logged-in user profile
   * @returns {Promise<User|null>}
   */
  async getCurrentUser() {
    const { data: { session }, error: sessionError } = await this.supabase.auth.getSession();
    
    if (sessionError) this._handleError(sessionError);
    if (!session) return null;

    try {
      const profile = await this._ensureProfile(session.user);
      return profile;
    } catch (e) {
      console.error("Error fetching user profile for session:", e);
      return null;
    }
  }

  /**
   * Listen to auth state changes
   * @param {function} callback - Called with (event, session)
   * @returns {object} Subscription object with unsubscribe()
   */
  onAuthStateChange(callback) {
    const { data } = this.supabase.auth.onAuthStateChange(callback);
    return data.subscription;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
