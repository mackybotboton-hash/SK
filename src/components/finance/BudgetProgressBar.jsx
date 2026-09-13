import React from 'react';
import { formatCurrency } from '../../utils/formatters';

export default function BudgetProgressBar({ category, allocated, spent }) {
  const utilization = allocated > 0 ? (spent / allocated) * 100 : 0;
  const clampedUtil = Math.min(utilization, 100);
  
  let color = 'var(--primary)';
  if (utilization >= 100) color = 'var(--danger)';
  else if (utilization >= 80) color = 'var(--warning)';

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{category}</span>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {formatCurrency(spent)} / {formatCurrency(allocated)} ({utilization.toFixed(1)}%)
        </span>
      </div>
      <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-default)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ 
          width: `${clampedUtil}%`, 
          height: '100%', 
          backgroundColor: color, 
          transition: 'width 0.5s ease-in-out' 
        }} />
      </div>
    </div>
  );
}
