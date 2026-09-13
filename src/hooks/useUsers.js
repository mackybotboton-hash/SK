import { useEffect } from 'react';
import useController from './useController';
import { userController } from '../controllers/UserController';

export function useUsers(autoLoad = true, filters = {}) {
  const state = useController(userController);
  const data = state.data || {};

  useEffect(() => {
    if (autoLoad) {
      userController.loadUsers(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad, JSON.stringify(filters)]);

  return {
    ...state,
    users: data.users || [],
    loadUsers: (f) => userController.loadUsers(f),
    updateUserRole: (id, role) => userController.updateUserRole(id, role),
    updateUserStatus: (id, status) => userController.updateUserStatus(id, status)
  };
}

export default useUsers;
