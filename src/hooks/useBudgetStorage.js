import { useState, useEffect } from 'react';

const STORAGE_KEY = 'sk_budget_data';

const DEFAULT_DATA = {
  generalFund: 0,
  skFund: 0,
  ppas: [], // { id, name, description, allocated_amount }
  personalServices: 0,
  training: 0,
  resolutionNo: '',
  resolutionDate: '',
  isAuthorized: false,
};

export default function useBudgetStorage() {
  const [budgetData, setBudgetData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_DATA;
    } catch (e) {
      return DEFAULT_DATA;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(budgetData));
  }, [budgetData]);

  const updateFund = (generalFund) => {
    const parsed = parseFloat(generalFund) || 0;
    setBudgetData(prev => ({
      ...prev,
      generalFund: parsed,
      skFund: parsed * 0.10 // 10% of GF
    }));
  };

  const addPPA = (ppa) => {
    setBudgetData(prev => ({
      ...prev,
      ppas: [...prev.ppas, { ...ppa, id: Date.now().toString() }]
    }));
  };

  const updatePPA = (id, updates) => {
    setBudgetData(prev => ({
      ...prev,
      ppas: prev.ppas.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };

  const removePPA = (id) => {
    setBudgetData(prev => ({
      ...prev,
      ppas: prev.ppas.filter(p => p.id !== id)
    }));
  };

  const updateAllocations = (personalServices, training) => {
    setBudgetData(prev => ({
      ...prev,
      personalServices: parseFloat(personalServices) || 0,
      training: parseFloat(training) || 0,
    }));
  };

  const authorizeBudget = (resolutionNo, resolutionDate) => {
    setBudgetData(prev => ({
      ...prev,
      resolutionNo,
      resolutionDate,
      isAuthorized: true
    }));
  };

  const getTotalAllocated = () => {
    const ppasTotal = budgetData.ppas.reduce((sum, p) => sum + (parseFloat(p.allocated_amount) || 0), 0);
    return ppasTotal + (parseFloat(budgetData.personalServices) || 0) + (parseFloat(budgetData.training) || 0);
  };

  return {
    budgetData,
    updateFund,
    addPPA,
    updatePPA,
    removePPA,
    updateAllocations,
    authorizeBudget,
    getTotalAllocated
  };
}
