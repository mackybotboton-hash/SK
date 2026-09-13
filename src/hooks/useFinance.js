import { useEffect } from 'react';
import useController from './useController';
import { financeController } from '../controllers/FinanceController';

export function useFinance(autoLoad = true, filters = {}) {
  const state = useController(financeController);
  const data = state.data || {};

  useEffect(() => {
    if (autoLoad) {
      financeController.loadFinanceData(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad, JSON.stringify(filters)]);

  return {
    ...state,
    budgets: data.budgets || [],
    expenses: data.expenses || [],
    alerts: data.alerts || [],
    loadFinanceData: (f) => financeController.loadFinanceData(f),
    saveExpense: (expense) => financeController.saveExpense(expense),
    deleteExpense: (id) => financeController.deleteExpense(id),
  };
}

export default useFinance;
