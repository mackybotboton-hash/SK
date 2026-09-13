import { useEffect } from 'react';
import useController from './useController';
import { scheduleController } from '../controllers/ScheduleController';

export function useSchedule(autoLoad = true, filters = {}) {
  const state = useController(scheduleController);
  const data = state.data || {};

  useEffect(() => {
    if (autoLoad) {
      scheduleController.loadActivities(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad, JSON.stringify(filters)]);

  return {
    ...state,
    activities: data.activities || [],
    loadActivities: (f) => scheduleController.loadActivities(f),
    saveActivity: (act) => scheduleController.saveActivity(act),
    deleteActivity: (id, name) => scheduleController.deleteActivity(id, name),
  };
}

export default useSchedule;
