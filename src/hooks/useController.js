import { useState, useEffect, useCallback } from 'react';

/**
 * useController — React hook that bridges OOP controllers to React state.
 * Subscribes to controller state changes and provides reactive updates.
 *
 * @param {import('../controllers/BaseController').BaseController} controller
 * @returns {{ loading: boolean, error: string|null, data: any, clearError: Function }}
 */
export default function useController(controller) {
  const [state, setState] = useState({
    loading: controller.loading,
    error: controller.error,
    data: controller.data,
  });

  useEffect(() => {
    const unsubscribe = controller.subscribe((newState) => {
      setState({ ...newState });
    });
    return unsubscribe;
  }, [controller]);

  const clearError = useCallback(() => {
    controller.clearError();
  }, [controller]);

  return {
    loading: state.loading,
    error: state.error,
    data: state.data,
    clearError,
  };
}
