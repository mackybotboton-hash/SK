import { useEffect } from 'react';
import useController from './useController';
import { projectController } from '../controllers/ProjectController';

/**
 * SKTrack — useProjects hook
 */
export function useProjects(autoLoad = true, filters = {}) {
  const state = useController(projectController);
  const data = state.data || {};

  useEffect(() => {
    if (autoLoad) {
      projectController.loadProjects(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad, JSON.stringify(filters)]);

  return {
    ...state,
    projects: data.projects || [],
    currentProject: data.currentProject || null,
    loadProjects: (f) => projectController.loadProjects(f),
    loadProject: (id) => projectController.loadProject(id),
    saveProject: (project) => projectController.saveProject(project),
    deleteProject: (id, name) => projectController.deleteProject(id, name),
    updateStatus: (id, status) => projectController.updateStatus(id, status),
  };
}

export default useProjects;
