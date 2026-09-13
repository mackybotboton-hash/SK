import { useState, useEffect } from 'react';
import { authController } from '../controllers/AuthController';
import RoleManager from '../auth/RoleManager';

/**
 * SKTrack — useAuth hook
 * React bridge to the AuthController.
 * Provides user state, loading state, and helper methods.
 */
export function useAuth() {
  const [authState, setAuthState] = useState({
    user: authController.user,
    isAuthenticated: authController.isAuthenticated,
    loading: authController.loading,
    error: authController.error,
  });

  useEffect(() => {
    // Subscribe to AuthController updates
    const unsubscribe = authController.subscribe((state) => {
      setAuthState({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
      });
    });

    return unsubscribe;
  }, []);

  const hasPermission = (permission) => {
    return RoleManager.getInstance().hasPermission(permission);
  };

  return {
    ...authState,
    login: (email, password) => authController.login(email, password),
    signup: (email, password, fullName) => authController.signup(email, password, fullName),
    logout: () => authController.logout(),
    hasPermission,
  };
}

export default useAuth;
