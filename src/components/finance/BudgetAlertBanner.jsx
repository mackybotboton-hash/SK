import React from 'react';
import { MdWarning, MdError } from 'react-icons/md';

export default function BudgetAlertBanner({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
      {alerts.map((alert, idx) => (
        <div key={idx} className={`alert alert-${alert.type === 'critical' ? 'error' : 'warning'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {alert.type === 'critical' ? <MdError size={20} /> : <MdWarning size={20} />}
          <span>{alert.message}</span>
        </div>
      ))}
    </div>
  );
}
